import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import Register from "./src/screens/Register";
import Login from "./src/screens/Login";
import UserData from "./src/screens/UserData";
import Home from "./src/screens/Home";
import VerifyEmail from "./src/screens/VerifyEmail";
import { Provider } from "react-redux";
import { store } from "./src/app/store";
// import store from "./src/redux/store";
import Toast from "react-native-toast-message";
import DiaryDetail from "./src/component/DiaryDetail";
import RequireAuth from "./src/screens/RequireAuth";

const Stack = createStackNavigator();

const App = () => {
  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState("Login");

  useEffect(() => {
    setInitialRoute("Home");
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute}>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="UserData"
            component={UserData}
            options={{ headerShown: false }}
          />
          {/* <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          /> */}
          <Stack.Screen name="Home"
            options={{ headerShown: false }}
          >
            {() => (
              <RequireAuth allowedRole={["user", "admin"]}>
                <Home />
              </RequireAuth>
            )}
          </Stack.Screen>

          <Stack.Screen
            name="VerifyEmail"
            component={VerifyEmail}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DiaryDetail"
            component={DiaryDetail}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
      <Toast />
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default App;
