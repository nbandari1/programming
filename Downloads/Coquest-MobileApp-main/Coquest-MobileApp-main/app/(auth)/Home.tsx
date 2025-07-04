import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalContext } from '../../context/GlobalProvider';
import { useDispatch } from 'react-redux';
import { clearUser } from '../../redux/slice/user/userSlice';
import { router } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

const overviewItems = [
  { label: 'Projects', icon: <MaterialIcons name="assignment-turned-in" size={24} color="#161622" />, route: '/(Projects)/Sample' },
  { label: 'Programs', icon: <MaterialCommunityIcons name="book-open-variant" size={24} color="#161622" />, route: '/(Programs)/Sample' },
  { label: 'Coops', icon: <FontAwesome5 name="hard-hat" size={22} color="#161622" />, route: '/(Coops)/Sample' },
  { label: 'Communities', icon: <MaterialIcons name="groups" size={24} color="#161622" />, route: '#' },
];

const posts = [
  { title: 'Welcome to Coquest!', image: null },
  { title: 'First Project Launched', image: null },
  { title: 'Join a Community', image: null },
];

const Home: React.FC = () => {
  const { setIsLogged, setUser, user } = useGlobalContext();
  const dispatch = useDispatch();
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  const handleLogout = async (): Promise<void> => {
    await AsyncStorage.removeItem('token');
    setUser(null);
    setIsLogged(false);
    dispatch(clearUser());
    router.replace('/signin');
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f5f6fa' }} contentContainerStyle={{ padding: 16 }}>
      {/* Welcome and Overview */}
      <View style={styles.headerBox}>
        <Text style={styles.welcomeText}>{`Welcome, ${firstName}!`}</Text>
        <Text style={styles.overviewTitle}>Overview</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="#888" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Nearby"
          placeholderTextColor="#aaa"
        />
      </View>

      {/* Overview Quick Links */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Quick Links</Text>
        <View style={styles.quickLinksRow}>
          {overviewItems.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.quickLink}
              onPress={() => item.route !== '#' && router.push(item.route)}
            >
              {item.icon}
              <Text style={styles.quickLinkLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Posts Preview */}
      <View style={styles.card}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Posts</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.postsRow}>
          {posts.map((post, idx) => (
            <View key={idx} style={styles.postCard}>
              {post.image ? (
                <Image source={{ uri: post.image }} style={styles.postImage} />
              ) : (
                <View style={styles.postImagePlaceholder} />
              )}
              <Text style={styles.postTitle} numberOfLines={2}>{post.title}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* My Tasks */}
      <View style={styles.card}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>My Tasks</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.emptyText}>You have no tasks yet.</Text>
      </View>

      {/* Map Placeholder */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Map</Text>
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map" size={48} color="#bbb" />
          <Text style={{ color: '#bbb', marginTop: 8 }}>Map coming soon</Text>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerBox: {
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 2,
    fontWeight: '500',
  },
  overviewTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#161622',
    marginBottom: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 18,
    height: 44,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#222',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#161622',
    marginBottom: 10,
  },
  quickLinksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  quickLink: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 8,
  },
  quickLinkLabel: {
    marginTop: 6,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  seeAll: {
    color: '#007bff',
    fontSize: 15,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  postsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  postCard: {
    width: 90,
    height: 90,
    backgroundColor: '#f5f6fa',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    padding: 6,
  },
  postImage: {
    width: 70,
    height: 40,
    borderRadius: 6,
    marginBottom: 4,
  },
  postImagePlaceholder: {
    width: 70,
    height: 40,
    borderRadius: 6,
    backgroundColor: '#e0e0e0',
    marginBottom: 4,
  },
  postTitle: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  emptyText: {
    color: '#888',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 10,
  },
  mapPlaceholder: {
    height: 120,
    backgroundColor: '#f5f6fa',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default Home;
