import React, { useEffect } from "react";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Paragraph from "../components/Paragraph";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export default function LoginScreen({
  // This is the useNavigation prop from React Navigation
  navigation
}: {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("StartScreen");
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Background>
      <Logo />
      <Paragraph>Loading...</Paragraph>
    </Background>
  );
}
