import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, 
  ActivityIndicator, RefreshControl, Image } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import ApiClient from "../services/ApiClient";
import { Post } from "../services/posts.service";
import { useTimeAgo } from "../utils/timeUtils";

// Types
type RootStackParamList = {
  TrendingScreen: undefined;
  PostScreen: {
    id: string;
    username: string;
    text: string;
    image?: string;
    profilePic?: string;
    reactions: string[];
    timeAgo: string;
  };
  LoginScreen: undefined;
};

// Components
const BackButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity style={styles.backButton} onPress={onPress}>
    <Ionicons name="arrow-back" size={24} color="#333" />
  </TouchableOpacity>
);

const LoadingSpinner = () => (
  <View style={styles.centerContainer}>
    <ActivityIndicator size="large" color="#4CAF50" />
  </View>
);

const ErrorDisplay = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <View style={styles.centerContainer}>
    <Text style={styles.errorText}>{message}</Text>
    <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
      <Text style={styles.retryButtonText}>Try Again</Text>
    </TouchableOpacity>
  </View>
);

const EmptyState = () => (
  <View style={styles.centerContainer}>
    <Text style={styles.emptyText}>No trending posts available</Text>
  </View>
);

const PostItem = ({ post, onPress }: { post: Post; onPress: () => void }) => {
  const dynamicTimeAgo = useTimeAgo(post.createdAt);
  
  return (
    <TouchableOpacity
      style={styles.postContainer}
      onPress={onPress}
    >
      <View style={styles.postHeader}>
        <Text style={styles.username}>{post.author.username}</Text>
        <Text style={styles.timeAgo}>{dynamicTimeAgo}</Text>
      </View>
      <Text style={styles.content} numberOfLines={2}>
        {post.content}
      </Text>
      {post.media?.[0]?.url && (
        <Image
          source={{ uri: post.media[0].url }}
          style={styles.postImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.postFooter}>
        <Text style={styles.reactions}>{post.reactions.length} reactions</Text>
        <Text style={styles.comments}>
          {post.comments?.length || 0} comments
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// API Functions
const fetchTrendingPosts = async (): Promise<Post[]> => {
  const token = await SecureStore.getItemAsync("accessToken");
  if (!token) throw new Error("Not authenticated");

  const { data } = await ApiClient.get("/v1/posts/trending", {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!data || !data.posts) {
    throw new Error("No posts found");
  }

  return data.posts;
};

// Main Component
const TrendingScreen = ({
  navigation
}: {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadPosts = async (refresh = false) => {
    try {
      if (!refresh) setIsLoading(true);
      setError(null);

      const fetchedPosts = await fetchTrendingPosts();
      setPosts(fetchedPosts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch trending posts";
      console.error("Error fetching trending posts:", errorMessage);

      if (errorMessage === "Not authenticated") {
        navigation.navigate("LoginScreen");
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
      if (refresh) setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadPosts(true);
  };

  const handlePostPress = (post: Post) => {
    navigation.navigate("PostScreen", {
      id: post.id,
      username: post.author.username,
      text: post.content,
      image: post.media?.[0]?.url,
      profilePic: post.author.profilePicture,
      reactions: post.reactions,
      timeAgo: post.createdAt
    });
  };

  useEffect(() => {
    loadPosts();
  }, []);

  if (isLoading && !isRefreshing) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error} onRetry={loadPosts} />;
  }

  if (!posts.length) {
    return <EmptyState />;
  }

  return (
    <View style={styles.mainContainer}>
      <BackButton onPress={() => navigation.goBack()} />
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {posts.map((post) => (
          <PostItem
            key={post.id}
            post={post}
            onPress={() => handlePostPress(post)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff"
  },
  backButton: {
    padding: 16,
    backgroundColor: "transparent"
  },
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  errorText: {
    fontSize: 16,
    color: "#e91e63",
    textAlign: "center",
    marginBottom: 16
  },
  retryButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600"
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center"
  },
  postContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0"
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8
  },
  content: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 8
  },
  postFooter: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  reactions: {
    fontSize: 12,
    color: "#666"
  },
  comments: {
    fontSize: 12,
    color: "#666"
  },
  timeAgo: {
    fontSize: 12,
    color: "#999"
  }
});

export default TrendingScreen;
