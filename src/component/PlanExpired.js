import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import PurchasePremium from "./PurchasePremium";

const PlanExpiredScreen = ({ userPlan }) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>
          Your {userPlan?.plan} has Expired
        </Text>
        <Text style={styles.subtitle}>Please renew to continue using the app.</Text>
        {/* <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}
          onPress={() => <PlanScreen/>}>Renew Now</Text>
        </TouchableOpacity> */}
        <PurchasePremium/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 16,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#DC2626", // red
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 18,
    color: "#4B5563",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default PlanExpiredScreen;
