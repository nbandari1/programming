import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const categories = [
  'All',
  'Music',
  'Sports',
  'Food',
  'Art',
  'Technology',
  'Fashion',
  'Travel',
  'Events',
];

interface CategoriesProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const Categories = ({ selectedCategory, onSelectCategory }: CategoriesProps) => {
  return (
    <View style={styles.container}>
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          onPress={() => onSelectCategory(category)}
          style={[
            styles.categoryButton,
            selectedCategory === category && styles.selectedCategoryButton
          ]}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === category && styles.selectedCategoryText
            ]}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10
  },
  categoryButton: {
    padding: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#999",
    backgroundColor: "#fff",
    marginRight: 8,
  },
  selectedCategoryButton: {
    backgroundColor: "#4a4",
    borderColor: "#4a4"
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666"
  },
  selectedCategoryText: {
    color: "#fff"
  }
});

export default Categories;
