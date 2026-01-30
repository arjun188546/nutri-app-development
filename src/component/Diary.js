import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import UserAllFoodList from "./Dashbord/UserAllFoodList";
import { useGetUserFoodQuery } from "../redux/userAddedFood/userAllFoodApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/auth/authSlice";
import DatePicker from "./Dashbord/DatePicker";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const Diary = () => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const user = useSelector(selectCurrentUser);
  const { data: userFood, isLoading: userFoodDataIsLoading } =
    useGetUserFoodQuery({
      userId: user.id,
      date: selectedDate,
    });

  const handleAddPress = () => {
    navigation.navigate("DiarySearch");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meal Diary</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Date Selection Area */}
        <View style={styles.dateSection}>
          <Text style={styles.dateLabel}>LOGGING FOR</Text>
          <DatePicker date={selectedDate} setDate={setSelectedDate} />
        </View>

        {/* User Food List (Updated Style) */}
        <UserAllFoodList
          userFood={userFood}
          userFoodDataIsLoading={userFoodDataIsLoading}
        />

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Floating Add Meal Button (New Theme) */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
          <Ionicons name="add" size={24} color="#000" />
          <Text style={styles.addButtonText}>Add Manual Meal</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBFBFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#FBFBFB",
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#000",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  dateSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  dateLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#BBB',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 30,
    backgroundColor: 'transparent',
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D4FF00",
    height: 60,
    borderRadius: 30,
    // Premium Shadow
    shadowColor: "#D4FF00",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 15,
    elevation: 8,
  },
  addButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "900",
    marginLeft: 10,
  },
});

export default Diary;
