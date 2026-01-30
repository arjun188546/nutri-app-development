import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 60) / 3; // For the 3-column grid below

const MacroMiniCard = ({ label, current, goal, color, icon }) => {
  const left = Math.max(goal - current, 0);
  const fill = (current / goal) * 100;

  return (
    <View style={styles.miniCard}>
      <Text style={styles.miniValue}>{left}g</Text>
      <Text style={styles.miniLabel}>{label} left</Text>
      <View style={styles.miniProgressContainer}>
        <AnimatedCircularProgress
          size={50}
          width={4}
          fill={fill}
          tintColor={color}
          backgroundColor="#F0F0F0"
          rotation={0}
          lineCap="round"
        >
          {() => (
            <MaterialCommunityIcons name={icon} size={20} color={color} />
          )}
        </AnimatedCircularProgress>
      </View>
    </View>
  );
};

const NutritionCard = ({ consumed, goal, macros }) => {
  const caloriesLeft = Math.max(goal - consumed, 0);
  const caloriesFill = (consumed / goal) * 100;

  // Map icons to labels
  const getIcon = (label) => {
    const l = label.toLowerCase();
    if (l.includes("protein")) return "food-drumstick";
    if (l.includes("carb")) return "wheat";
    if (l.includes("fat")) return "avocado";
    return "fire";
  };

  return (
    <View style={styles.container}>
      {/* Top Large Calorie Card */}
      <View style={styles.topCard}>
        <View style={styles.calorieTextContainer}>
          <Text style={styles.calorieValue}>{caloriesLeft}</Text>
          <Text style={styles.calorieLabel}>Calories left</Text>
        </View>
        <View style={styles.mainProgressContainer}>
          <AnimatedCircularProgress
            size={100}
            width={10}
            fill={caloriesFill}
            tintColor="#000" // Matches the black ring in screenshot
            backgroundColor="#F0F0F0"
            rotation={0}
            lineCap="round"
          >
            {() => (
              <MaterialCommunityIcons name="fire" size={36} color="#000" />
            )}
          </AnimatedCircularProgress>
        </View>
      </View>

      {/* Bottom Macro Grid */}
      <View style={styles.bottomGrid}>
        {macros.map((macro, index) => (
          <MacroMiniCard
            key={index}
            label={macro.label}
            current={macro.current}
            goal={macro.goal}
            color={macro.color}
            icon={getIcon(macro.label)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  topCard: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 3,
  },
  calorieTextContainer: {
    flex: 1,
  },
  calorieValue: {
    fontSize: 48,
    fontWeight: "900",
    color: "#000",
  },
  calorieLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
    marginTop: 4,
  },
  mainProgressContainer: {
    marginLeft: 20,
  },
  bottomGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  miniCard: {
    backgroundColor: "#F8F8F8", // Subtle difference for mini cards
    borderRadius: 24,
    padding: 16,
    width: CARD_WIDTH,
    alignItems: "flex-start",
  },
  miniValue: {
    fontSize: 20,
    fontWeight: "900",
    color: "#000",
  },
  miniLabel: {
    fontSize: 11,
    color: "#666",
    fontWeight: "600",
    marginTop: 2,
    marginBottom: 12,
  },
  miniProgressContainer: {
    width: "100%",
    alignItems: "center",
  }
});

export default NutritionCard;
