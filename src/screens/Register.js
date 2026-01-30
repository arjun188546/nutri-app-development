import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
} from "react-native";
import customAxios from "../component/CustomAxios";
import api from "../component/PrivateAxios";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/UserSlice";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-toast-message";
import { useSignupMutation } from "../redux/auth/authApiSlice";

const Register = ({ navigation }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [number, setNumber] = useState("");
    const dispatch = useDispatch();

    const [signup, { isLoading }] = useSignupMutation();

    const handleRegister = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!username || !email || !password || !number) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "All fields are required!",
            });
            return;
        }

        if (!emailRegex.test(email)) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Please enter a valid email address.",
            });
            return;
        }

        if (password.length < 8) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Password must be at least 8 characters long.",
            });
            return;
        }

        try {
            console.log("Registering user with payload:", { name: username, email, password, mobile: number });
            const response = await signup({
                name: username,
                email,
                password,
                mobile: number,
            }).unwrap();

            console.log("Signup success response:", response);
            dispatch(setUser(response));
            await SecureStore.setItemAsync("accessToken", response.accessToken);
            await SecureStore.setItemAsync("refreshToken", response.refreshToken);

            Toast.show({
                type: "success",
                text1: "Success",
                text2: "Registered successfully",
            });

            navigation.navigate("VerifyEmail", { email });
        } catch (error) {
            console.error("Signup failed error:", JSON.stringify(error, null, 2));
            Toast.show({
                type: "error",
                text1: "Error",
                text2: error?.data?.message || "Failed to Register. Please try again.",
            });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>

            <View style={styles.imageContainer}>
                <Image
                    source={require("../assets/Register.png")}
                    style={styles.image}
                />
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    placeholderTextColor="#999"
                    onChangeText={(text) => setUsername(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    onChangeText={(text) => setEmail(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    placeholderTextColor="#999"
                    onChangeText={(text) => setNumber(text)}
                    keyboardType="numeric"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#999"
                    secureTextEntry
                    onChangeText={(text) => setPassword(text)}
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.loginLink}>Login</Text>
                </TouchableOpacity>
            </View>
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
        fontSize: 44,
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
    loginContainer: {
        flexDirection: "row",
        marginTop: 20,
    },
    loginText: {
        color: "#333",
    },
    loginLink: {
        color: "#2196F3",
        fontWeight: "bold",
    },
});

export default Register;
