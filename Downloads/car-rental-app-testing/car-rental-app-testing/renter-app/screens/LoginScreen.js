import { View, Text, TextInput, StyleSheet, Pressable, SafeAreaView, Alert } from "react-native";
import { useState } from "react";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("rentaltest@gmail.com");
  const [password, setPassword] = useState("testpassword");

  const authenticateUser = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Navigate to SearchScreen via Main tab navigator
      navigation.navigate("Main", { screen: "Search" });
    } catch (err) {
      Alert.alert("Login Failed", err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.inputField} 
          placeholder="Email" 
          value={email} 
          onChangeText={setEmail} 
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput 
          style={styles.inputField} 
          placeholder="Password" 
          value={password} 
          onChangeText={setPassword} 
          secureTextEntry
        />
      </View>

      <Pressable onPress={authenticateUser} style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Login</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 60,
    fontWeight: 'bold',
    textAlign: 'left',
    width: 260,
    marginBottom: 20,
  },

  inputContainer: {
    margin: 20,
    gap: 20,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  inputField: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 20,
    borderWidth: 2,
    width: 260,
    textAlign: 'left',
  },

  loginButton: {
    backgroundColor: "#3a7ca5",
    paddingHorizontal: 100,
    paddingVertical: 25,
    borderRadius: 20,
    borderWidth: 3,
  },

  loginButtonText: {
    fontWeight: "bold",
    fontSize: 20,
    color: 'white',
  },
});

export default LoginScreen;
