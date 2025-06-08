import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { TextInput, Button, Text, Snackbar, Menu } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { categories } from '../components/Categories';
import * as SecureStore from 'expo-secure-store';
import ApiClient from "../services/ApiClient";

// TODO: Implement proper authentication
// For now we're using mock data and skipping auth checks

// Filter out the 'All' category since it's not a valid post category
const postCategories = categories.filter(cat => cat !== 'All');

interface CreatePostScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

export default function CreatePostScreen({ navigation }: CreatePostScreenProps) {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [media, setMedia] = useState<{ type: 'image' | 'video'; url: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [emojiMenuVisible, setEmojiMenuVisible] = useState(false);
  
  // TODO: Replace with actual user profile pic
  const DEFAULT_PROFILE_PIC = require('../../assets/profile.jpg');

  const validatePost = () => {
    if (!content.trim() && media.length === 0) {
      setError('Please add some content or an image to create a post');
      setSnackbarVisible(true);
      return false;
    }
    if (!category) {
      setError('Please select a category for your post');
      setSnackbarVisible(true);
      return false;
    }
    return true;
  };

  const handleCreatePost = async () => {
    if (!validatePost()) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const token = await SecureStore.getItemAsync("accessToken");
      if (!token) {
        navigation.navigate("LoginScreen");
        return;
      }

      const newPost = {
        content: content.trim(),
        category,
        media,
      };

      await ApiClient.post("/v1/posts", newPost, {
        headers: { Authorization: `Bearer ${token}` }
      });

      navigation.navigate('Dashboard');
    } catch (error: any) {
      console.error('Error creating post:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create post';
      
      if (errorMessage === "User not logged in") {
        navigation.navigate("LoginScreen");
      } else {
        setError(errorMessage);
        setSnackbarVisible(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddImage = () => {
    // TODO: Implement image picker
    console.log('Add image');
  };

  const handleAddEmoji = (emoji: string) => {
    setContent(prevContent => prevContent + emoji);
    setEmojiMenuVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color="#333" />
        </TouchableOpacity>
        
        {/* Category Dropdown */}
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button 
              mode="outlined" 
              onPress={() => setMenuVisible(true)}
              style={styles.categoryButton}
              contentStyle={styles.categoryButtonContent}
              icon={() => <Ionicons name="chevron-down" size={16} color="#666" />}
              labelStyle={styles.categoryButtonLabel}
            >
              {category || 'Select Category'}
            </Button>
          }
        >
          {postCategories.map((cat: string) => (
            <Menu.Item
              key={cat}
              onPress={() => {
                setCategory(cat);
                setMenuVisible(false);
              }}
              title={cat}
            />
          ))}
        </Menu>

        <Button
          mode="contained"
          onPress={handleCreatePost}
          loading={isLoading}
          disabled={isLoading}
        >
          Post
        </Button>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        <View style={styles.inputContainer}>
          <Image source={DEFAULT_PROFILE_PIC} style={styles.profilePic} />
          <TextInput
            placeholder="What's on your mind?"
            value={content}
            onChangeText={setContent}
            multiline
            style={styles.contentInput}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            placeholderTextColor="rgba(0, 0, 0, 0.4)"
          />
        </View>

        {/* Media Preview */}
        {media.length > 0 && (
          <View style={styles.mediaPreview}>
            {media.map((item, index) => (
              <View key={index} style={styles.mediaItem}>
                <Image source={{ uri: item.url }} style={styles.mediaImage} />
                <TouchableOpacity
                  style={styles.removeMedia}
                  onPress={() => setMedia(media.filter((_, i) => i !== index))}
                >
                  <Ionicons name="close-circle" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <View style={styles.bottomActionsLeft}>
          <TouchableOpacity onPress={handleAddImage} style={styles.actionButton}>
            <Ionicons name="image" size={24} color="#333" />
          </TouchableOpacity>
          
          {/* Emoji Button */}
          <Menu
            visible={emojiMenuVisible}
            onDismiss={() => setEmojiMenuVisible(false)}
            anchor={
              <TouchableOpacity 
                onPress={() => setEmojiMenuVisible(true)}
                style={styles.actionButton}
              >
                <Ionicons name="happy-outline" size={24} color="#333" />
              </TouchableOpacity>
            }
          >
            <View style={styles.emojiGrid}>
              {["😊", "👍", "❤️", "🎉", "😂", "🤔", "👋", "🔥", "✨", "💯", "🙌", "��"].map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={styles.emojiButton}
                  onPress={() => handleAddEmoji(emoji)}
                >
                  <Text style={styles.emojiText}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Menu>
        </View>
      </View>

      {/* Error Snackbar */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={styles.snackbar}
      >
        {error}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  content: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  contentInput: {
    flex: 1,
    backgroundColor: 'transparent',
    fontSize: 16,
    paddingTop: 0,
  },
  categoryButton: {
    borderRadius: 20,
    borderColor: '#666',
    flex: 1,
    marginHorizontal: 20,
  },
  categoryButtonContent: {
    flexDirection: 'row-reverse', // Places icon on the right
    height: 40,
  },
  categoryButtonLabel: {
    fontSize: 14,
    marginRight: 8, // Space between text and icon
  },
  mediaPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 16,
  },
  mediaItem: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  mediaImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeMedia: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
  },
  bottomActions: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  bottomActionsLeft: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    width: 200,
  },
  emojiButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiText: {
    fontSize: 24,
  },
  snackbar: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#333',
  },
}); 