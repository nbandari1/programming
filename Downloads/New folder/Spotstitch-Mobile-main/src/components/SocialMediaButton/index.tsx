import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "./styles";

export default function SocialMediaButton({
  title,
  iconColor,
  iconName,
  iconSize,
  onPress
}: {
  title: string;
  iconColor?: string;
  iconName: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  iconSize?: number;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name={iconName} size={iconSize} color={iconColor} />
      </View>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}
