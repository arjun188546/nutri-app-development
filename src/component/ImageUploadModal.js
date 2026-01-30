import React from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const ImageUploadModal = ({ visible, onClose, onPickImage, onTakePhoto }) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContainer}>
                            <View style={styles.header}>
                                <Text style={styles.title}>Add Food Image</Text>
                                <TouchableOpacity onPress={onClose}>
                                    <Ionicons name="close" size={24} color="#666" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.optionsContainer}>
                                <TouchableOpacity style={styles.option} onPress={onPickImage}>
                                    <View style={[styles.iconContainer, { backgroundColor: "#E3F2FD" }]}>
                                        <Ionicons name="images" size={30} color="#2196F3" />
                                    </View>
                                    <Text style={styles.optionText}>Gallery</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.option} onPress={onTakePhoto}>
                                    <View style={[styles.iconContainer, { backgroundColor: "#E8F5E9" }]}>
                                        <Ionicons name="camera" size={30} color="#4CAF50" />
                                    </View>
                                    <Text style={styles.optionText}>Camera</Text>
                                </TouchableOpacity>
                            </View>
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
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: width * 0.85,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 25,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
    },
    optionsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingBottom: 10,
    },
    option: {
        alignItems: "center",
    },
    iconContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
    optionText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#555",
    },
});

export default ImageUploadModal;
