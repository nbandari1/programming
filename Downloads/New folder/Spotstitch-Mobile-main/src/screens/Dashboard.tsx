import React, { useState, useEffect, useContext } from "react";
import { View, ScrollView, StyleSheet, Image, TouchableOpacity, SafeAreaView, Text,
  ActivityIndicator, GestureResponderEvent, Alert, RefreshControl } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { BottomNavigation, FAB, Menu, Portal } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import Post from "../components/Post";
import ImageGrid from "../components/ImageGrid";
import Categories from "../components/Categories";
import { Post as PostType, PostsContext, PostsContextType } from "../services/posts.service";
import { getTimeAgo } from '../utils/timeUtils';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import PostsService from '../services/posts.service';
import Event from "../components/Event";

const Tab = createMaterialTopTabNavigator();

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

// Separate component for error display
const ErrorDisplay = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <View style={styles.centerContainer}>
    <Text style={styles.errorText}>{message}</Text>
    <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
      <Text style={styles.retryButtonText}>Try Again</Text>
    </TouchableOpacity>
  </View>
);

// Separate component for loading display
const LoadingDisplay = () => (
  <View style={styles.centerContainer}>
    <ActivityIndicator size="large" />
  </View>
);

// Separate component for empty state
const EmptyState = () => (
  <View style={styles.emptyState}>
    <Text style={styles.emptyStateText}>No posts yet. Be the first to post!</Text>
  </View>
);

// Posts list component
const PostsList = ({ 
  posts,
  isLoading,
  isRefreshing,
  onRefresh,
  onLoadMore 
}: {
  posts: PostType[];
  isLoading: boolean;
  isRefreshing: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
}) => (
  <ScrollView 
    style={styles.scrollView}
    contentContainerStyle={styles.scrollViewContent}
    showsVerticalScrollIndicator={false}
    refreshControl={
      <RefreshControl
        refreshing={isRefreshing}
        onRefresh={onRefresh}
      />
    }
    onScroll={({ nativeEvent }) => {
      const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
      const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
      if (isCloseToBottom) onLoadMore();
    }}
    scrollEventThrottle={400}
  >
    <ImageGrid />
    {posts.map((post) => (
      <Post
        key={post.id}
        id={post.id}
        author={post.author}
        text={post.content}
        image={post.media?.[0]?.url}
        timeAgo={getTimeAgo(post.createdAt)}
        commentsCount={post.comments?.length || 0}
        reactions={post.reactions}
      />
    ))}
    {isLoading && posts.length > 0 && (
      <View style={styles.loadingMore}>
        <ActivityIndicator size="small" />
      </View>
    )}
    {!isLoading && posts.length === 0 && <EmptyState />}
  </ScrollView>
);

