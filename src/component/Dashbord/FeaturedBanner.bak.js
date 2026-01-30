import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const FeaturedBanner = () => {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#1F1F1F', '#000000']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
            >
                <View style={styles.textContainer}>
                    <Text style={styles.title}>AI Insight:{"\n"}Optimal Protein</Text>
                    <Text style={styles.subtitle}>Last 3 meals reached{"\n"}75% of your daily goal</Text>

                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>View Report</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.imageWrapper}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop' }}
                        style={styles.image}
                    />
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
        height: 160,
        borderRadius: 28,
        overflow: 'hidden',
    },
    gradient: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '900',
        lineHeight: 24,
        marginBottom: 8,
    },
    subtitle: {
        color: '#AAA',
        fontSize: 12,
        lineHeight: 16,
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#D4FF00',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    buttonText: {
        color: '#000',
        fontSize: 12,
        fontWeight: '800',
    },
    imageWrapper: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#000',
        borderWidth: 2,
        borderColor: '#333',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    }
});

export default FeaturedBanner;
