//handles what is shown on the post screen
import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput, 
  Alert, ActivityIndicator } from "react-native";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { FAB, Menu } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PostsContext, PostsContextType } from '../services/posts.service';
import * as SecureStore from 'expo-secure-store';
import ApiClient from "../services/ApiClient";
import SharePopup from "../components/SharePopup";

type RootStackParamList = {
  Dashboard: undefined;
  PostScreen: {
    id: string;
    username: string;
    text: string;
    image?: string;
    profilePic?: string;
    reactions: string[];
    timeAgo: string;
  };
  CreatePostScreen: undefined;
  LoginScreen: undefined;
};

type PostScreenRouteProp = RouteProp<RootStackParamList, 'PostScreen'>;

type PostScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PostScreen'>;

const BackButton = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
      <Text style={styles.backButtonText}>← Back to feed</Text>
    </TouchableOpacity>
  );
};

const PostHeader = ({ 
  username, 
  profilePic, 
  timeAgo, 
  onMenuPress 
}: { 
  username: string;
  profilePic?: string;
  timeAgo: string;
  onMenuPress: () => void;
}) => {
  const DEFAULT_PROFILE_PIC = require("../../assets/profile.jpg");
  
  return (
    <View style={styles.header}>
      <View style={styles.userInfo}>
        <Image 
          source={profilePic ? { uri: profilePic } : DEFAULT_PROFILE_PIC} 
          style={styles.profilePic} 
        />
        <View>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.timeAgo}>{timeAgo}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={onMenuPress}>
        <Ionicons name="ellipsis-horizontal" size={24} color="#666" />
      </TouchableOpacity>
    </View>
  );
};

const PostContent = ({ text, image }: { text: string; image?: string }) => (
  <>
    {image ? (
      <>
        <Text style={styles.caption}>{text}</Text>
        <Image source={{ uri: image }} style={styles.image} />
      </>
    ) : (
      <Text style={styles.text}>{text}</Text>
    )}
  </>
);

const PostActions = ({
  isLiked,
  reactionsCount,
  onLike,
  onComment,
  onShare
}: {
  isLiked: boolean;
  reactionsCount: number;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
}) => (
  <View style={styles.footer}>
    <TouchableOpacity style={styles.iconContainer} onPress={onLike}>
      <Ionicons
        name={isLiked ? "heart" : "heart-outline"}
        size={24}
        color={isLiked ? "#e91e63" : "#333"}
      />
      <Text style={[styles.iconText, isLiked && styles.likedText]}>
        {reactionsCount > 0 ? reactionsCount : ''}
      </Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.iconContainer} onPress={onComment}>
      <Feather name="message-circle" size={24} color="#333" />
      <Text style={styles.iconText}>Comment</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.iconContainer} onPress={onShare}>
      <AntDesign name="sharealt" size={24} color="#333" />
      <Text style={styles.iconText}>Share</Text>
    </TouchableOpacity>
  </View>
);

const CommentSection = ({
  profilePic,
  comment,
  setComment,
  onSubmitComment
}: {
  profilePic?: string;
  comment: string;
  setComment: (text: string) => void;
  onSubmitComment: () => void;
}) => {
  const DEFAULT_PROFILE_PIC = require("../../assets/profile.jpg");

  return (
    <View style={styles.commentSection}>
      <Text style={styles.commentTitle}>Comments</Text>
      <View style={styles.commentInputContainer}>
        <Image 
          source={profilePic ? { uri: profilePic } : DEFAULT_PROFILE_PIC} 
          style={styles.commentProfilePic} 
        />
        <TextInput 
          style={styles.commentInput} 
          placeholder="Add a comment..." 
          value={comment}
          onChangeText={setComment}
          onSubmitEditing={onSubmitComment}
          returnKeyType="send"
        />
      </View>
    </View>
  );
};