const MyPostsScreen = () => {
  const { posts, setPosts } = useContext<PostsContextType>(PostsContext);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Fetch posts with simplified error handling
  const fetchPosts = async (options?: { refresh?: boolean }) => {
    try {
      setIsLoading(!options?.refresh);
      if (options?.refresh) setIsRefreshing(true);
      setError(null);

      const filters = selectedCategory !== "All" ? { category: selectedCategory } : undefined;
      const response = await PostsService.getPosts(filters);
      
      setPosts(response.posts || []);
      setHasMore(response.hasMore);
      setNextCursor(response.nextCursor);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError("Failed to load posts. Please try again.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const loadMorePosts = async () => {
    if (!hasMore || isLoading) return;

    try {
      setIsLoading(true);
      const filters = {
        category: selectedCategory !== "All" ? selectedCategory : undefined,
        cursor: nextCursor,
      };
      
      const response = await PostsService.getPosts(filters);
      setPosts(prev => [...prev, ...(response.posts || [])]);
      setHasMore(response.hasMore);
      setNextCursor(response.nextCursor);
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial posts load
  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  const handleLike = async (postId: string) => {
    try {
      const post = posts.find((p: PostType) => p.id === postId);
      const hasLiked = post?.reactions.includes('1'); // TODO: Replace with actual user ID
      
      if (hasLiked) {
        await PostsService.unlikePost(postId);
      } else {
        await PostsService.likePost(postId);
      }
      
      await fetchPosts();
    } catch (error) {
      console.error("Error liking/unliking post:", error);
      Alert.alert("Error", "Failed to update like");
    }
  };

  const handleDelete = async () => {
    setMenuVisible(false);
    
    if (!selectedPostId) return;

    try {
      await PostsService.deletePost(selectedPostId);
      await fetchPosts();
      setSelectedPostId(null);
    } catch (error) {
      console.error("Error deleting post:", error);
      Alert.alert("Error", "Failed to delete post");
    }
  };

  const handleOptionsPress = (postId: string, event: GestureResponderEvent) => {
    const { pageX, pageY } = event.nativeEvent;
    setSelectedPostId(postId);
    setMenuPosition({ x: pageX, y: pageY });
    setMenuVisible(true);
  };

  const onSelectCategory = (category: string) => {
    setSelectedCategory(category);
  };

  // Error state
  if (error) {
    return <ErrorDisplay message={error} onRetry={() => fetchPosts()} />;
  }

  // Loading state (initial load)
  if (isLoading && posts.length === 0) {
    return <LoadingDisplay />;
  }

  return (
    <View style={styles.screenContainer}>
      <Categories
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
      />
      <PostsList
        posts={posts}
        isLoading={isLoading}
        isRefreshing={isRefreshing}
        onRefresh={() => fetchPosts({ refresh: true })}
        onLoadMore={loadMorePosts}
      />
      <Portal>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={menuPosition}
        >
          <Menu.Item 
            onPress={() => {
              setMenuVisible(false);
              // TODO: Implement edit functionality
              console.log("Edit post", selectedPostId);
            }} 
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
      </Portal>
    </View>
  );
};

const EventScreen = () => {
  const [events] = useState([
    {
      id: 2,
      name: "Event 1",
      time: "2:00 PM",
      area: "Location 1",
      image: "https://www.example.com/image1.jpg",
      description:
        "This is the description of Event1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce rutrum dolor in orci convallis, eu aliquet dui congue"
    },
    {
      id: 4,
      name: "Event 2",
      time: "3:00 PM",
      area: "Location 2",
      image: "https://www.example.com/image2.jpg",
      description:
        "This is the description of Event2. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce rutrum dolor in orci convallis, eu aliquet dui congue"
    }
  ]);

  return (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        {events.map((event) => (
          <Event
            key={event.id}
            name={event.name}
            time={event.time}
            area={event.area}
            imageUrl={event.image}
            description={event.description}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const DashboardContent = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarStyle: styles.tabBar,
      tabBarLabelStyle: styles.tabLabel,
      tabBarIndicatorStyle: styles.tabIndicator,
    }}
  >
    <Tab.Screen name="Personal" component={MyPostsScreen} />
    <Tab.Screen name="Events" component={EventScreen} />
  </Tab.Navigator>
);

const Dashboard = () => {
  interface RouteType {
    key: string;
    title: string;
    iconFilled: keyof typeof Ionicons.glyphMap;
    iconOutline: keyof typeof Ionicons.glyphMap;
  }

  const [index, setIndex] = useState(0);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { posts, setPosts } = useContext<PostsContextType>(PostsContext);
  const [routes] = useState<RouteType[]>([
    { key: 'home', title: 'Home', iconFilled: 'home', iconOutline: 'home-outline' },
    { key: 'games', title: 'Games', iconFilled: 'game-controller', iconOutline: 'game-controller-outline' },
    { key: 'map', title: 'Map', iconFilled: 'map', iconOutline: 'map-outline' },
    { key: 'cart', title: 'Cart', iconFilled: 'cart', iconOutline: 'cart-outline' },
    { key: 'search', title: 'Search', iconFilled: 'search', iconOutline: 'search-outline' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: DashboardContent,
    games: () => <View />,
    map: () => <View />,
    cart: () => <View />,
    search: () => <View />,
  });

  return (
    <PostsContext.Provider value={{ posts, setPosts }}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.menuButton} />
          <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
            <Image
              source={require('../../assets/SpotStitch_Logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="menu" size={28} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <BottomNavigation
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={renderScene}
            renderIcon={({ route, focused, color }) => {
              const routeTyped = route as RouteType;
              return (
                <Ionicons
                  name={focused ? routeTyped.iconFilled : routeTyped.iconOutline}
                  size={24}
                  color={color}
                />
              );
            }}
          />
        </View>

        {/* Add FAB */}
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => navigation.navigate('CreatePostScreen')}
          color="#fff"
        />
      </SafeAreaView>
    </PostsContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  screenContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  logo: {
    width: 225,
    height: 60,
  },
  menuButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
  },
  tabBar: {
    backgroundColor: '#fff',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tabLabel: {
    textTransform: 'none',
    fontSize: 14,
    fontWeight: '600',
  },
  tabIndicator: {
    backgroundColor: '#4a4',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#e91e63',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    backgroundColor: '#4CAF50',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshIndicator: {
    marginLeft: 10,
  },
  deleteText: {
    color: '#e91e63'  // Red color for delete option
  },
  loadingMore: {
    padding: 10,
    alignItems: 'center'
  }
});

export default Dashboard;
