import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
    View,
    TouchableWithoutFeedback,
    ScrollView,
    Text,
    StyleSheet,
    ActivityIndicator,
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

const Dashboard = ({ navigation, mealHistory, onMealPress }) => {
    const user = useSelector(selectCurrentUser);
    const [selectedDate] = useState(new Date().toISOString().split("T")[0]);

    // REAL DATA: Fetch nutrition goals
    const { data: nutriData, isLoading: loadingNutri } = useGetNutritionDetailsQuery();

    // REAL DATA: Fetch logged meals
    const { data: userFoodData, isLoading: loadingFood } = useGetUserFoodQuery({
        date: selectedDate,
    });

    // Fallback/Mock data ONLY if real data is missing (for premium feel)
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
                <ActivityIndicator size="large" color="#D4FF00" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                {/* New Header */}
                <DashboardHeader onMenuPress={() => navigation.navigate("DashboardSearch")} />

                {/* Hero Banner */}
                <FeaturedBanner />

                {/* Daily Performance */}
                <View style={styles.macroSummary}>
                    <Text style={styles.macroTitle}>DAILY PERFORMANCE</Text>
                    <NutritionCard
                        consumed={displayFood.totalCalories}
                        goal={displayNutri.caloriegoal}
                        macros={[
                            { label: "Protein", current: displayFood.totalProtein, goal: displayNutri.protein, color: "#2ecc71" },
                            { label: "Fat", current: displayFood.totalFat, goal: displayNutri.fat, color: "#F0E68C" },
                            { label: "Carbs", current: displayFood.totalCarbs, goal: displayNutri.carbs, color: "#3498db" },
                        ]}
                    />
                </View>

                {/* Recommended Header */}
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

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FBFBFB" },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scroll: { paddingTop: 60, paddingHorizontal: 20 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16, marginTop: 12 },
    sectionTitle: { fontSize: 20, fontWeight: '900', color: '#000' },
    seeMore: { fontSize: 12, color: '#888', fontWeight: '700' },
    gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    emptyContainer: { width: '100%', padding: 40, alignItems: 'center' },
    emptyText: { textAlign: 'center', color: '#999', fontSize: 14 },
    macroSummary: { marginTop: 10, backgroundColor: '#fff', borderRadius: 24, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
    macroTitle: { fontSize: 12, fontWeight: '900', color: '#BBB', letterSpacing: 2, marginBottom: 16 },
});

export default Dashboard;
