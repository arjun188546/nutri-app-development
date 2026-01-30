import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import api from "./PrivateAxios";
import Toast from "react-native-toast-message";
import MacroStat from "./MacroStat";
import {
  useRemoveFoodMutation,
  useUpdateFoodMutation,
} from "../redux/userAddedFood/userAllFoodApiSlice";

const { width } = Dimensions.get("window");

const DiaryDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const {
    name,
    calories,
    protein,
    fat,
    carbs,
    quantity,
    mealType,
    id,
    servingSize,
  } = route.params;

  const [editedMealType, setEditedMealType] = useState(mealType);
  const [editedQuantity, setEditedQuantity] = useState(quantity.toString());
  const [updateFood] = useUpdateFoodMutation();
  const [removeFood] = useRemoveFoodMutation();

  const getMealImage = (type) => {
    switch (type) {
      case "Breakfast": return require("../assets/breakfast.jpeg");
      case "Lunch": return require("../assets/lunch.jpeg");
      case "Dinner": return require("../assets/dinner.jpeg");
      default: return require("../assets/fruits.jpeg");
    }
  };

  const handleRemove = async () => {
    try {
      await removeFood({ id }).unwrap();
      Toast.show({ type: "success", text1: "Meal Deleted" });
      navigation.goBack();
    } catch (error) {
      Toast.show({ type: "error", text1: "Error deleting meal" });
    }
  };

  const handleSave = async () => {
    try {
      await updateFood({
        meal: editedMealType,
        quantity: editedQuantity,
        id: id,
      }).unwrap();
      navigation.goBack();
      Toast.show({ type: "success", text1: "Changes Saved" });
    } catch (error) {
      Toast.show({ type: "error", text1: "Failed to update" });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Split Background Header (Matching FoodDetail) */}
      <View style={styles.header}>
        <View style={styles.topHalf} />
        <View style={styles.bottomHalf} />

        <Image source={getMealImage(editedMealType)} style={styles.mainImage} />

        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.mainContent}>
          <Text style={styles.title}>{name}</Text>

          {/* Macro Stats Row */}
          <View style={styles.macroRow}>
            <MacroStat label="kcal" value={(calories * Number(editedQuantity)).toFixed(0)} />
            <View style={styles.divider} />
            <MacroStat label="proteins" value={(protein * Number(editedQuantity)).toFixed(1)} />
            <View style={styles.divider} />
            <MacroStat label="fats" value={(fat * Number(editedQuantity)).toFixed(1)} />
            <View style={styles.divider} />
            <MacroStat label="carbs" value={(carbs * Number(editedQuantity)).toFixed(1)} />
          </View>

          {/* Edit Section */}
          <View style={styles.editSection}>
            <Text style={styles.sectionTitle}>Adjust Log</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>MEAL TYPE</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={editedMealType}
                  onValueChange={(itemValue) => setEditedMealType(itemValue)}
                >
                  <Picker.Item label="Breakfast" value="Breakfast" />
                  <Picker.Item label="Lunch" value="Lunch" />
                  <Picker.Item label="Dinner" value="Dinner" />
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>QUANTITY ({servingSize})</Text>
              <TextInput
                style={styles.servingInput}
                value={editedQuantity}
                onChangeText={setEditedQuantity}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Action Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.deleteBtn} onPress={handleRemove}>
          <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    height: 380,
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topHalf: { position: 'absolute', top: 0, left: 0, right: 0, height: '50%', backgroundColor: '#F0F0F0' },
  bottomHalf: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', backgroundColor: '#FFF' },
  mainImage: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: (width * 0.7) / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
  },
  backBtn: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  scroll: { paddingHorizontal: 24 },
  mainContent: { marginTop: 10 },
  title: { fontSize: 26, fontWeight: '900', color: '#000', marginBottom: 20, textTransform: 'capitalize' },
  macroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    marginBottom: 32,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F5F5F5',
  },
  divider: { width: 1, height: 30, backgroundColor: '#F0F0F0' },
  editSection: { marginTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#000', marginBottom: 20 },
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 11, fontWeight: '900', color: '#BBB', letterSpacing: 1, marginBottom: 8 },
  pickerContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  servingInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 25,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  deleteBtn: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  saveBtn: {
    flex: 1,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#D4FF00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnText: { fontSize: 16, fontWeight: '900', color: '#000' }
});

export default DiaryDetail;
