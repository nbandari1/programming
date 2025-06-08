import React, { useState } from "react";
import { View, Text, FlatList } from "react-native";
import styles from "./styles";
import LayerButton from "../../LayerButton";
import { dummyData } from "./dummyData";

export default function JoinLayers() {
  const [joinedLayers, setJoinedLayers] = useState<number[]>([]);

  const handleLayerJoin = (layerId: number) => {
    setJoinedLayers((prev) => {
      if (prev.includes(layerId)) {
        // Remove layer if already joined (leave)
        return prev.filter((id) => id !== layerId);
      } else {
        // Add layer if not joined (join)
        return [...prev, layerId];
      }
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={dummyData}
        renderItem={({ item }) => (
          <LayerButton
            title={item.title}
            isJoined={joinedLayers.includes(item.id)}
            onPress={() => handleLayerJoin(item.id)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}
