//controls the post related functionality like: like, comment, share, etc.

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, GestureResponderEvent } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getTimeAgo, useTimeAgo, formatDetailedDate } from '../utils/timeUtils';
import * as SecureStore from "expo-secure-store";
import ApiClient from "../services/ApiClient";
import SharePopup from "./SharePopup";

// Types
interface User {
  id: string;
  username: string;
  profilePicture?: string;
}

interface PostUser {
  id: string;
  username: string;
  profilePic?: string;
}

// API Functions
async function likePost(postId: string) {
  const token = await SecureStore.getItemAsync("accessToken");
  if (!token) throw new Error("User not logged in");
  
  await ApiClient.post(`/v1/posts/${postId}/like`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

async function unlikePost(postId: string) {
  const token = await SecureStore.getItemAsync("accessToken");
  if (!token) throw new Error("User not logged in");
  
  await ApiClient.delete(`/v1/posts/${postId}/unlike`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

// Components
const PostHeader = ({ 
  user, 
  timeAgo,
  onOptionsPress,
  onUserPress
}: { 
  user: PostUser;
  timeAgo: string;
  onOptionsPress?: (event: GestureResponderEvent) => void;
  onUserPress?: () => void;
}) => {
  const dynamicTimeAgo = useTimeAgo(timeAgo);
  const fullDate = formatDetailedDate(timeAgo);
  
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.userInfo} onPress={onUserPress}>
        <Image 
          source={user.profilePic ? { uri: user.profilePic } : require('../assets/empty-avatar.png')} 
          style={styles.profilePic} 
        />
        <View>
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.timeAgo} numberOfLines={1}>{dynamicTimeAgo}</Text>
          <Text style={styles.fullDate} numberOfLines={1}>{fullDate}</Text>
        </View>
      </TouchableOpacity>
      {onOptionsPress && (
        <TouchableOpacity onPress={onOptionsPress}>
          <Ionicons name="ellipsis-horizontal" size={24} color="#666" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const PostContent = ({ text, image }: { text: string; image?: string }) => (
  <View style={styles.content}>
    <Text style={styles.text}>{text}</Text>
    {image && (
      <Image 
        source={{ uri: image }} 
        style={styles.image} 
        resizeMode="cover"
      />
    )}
  </View>
);

const PostActions = ({
  reactions,
  commentsCount,
  onLike,
  onComment,
  onShare,
  isLiked
}: {
  reactions: string[];
  commentsCount: number;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  isLiked?: boolean;
}) => (
  <View style={styles.actions}>
    <TouchableOpacity style={styles.actionButton} onPress={onLike}>
      <Image 
        source={require('../../assets/like.png')} 
        style={[styles.actionIcon, isLiked && styles.likedIcon]} 
      />
      {reactions.length > 0 && (
        <Text style={[styles.actionText, isLiked && styles.likedText]}>
          {reactions.length}
        </Text>
      )}
    </TouchableOpacity>
    
    <TouchableOpacity style={styles.actionButton} onPress={onComment}>
      <Image source={require('../../assets/comment.png')} style={styles.actionIcon} />
      {commentsCount > 0 && (
        <Text style={styles.actionText}>{commentsCount}</Text>
      )}
    </TouchableOpacity>
    
    <TouchableOpacity style={styles.actionButton} onPress={onShare}>
      <Image source={require('../../assets/share.png')} style={styles.actionIcon} />
    </TouchableOpacity>
  </View>
);

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
  UserProfile: {
    userId: string;
    username: string;
  };
  CreatePostScreen: undefined;
};

type PostNavigationProp = NativeStackNavigationProp<RootStackParamList>;

type PostProps = {
  id: string;
  author: User;
  text: string;
  image?: string;
  timeAgo: string;
  commentsCount: number;
  reactions: string[];
  onLike?: (postId: string) => void;
  onOptionsPress?: (event: GestureResponderEvent) => void;
};

const Post = ({ 
  id,
  author,
  text, 
  image, 
  timeAgo,
  commentsCount,
  reactions = [],
  onLike,
  onOptionsPress
}: PostProps) => {
  const navigation = useNavigation<PostNavigationProp>();
  const [currentTimeAgo, setCurrentTimeAgo] = useState(timeAgo);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sharePopupVisible, setSharePopupVisible] = useState(false);
  
  // TODO: Replace with actual user ID from auth
  const currentUserId = '1';

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimeAgo(getTimeAgo(timeAgo));
    }, 60000);

    return () => clearInterval(interval);
  }, [timeAgo]);

  // Check if current user has liked the post
  useEffect(() => {
    setIsLiked(reactions.includes(currentUserId));
  }, [reactions]);

  const handleLike = async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      
      if (isLiked) {
        await unlikePost(id);
      } else {
        await likePost(id);
      }
      
      setIsLiked(!isLiked);
      if (onLike) {
        onLike(id);
      }
    } catch (error) {
      console.error('Error handling like:', error);
      // TODO: Show error toast/alert
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserPress = () => {
    navigation.navigate('UserProfile', {
      userId: author.id,
      username: author.username
    });
  };

  const onPressComment = () => {
    navigation.navigate('PostScreen', {
      id,
      username: author.username,
      text,
      image,
      profilePic: author.profilePicture,
      reactions,
      timeAgo
    });
  };

  const handleShare = () => {
    setSharePopupVisible(true);
  };

  const handleSharePlatform = (platform: string) => {
    // TODO: Implement actual sharing logic for each platform
    console.log(`Sharing on ${platform}`);
  };

  const onPressPost = () => {
    navigation.navigate('PostScreen', {
      id,
      username: author.username,
      text,
      image,
      profilePic: author.profilePicture,
      reactions,
      timeAgo
    });
  };

  const postUser: PostUser = {
    id: author.id,
    username: author.username,
    profilePic: author.profilePicture
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPressPost}>
      <PostHeader 
        user={postUser}
        timeAgo={currentTimeAgo}
        onOptionsPress={onOptionsPress}
        onUserPress={handleUserPress}
      />
      
      <PostContent text={text} image={image} />
      
      <PostActions
        reactions={reactions}
        commentsCount={commentsCount}
        onLike={handleLike}
        onComment={onPressComment}
        onShare={handleShare}
        isLiked={isLiked}
      />

      <SharePopup
        visible={sharePopupVisible}
        onClose={() => setSharePopupVisible(false)}
        onShare={handleSharePlatform}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  timeAgo: {
    fontSize: 12,
    color: "#999",
    marginTop: 2
  },
  fullDate: {
    fontSize: 10,
    color: "#999",
    marginTop: 1
  },
  content: {
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionIcon: {
    width: 20,
    height: 20,
    tintColor: '#666',
    marginRight: 6,
  },
  likedIcon: {
    tintColor: '#e91e63',
  },
  actionText: {
    fontSize: 14,
    color: '#666',
  },
  likedText: {
    color: '#e91e63',
  },
});

export default Post;
