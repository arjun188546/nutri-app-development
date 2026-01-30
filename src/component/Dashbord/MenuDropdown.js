import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const MenuDropdown = ({ onEditProfile, onLogout }) => {
  return (
    <View style={styles.menuContainer}>
      <TouchableOpacity onPress={onEditProfile}>
        <View style={styles.menuItem}>
          <Text style={styles.menuItemText}>Edit Profile</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={onLogout}>
        <View style={styles.menuItem}>
          <Text style={styles.menuItemText}>Logout</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default MenuDropdown;

const styles = StyleSheet.create({
  menuContainer: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    zIndex: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  menuItemText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0072DB",
  },
});
