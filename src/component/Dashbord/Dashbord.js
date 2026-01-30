import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
    View,
    TouchableWithoutFeedback,
    ScrollView,
    Text,
    StyleSheet,
    ActivityIndicator,
    Dimensions,
} from "react-native";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import NutritionCard from "./NutritionCard";
import DashboardHeader from "./DashboardHeader";
import FeaturedBanner from "./FeaturedBanner";
import MealCard from "../MealCard";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import { useGetNutritionDetailsQuery } from "../../redux/caloriesRequirementData/NutriDetailsApiSlice";
import { useGetUserFoodQuery } from "../../redux/userAddedFood/userAllFoodApiSlice";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const Dashboard = ({ navigation, mealHistory, onMealPress }) => {
    const user = useSelector(selectCurrentUser);
    const [selectedDate] = useState(new Date().toISOString().split("T")[0]);

    // REAL DATA: Fetch nutrition goals
    const { data: nutriData, isLoading: loadingNutri } = useGetNutritionDetailsQuery();

    // REAL DATA: Fetch logged meals
    const { data: userFoodData, isLoading: loadingFood } = useGetUserFoodQuery({
        userId: user?.id,
        date: selectedDate,
    });

    const displayNutri = useMemo(() => ({
        caloriegoal: nutriData?.caloriegoal || 2000,
        protein: nutriData?.protein || 100,
        fat: nutriData?.fat || 65,
        carbs: nutriData?.carbs || 250,
    }), [nutriData]);

    const displayFood = useMemo(() => ({
        totalCalories: userFoodData?.totalCalories || 0,
        totalProtein: userFoodData?.totalProtein || 0,
        totalFat: userFoodData?.totalFat || 0,
        totalCarbs: userFoodData?.totalCarbs || 0,
    }), [userFoodData]);

    if (loadingNutri || loadingFood) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#30475E" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* 1. Header is now absolutely positioned over the hero */}
            <DashboardHeader onMenuPress={() => navigation.navigate("DashboardSearch")} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scroll}
                stickyHeaderIndices={[]}
                bounces={true}
            >
                {/* 2. Background Hero Layer */}
                <View style={styles.heroLayer}>
                    <FeaturedBanner />
                </View>

                {/* 3. Sliding Content Sheet */}
                <View style={styles.contentSheet}>
                    <View style={styles.sheetHandle} />

                    {/* Daily Performance */}
                    <View style={styles.macroSummary}>
                        <Text style={styles.macroTitle}>DAILY PERFORMANCE</Text>
                        <NutritionCard
                            consumed={displayFood.totalCalories}
                            goal={displayNutri.caloriegoal}
                            macros={[
                                { label: "Protein", current: displayFood.totalProtein, goal: displayNutri.protein, color: "#FF5252" },
                                { label: "Carbs", current: displayFood.totalCarbs, goal: displayNutri.carbs, color: "#FFA000" },
                                { label: "Fat", current: displayFood.totalFat, goal: displayNutri.fat, color: "#30475E" },
                            ]}
                        />
                    </View>

                    {/* Menu Section */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recently Analyzed</Text>
                        <TouchableWithoutFeedback onPress={() => navigation.navigate("Diary")}>
                            <Text style={styles.seeMore}>View History</Text>
                        </TouchableWithoutFeedback>
                    </View>

                    {/* AI Analyzed Meals Grid */}
                    <View style={styles.gridContainer}>
                        {mealHistory && mealHistory.length > 0 ? (
                            mealHistory.map((meal, index) => (
                                <MealCard
                                    key={index}
                                    meal={meal}
                                    onPress={() => onMealPress(meal)}
                                />
                            ))
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No AI meals yet. Use the (+) button to analyze!</Text>
                            </View>
                        )}
                    </View>

                    <View style={{ height: 120 }} />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#000" },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
    scroll: { flexGrow: 1 },
    heroLayer: {
        width: '100%',
        height: 440,
        zIndex: 1,
    },
    contentSheet: {
        marginTop: -60, // The sliding overlap effect
        flex: 1,
        backgroundColor: '#FFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 20,
        paddingTop: 10,
        zIndex: 2,
        minHeight: SCREEN_HEIGHT - 380,
    },
    sheetHandle: {
        width: 40,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: '#E0E0E0',
        alignSelf: 'center',
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 16,
        marginTop: 24
    },
    sectionTitle: { fontSize: 22, fontWeight: '900', color: '#000' },
    seeMore: { fontSize: 12, color: '#888', fontWeight: '700' },
    gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    emptyContainer: { width: '100%', padding: 40, alignItems: 'center' },
    emptyText: { textAlign: 'center', color: '#999', fontSize: 14 },
    macroSummary: {
        marginTop: 0,
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 2
    },
    macroTitle: { fontSize: 12, fontWeight: '900', color: '#BBB', letterSpacing: 2, marginBottom: 16 },
});

export default Dashboard;
