import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2; // Calculation for 2-column grid with padding

const MealCard = ({ meal, onPress }) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
            <View style={styles.imageContainer}>
                {meal.imageUri ? (
                    <Image source={{ uri: meal.imageUri }} style={styles.image} />
                ) : (
                    <View style={[styles.image, styles.placeholder]}>
                        <Ionicons name="fast-food" size={40} color="#DDD" />
                    </View>
                )}
                <TouchableOpacity style={styles.favoriteBtn}>
                    <Ionicons name="heart-outline" size={20} color="#666" />
                </TouchableOpacity>

                {/* Genyus AI Badge */}
                <View style={styles.aiBadge}>
                    <Text style={styles.aiBadgeText}>GENYUS AI</Text>
                </View>
            </View>

            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={1}>
                    {meal.mealName || meal.summary || "Meal Analysis"}
                </Text>
                <Text style={styles.subtitle} numberOfLines={1}>
                    {meal.items?.length || 0} items found
                </Text>

                <View style={styles.footer}>
                    <View style={styles.calContainer}>
                        <Text style={styles.calValue}>{meal.totalCalories}</Text>
                        <Text style={styles.calLabel}> kcal</Text>
                    </View>

                    <TouchableOpacity style={styles.plusBtn} onPress={onPress}>
                        <Ionicons name="add" size={20} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: cardWidth,
        backgroundColor: '#fff',
        borderRadius: 24,
        marginBottom: 20,
        overflow: 'hidden',
        // Soft iOS shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 15,
        elevation: 5,
    },
    imageContainer: {
        width: '100%',
        height: cardWidth,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        backgroundColor: '#F8F9FA',
    },
    placeholder: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    favoriteBtn: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    aiBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: '#30475E',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#000',
    },
    aiBadgeText: {
        fontSize: 9,
        fontWeight: '900',
        color: '#FFF',
    },
    content: {
        padding: 12,
    },
    title: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1A1A1A',
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 11,
        color: '#888',
        marginBottom: 10,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    calContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    calValue: {
        fontSize: 16,
        fontWeight: '900',
        color: '#1A1A1A',
    },
    calLabel: {
        fontSize: 11,
        color: '#666',
        fontWeight: '600',
    },
    plusBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#30475E',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default MealCard;
