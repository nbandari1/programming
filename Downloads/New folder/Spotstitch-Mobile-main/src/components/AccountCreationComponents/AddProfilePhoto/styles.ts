import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center"
  },
  image: {
    backgroundColor: "#eee",
    position: "absolute",
    top: 10,
    right: 10,
    padding: 8,
    borderRadius: 20,
    zIndex: 1
  },
  userAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50
  }
});
