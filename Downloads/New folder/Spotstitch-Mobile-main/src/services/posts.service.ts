import * as SecureStore from "expo-secure-store";
import { createContext, useContext } from 'react';
import ApiClient from "./ApiClient";

// Types
export interface User {
  id: string;
  username: string;
  profilePicture?: string;
}

export interface Post {
  id: string;
  content: string;
  media?: { type: 'image' | 'video'; url: string }[];
  author: User;
  category: string;
  reactions: string[];
  comments: { id: string; content: string; author: User }[];
  createdAt: string;
  updatedAt?: string;
}

export interface PostsResponse {
  posts: Post[];
  hasMore: boolean;
  nextCursor?: string;
  total?: number;
}

// Context Type
export interface PostsContextType {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

// Create Context
export const PostsContext = createContext<PostsContextType>({
  posts: [],
  setPosts: () => {},
});

// Custom Hook
export const usePosts = () => {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
};

// API Service
class PostsService {
  static async getPosts(options?: { 
    category?: string;
    authorId?: string;
    following?: boolean;
    trending?: boolean;
    cursor?: string;
    limit?: number;
  }): Promise<PostsResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (options?.category) queryParams.append('category', options.category);
      if (options?.authorId) queryParams.append('authorId', options.authorId);
      if (options?.following) queryParams.append('following', 'true');
      if (options?.trending) queryParams.append('trending', 'true');
      if (options?.cursor) queryParams.append('cursor', options.cursor);
      if (options?.limit) queryParams.append('limit', options.limit.toString());

      const response = await ApiClient.get(`/v1/posts?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      return { posts: [], hasMore: false };
    }
  }

  static async getPost(postId: string): Promise<Post> {
    try {
      const response = await ApiClient.get(`/v1/posts/${postId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  }

  static async getUserPosts(username: string): Promise<PostsResponse> {
    try {
      const response = await ApiClient.get(`/v1/users/${username}/posts`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user posts:', error);
      return { posts: [], hasMore: false };
    }
  }

  static async createPost(post: { 
    content: string;
    category: string;
    media?: { type: 'image' | 'video'; url: string }[];
    taggedUserIds?: string[];
  }): Promise<Post> {
    try {
      const token = await this.getAuthToken();
      const { data } = await ApiClient.post<Post>("/v1/posts", post, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to create post");
    }
  }

  static async updatePost(postId: string, updates: {
    content?: string;
    category?: string;
    media?: { type: 'image' | 'video'; url: string }[];
    taggedUserIds?: string[];
  }): Promise<Post> {
    try {
      const token = await this.getAuthToken();
      const { data } = await ApiClient.put<Post>(`/v1/posts/${postId}`, updates, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    } catch (error: any) {
      if (error.response?.status === 404) throw new Error("Post not found");
      throw new Error(error.response?.data?.message || "Failed to update post");
    }
  }

  static async deletePost(postId: string): Promise<void> {
    try {
      const token = await this.getAuthToken();
      await ApiClient.delete(`/v1/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error: any) {
      if (error.response?.status === 404) throw new Error("Post not found");
      throw new Error(error.response?.data?.message || "Failed to delete post");
    }
  }

  static async likePost(postId: string): Promise<void> {
    try {
      const token = await this.getAuthToken();
      await ApiClient.post(`/v1/posts/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error: any) {
      if (error.response?.status === 404) throw new Error("Post not found");
      throw new Error(error.response?.data?.message || "Failed to like post");
    }
  }

  static async unlikePost(postId: string): Promise<void> {
    try {
      const token = await this.getAuthToken();
      await ApiClient.delete(`/v1/posts/${postId}/unlike`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error: any) {
      if (error.response?.status === 404) throw new Error("Post not found");
      throw new Error(error.response?.data?.message || "Failed to unlike post");
    }
  }

  static async addComment(postId: string, content: string): Promise<void> {
    try {
      const token = await this.getAuthToken();
      await ApiClient.post(`/v1/posts/${postId}/comments`, { content }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error: any) {
      if (error.response?.status === 404) throw new Error("Post not found");
      throw new Error(error.response?.data?.message || "Failed to add comment");
    }
  }

  static async sharePost(postId: string, content?: string): Promise<Post> {
    try {
      const token = await this.getAuthToken();
      const { data } = await ApiClient.post<Post>(`/v1/posts/${postId}/share`, { content }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    } catch (error: any) {
      if (error.response?.status === 404) throw new Error("Post not found");
      throw new Error(error.response?.data?.message || "Failed to share post");
    }
  }

  private static async getAuthToken() {
    const token = await SecureStore.getItemAsync("accessToken");
    if (!token) throw new Error("Not authenticated");
    return token;
  }
}

export default PostsService; 