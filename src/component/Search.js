import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import api from "./PrivateAxios";
import { selectCurrentUser } from "../redux/auth/authSlice";
import { useAddFoodMutation } from "../redux/userAddedFood/userAllFoodApiSlice";
import { useNavigation } from "@react-navigation/native";

const Search = () => {
  const navigation = useNavigation();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const user = useSelector(selectCurrentUser);
  const [addFood] = useAddFoodMutation();

  const getData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/getFoodItems");
      setItems(res.data);
      setFilteredItems(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = items.filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  const handleAddPress = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleOptionSelect = async (option) => {
    if (!selectedItem) return;
    const mealData = {
      user: user.id,
      [option.toLowerCase()]: [selectedItem._id],
    };

    try {
      await addFood(mealData).unwrap();
      Toast.show({ type: "success", text1: "Item Added", text2: `${selectedItem.name} added to ${option}` });
      setModalVisible(false);
    } catch (err) {
      Toast.show({ type: "error", text1: "Failed to add item" });
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.foodCard}>
      <View style={styles.cardInfo}>
        <Text style={styles.foodName}>{item.name}</Text>
        <Text style={styles.foodMacros}>
          {item.protein}g Protein • {item.carbs}g Carbs • {item.fat}g Fat
        </Text>
      </View>
      <View style={styles.cardRight}>
        <Text style={styles.calText}>{item.calories} kcal</Text>
        <TouchableOpacity style={styles.addIconBtn} onPress={() => handleAddPress(item)}>
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Find Food</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#AAA" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a dish..."
          placeholderTextColor="#AAA"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#30475E" />
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={(item) => item._id.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.emptyText}>No items found</Text>}
        />
      )}

      {/* Premium Logic Modal (Selection Sheet) */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Add to which meal?</Text>

            {["Breakfast", "Lunch", "Dinner"].map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.modalOption}
                onPress={() => handleOptionSelect(option)}
              >
                <Text style={styles.optionText}>{option}</Text>
                <Ionicons name="chevron-forward" size={18} color="#EEE" />
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FBFBFB" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
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
  headerTitle: { fontSize: 20, fontWeight: "900", color: "#000" },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 60,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 16, fontWeight: '600', color: '#000' },
  loaderContainer: { flex: 1, justifyContent: 'center' },
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  foodCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  cardInfo: { flex: 1 },
  foodName: { fontSize: 18, fontWeight: "800", color: "#1A1A1A", marginBottom: 4 },
  foodMacros: { fontSize: 12, color: "#AAA", fontWeight: "600" },
  cardRight: { alignItems: 'flex-end' },
  calText: { fontSize: 14, fontWeight: "900", color: "#000", marginBottom: 8 },
  addIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#30475E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: { textAlign: 'center', marginTop: 40, fontSize: 14, color: '#BBB', fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.4)", justifyContent: "flex-end" },
  modalContent: {
    backgroundColor: "#1A1A1A",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 32,
    paddingBottom: 48,
  },
  modalHandle: { width: 40, height: 4, backgroundColor: '#333', borderRadius: 2, alignSelf: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 20, fontWeight: "900", color: "#FFF", marginBottom: 24, textAlign: 'center' },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#262626',
    padding: 20,
    borderRadius: 20,
    marginBottom: 12,
  },
  optionText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  cancelBtn: { marginTop: 12, padding: 16, alignItems: 'center' },
  cancelText: { color: '#888', fontSize: 14, fontWeight: '700' }
});

export default Search;
