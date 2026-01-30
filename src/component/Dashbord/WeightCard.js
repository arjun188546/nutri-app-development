import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const WeightCard = ({ weight, bgColor = "#E3F2FD" }) => {
  return (
    <View style={[styles.card, { backgroundColor: bgColor }]}>
      <View style={styles.leftContent}>
        <Ionicons name="barbell-outline" size={22} color="#2196F3" />
        <Text style={styles.label}>Weight</Text>
      </View>
      <Text style={styles.value}>{weight ? `${weight} kg` : "N/A"}</Text>
    </View>
  );
};

export default WeightCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginTop: 20,
    marginHorizontal: 5,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
    color: "#444",
  },
  value: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2196F3",
  },
});
