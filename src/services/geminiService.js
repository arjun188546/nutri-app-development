import Toast from "react-native-toast-message";
import * as SecureStore from "expo-secure-store";

// Update this to your local IP for physical device testing
const BASE_URL = 'http://192.168.0.101:8000';
const ANALYZE_URL = `${BASE_URL}/api/analyze-food`;
const MEALS_URL = `${BASE_URL}/api/meals`;

export const analyzeFoodImage = async (imageBase64, mealName, imageUri, userId) => {
    try {
        const token = await SecureStore.getItemAsync("accessToken");
        const response = await fetch(ANALYZE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                imageBase64,
                mealName,
                imageUri,
                userId
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to analyze image through backend');
        }

        const result = await response.json();
        return result;

    } catch (error) {
        console.error('Error analyzing image via Backend:', error);
        Toast.show({
            type: 'error',
            text1: 'Analysis Failed',
            text2: 'Could not connect to the food analysis server.',
        });
        throw error;
    }
};

export const fetchMealHistory = async () => {
    try {
        const token = await SecureStore.getItemAsync("accessToken");
        const response = await fetch(MEALS_URL, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch history');
        return await response.json();
    } catch (error) {
        console.error('Error fetching history:', error);
        return [];
    }
};
