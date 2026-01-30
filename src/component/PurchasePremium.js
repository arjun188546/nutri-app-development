// import React, { useState } from "react";
// import {
//     StyleSheet,
//     Text,
//     View,
//     TouchableOpacity,
//     ScrollView,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import * as SecureStore from "expo-secure-store";
// import api from "./PrivateAxios";
// import Toast from "react-native-toast-message";
// import { WebView } from "react-native-webview";
// import { useNavigation } from "@react-navigation/native";
// import * as Updates from "expo-updates";
// const PurchasePremium = () => {
//     const [loading, setLoading] = useState(false);
//     const [paymentUrl, setPaymentUrl] = useState(null);
//     const [orderId, setOrderId] = useState(null);
//     const navigation = useNavigation();
//     const upgradeToPremium = async () => {
//         const key = await api.get("/payment/get-key");
//         console.log("Razorpay key response:", key);
//         const key_id = key.data.key_id; // Fetch Razorpay key ID from your API
//         console.log("Razorpay Key ID:", key_id);
//         setLoading(true);
//         try {
//             const res = await api.post("/nutri-checkout", {
//                 currency: "INR", // Using user ID from Redux store
//             });
//             console.log("Response from order creation:", res.data);
//             if (res.status === 200) {
//                 const { amount, orderId, currency } = res.data.Data;

//                 setOrderId(orderId);
//                 console.log("Order ID:", orderId);
//                 console.log("Key ID:", key_id);

//                 const htmlContent = `
//           <!DOCTYPE html>
//           <html>
//             <head>
//               <title>Razorpay Checkout</title>
//               <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
//               <script>
//                 var options = {
//                   key: ${key_id} , // Replace with your Razorpay key
//                   amount: ${amount}, // Convert to the smallest currency unit (paise)
//                   currency: '${currency}',
//                   name: 'Geneus Solution',
//                   description: 'Payment for Premium Plan',
//                   order_id: '${orderId}',
//                   handler: function(response) {
//                     window.ReactNativeWebView.postMessage(JSON.stringify(response));
//                   },
//                   theme: {
//                     color: '#276FFC',
//                   },
//                 };
//                 var rzp1 = new Razorpay(options);
//                 rzp1.open();
//               </script>
//             </head>
//             <body>
//             </body>
//           </html>
//         `;

//                 setPaymentUrl(
//                     `data:text/html;charset=utf-8,${encodeURIComponent(
//                         htmlContent
//                     )}`
//                 );
//             } else {
//                 showError("Failed to create order. Please try again.");
//             }
//         } catch (error) {
//             console.error(error);
//             showError("An error occurred. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const showError = (message) => {
//         Toast.show({
//             type: "error",
//             text1: "Error",
//             text2: message,
//             visibilityTime: 3000,
//             autoHide: true,
//         });
//     };

//     const verifyPayment = async (
//         razorpay_order_id,
//         razorpay_payment_id,
//         razorpay_signature
//     ) => {
//         try {
//             console.log("Verifying payment...");
//             console.log("razorpay_order_id:", razorpay_order_id);
//             console.log("razorpay_payment_id:", razorpay_payment_id);
//             console.log("razorpay_signature:", razorpay_signature);
//             const res = await api.post("/api/plan/verify-payment", {
//                 razorpay_order_id,
//                 razorpay_payment_id,
//                 razorpay_signature,
//             });
//             if (res.status === 200) {
//                 console.log("Payment verified successfully");
//                 await Updates.reloadAsync();
//             }
//         } catch (error) {
//             if (error.response) {
//                 console.error("Error response data:", error.response.data);
//                 console.error("Error status:", error.response.status);
//                 showError(
//                     error.response.data.message ||
//                         "Payment verification failed. Please try again."
//                 );
//             } else {
//                 console.error("Error message:", error.message);
//                 showError("An error occurred during payment verification.");
//             }
//         }
//     };

//     if (paymentUrl) {
//         return (
//             <WebView
//                 source={{ uri: paymentUrl }}
//                 onMessage={(event) => {
//                     const response = JSON.parse(event.nativeEvent.data);
//                     const {
//                         razorpay_order_id,
//                         razorpay_payment_id,
//                         razorpay_signature,
//                     } = response;
//                     console.log("Payment response:", response);
//                     verifyPayment(
//                         razorpay_order_id,
//                         razorpay_payment_id,
//                         razorpay_signature
//                     );
//                 }}
//                 onNavigationStateChange={(navState) => {
//                     console.log("Navigation state:", navState);
//                     if (navState.url.includes("payment_failure")) {
//                         showError("Payment failed. Please try again.");
//                     }
//                 }}
//             />
//         );
//     }

//     return (
//         <ScrollView style={styles.container}>
//             <View style={styles.header}>
//                 <Ionicons name="star" size={48} color="#FFD700" />
//                 <Text style={styles.title}>Upgrade to Premium</Text>
//             </View>

//             <Text style={styles.description}>
//                 Unlock all features and take your experience to the next level!
//             </Text>

//             <TouchableOpacity
//                 style={styles.purchaseButton}
//                 onPress={upgradeToPremium}
//                 disabled={loading}
//             >
//                 <Text style={styles.purchaseButtonText}>
//                     {loading ? "Upgrading..." : "Upgrade Now"}
//                 </Text>
//             </TouchableOpacity>
//         </ScrollView>
//     );
// };

