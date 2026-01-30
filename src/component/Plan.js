import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import PurchasePremium from "../component/PurchasePremium";

const PlanScreen = ({ userPlan }) => {
  if (!userPlan) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>No Active Plan</Text>
          <Text style={styles.subtitle}>Purchase a plan to continue.</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Get Premium</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.upgradeContainer}>
          <PurchasePremium />
        </View>
      </ScrollView>
    );
  }

  const { plan, startDate, endDate } = userPlan;
  const planName = plan?.toLowerCase().trim();
  const start = new Date(startDate).toLocaleDateString();
  const end = new Date(endDate).toLocaleDateString();
  const currentDate = new Date();
  const isExpired = currentDate > new Date(endDate);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        {isExpired ? (
          <>
            <Text style={styles.title}>Your {planName} has expired</Text>
            <Text style={styles.subtitle}>Ended on {end}</Text>
            <Text style={styles.subtitle}>Please purchase again.</Text>
            <View style={styles.upgradeContainer}>
                <PurchasePremium />
            </View>
          </>
        ) : (
          <>
            <Text style={styles.title}>
              {planName === "free trial"
                ? "🎉 Free Trial Active"
                : "✨ Premium Plan Active"}
            </Text>
            <Text style={styles.dateText}>Start Date: {start}</Text>
            <Text style={styles.dateText}>End Date: {end}</Text>
            {planName === "free trial" && (
              <View style={styles.upgradeContainer}>
                <PurchasePremium />
              </View>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 25,
    width: "100%",
    height: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#2563EB",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 8,
    color: "#4B5563",
    textAlign: "center",
  },
  dateText: {
    fontSize: 15,
    color: "#6B7280",
    marginBottom: 5,
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 30,
    marginTop: 18,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  upgradeContainer: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
});

export default PlanScreen;
