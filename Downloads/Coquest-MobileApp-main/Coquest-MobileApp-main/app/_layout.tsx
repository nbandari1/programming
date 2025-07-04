import React from 'react';
import { Stack } from 'expo-router';
import GlobalProvider from '../context/GlobalProvider';
import { ApolloProvider } from '../apollo/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '../redux/store';

const RootLayout: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GlobalProvider>
          <ApolloProvider>
            <Stack>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(Programs)" options={{ headerShown: false }} />
              <Stack.Screen name="(Projects)" options={{ headerShown: false }} />
              <Stack.Screen name="(Coops)" options={{ headerShown: false }} />
            </Stack>
          </ApolloProvider>
        </GlobalProvider>
      </PersistGate>
    </Provider>
  );
};

export default RootLayout;