const PostScreen = () => {
  const navigation = useNavigation<PostScreenNavigationProp>();
  const route = useRoute<PostScreenRouteProp>();
  const { id, username, text, image, profilePic, reactions, timeAgo } = route.params;
  
  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sharePopupVisible, setSharePopupVisible] = useState(false);
  const { setPosts } = useContext<PostsContextType>(PostsContext);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Fetch current user ID on mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = await SecureStore.getItemAsync("accessToken");
        if (!token) {
          navigation.navigate("LoginScreen");
          return;
        }
        const { data } = await ApiClient.get("/v1/users/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCurrentUserId(data.id);
        setIsLiked(reactions.includes(data.id));
      } catch (error) {
        console.error('Error fetching current user:', error);
        navigation.navigate("LoginScreen");
      }
    };

    fetchCurrentUser();
  }, [navigation, reactions]);

  const handleLike = async () => {
    if (isLoading || !currentUserId) return;
    
    try {
      setIsLoading(true);
      const token = await SecureStore.getItemAsync("accessToken");
      if (!token) throw new Error("User not logged in");
      
      if (isLiked) {
        await ApiClient.delete(`/v1/posts/${id}/unlike`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await ApiClient.post(`/v1/posts/${id}/like`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setIsLiked(!isLiked);
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === id
            ? {
                ...post,
                reactions: isLiked
                  ? post.reactions.filter(reactionId => reactionId !== currentUserId)
                  : [...post.reactions, currentUserId]
              }
            : post
        )
      );
    } catch (error) {
      console.error('Error toggling like:', error);
      Alert.alert('Error', 'Failed to update like status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleComment = async () => {
    if (!comment.trim() || !currentUserId) return;

    try {
      setIsLoading(true);
      const token = await SecureStore.getItemAsync("accessToken");
      if (!token) throw new Error("User not logged in");

      await ApiClient.post(`/v1/posts/${id}/comments`, { content: comment.trim() }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setComment("");
      
      // Refresh post to show new comment
      const { data: updatedPost } = await ApiClient.get(`/v1/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === id ? updatedPost : post
        )
      );
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Failed to add comment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    setSharePopupVisible(true);
  };

  const handleSharePlatform = (platform: string) => {
    // TODO: Implement actual sharing logic for each platform
    console.log(`Sharing on ${platform}`);
    setSharePopupVisible(false);
  };

  const handleEdit = () => {
    setMenuVisible(false);
    // TODO: Implement edit functionality
    console.log("Edit post", id);
  };

  const handleDelete = async () => {
    if (!currentUserId) return;

    try {
      setIsLoading(true);
      const token = await SecureStore.getItemAsync("accessToken");
      if (!token) throw new Error("User not logged in");

      await ApiClient.delete(`/v1/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting post:', error);
      Alert.alert('Error', 'Failed to delete post');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BackButton />
      
      <PostHeader
        username={username}
        profilePic={profilePic}
        timeAgo={timeAgo}
        onMenuPress={() => setMenuVisible(true)}
      />
      
      <PostContent text={text} image={image} />
      
      <PostActions
        isLiked={isLiked}
        reactionsCount={reactions.length}
        onLike={handleLike}
        onComment={handleComment}
        onShare={handleShare}
      />
      
      <View style={styles.separator} />
      
      <CommentSection
        profilePic={profilePic}
        comment={comment}
        setComment={setComment}
        onSubmitComment={handleComment}
      />

      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={{ x: 0, y: 0 }}
      >
        <Menu.Item 
          onPress={handleEdit} 
          title="Edit Post"
          leadingIcon="pencil"
        />
        <Menu.Item 
          onPress={handleDelete} 
          title="Delete"
          leadingIcon="delete"
          titleStyle={styles.deleteText}
        />
      </Menu>

      <SharePopup
        visible={sharePopupVisible}
        onClose={() => setSharePopupVisible(false)}
        onShare={handleSharePlatform}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('CreatePostScreen')}
        color="#fff"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#fff"
  },
  backButton: {
    padding: 12,
    backgroundColor: "transparent"
  },
  backButtonText: {
    color: "#1e90ff",
    fontSize: 16,
    fontWeight: "bold"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16
  },
  profilePic: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#ccc"
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333"
  },
  caption: {
    fontSize: 16,
    color: "#333",
    paddingHorizontal: 8
  },
  text: {
    fontSize: 16,
    color: "#333",
    paddingHorizontal: 8,
    paddingVertical: 8
  },
  image: {
    height: 300,
    width: "100%",
    borderRadius: 8
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16
  },
  iconText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333"
  },
  separator: {
    borderBottomColor: "#ccc",
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginTop: 8
  },
  commentSection: {
    padding: 12,
    backgroundColor: "#fafafa"
  },
  commentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16
  },
  commentProfilePic: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#ccc"
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#333"
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#4CAF50',
  },
  timeAgo: {
    fontSize: 12,
    color: "#999"
  },
  likedText: {
    color: "#e91e63"
  },
  deleteText: {
    color: '#e91e63'
  }
});

export default PostScreen;
