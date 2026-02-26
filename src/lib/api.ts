import axios, { type AxiosInstance } from "axios";
import { storage } from "./storage";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const TOKEN_STORAGE_KEY = "sales.auth.token";

export const getAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add request interceptor to attach token
  instance.interceptors.request.use(
    (config) => {
      const token = storage.get(TOKEN_STORAGE_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Add response interceptor for error handling
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expired or invalid
        storage.remove(TOKEN_STORAGE_KEY);
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );

  return instance;
};
