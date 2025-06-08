import { StyleSheet } from "react-native";
import { theme } from "../../core/theme";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24
  },
  phoneContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 24
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8
  },
  phoneText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333"
  },
  codeText: {
    fontSize: 16,
    color: "#333"
  },
  button: {
    marginTop: 24,
    width: "100%",
    borderRadius: 8,
    paddingVertical: 12,
    backgroundColor: "#1e90ff"
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center"
  },
  skipButton: {
    marginTop: 12,
    width: "100%",
    borderRadius: 8,
    paddingVertical: 12,
    backgroundColor: "transparent"
  },
  skipButtonText: {
    color: "#1e90ff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center"
  },
  link: {
    color: "#1e90ff",
    fontWeight: "bold",
    fontSize: 16
  }
});
