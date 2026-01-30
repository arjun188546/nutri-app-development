import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const FeaturedBanner = () => {
    return (
        <View style={styles.container}>
            <ImageBackground
                source={{ uri: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1470&auto=format&fit=crop' }}
                style={styles.backgroundImage}
            >
                <LinearGradient
                    colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.85)']}
                    style={styles.gradient}
                >
                    <View style={styles.content}>
                        <Text style={styles.premiumTag}>PREMIUM</Text>
                        <Text style={styles.title}>Menu{"\n"}Recipes</Text>
                        <Text style={styles.subtitle}>Discover AI-analyzed culinary treasures for your fitness journey.</Text>

                        <View style={styles.indicatorContainer}>
                            <View style={[styles.dot, styles.activeDot]} />
                            <View style={styles.dot} />
                            <View style={styles.dot} />
                            <View style={styles.dot} />
                            <View style={styles.dot} />
                        </View>
                    </View>
                </LinearGradient>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: width,
        height: 440,
        backgroundColor: '#000',
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
    },
    gradient: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: 80,
        paddingHorizontal: 24,
    },
    content: {
        width: '100%',
    },
    premiumTag: {
        color: '#BD4B4B',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 2,
        marginBottom: 8,
    },
    title: {
        color: '#FFF',
        fontSize: 52,
        fontWeight: '900',
        lineHeight: 54,
        marginBottom: 12,
    },
    subtitle: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 13,
        fontWeight: '600',
        lineHeight: 18,
        width: '80%',
        marginBottom: 24,
    },
    indicatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    activeDot: {
        backgroundColor: '#BD4B4B',
        width: 20,
    }
});

export default FeaturedBanner;
