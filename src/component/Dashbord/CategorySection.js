import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const categories = [
    { id: 1, name: 'Protein', icon: 'barbell-outline' },
    { id: 2, name: 'Fruits', icon: 'nutrition-outline' },
    { id: 3, name: 'Fast Food', icon: 'fast-food-outline' },
    { id: 4, name: 'Veggies', icon: 'leaf-outline' },
    { id: 5, name: 'Snacks', icon: 'pizza-outline' },
];

const CategorySection = () => {
    return (
        <View style={styles.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                {categories.map((cat, index) => (
                    <TouchableOpacity key={cat.id} style={[styles.card, index === 0 && styles.activeCard]}>
                        <View style={[styles.iconBox, index === 0 && styles.activeIconBox]}>
                            <Ionicons name={cat.icon} size={24} color={index === 0 ? '#000' : '#444'} />
                        </View>
                        <Text style={[styles.name, index === 0 && styles.activeName]}>{cat.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    scroll: {
        paddingRight: 20,
    },
    card: {
        width: 80,
        alignItems: 'center',
        marginRight: 12,
    },
    iconBox: {
        width: 60,
        height: 60,
        borderRadius: 20,
        backgroundColor: '#F8F9FA',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    activeIconBox: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    name: {
        fontSize: 12,
        fontWeight: '600',
        color: '#888',
    },
    activeName: {
        color: '#000',
        fontWeight: '800',
    }
});

export default CategorySection;
