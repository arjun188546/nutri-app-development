import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DashboardHeader = ({ onMenuPress }) => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <View style={styles.header}>
                {/* Search Icon / Menu */}
                <TouchableOpacity
                    style={styles.iconCircle}
                    onPress={onMenuPress}
                >
                    <Ionicons name="search-outline" size={20} color="#FFF" />
                </TouchableOpacity>

                {/* Dashboard Title */}
                <View style={styles.titleContainer}>
                    <Text style={styles.brandTitle}>NUTRI APP</Text>
                </View>

                {/* Notification Icon */}
                <TouchableOpacity style={styles.iconCircle}>
                    <Ionicons name="notifications-outline" size={20} color="#FFF" />
                    <View style={styles.redDot} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        height: 60,
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
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
        borderColor: '#000',
    },
    titleContainer: {
        alignItems: 'center',
    },
    brandTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#FFF',
        letterSpacing: 2,
    },
});

export default DashboardHeader;
