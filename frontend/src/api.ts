import axios from "axios";
import { Feed, FeedResponse, FiltersResponse } from "./types/feeds";
import { AdminArticle } from "./types/adminArticles";
import { User } from "./types/users";
import { AiArticle } from "./types/aiArticles";
import { Article } from "./types/article";
import { ScheduledArticleData } from "./types/scheduledArticle";

// Base URL for the backend API
const BASE_URL = import.meta.env.VITE_BASE_URL;

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
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
  startDate?: string;
  endDate?: string;
  sort?: string;
  order?: "asc" | "desc";
  leagues?: string[];
}): Promise<FeedResponse> => {
  try {
    const response = await instance.get<FeedResponse>("/feeds", { params });
    console.log("hello");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch feeds.");
  }
};

export const fetchFeedById = async (id: string): Promise<Feed> => {
  try {
    const response = await instance.get<Feed>(`/feeds/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch feed.");
  }
};

export const editFeed = async (
  id: string,
  feedData: Partial<Feed>
): Promise<Feed> => {
  try {
    const response = await instance.put<Feed>(`/feeds/${id}`, feedData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update feed.");
  }
};

export const fetchFilters = async (): Promise<FiltersResponse> => {
  try {
    const response = await instance.get<FiltersResponse>("/filters");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch filters."
    );
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

// Chat API
export const handleChatRequest = async (data: {
  modelAuthor: string;
  selectedArticleIds: string[];
  userInstructions: string;
}): Promise<{ title: string; description: string }> => {
  try {
    console.log(data);
    const response = await instance.post<{
      title: string;
      description: string;
    }>("/chat", data);

    return response.data;
  } catch (error: any) {
    console.error("❌ API Error in handleChatRequest:", error.response);
    throw new Error(
      error.response?.data?.message || "Failed to handle chat request."
    );
  }
};

export const getAvailableModelAuthors = async (): Promise<{
  models: string[];
}> => {
  try {
    const response = await instance.get<{ models: string[] }>("/chat");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch available model authors."
    );
  }
};

// AI Articles Generator API
export const generateMultipleAiArticles = async (data: {
  modelAuthor: string;
  filters: {
    category?: string[];
    sourceUrl?: string;
    pubDate?: string;
    search?: string;
  };
  numberOfArticles: number;
  userInstructions: string;
}): Promise<{ generatedArticles: any[] }> => {
  try {
    const response = await instance.post<{ generatedArticles: any[] }>(
      "/ai-articles/generate-multiple",
      data
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ API Error in generateMultipleAiArticles:",
      error.response
    );
    throw new Error(
      error.response?.data?.message || "Failed to generate AI articles."
    );
  }
};

// AI Articles API
export const fetchAIGeneratedArticles = async (): Promise<AiArticle[]> => {
  try {
    const response = await instance.get<AiArticle[]>("/ai-generated-articles");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch AI-generated articles."
    );
  }
};

// fetchAIGeneratedArticleById

export const fetchAIGeneratedArticleById = async (
  id: string
): Promise<AiArticle> => {
  try {
    const response = await instance.get<AiArticle>(
      `/ai-generated-articles/${id}`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch AI-generated article."
    );
  }
};

// Fetch all scheduled articles
export const fetchScheduledArticles = async (): Promise<
  ScheduledArticleData[]
> => {
  try {
    const response = await instance.get<ScheduledArticleData[]>(
      "/scheduled-articles"
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch scheduled articles."
    );
  }
};

// Fetch a scheduled article by its ID
export const fetchScheduledArticleById = async (
  id: string
): Promise<ScheduledArticleData> => {
  try {
    const response = await instance.get<ScheduledArticleData>(
      `/scheduled-articles/${id}`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch scheduled article."
    );
  }
};

// Create a new scheduled article
export const createScheduledArticle = async (
  scheduledArticle: Omit<
    ScheduledArticleData,
    "_id" | "createdAt" | "updatedAt"
  >
): Promise<ScheduledArticleData> => {
  try {
    const response = await instance.post<ScheduledArticleData>(
      "/scheduled-articles",
      scheduledArticle
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to create scheduled article."
    );
  }
};

// Update an existing scheduled article
export const updateScheduledArticle = async (
  id: string,
  scheduledArticle: Partial<ScheduledArticleData>
): Promise<ScheduledArticleData> => {
  try {
    const response = await instance.put<ScheduledArticleData>(
      `/scheduled-articles/${id}`,
      scheduledArticle
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to update scheduled article."
    );
  }
};

// Delete a scheduled article
export const deleteScheduledArticle = async (id: string): Promise<void> => {
  try {
    await instance.delete(`/scheduled-articles/${id}`);
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to delete scheduled article."
    );
  }
};
