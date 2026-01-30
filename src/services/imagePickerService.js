import * as ImagePicker from 'expo-image-picker';

export const pickImageFromGallery = async () => {
    try {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to select images!');
            return null;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1.0,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            return result.assets[0].uri;
        }

        return null;
    } catch (error) {
        console.error('Error picking image:', error);
        throw new Error('Failed to pick image from gallery');
    }
};

export const takePhotoWithCamera = async () => {
    try {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== 'granted') {
            alert('Sorry, we need camera permissions to take photos!');
            return null;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1.0,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            return result.assets[0].uri;
        }

        return null;
    } catch (error) {
        console.error('Error taking photo:', error);
        throw new Error('Failed to take photo with camera');
    }
};
