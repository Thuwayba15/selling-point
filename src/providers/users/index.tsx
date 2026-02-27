"use client";

import { useContext, useReducer } from "react";
import { getAxiosInstance } from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";
import { INITIAL_STATE, IUser, UsersActionContext, UsersStateContext } from "./context";
import { UsersReducer } from "./reducer";
import {
  getUsersPending,
  getUsersSuccess,
  getUsersError,
  getUserPending,
  getUserSuccess,
  getUserError,
  clearError as clearErrorAction,
  clearUser as clearUserAction,
} from "./actions";

export const UsersProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(UsersReducer, INITIAL_STATE);
  const api = getAxiosInstance();

  // ============================================================================
  // Get Users (with filters)
  // GET /api/users
  // ============================================================================
  const getUsers = async (params?: {
    role?: string;
    searchTerm?: string;
    isActive?: boolean;
    pageNumber?: number;
    pageSize?: number;
  }) => {
    dispatch(getUsersPending());
    try {
      const response = await api.get("/api/users", { params });
      const data = response.data;
      dispatch(
        getUsersSuccess({
          users: data.items || data,
          pagination: {
            currentPage: data.currentPage ?? data.pageNumber ?? params?.pageNumber ?? 1,
            pageSize: data.pageSize ?? params?.pageSize ?? 10,
            totalCount: data.totalCount ?? 0,
            totalPages: data.totalPages ?? 0,
          },
        }),
      );
    } catch (error: unknown) {
      console.error("Error fetching users:", error);
      dispatch(getUsersError(getErrorMessage(error, "Failed to fetch users")));
    }
  };

  // ============================================================================
  // Get Single User
  // GET /api/users/{id}
  // ============================================================================
  const getUser = async (id: string) => {
    dispatch(getUserPending());
    try {
      const response = await api.get(`/api/users/${id}`);
      dispatch(getUserSuccess(response.data));
    } catch (error: unknown) {
      console.error("Error fetching user:", error);
      dispatch(getUserError(getErrorMessage(error, "Failed to fetch user")));
    }
  };

  // ============================================================================
  // Utility Actions
  // ============================================================================
  const clearError = () => {
    dispatch(clearErrorAction());
  };

  const clearUser = () => {
    dispatch(clearUserAction());
  };

  return (
    <UsersStateContext.Provider value={state}>
      <UsersActionContext.Provider
        value={{
          getUsers,
          getUser,
          clearError,
          clearUser,
        }}
      >
        {children}
      </UsersActionContext.Provider>
    </UsersStateContext.Provider>
  );
};

// ============================================================================
// Custom Hooks
// ============================================================================
export const useUsersState = () => {
  const context = useContext(UsersStateContext);
  if (!context) {
    throw new Error("useUsersState must be used within a UsersProvider");
  }
  return context;
};

export const useUsersActions = () => {
  const context = useContext(UsersActionContext);
  if (!context) {
    throw new Error("useUsersActions must be used within a UsersProvider");
  }
  return context;
};
