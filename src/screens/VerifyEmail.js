import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
} from "react-native";
import Toast from "react-native-toast-message";
import api from "../component/PrivateAxios";

const VerifyEmail = ({ route, navigation }) => {
    const [otp, setOtp] = useState("");
    const { email } = route.params; // Get email from navigation

    const handleVerify = async () => {
        if (!otp) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "OTP is required!",
                visibilityTime: 3000,
            });
            return;
        }

        try {
            const response = await api.post("/verify-account", {
                email,
                otp,
            });

            if (response.status === 200) {
                Toast.show({
                    type: "success",
                    text1: "Success",
                    text2: "Email verified successfully!",
                    visibilityTime: 3000,
                });
                navigation.navigate("UserData");
            }
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: error?.response?.data?.message || "Verification failed",
                visibilityTime: 3000,
            });
            console.log("Verification error:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Verify Email</Text>

            <View style={styles.imageContainer}>
                <Image
                    source={require("../assets/Register.png")}
                    style={styles.image}
                />
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter OTP"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    onChangeText={(text) => setOtp(text)}
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleVerify}>
                <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity
                style={styles.linkText}
                onPress={() => navigation.navigate("Register")}
            >
                <Text style={styles.loginText}>Back to Register</Text>
            </TouchableOpacity> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 38,
        fontWeight: "bold",
        color: "#2196F3",
        marginBottom: 20,
    },
    imageContainer: {
        width: "100%",
        height: 200,
        marginBottom: 20,
    },
    image: {
        width: "100%",
        height: "100%",
    },
    inputContainer: {
        width: "95%",
    },
    input: {
        backgroundColor: "#F5F5F5",
        padding: 15,
        borderRadius: 40,
        marginBottom: 10,
    },
    button: {
        backgroundColor: "#2196F3",
        padding: 15,
        borderRadius: 5,
        width: "100%",
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    linkText: {
        marginTop: 20,
    },
    loginText: {
        color: "#2196F3",
        fontWeight: "bold",
    },
});

export default VerifyEmail;
