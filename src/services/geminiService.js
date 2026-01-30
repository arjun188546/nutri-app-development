import Toast from "react-native-toast-message";

// Update this to your local IP for physical device testing
const BASE_URL = 'http://192.168.29.140:3000';
const ANALYZE_URL = `${BASE_URL}/api/analyze-food`;
const MEALS_URL = `${BASE_URL}/api/meals`;

export const analyzeFoodImage = async (imageBase64, mealName, imageUri) => {
    try {
        const response = await fetch(ANALYZE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                imageBase64,
                mealName,
                imageUri
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
        const response = await fetch(MEALS_URL);
        if (!response.ok) throw new Error('Failed to fetch history');
        return await response.json();
    } catch (error) {
        console.error('Error fetching history:', error);
        return [];
    }
};
