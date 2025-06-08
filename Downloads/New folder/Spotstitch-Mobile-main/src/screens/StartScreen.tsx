import React from "react";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import Paragraph from "../components/Paragraph";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export default function StartScreen({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList> }) {
  return (
    <Background>
      <Logo />
      <Header>Spotstitch</Header>
      <Paragraph>Welcome to Spotstitch</Paragraph>
      <Button mode="contained" onPress={() => navigation.navigate("LoginScreen")}>
        Login
      </Button>
      <Button mode="outlined" onPress={() => navigation.navigate("RegisterScreen")}>
        Sign Up
      </Button>
    </Background>
  );
}
