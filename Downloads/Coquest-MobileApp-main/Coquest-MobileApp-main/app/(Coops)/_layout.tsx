import React from "react";
import { Redirect, Stack } from "expo-router";
import { View } from "react-native";
import { Provider } from "react-redux";
import { store } from "../../redux/store";
import GlobalProvider, { useGlobalContext } from "../../context/GlobalProvider";

const AuthLayout: React.FC = () => {
  const { loading, isLogged } = useGlobalContext() as {
    loading: boolean;
    isLogged: boolean;
  };

  if (!loading && isLogged) return <Redirect href='/home' />;

  return (
    <Provider store={store}>
      <View style={{ flex: 1 }}>
        <GlobalProvider>
          <Stack>
            <Stack.Screen name="Sample" options={{ headerShown: false }} />
            {/* Add more screens as needed */}
          </Stack>
        </GlobalProvider>
      </View>
    </Provider>
  );
};

export default AuthLayout; 