import React, { useState } from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    TouchableWithoutFeedback,
    Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const MealNameModal = ({ visible, onClose, onSubmit, imageUri }) => {
    const [mealName, setMealName] = useState("");

    const handleLevelSelect = (name) => {
        setMealName(name);
    };

    const handleSubmit = () => {
        if (mealName.trim()) {
            onSubmit(mealName.trim());
            setMealName("");
        }
    };

    const mealPresets = ["Breakfast", "Lunch", "Dinner", "Snack", "Cheat Meal"];

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContainer}>
                            <View style={styles.header}>
                                <Text style={styles.title}>What's this meal?</Text>
                                <TouchableOpacity onPress={onClose}>
                                    <Ionicons name="close" size={24} color="#666" />
                                </TouchableOpacity>
                            </View>

                            <TextInput
                                style={styles.input}
                                placeholder="e.g., Morning Fuel, Healthy Salad..."
                                value={mealName}
                                onChangeText={setMealName}
                                autoFocus
                            />

                            <View style={styles.presetsContainer}>
                                {mealPresets.map((preset) => (
                                    <TouchableOpacity
                                        key={preset}
                                        style={[
                                            styles.presetBadge,
                                            mealName === preset && styles.activePresetBadge,
                                        ]}
                                        onPress={() => handleLevelSelect(preset)}
                                    >
                                        <Text
                                            style={[
                                                styles.presetText,
                                                mealName === preset && styles.activePresetText,
                                            ]}
                                        >
                                            {preset}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <TouchableOpacity
                                style={[
                                    styles.submitButton,
                                    !mealName.trim() && styles.disabledButton,
                                ]}
                                onPress={handleSubmit}
                                disabled={!mealName.trim()}
                            >
                                <Text style={styles.submitButtonText}>ANALYZE MEAL</Text>
                                <Ionicons name="sparkles" size={20} color="black" style={{ marginLeft: 8 }} />
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        justifyContent: "flex-end",
    },
    modalContainer: {
        backgroundColor: "white",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 25,
        paddingBottom: 40,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#333",
    },
    input: {
        backgroundColor: "#F5F5F5",
        borderRadius: 12,
        padding: 15,
        fontSize: 18,
        color: "#333",
        borderWidth: 1,
        borderColor: "#E0E0E0",
        marginBottom: 20,
    },
    presetsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 30,
    },
    presetBadge: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: "#F0F0F0",
        marginRight: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#E0E0E0",
    },
    activePresetBadge: {
        backgroundColor: "#FFE14D",
        borderColor: "#000",
    },
    presetText: {
        fontSize: 14,
        color: "#666",
        fontWeight: "600",
    },
    activePresetText: {
        color: "#000",
    },
    submitButton: {
        backgroundColor: "#FFE14D",
        flexDirection: "row",
        height: 60,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#FFE14D",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 5,
    },
    disabledButton: {
        backgroundColor: "#E0E0E0",
        shadowOpacity: 0,
        elevation: 0,
    },
    submitButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "black",
        letterSpacing: 1,
    },
});

export default MealNameModal;
