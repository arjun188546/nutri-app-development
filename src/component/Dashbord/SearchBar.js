import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SearchBar = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.searchBar}>
        <Text style={{ color: "gray" }}>Search and add food</Text>
        <Ionicons name="search" size={30} color="black" />
      </View>
    </TouchableOpacity>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  searchBar: {
    borderWidth: 1,
    borderColor: "lightgray",
    marginTop: 10,
    padding: 10,
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
