import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useMutation, MutationResult } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REGISTER_USER_MUTATION } from '../../constants/gqlStrings';
import { useGlobalContext } from '../../context/GlobalProvider';
import { router, Link } from 'expo-router';

// Define the expected shape of the GraphQL response
interface RegisterUserData {
  registerUser: {
    token: string;
    user: {
      _id: string;
      email: string;
      name: string;
      role: string;
      onboarded: boolean;
    };
  };
}

// Define the shape of the input variables
interface RegisterUserVars {
  email: string;
  password: string;
  name: string;
}

const Signup: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const { setIsLogged, setUser, setLoading, loading } = useGlobalContext();

  const [registerUser, { loading: gqlLoading }]: [
    (options: { variables: RegisterUserVars }) => Promise<any>,
    MutationResult<RegisterUserData>
  ] = useMutation<RegisterUserData, RegisterUserVars>(REGISTER_USER_MUTATION, {
    onCompleted: async (data) => {
      setLoading(false);
      if (data.registerUser) {
        await AsyncStorage.setItem('token', data.registerUser.token);
        setUser({
          _id: data.registerUser.user._id,
          email: data.registerUser.user.email,
          isAuthenticated: true,
          name: data.registerUser.user.name,
          role: data.registerUser.user.role,
          onboarded: data.registerUser.user.onboarded,
          token: data.registerUser.token,
        });
        setIsLogged(true);
        router.replace('/Home');
      }
    },
    onError: (error) => {
      setLoading(false);
      Alert.alert('Signup failed', error.message || 'Please check your details.');
    },
  });

  const handleSignup = (): void => {
    setPasswordError('');
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    setLoading(true);
    registerUser({ variables: { email, password, name } });
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.logoContainer}>
        {/* Replace with your logo if desired */}
        <Text style={styles.logoText}>Coquest</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>Sign up</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          editable={!loading && !gqlLoading}
        />
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          editable={!loading && !gqlLoading}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!loading && !gqlLoading}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          editable={!loading && !gqlLoading}
        />
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSignup}
          disabled={loading || gqlLoading}
        >
          <Text style={styles.buttonText}>{loading || gqlLoading ? '' : 'Sign Up'}</Text>
        </TouchableOpacity>
        {(loading || gqlLoading) && <ActivityIndicator style={{ marginTop: 16 }} />}
        <View style={styles.signupRow}>
          <Text style={styles.signupText}>Already have an account?</Text>
          <Link href="/signin" asChild>
            <TouchableOpacity>
              <Text style={styles.link}>Sign in</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
    padding: 16,
  },
  logoContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#161622',
    letterSpacing: 2,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#161622',
  },
  input: {
    width: '100%',
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fafbfc',
  },
  button: {
    width: '100%',
    height: 48,
    backgroundColor: '#161622',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  signupText: {
    fontSize: 16,
    color: '#333',
    marginRight: 6,
  },
  link: {
    color: '#007bff',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
    fontSize: 14,
    alignSelf: 'flex-start',
  },
});

export default Signup;
