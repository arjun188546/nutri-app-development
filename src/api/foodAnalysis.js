const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const crypto = require('crypto');
const path = require('path');

// NOTE: This file is intended to be integrated into the main backend server.
// For now, we provide the logic that would exist in the /api/analyze-food endpoint.

let db;

const initDb = async () => {
    if (db) return db;

    // Using a separate database for food data to mirror Genyus setup
    const dbPath = path.resolve(__dirname, '../../food_data.db');

    db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS food_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            food_name TEXT UNIQUE,
            calories TEXT,
            protein TEXT,
            carbs TEXT,
            fat TEXT,
            fiber TEXT,
            serving_size TEXT,
            ingredients TEXT,
            description TEXT
        );
        CREATE TABLE IF NOT EXISTS food_meals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            meal_name TEXT,
            image_hash TEXT UNIQUE,
            items TEXT, -- JSON array of food IDs
            total_calories TEXT,
            summary TEXT,
            image_uri TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    return db;
};

const transformFood = (row) => {
    if (!row) return null;
    return {
        id: row.id,
        foodName: row.food_name,
        calories: row.calories,
        description: row.description,
        ingredients: row.ingredients ? JSON.parse(row.ingredients) : [],
        nutritionalInfo: {
            protein: row.protein,
            carbs: row.carbs,
            fat: row.fat,
            fiber: row.fiber,
            servingSize: row.serving_size
        }
    };
};

const analyzeFood = async (req, res, GEMINI_API_KEY) => {
    try {
        const { imageBase64, mealName, imageUri } = req.body;

        if (!imageBase64) {
            return res.status(400).json({ error: 'No image data provided' });
        }

        const database = await initDb();
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // 1. Hash check for caching
        const imageHash = crypto.createHash('sha256').update(imageBase64).digest('hex');
        const existingMeal = await database.get('SELECT * FROM food_meals WHERE image_hash = ?', [imageHash]);

        if (existingMeal) {
            const itemIds = JSON.parse(existingMeal.items);
            const items = await Promise.all(itemIds.map(async id => {
                const row = await database.get('SELECT * FROM food_items WHERE id = ?', [id]);
                return transformFood(row);
            }));

            return res.json({
                success: true,
                mealId: existingMeal.id,
                mealName: existingMeal.meal_name,
                totalCalories: existingMeal.total_calories,
                summary: existingMeal.summary,
                items: items,
                imageUri: existingMeal.image_uri,
                cached: true
            });
        }

        // 2. Vision analysis
        const visionPrompt = `Identify all distinct food items in this meal. Return a JSON object:
{
  "items": ["Item Name 1", "Item Name 2"],
  "summary": "Short description of the meal"
}
If this is not food, return {"isFood": false}.`;

        const visionResult = await model.generateContent([
            visionPrompt,
            { inlineData: { data: imageBase64, mimeType: 'image/jpeg' } }
        ]);

        const visionText = visionResult.response.text().replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const visionData = JSON.parse(visionText);

        if (visionData.isFood === false) {
            return res.json({ success: false, error: 'No food detected' });
        }

        const itemNames = visionData.items || [];
        const detectedItems = [];

        // 3. Nutrition fetching (with local SQLite cache)
        for (const name of itemNames) {
            let row = await database.get('SELECT * FROM food_items WHERE food_name LIKE ?', [`%${name}%`]);

            if (!row) {
                const textPrompt = `Provide nutritional info for "${name}" (standard serving). Return JSON:
{
  "foodName": "${name}",
  "calories": "kcal value (e.g. 250 kcal)",
  "nutritionalInfo": {"protein": "g", "carbs": "g", "fat": "g", "fiber": "g", "servingSize": "desc"},
  "ingredients": ["list"],
  "description": "brief desc"
}`;
                const textResult = await model.generateContent(textPrompt);
                const textData = JSON.parse(textResult.response.text().replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());

                const result = await database.run(
                    `INSERT INTO food_items (food_name, calories, protein, carbs, fat, fiber, serving_size, ingredients, description) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        name,
                        textData.calories,
                        textData.nutritionalInfo.protein,
                        textData.nutritionalInfo.carbs,
                        textData.nutritionalInfo.fat,
                        textData.nutritionalInfo.fiber,
                        textData.nutritionalInfo.servingSize,
                        JSON.stringify(textData.ingredients),
                        textData.description
                    ]
                );
                row = await database.get('SELECT * FROM food_items WHERE id = ?', [result.lastID]);
            }
            detectedItems.push(transformFood(row));
        }

        // 4. Calculate Aggregate Calories
        let totalCals = 0;
        detectedItems.forEach(item => {
            const calMatch = (item.calories || "0").match(/\d+/);
            if (calMatch) totalCals += parseInt(calMatch[0]);
        });

        // 5. Store Meal Result
        const totalCaloriesStr = `${totalCals} kcal`;
        const mealResult = await database.run(
            'INSERT INTO food_meals (meal_name, image_hash, items, total_calories, summary, image_uri) VALUES (?, ?, ?, ?, ?, ?)',
            [mealName || visionData.summary, imageHash, JSON.stringify(detectedItems.map(i => i.id)), totalCaloriesStr, visionData.summary, imageUri]
        );

        res.json({
            success: true,
            mealId: mealResult.lastID,
            mealName: mealName || visionData.summary,
            totalCalories: totalCaloriesStr,
            summary: visionData.summary,
            items: detectedItems,
            imageUri: imageUri,
            cached: false
        });

    } catch (error) {
        console.error('Food Analysis Error:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};

module.exports = { analyzeFood };
