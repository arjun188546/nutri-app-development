import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

const DatePicker = ({ date, setDate }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <View style={styles.container}>
      {/* Left side */}
      <View style={styles.leftSection}>
        <Text style={styles.label}>Your Food</Text>
        <Text style={styles.dateText}>{date}</Text>
      </View>

      {/* Right side: Button */}
      <TouchableOpacity
        style={styles.pickButton}
        onPress={() => setShowDatePicker(true)}
        activeOpacity={0.7}
      >
        <Ionicons name="calendar-outline" size={18} color="#0072DB" />
        <Text style={styles.pickButtonText}>Pick Date</Text>
      </TouchableOpacity>

      {/* Native Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={new Date(date)}
          mode="date"
          display="calendar"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              const formatted = selectedDate.toISOString().split("T")[0];
              setDate(formatted);
            }
          }}
        />
      )}
    </View>
  );
};

export default DatePicker;

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    // elevation: 3,
  },
  leftSection: {
    flexDirection: "column",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#777",
  },
  dateText: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: "bold",
    color: "#0072DB",
  },
  pickButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EAF3FF",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  pickButtonText: {
    marginLeft: 6,
    color: "#0072DB",
    fontSize: 14,
    fontWeight: "600",
  },
});
