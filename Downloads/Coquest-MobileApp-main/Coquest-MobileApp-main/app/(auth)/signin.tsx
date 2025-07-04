import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useMutation, MutationResult } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LOGIN_USER_MUTATION } from '../../constants/gqlStrings';
import { useGlobalContext } from '../../context/GlobalProvider';
import { router, Link } from 'expo-router';

interface LoginUserData {
  loginUser: {
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

interface LoginUserVars {
  email: string;
  password: string;
}

const LoginScreen: React.FC = () => {
  const [email, setEmailState] = useState<string>('');
  const [password, setPasswordState] = useState<string>('');
  const { setIsLogged, setUser, setLoading, loading } = useGlobalContext();

  const [loginUser, { loading: gqlLoading }]: [
    (options: { variables: LoginUserVars }) => Promise<any>,
    MutationResult<LoginUserData>
  ] = useMutation<LoginUserData, LoginUserVars>(LOGIN_USER_MUTATION, {
    onCompleted: async (data) => {
      setLoading(false);
      if (data.loginUser) {
        await AsyncStorage.setItem('token', data.loginUser.token);
        setUser({
          _id: data.loginUser.user._id,
          email: data.loginUser.user.email,
          isAuthenticated: true,
          name: data.loginUser.user.name,
          role: data.loginUser.user.role,
          onboarded: data.loginUser.user.onboarded,
          token: data.loginUser.token,
        });
        setIsLogged(true);
        router.replace('/Home');
      }
    },
    onError: (error) => {
      setLoading(false);
      Alert.alert('Login failed', error.message || 'Please check your credentials.');
    },
  });

  const handleLogin = (): void => {
    setLoading(true);
    loginUser({ variables: { email, password } });
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.logoContainer}>
        {/* Replace with your logo if desired */}
        <Text style={styles.logoText}>Coquest</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>Sign in</Text>
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmailState}
          editable={!loading && !gqlLoading}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPasswordState}
          editable={!loading && !gqlLoading}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading || gqlLoading}
        >
          <Text style={styles.buttonText}>{loading || gqlLoading ? '' : 'Sign In'}</Text>
        </TouchableOpacity>
        {(loading || gqlLoading) && <ActivityIndicator style={{ marginTop: 16 }} />}
        <View style={styles.signupRow}>
          <Text style={styles.signupText}>Don't have an account?</Text>
          <Link href="/signup" asChild>
            <TouchableOpacity>
              <Text style={styles.link}>Sign up</Text>
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
});

export default LoginScreen;
