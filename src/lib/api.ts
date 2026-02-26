import axios, { type AxiosInstance } from "axios";
import { storage } from "./storage";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const TOKEN_STORAGE_KEY = "sales.auth.token";

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

export { TOKEN_STORAGE_KEY };
import type { OpportunitiesQuery, Opportunity, PagedResponse } from "../domains/opportunities/types";
import { opportunitiesEndpoints } from "../domains/opportunities/endpoints";

import { getAxiosInstance } from "../lib/axios";

const api = getAxiosInstance();

const toApiPageNumber = (uiPage: number) => Math.max(0, uiPage - 1);

export const getOpportunities = async (q: OpportunitiesQuery) => {
  const { data } = await api.get<PagedResponse<Opportunity>>(opportunitiesEndpoints.list, {
    params: {
      searchTerm: q.searchTerm || undefined,
      stage: q.stage ?? undefined,
      pageNumber: toApiPageNumber(q.page),
      pageSize: q.pageSize,
    },
  });

  return data;
};

export const getMyOpportunities = async (q: OpportunitiesQuery) => {
  const { data } = await api.get<PagedResponse<Opportunity>>(opportunitiesEndpoints.myOpportunities, {
    params: {
      stage: q.stage ?? undefined,
      pageNumber: toApiPageNumber(q.page),
      pageSize: q.pageSize,
    },
  });

  return data;
};
