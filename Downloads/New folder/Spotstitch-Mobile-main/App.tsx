import React from "react";
import { Provider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { theme } from "./src/core/theme";
import { LoadingScreen, StartScreen, LoginScreen, RegisterScreen, ResetPasswordScreen, Dashboard } from "./src/screens";
import TrendingScreen from "./src/screens/TrendingScreen";
import PostScreen from "./src/screens/PostScreen";
import EventScreen from "./src/screens/EventScreen";
import LoginOTPVerificationScreen from "./src/screens/LoginOTPVerification";
import AccountCreationScreen from "./src/screens/AccountCreation";
import CreatePostScreen from "./src/screens/CreatePostScreen";

type RootStackParamList = {
  EventScreen: {
    name: string;
    time: string;
    area: string;
    imageUrl: string;
    description: string;
  };
  TrendingScreen: undefined;
  PostScreen: {
    id: string;
    username: string;
    text: string;
    image?: string;
    profilePic?: string;
    reactions: string[];
    timeAgo: string;
  };
  StartScreen: undefined;
  LoginOTPVerificationScreen: undefined;
  RegisterScreen: undefined;
  LoginScreen: undefined;
  Dashboard: undefined;
  LoadingScreen: undefined;
  ResetPasswordScreen: undefined;
  AccountCreationScreen: undefined;
  CreatePostScreen: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <Provider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="LoadingScreen"
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
          <Stack.Screen name="StartScreen" component={StartScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="TrendingScreen" component={TrendingScreen} />
          <Stack.Screen name="PostScreen" component={PostScreen} />
          <Stack.Screen name="EventScreen" component={EventScreen} />
          <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
          <Stack.Screen name="LoginOTPVerificationScreen" component={LoginOTPVerificationScreen} />
          <Stack.Screen name="AccountCreationScreen" component={AccountCreationScreen} />
          <Stack.Screen name="CreatePostScreen" component={CreatePostScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
