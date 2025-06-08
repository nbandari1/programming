import { StyleSheet, Dimensions } from "react-native";
import { theme } from "../../core/theme";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  content: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 200,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  socialButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    gap: 20,
  },
  socialButton: {
    alignItems: "center",
    width: width / 4 - 25,
  },
  socialIcon: {
    backgroundColor: theme.colors.darkGray,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  socialText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
}); 