// export default PurchasePremium;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#fff",
//         padding: 20,
//         paddingTop: 40,
//     },
//     header: {
//         alignItems: "center",
//         marginBottom: 20,
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: "bold",
//         marginTop: 10,
//     },
//     description: {
//         fontSize: 16,
//         textAlign: "center",
//         marginBottom: 20,
//         color: "#666",
//     },
//     purchaseButton: {
//         backgroundColor: "#276FFC",
//         paddingVertical: 15,
//         borderRadius: 5,
//         alignItems: "center",
//     },
//     purchaseButtonText: {
//         color: "#fff",
//         fontSize: 18,
//         fontWeight: "bold",
//     },
// });

import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux"; // Import Redux's useSelector
import api from "./PrivateAxios";
import Toast from "react-native-toast-message";
import RazorpayCheckout from "react-native-razorpay";
import { useNavigation } from "@react-navigation/native";
import * as Updates from "expo-updates";
import { selectCurrentUser } from "../redux/auth/authSlice";

const PurchasePremium = () => {
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const navigation = useNavigation();

    // Get user data from Redux store
    // const user = useSelector((state) => state.user.user.user); // Assuming the user data is stored in state.user
    const user = useSelector(selectCurrentUser);

    // Create order for Premium Upgrade
    const upgradeToPremium = async () => {
        if (!user) {
            showError("User not found. Please log in again.");
            return;
        }
        const key = await api.get("/payment/get-key");
        console.log("Razorpay key response:", key);
        const key_id = key?.data?.key_id; // Fetch Razorpay key ID from your API
        console.log("Razorpay Key ID:", key_id);
        setLoading(true);
        try {
            const res = await api.post("/nutri-checkout", {
                currency: "INR", // Using user ID from Redux store
            });
            console.log("Response from order creation:", res.data);
            if (res.status === 200) {
                const { orderId, currency, amount } = res.data.Data;
                setOrderId(orderId);
                console.log("Order ID:", orderId);
                console.log("Key ID:", key_id);

                const options = {
                    description: "Credits towards Premium Plan",
                    // image: "https://i.imgur.com/3g7nmJC.jpg", // Replace with your image URL
                    currency: currency,
                    key: key_id, // Replace with your Razorpay key
                    amount: amount, // Convert to the smallest currency unit (paise)
                    name: "Geneus Solution",
                    order_id: orderId,
                    prefill: {
                        email: user.email, // Assuming user object has 'email'
                        contact: user.mobile, // Assuming user object has 'contact'
                        name: user.name, // Assuming user object has 'name'
                    },
                    theme: { color: "#276FFC" },
                };
                console.log("Razorpay options:", options);
                console.log("Opening Razorpay Checkout...");
                console.log("RazorpayCheckout:", RazorpayCheckout);

                RazorpayCheckout?.open(options)
                    .then((data) => {
                        // Handle success
                        alert(`Success: ${data.razorpay_payment_id}`);
                        verifyPayment(
                            data.razorpay_order_id,
                            data.razorpay_payment_id,
                            data.razorpay_signature
                        );
                    })
                    .catch((error) => {
                        // Handle failure
                        console.error("Razorpay error:", error);
                        alert(`Error: ${error.code} | ${error.description}`);
                    });
            } else {
                showError("Failed to create order. Please try again.");
            }
        } catch (error) {
            console.error("Error during upgradeToPremium:", res);
            console.error(error);
            console.log("Error message:", error.message);
            showError(error.message || "An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Show error Toast message
    const showError = (message) => {
        Toast.show({
            type: "error",
            text1: "Error",
            text2: message,
            visibilityTime: 3000,
            autoHide: true,
        });
    };

    // Verify the payment after success
    const verifyPayment = async (
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    ) => {
        try {
            console.log("Verifying payment...");
            console.log("razorpay_order_id:", razorpay_order_id);
            console.log("razorpay_payment_id:", razorpay_payment_id);
            console.log("razorpay_signature:", razorpay_signature);

            const res = await api.post("/payment/verify-payment", {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
            });

            if (res.status === 200) {
                console.log("Payment verified successfully");
                await Updates.reloadAsync();
            }
        } catch (error) {
            if (error.response) {
                console.error("Error response data:", error.response.data);
                console.error("Error status:", error.response.status);
                showError(
                    error.response.data.message ||
                    "Payment verification failed. Please try again."
                );
            } else {
                console.error("Error message:", error.message);
                showError("An error occurred during payment verification.");
            }
        }
    };

    return (
        // <ScrollView style={styles.container}>
        //     <View style={styles.header}>
        //         <Ionicons name="star" size={48} color="#FFD700" />
        //         <Text style={styles.title}>Upgrade to Premium</Text>
        //     </View>

        //     <Text style={styles.description}>
        //         Unlock all features and take your experience to the next level!
        //     </Text>

        //     <TouchableOpacity
        //         style={styles.purchaseButton}
        //         onPress={upgradeToPremium}
        //         disabled={loading}
        //     >
        //         <Text style={styles.purchaseButtonText}>
        //             {loading ? "Upgrading..." : "Upgrade Now"}
        //         </Text>
        //     </TouchableOpacity>
        // </ScrollView>

        <ScrollView >
            <View style={styles.card}>
                <View style={styles.header}>
                    <Ionicons name="star" size={56} color="#F59E0B" />
                    <Text style={styles.title}>Upgrade to Premium</Text>
                </View>

                <Text style={styles.description}>
                    🚀 Unlock all features and take your experience to the next level!
                </Text>

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={upgradeToPremium}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? "Processing..." : "Upgrade Now"}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>

    );
};

export default PurchasePremium;

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 25,
        width: "100%",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        // elevation: 5,
    },
    header: {
        alignItems: "center",
        marginBottom: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 10,
        color: "#2563EB", // modern blue
        textAlign: "center",
    },
    description: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20,
        color: "#4B5563",
    },
    button: {
        backgroundColor: "#2563EB",
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 30,
        alignItems: "center",
        marginTop: 10,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "600",
    }
});
