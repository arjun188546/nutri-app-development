import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DashboardHeader = ({ onMenuPress }) => {
    return (
        <View style={styles.header}>
            {/* Search Icon / Menu */}
            <TouchableOpacity
                style={styles.iconCircle}
                onPress={onMenuPress}
            >
                <Ionicons name="search-outline" size={20} color="#666" />
            </TouchableOpacity>

            {/* Dashboard Title */}
            <View style={styles.titleContainer}>
                <Text style={styles.brandTitle}>NUTRI APP</Text>
            </View>

            {/* Notification Icon */}
            <TouchableOpacity style={styles.iconCircle}>
                <Ionicons name="notifications-outline" size={20} color="#666" />
                <View style={styles.redDot} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: 'transparent',
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F0F0F0',
        position: 'relative',
    },
    redDot: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF3B30',
        borderWidth: 1.5,
        borderColor: '#FFF',
    },
    titleContainer: {
        alignItems: 'center',
    },
    brandTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#000',
        letterSpacing: 1,
    },
});

export default DashboardHeader;
