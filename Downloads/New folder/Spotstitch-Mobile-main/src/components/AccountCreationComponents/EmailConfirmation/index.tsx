import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./styles";

export default function EmailConfirmation() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Didn&apos;t receive an email? </Text>
      <TouchableOpacity onPress={() => {}}>
        <Text style={styles.link}>Send again.</Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * refactor: Application now uses TS; Improve code consistency: Changed file paths to match industry-standard structures. Added linting and precommit hooks.

- Updated LoadingScreen, LoginScreen, RegisterScreen, ResetPasswordScreen, StartScreen, TrendingScreen, and PostScreen to use NativeStackNavigationProp and RouteProp for better type safety.
- Cleaned up code formatting and removed unnecessary comments.
- Enhanced styles in LoginOTPVerification and PostScreen for improved UI.
- Added profile picture asset and updated styles for better visual consistency.
- Introduced RootStackParamList type definition for better navigation type management.
- Added .prettierignore file to exclude specific directories from formatting.
- Updated tsconfig.json to include module setting for ESNext.
 */
