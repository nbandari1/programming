import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Redirect } from 'expo-router';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '../context/GlobalProvider';

const Welcome: React.FC = () => {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && !isLogged) return <Redirect href="/signin" />;
  if (!loading && isLogged) return <Redirect href="/Home" />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#161622' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
          <Text style={{ fontSize: 28, color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
            Welcome to Your App
          </Text>
          <Text style={{ fontSize: 16, color: '#ccc', marginTop: 16, textAlign: 'center' }}>
            Where Creativity Meets Innovation: Embark on a Journey of Limitless Exploration.
          </Text>
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Welcome;


