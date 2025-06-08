import React from "react";
import { View, Modal, TouchableOpacity, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "./styles";
import { socialIconList } from "../Icon/socialIconList";

interface SharePopupProps {
  visible: boolean;
  onClose: () => void;
  onShare: (platform: string) => void;
}

const SharePopup = ({ visible, onClose, onShare }: SharePopupProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Share via</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.socialButtons}>
            {socialIconList.map((platform) => (
              <TouchableOpacity
                key={platform.id}
                style={styles.socialButton}
                onPress={() => {
                  onShare(platform.name);
                  onClose();
                }}
              >
                <MaterialCommunityIcons
                  name={platform.name}
                  size={32}
                  color="#fff"
                  style={styles.socialIcon}
                />
                <Text style={styles.socialText}>
                  {platform.name.charAt(0).toUpperCase() + platform.name.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default SharePopup; 