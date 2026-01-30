import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const mealIcons = {
  Breakfast: "sunny-outline",
  Lunch: "restaurant-outline",
  Dinner: "moon-outline",
};

const UserAllFoodList = ({ userFood, userFoodDataIsLoading }) => {
  const navigation = useNavigation();

  if (userFoodDataIsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D4FF00" />
      </View>
    );
  }

  const allFoods = {
    Breakfast: userFood?.breakfast || [],
    Lunch: userFood?.lunch || [],
    Dinner: userFood?.dinner || [],
  };

  const isEmpty = Object.values(allFoods).every(list => list.length === 0);

  if (isEmpty) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="receipt-outline" size={48} color="#DDD" />
        <Text style={styles.emptyText}>Your diary is empty for today.</Text>
      </View>
    );
  }

  const renderFoodItem = (item, mealType) => (
    <TouchableOpacity
      activeOpacity={0.8}
      key={item._id}
      onPress={() =>
        navigation.navigate("DiaryDetail", {
          name: item.item.name,
          calories: item.item.calories,
          protein: item.item.protein,
          fat: item.item.fat,
          carbs: item.item.carbs,
          quantity: item.quantity,
          id: item._id,
          servingSize: item.item.servingSize,
          mealType,
        })
      }
      style={styles.foodCard}
    >
      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>{item.item.name}</Text>
        <Text style={styles.foodDetails}>
          {item.quantity} {item.item.servingSize || "serving"}
        </Text>
      </View>
      <View style={styles.calBadge}>
        <Text style={styles.calText}>{item.item.calories}</Text>
        <Text style={styles.unitText}> kcal</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {Object.entries(allFoods).map(([mealType, items]) =>
        items.length > 0 ? (
          <View key={mealType} style={styles.mealSection}>
            <View style={styles.mealHeader}>
              <Ionicons name={mealIcons[mealType]} size={18} color="#000" />
              <Text style={styles.mealTitle}>{mealType.toUpperCase()}</Text>
            </View>
            {items.map((item) => renderFoodItem(item, mealType))}
          </View>
        ) : null
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  loadingContainer: {
    padding: 60,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 60,
    alignItems: 'center',
    opacity: 0.5,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  mealSection: {
    marginBottom: 24,
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingLeft: 4,
  },
  mealTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 1.5,
    marginLeft: 8,
  },
  foodCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // Premium iOS Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  foodDetails: {
    fontSize: 12,
    color: "#888",
    fontWeight: "600",
  },
  calBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  calText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#000",
  },
  unitText: {
    fontSize: 10,
    color: "#666",
    fontWeight: "700",
  },
});

export default UserAllFoodList;
