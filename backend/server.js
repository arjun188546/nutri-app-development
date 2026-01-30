const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const crypto = require('crypto');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Local SQLite Database Connection
let db;
(async () => {
    try {
        db = await open({
            filename: './food_data.db',
            driver: sqlite3.Database
        });

        // Create Tables
        await db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                email TEXT UNIQUE,
                password TEXT,
                mobile TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS foods (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                food_name TEXT UNIQUE,
                calories TEXT,
                protein TEXT,
                carbs TEXT,
                fat TEXT,
                fiber TEXT,
                serving_size TEXT,
                ingredients TEXT,
                description TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS meals (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                image_hash TEXT UNIQUE,
                items TEXT, -- JSON array of food IDs
                total_calories TEXT,
                summary TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            CREATE INDEX IF NOT EXISTS idx_food_name ON foods(food_name);
        `);
        console.log('Local SQLite Database initialized with Users table');
    } catch (err) {
        console.error('Database Initialization Error:', err);
    }
})();

// --- Auth Endpoints (for Local Dev) ---

app.post('/signup', async (req, res) => {
    try {
        const { name, email, password, mobile } = req.body;
        console.log('Local Signup attempt:', { email });

        const result = await db.run(
            'INSERT INTO users (name, email, password, mobile) VALUES (?, ?, ?, ?)',
            [name, email, password, mobile]
        );

        res.json({
            success: true,
            accessToken: "local-access-token-" + result.lastID,
            refreshToken: "local-refresh-token-" + result.lastID,
            user: { id: result.lastID, name, email }
        });
    } catch (error) {
        console.error('Local Signup Error:', error);
        res.status(400).json({ error: 'User already exists or invalid data' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Local Login attempt:', { email });

        const user = await db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);

        if (user) {
            res.json({
                accessToken: "local-access-token-" + user.id,
                refreshToken: "local-refresh-token-" + user.id,
                user: { id: user.id, name: user.name, email: user.email }
            });
        } else {
            res.status(400).json({ error: 'Invalid Email or Password' });
        }
    } catch (error) {
        console.error('Local Login Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/refresh_token_android', (req, res) => {
    const refreshToken = req.headers['x-refresh-token'];
    console.log('Local Refresh Token attempt:', refreshToken);
    res.json({
        accessToken: "local-new-access-token-" + Date.now(),
        refreshToken: refreshToken
    });
});

// --- Food Endpoints ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper to parse numeric values from strings like "500 kcal" or "10g"
const parseNutritionalValue = (value) => {
    if (!value) return 0;
    const match = value.match(/(\d+(\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
};

// Helper to transform SQLite flat row to nested JSON
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

app.post('/api/analyze-food', async (req, res) => {
    try {
        const { imageBase64, mealName, imageUri, userId } = req.body;

        if (!imageBase64) {
            return res.status(400).json({ error: 'No image data provided' });
        }

        // 1. Image Hash Check
        const imageHash = crypto.createHash('sha256').update(imageBase64).digest('hex');
        const existingMeal = await db.get('SELECT * FROM meals WHERE image_hash = ?', [imageHash]);

        if (existingMeal) {
            console.log('Returning cached meal result from SQLite');
            const itemIds = JSON.parse(existingMeal.items);
            const items = await Promise.all(itemIds.map(async id => {
                const row = await db.get('SELECT * FROM foods WHERE id = ?', [id]);
                return transformFood(row);
            }));

            return res.json({
                success: true,
                mealName: mealName || existingMeal.summary,
                totalCalories: existingMeal.total_calories,
                summary: existingMeal.summary,
                items: items,
                imageUri: imageUri
            });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        // 2. Vision Identification
        console.log('Step A: Identifying food items via Vision API...');
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

        // 3. Database Lookup & Text Fetching
        for (const name of itemNames) {
            let row = await db.get('SELECT * FROM foods WHERE food_name LIKE ?', [`%${name}%`]);

            if (!row) {
                console.log(`Step B: Fetching nutrition for NEW item: ${name}`);
                const textPrompt = `Provide nutritional info for "${name}" (standard serving). Return JSON:
{
  "foodName": "${name}",
  "calories": "kcal value",
  "nutritionalInfo": {"protein": "g", "carbs": "g", "fat": "g", "fiber": "g", "servingSize": "desc"},
  "ingredients": ["list"],
  "description": "brief desc"
}`;
                const textResult = await model.generateContent(textPrompt);
                const textData = JSON.parse(textResult.response.text().replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());

                const result = await db.run(
                    `INSERT INTO foods (food_name, calories, protein, carbs, fat, fiber, serving_size, ingredients, description) 
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
                row = await db.get('SELECT * FROM foods WHERE id = ?', [result.lastID]);
            }
            detectedItems.push(transformFood(row));
        }

        // 4. Calculate Aggregate Nutrition
        let totalCals = 0;
        detectedItems.forEach(item => {
            const calMatch = (item.calories || "0").match(/\d+/);
            if (calMatch) totalCals += parseInt(calMatch[0]);
        });

        // 5. Save Meal Cache
        const totalCaloriesStr = `${totalCals} kcal`;
        await db.run(
            'INSERT INTO meals (user_id, image_hash, items, total_calories, summary) VALUES (?, ?, ?, ?, ?)',
            [userId, imageHash, JSON.stringify(detectedItems.map(i => i.id)), totalCaloriesStr, visionData.summary]
        );

        res.json({
            success: true,
            mealName: mealName || visionData.summary,
            totalCalories: totalCaloriesStr,
            summary: visionData.summary,
            items: detectedItems,
            imageUri: imageUri
        });

    } catch (error) {
        console.error('Backend Error:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});

app.get('/api/meals', async (req, res) => {
    try {
        const meals = await db.all('SELECT * FROM meals ORDER BY created_at DESC LIMIT 10');
        const detailedMeals = await Promise.all(meals.map(async meal => {
            const itemIds = JSON.parse(meal.items);
            // Fetch all items for this meal in a single query instead of mapping
            const items = await db.all(`SELECT * FROM foods WHERE id IN (${itemIds.join(',')})`);
            return {
                id: meal.id,
                totalCalories: meal.total_calories,
                summary: meal.summary,
                items: items.map(transformFood),
                createdAt: meal.created_at
            };
        }));
        res.json(detailedMeals);
    } catch (error) {
        console.error('Fetch Meals Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// New Dashboard Endpoints to fix slow loading
app.get('/api/detail/getYourCaloriesRequirement', (req, res) => {
    res.json({
        success: true,
        caloriegoal: 2200,
        protein: 150,
        fat: 70,
        carbs: 250,
        weight: 75
    });
});

app.get('/api/getFoodById/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { date } = req.query; // Expecting YYYY-MM-DD

        const targetDate = date || new Date().toISOString().split('T')[0];

        // Fetch meals for the user on this date
        const meals = await db.all(
            `SELECT * FROM meals WHERE user_id = ? AND date(created_at) = date(?)`,
            [userId, targetDate]
        );

        let totalCalories = 0;
        let totalProtein = 0;
        let totalFat = 0;
        let totalCarbs = 0;

        const detailedMeals = await Promise.all(meals.map(async (meal) => {
            const itemIds = JSON.parse(meal.items);
            const items = await db.all(`SELECT * FROM foods WHERE id IN (${itemIds.join(',')})`);

            items.forEach(item => {
                totalCalories += parseNutritionalValue(item.calories);
                totalProtein += parseNutritionalValue(item.protein);
                totalFat += parseNutritionalValue(item.fat);
                totalCarbs += parseNutritionalValue(item.carbs);
            });

            return {
                id: meal.id,
                totalCalories: meal.total_calories,
                summary: meal.summary,
                items: items.map(transformFood),
                createdAt: meal.created_at
            };
        }));

        res.json({
            success: true,
            totalCalories,
            totalProtein,
            totalFat,
            totalCarbs,
            meals: detailedMeals
        });
    } catch (error) {
        console.error('Get Food By Id Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Food Analysis Backend listening on all interfaces at port ${port}`);
});
