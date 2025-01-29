import axios from "axios";
import { Feed, FeedResponse, FiltersResponse } from "./types/feeds";
import { AdminArticle } from "./types/adminArticles";
import { User } from "./types/users";
import { Article } from "./types/article";

// Base URL for the backend API
const BASE_URL = import.meta.env.VITE_BASE_URL;

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10-second timeout
});

// Add a request interceptor to include the token in the headers
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Feeds API
export const fetchFeeds = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string[];
  sourceUrl?: string;
  pubDate?: string;
  sort?: string;
  order?: "asc" | "desc";
}): Promise<FeedResponse> => {
  try {
    const response = await instance.get<FeedResponse>("/feeds", { params });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to fetch feeds.");
  }
};

export const fetchFeedById = async (id: string): Promise<Feed> => {
  try {
    const response = await instance.get<Feed>(`/feeds/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to fetch feed.");
  }
};

export const fetchFilters = async (): Promise<FiltersResponse> => {
  try {
    const response = await instance.get<FiltersResponse>("/filters");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to fetch filters.");
  }
};

// Articles API
export const fetchArticles = async (): Promise<AdminArticle[]> => {
  try {
    const response = await instance.get<AdminArticle[]>("/articles");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch articles."
    );
  }
};

export const getPublishedAdminArticleById = async (
  id: string
): Promise<AdminArticle> => {
  try {
    const response = await instance.get<AdminArticle>(
      `/articles/published/${id}`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch published admin article."
    );
  }
};

export const fetchArticleById = async (id: string): Promise<AdminArticle> => {
  try {
    const response = await instance.get<AdminArticle>(`/articles/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch article."
    );
  }
};

export const createArticle = async (
  article: Omit<Article, "_id" | "userId" | "createdAt" | "updatedAt">
): Promise<Article> => {
  try {
    const response = await instance.post<Article>("/articles", article);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to create article."
    );
  }
};

export const updateArticle = async (
  id: string,
  article: Partial<Article>
): Promise<Article> => {
  try {
    const response = await instance.put<Article>(`/articles/${id}`, article);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to update article."
    );
  }
};

export const deleteArticle = async (id: string): Promise<void> => {
  try {
    await instance.delete(`/articles/${id}`);
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to delete article."
    );
  }
};

// Admin Articles API
export const fetchAdminArticles = async (): Promise<AdminArticle[]> => {
  try {
    const response = await instance.get<AdminArticle[]>("/admin-articles");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch admin articles."
    );
  }
};

export const fetchAdminArticleById = async (
  id: string
): Promise<AdminArticle> => {
  try {
    const response = await instance.get<AdminArticle>(`/admin-articles/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch admin article."
    );
  }
};

export const createAdminArticle = async (
  article: Omit<AdminArticle, "_id" | "userId" | "createdAt" | "updatedAt">
): Promise<AdminArticle> => {
  try {
    const response = await instance.post<AdminArticle>(
      "/admin-articles",
      article
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to create admin article."
    );
  }
};

export const updateAdminArticle = async (
  id: string,
  article: Partial<AdminArticle>
): Promise<AdminArticle> => {
  try {
    const response = await instance.put<AdminArticle>(
      `/admin-articles/${id}`,
      article
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to update admin article."
    );
  }
};

export const deleteAdminArticle = async (id: string): Promise<void> => {
  try {
    await instance.delete(`/admin-articles/${id}`);
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to delete admin article."
    );
  }
};

// User API
export const registerUser = async (user: {
  username: string;
  email: string;
  password: string;
}): Promise<void> => {
  try {
    await instance.post("/users/register", user);
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to register user."
    );
  }
};

export const loginUser = async (credentials: {
  email: string;
  password: string;
}): Promise<{ token: string }> => {
  try {
    const response = await instance.post<{ token: string }>(
      "/users/login",
      credentials
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to login user.");
  }
};

export const fetchUserProfile = async (): Promise<User> => {
  try {
    const response = await instance.get<User>("/users/profile");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch user profile."
    );
  }
};

// Admin User API
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await instance.get<User[]>("/admin/users");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch users.");
  }
};

export const updateUserRole = async (
  userId: string,
  newRole: "admin" | "writer" | "viewer"
): Promise<void> => {
  try {
    await instance.post("/admin/update-role", { userId, newRole });
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to update user role."
    );
  }
};

// Admin User Articles API
export const fetchAllUserArticles = async (): Promise<Article[]> => {
  try {
    const response = await instance.get<Article[]>("/admin/user-articles");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch user articles."
    );
  }
};

export const fetchUserArticleById = async (id: string): Promise<Article> => {
  try {
    const response = await instance.get<Article>(`/admin/user-articles/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch user article."
    );
  }
};

export const fetchUserArticlesByUserId = async (
  userId: string
): Promise<Article[]> => {
  try {
    const response = await instance.get<Article[]>(`/articles/user/${userId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch user articles."
    );
  }
};

// fetchAdminArticlesByUserId
export const fetchAdminArticlesByUserId = async (
  userId: string
): Promise<AdminArticle[]> => {
  try {
    const response = await instance.get<AdminArticle[]>(
      `/admin-articles/user/${userId}`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch admin articles."
    );
  }
};
