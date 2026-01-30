import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView, Dimensions, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import MacroStat from './MacroStat';

const { width } = Dimensions.get('window');

const FoodDetailScreen = ({ route, navigation }) => {
    const { meal } = route.params;

    // Helper to extract numeric value from strings like "20-30 g (Estimated...)"
    const getNum = (str) => {
        if (!str) return 0;
        const match = str.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
    };

    // Aggregate totals based on extracted numbers
    const totalProtein = meal.items?.reduce((acc, item) => acc + getNum(item.nutritionalInfo.protein), 0) || 0;
    const totalCarbs = meal.items?.reduce((acc, item) => acc + getNum(item.nutritionalInfo.carbs), 0) || 0;
    const totalFat = meal.items?.reduce((acc, item) => acc + getNum(item.nutritionalInfo.fat), 0) || 0;
    const totalKcal = getNum(meal.totalCalories);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Top Feature Image Section */}
                <View style={styles.imageHeader}>
                    <Image source={{ uri: meal.imageUri }} style={styles.mainImage} />

                    {/* Bottom Gradient for Naming & Macros */}
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.95)']}
                        style={styles.bottomOverlay}
                    >
                        <View style={styles.namingContent}>
                            {/* Total Macro Row - Moved just above naming */}
                            <View style={styles.macroRowOverlay}>
                                <View style={styles.overlayStat}>
                                    <Text style={styles.overlayStatValue}>{totalKcal}</Text>
                                    <Text style={styles.overlayStatLabel}>kcal</Text>
                                </View>
                                <View style={styles.overlayDivider} />
                                <View style={styles.overlayStat}>
                                    <Text style={styles.overlayStatValue}>{totalProtein}g</Text>
                                    <Text style={styles.overlayStatLabel}>protein</Text>
                                </View>
                                <View style={styles.overlayDivider} />
                                <View style={styles.overlayStat}>
                                    <Text style={styles.overlayStatValue}>{totalFat}g</Text>
                                    <Text style={styles.overlayStatLabel}>fats</Text>
                                </View>
                                <View style={styles.overlayDivider} />
                                <View style={styles.overlayStat}>
                                    <Text style={styles.overlayStatValue}>{totalCarbs}g</Text>
                                    <Text style={styles.overlayStatLabel}>carbo</Text>
                                </View>
                            </View>

                            <Text style={styles.mealSummaryText} numberOfLines={2}>
                                {meal.summary}
                            </Text>
                        </View>
                    </LinearGradient>

                    {/* Back Button */}
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={24} color="#000" />
                    </TouchableOpacity>
                </View>

                <View style={styles.mainInfo}>
                    <Text style={styles.sectionHeading}>DETAILED BREAKDOWN</Text>

                    {/* Individual Item Cards */}
                    {meal.items?.map((item, idx) => (
                        <View key={idx} style={styles.itemCard}>
                            <View style={styles.itemHeader}>
                                <Text style={styles.itemName}>{item.foodName}</Text>
                            </View>

                            <Text style={styles.itemDescription}>{item.description}</Text>

                            <View style={styles.infoSection}>
                                <View style={styles.infoRow}>
                                    <View style={styles.infoBox}>
                                        <Text style={styles.infoValue}>{item.calories}</Text>
                                        <Text style={styles.infoLabel}>CALORIES</Text>
                                    </View>
                                </View>

                                <View style={styles.miniGrid}>
                                    <View style={styles.miniStat}>
                                        <Text style={styles.miniValue}>{item.nutritionalInfo.protein}</Text>
                                        <Text style={styles.miniLabel}>PROTEIN</Text>
                                    </View>
                                    <View style={styles.miniStat}>
                                        <Text style={styles.miniValue}>{item.nutritionalInfo.carbs}</Text>
                                        <Text style={styles.miniLabel}>CARBS</Text>
                                    </View>
                                    <View style={styles.miniStat}>
                                        <Text style={styles.miniValue}>{item.nutritionalInfo.fat}</Text>
                                        <Text style={styles.miniLabel}>FAT</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.ingredientsSection}>
                                <Text style={styles.ingredientsTitle}>KEY INGREDIENTS</Text>
                                <View style={styles.tagCloud}>
                                    {(item.ingredients || [item.foodName]).map((ing, i) => (
                                        <View key={i} style={styles.ingredientTag}>
                                            <Text style={styles.tagText}>{ing}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.logBtn} onPress={() => navigation.goBack()}>
                    <Text style={styles.logBtnText}>Log to Diary</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FBFBFB' },
    scrollContent: { paddingBottom: 20 },
    imageHeader: {
        width: '100%',
        height: 520,
        backgroundColor: '#000',
        position: 'relative',
    },
    mainImage: { width: '100%', height: '100%', opacity: 0.95 },
    bottomOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60%',
        justifyContent: 'flex-end',
        paddingBottom: 40,
        paddingHorizontal: 24,
    },
    namingContent: { width: '100%' },
    macroRowOverlay: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        marginBottom: 20,
    },
    overlayStat: { alignItems: 'center', flex: 1 },
    overlayStatValue: { color: '#BD4B4B', fontSize: 16, fontWeight: '900' }, // Using Rust for macros as per previous high-fidelity state
    overlayStatLabel: { color: '#FFF', fontSize: 9, fontWeight: '700', marginTop: 1, opacity: 0.9 },
    overlayDivider: { width: 1, height: 16, backgroundColor: 'rgba(255,255,255,0.2)' },

    mealSummaryText: {
        fontSize: 28,
        fontWeight: '900',
        color: '#FFF',
        lineHeight: 36,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 10,
    },
    backBtn: {
        position: 'absolute',
        top: 54,
        left: 20,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    mainInfo: {
        marginTop: 24,
        paddingHorizontal: 24,
    },
    sectionHeading: { fontSize: 12, fontWeight: '900', color: '#AAA', letterSpacing: 2, marginBottom: 20 },
    itemCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#F2F2F2',
    },
    itemHeader: { marginBottom: 12 },
    itemName: { fontSize: 24, fontWeight: '900', color: '#1A1A1A' },
    itemDescription: { fontSize: 14, color: '#666', lineHeight: 22, marginBottom: 20 },

    infoSection: { marginBottom: 20 },
    infoRow: { marginBottom: 12 },
    infoBox: {
        backgroundColor: '#F8F9FA',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F0F0F0'
    },
    infoValue: { fontSize: 14, fontWeight: '800', color: '#1A1A1A', marginBottom: 4 },
    infoLabel: { fontSize: 10, fontWeight: '700', color: '#999', letterSpacing: 1 },

    miniGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    miniStat: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: '#F8F9FA',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    miniValue: { fontSize: 14, fontWeight: '800', color: '#1A1A1A', marginBottom: 4 },
    miniLabel: { fontSize: 10, fontWeight: '700', color: '#999', letterSpacing: 1 },

    ingredientsSection: { marginTop: 4 },
    ingredientsTitle: { fontSize: 10, fontWeight: '900', color: '#BBB', letterSpacing: 1, marginBottom: 12 },
    tagCloud: { flexDirection: 'row', flexWrap: 'wrap' },
    ingredientTag: {
        backgroundColor: '#FFFBE6',
        borderWidth: 1,
        borderColor: '#FFE58F',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        marginRight: 10,
        marginBottom: 10,
    },
    tagText: { fontSize: 12, color: '#856404', fontWeight: '600' },

    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 110,
        backgroundColor: '#fff',
        paddingHorizontal: 24,
        justifyContent: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingBottom: 30,
    },
    logBtn: {
        height: 60,
        borderRadius: 30,
        backgroundColor: '#30475E',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logBtnText: { fontSize: 16, fontWeight: '900', color: '#FFF' }
});

export default FoodDetailScreen;
