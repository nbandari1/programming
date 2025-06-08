import React from "react";
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type EventProps = {
  name: string;
  time: string;
  area: string;
  imageUrl: string;
  description: string;
};

const Event = ({ name, time, area, imageUrl, description }: EventProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handlePress = () => {
    navigation.navigate("EventScreen", {
      name,
      time,
      area,
      imageUrl,
      description
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <ImageBackground source={{ uri: imageUrl }} style={styles.image}>
        <View style={styles.overlay} />
        <View style={styles.details}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.time}>{time}</Text>
          <Text style={styles.area}>{area}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    aspectRatio: 2 / 1,
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 8,
    marginLeft: 2,
    marginRight: 2
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end"
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  details: {
    padding: 16
  },
  name: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold"
  },
  time: {
    color: "#fff",
    fontSize: 16,
    marginTop: 8
  },
  area: {
    color: "#fff",
    fontSize: 16,
    marginTop: 8
  }
});

export default Event;
