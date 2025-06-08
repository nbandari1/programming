//handles the image grid on the dashboard

import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Post, PostsContext, PostsContextType } from '../services/posts.service';
import PostsService from "../services/posts.service";

type RootStackParamList = {
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

const chunkArray = <T,>(array: T[], chunkSize: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
};

const ImageGrid = () => {
  const [showAll, setShowAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { posts, setPosts } = useContext<PostsContextType>(PostsContext);
  const trendingPosts = posts.filter(post => post.media && post.media.length > 0);

  useEffect(() => {
    fetchTrendingPosts();
  }, []);

  const fetchTrendingPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await PostsService.getPosts({ trending: true });
      
      if (!response.posts) {
        throw new Error('No posts found');
      }

      setPosts(prevPosts => {
        // Merge new trending posts with existing posts, avoiding duplicates
        const existingIds = new Set(prevPosts.map(p => p.id));
        const newPosts = response.posts.filter((p: any) => !existingIds.has(p.id));
        return [...prevPosts, ...newPosts];
      });
    } catch (err) {
      console.error('Error fetching trending posts:', err);
      setError('Failed to fetch trending posts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeeMore = () => {
    setShowAll(!showAll);
  };

  const renderItem = ({ item }: { item: Post[] }) => (
    <View style={styles.row}>
      {item.map((post) => (
        <TouchableOpacity
          key={post.id}
          style={styles.imageContainer}
          onPress={() => navigation.navigate('PostScreen', {
            id: post.id,
            username: post.author.username,
            text: post.content,
            image: post.media?.[0]?.url,
            reactions: post.reactions,
            timeAgo: post.createdAt
          })}
        >
          {post.media?.[0]?.url ? (
            <Image
              source={{ uri: post.media[0].url }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>No Image</Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
      {/* Fill empty spaces with placeholder containers to maintain grid layout */}
      {item.length < 3 && Array(3 - item.length).fill(0).map((_, index) => (
        <View key={`empty-${index}`} style={[styles.imageContainer, styles.emptyContainer]} />
      ))}
    </View>
  );

  if (isLoading && trendingPosts.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#666" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchTrendingPosts}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!trendingPosts.length) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.noPostsText}>No trending posts available</Text>
      </View>
    );
  }

  const displayPosts = showAll ? trendingPosts : trendingPosts.slice(0, 6);
  const chunkedPosts = chunkArray(displayPosts, 3);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Trending</Text>
        {trendingPosts.length > 6 && (
          <TouchableOpacity onPress={handleSeeMore}>
            <Text style={styles.seeMoreText}>
              {showAll ? 'See Less' : 'See More'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {chunkedPosts.map((chunk, index) => renderItem({ item: chunk }))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20
  },
  centerContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 10
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  seeMoreText: {
    color: '#666',
    fontSize: 14
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 10
  },
  imageContainer: {
    width: '32%',
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0'
  },
  emptyContainer: {
    backgroundColor: 'transparent'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  placeholderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  placeholderText: {
    color: '#666',
    fontSize: 12
  },
  errorText: {
    color: '#e91e63',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center'
  },
  retryButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8
  },
  retryText: {
    color: '#666',
    fontSize: 14
  },
  noPostsText: {
    color: '#666',
    fontSize: 14
  }
});

export default ImageGrid;
