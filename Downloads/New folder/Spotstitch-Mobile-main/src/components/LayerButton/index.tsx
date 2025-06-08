import React from "react";
import { TouchableOpacity, Text } from "react-native";
import styles from "./styles";

export default function LayerButton({
  title,
  onPress,
  isJoined = false
}: {
  title: string;
  onPress: () => void;
  isJoined?: boolean;
}) {
  return (
    <TouchableOpacity style={[styles.container, isJoined && styles.joinedContainer]} onPress={onPress}>
      <Text style={[styles.text, isJoined && styles.joinedText]}>{title}</Text>
      <Text style={[styles.joinText, isJoined && styles.joinedButtonText]}>{isJoined ? "Joined" : "Join"}</Text>
    </TouchableOpacity>
  );
}
