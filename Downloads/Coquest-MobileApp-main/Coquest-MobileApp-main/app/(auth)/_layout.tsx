import React from "react";
import { Redirect, Stack } from "expo-router";
import { View, ViewStyle } from "react-native";
import { Provider } from "react-redux";
import { store } from "../../redux/store";
import GlobalProvider, { useGlobalContext } from "../../context/GlobalProvider";

// Define the shape of the context returned by useGlobalContext
interface GlobalContextType {
  loading: boolean;
  isLogged: boolean;
}

const AuthLayout: React.FC = () => {
  const { loading, isLogged } = useGlobalContext() as GlobalContextType;

  if (!loading && isLogged) {
    return <Redirect href="/home" />;
  }

  const containerStyle: ViewStyle = { flex: 1 };

  return (
    <Provider store={store}>
      <View style={containerStyle}>
        <GlobalProvider>
          <Stack>
            <Stack.Screen name="signin" options={{ headerShown: false }} />
            <Stack.Screen name="signup" options={{ headerShown: false }} />
            <Stack.Screen name="Home" options={{ headerShown: false }} />
          </Stack>
        </GlobalProvider>
      </View>
    </Provider>
  );
};

export default AuthLayout;
