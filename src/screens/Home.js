import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from "react-native";
import React, { useEffect, useState, useMemo } from "react";
import * as SecureStore from "expo-secure-store";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import Dashboard from "../component/Dashbord/Dashbord";
import PurchasePremium from "../component/PurchasePremium";
import Diary from "../component/Diary";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

import Search from "../component/Search";
import Edit from "../component/Edit";
import UserData from "./UserData";
import { selectCurrentUser } from "../redux/auth/authSlice";
import { useGetNutritionDetailsQuery } from "../redux/caloriesRequirementData/NutriDetailsApiSlice";
import PlanScreen from "../component/Plan";
import PlanExpiredScreen from "../component/PlanExpired";
import FoodDetailScreen from "../component/FoodDetailScreen";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import ImageUploadModal from "../component/ImageUploadModal";
import MealNameModal from "../component/MealNameModal";
import { analyzeFoodImage, fetchMealHistory } from "../services/geminiService";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// --- Static Navigators ---

const DashboardStack = ({ mealHistory, onMealPress }) => (
  <Stack.Navigator>
    <Stack.Screen name="DashboardMain" options={{ headerShown: false }}>
      {(props) => (
        <Dashboard
          {...props}
          mealHistory={mealHistory}
          onMealPress={onMealPress}
        />
      )}
    </Stack.Screen>
    <Stack.Screen name="DashboardSearch" component={Search} options={{ headerShown: false }} />
    <Stack.Screen name="DashboardEdit" component={Edit} options={{ headerShown: false }} />
    <Stack.Screen name="FoodDetail" component={FoodDetailScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const DiaryStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="DiaryMain" component={Diary} options={{ headerShown: false }} />
    <Stack.Screen name="DiarySearch" component={Search} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#2196F3" />
    <Text style={styles.loadingText}>Loading...</Text>
  </View>
);

const Placeholder = () => null;

// --- Main Home Component ---

const Home = () => {
  const navigation = useNavigation();
  const user = useSelector(selectCurrentUser);

  const nutriDetails = useMemo(() => ({
    caloriegoal: 2000, fat: 65, carbs: 250, protein: 100, weight: 75,
    userPlan: {
      plan: "premium plan",
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    },
  }), []);

  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [mealNameModalVisible, setMealNameModalVisible] = useState(false);
  const [pendingImage, setPendingImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [mealHistory, setMealHistory] = useState([]);

  // Fetch history on mount
  useEffect(() => {
    let isMounted = true;
    const loadHistory = async () => {
      try {
        const history = await fetchMealHistory();
        if (isMounted && history) {
          setMealHistory(history);
        }
      } catch (err) {
        console.error("Failed to load history:", err);
      }
    };
    loadHistory();
    return () => { isMounted = false; };
  }, []);

  if (!user) {
    navigation.replace("Login");
    return null;
  }

  const handleMealSubmit = async (mealName) => {
    setMealNameModalVisible(false);
    setAnalyzing(true);
    Toast.show({
      type: 'info',
      text1: 'Analyzing Meal...',
      text2: 'Identifying food facts.',
      autoHide: false
    });

    try {
      const result = await analyzeFoodImage(pendingImage.base64 || "", mealName, pendingImage.uri, user?.id);
      if (result.success) {
        setMealHistory(prev => [result, ...prev]);
        Toast.hide();
        navigation.navigate("Dashboard", {
          screen: "FoodDetail",
          params: { meal: result }
        });
      } else {
        Toast.show({ type: 'error', text1: 'Analysis Failed', text2: result.error });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const pickImageV2 = async () => {
    setUploadModalVisible(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });
    if (!result.canceled) {
      setPendingImage(result.assets[0]);
      setMealNameModalVisible(true);
    }
  };

  const takePhotoV2 = async () => {
    setUploadModalVisible(false);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return;
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });
    if (!result.canceled) {
      setPendingImage(result.assets[0]);
      setMealNameModalVisible(true);
    }
  };

  const userPlan = nutriDetails?.userPlan;
  if (userPlan && new Date() > new Date(userPlan.endDate)) {
    return <PlanExpiredScreen userPlan={userPlan} />;
  }

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Dashboard") iconName = focused ? "home" : "home-outline";
            else if (route.name === "Diary") iconName = focused ? "book" : "book-outline";
            else if (route.name === "Plan") iconName = focused ? "calendar" : "calendar-outline";
            else if (route.name === "Profile") iconName = focused ? "person" : "person-outline";
            else iconName = "add-circle";
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: "#000",
          tabBarInactiveTintColor: "#BBB",
          tabBarLabelStyle: styles.tabLabel,
        })}
      >
        <Tab.Screen name="Dashboard" options={{ headerShown: false }}>
          {(props) => (
            <DashboardStack
              {...props}
              mealHistory={mealHistory}
              onMealPress={(meal) => props.navigation.navigate("Dashboard", { screen: "FoodDetail", params: { meal } })}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Diary" component={DiaryStack} options={{ headerShown: false }} />
        <Tab.Screen
          name="Upload"
          component={Placeholder}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setUploadModalVisible(true);
            },
          }}
          options={{
            tabBarLabel: () => null,
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                onPress={() => setUploadModalVisible(true)}
                activeOpacity={0.7}
              >
                <View style={styles.plusButtonContainer}>
                  <View style={styles.plusButton}>
                    <Ionicons name="add" size={35} color="#FFF" />
                  </View>
                </View>
              </TouchableOpacity>
            ),
          }}
        />
        <Tab.Screen name="Plan" options={{ headerShown: false }}>
          {() => nutriDetails?.userPlan ? <PlanScreen userPlan={nutriDetails.userPlan} /> : <PurchasePremium />}
        </Tab.Screen>
        <Tab.Screen name="Profile" component={UserData} options={{ headerShown: false }} />
      </Tab.Navigator>

      <ImageUploadModal
        visible={uploadModalVisible}
        onClose={() => setUploadModalVisible(false)}
        onPickImage={pickImageV2}
        onTakePhoto={takePhotoV2}
      />
      <MealNameModal
        visible={mealNameModalVisible}
        onClose={() => setMealNameModalVisible(false)}
        onSubmit={handleMealSubmit}
        imageUri={pendingImage?.uri}
      />
    </>
  );
};

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  loadingText: { marginTop: 10, fontSize: 16, color: "#666" },
  tabBar: {
    backgroundColor: "#ffffff", borderTopWidth: 1, borderTopColor: "#f1f3f5", height: 80,
    paddingBottom: 20, paddingTop: 5, elevation: 25, shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 15,
  },
  tabLabel: { fontSize: 11, fontWeight: "600", marginTop: 2 },
  plusButtonContainer: { top: -24, justifyContent: "center", alignItems: "center", width: 70 },
  plusButton: {
    width: 65, height: 65, borderRadius: 32, backgroundColor: "#30475E",
    justifyContent: "center", alignItems: "center",
    shadowColor: "#30475E", shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 12, borderWidth: 4, borderColor: "#fff",
  },
});

export default Home;
