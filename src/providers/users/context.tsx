"use client";

import { createContext } from "react";

// Interface for a single user
export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  phoneNumber?: string;
  isActive: boolean;
  roles: string[];
  lastLoginAt?: string;
  createdAt?: string;
  tenantId?: string;
}

// Interface for pagination info
export interface IPaginationInfo {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

// Interface defining the state shape for our context
export interface IUsersStateContext {
  isPending: boolean;
  isLoadingDetails: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage?: string;

  // Data
  user?: IUser;
  users?: IUser[];
  pagination?: IPaginationInfo;
}

// Interface defining all the actions that can be performed
export interface IUsersActionContext {
  // List operations
  getUsers: (params?: {
    role?: string;
    searchTerm?: string;
    isActive?: boolean;
    pageNumber?: number;
    pageSize?: number;
  }) => Promise<void>;

  // Single user operations
  getUser: (id: string) => Promise<void>;

  // State management
  clearError: () => void;
  clearUser: () => void;
}

// Initial state
export const INITIAL_STATE: IUsersStateContext = {
  isPending: false,
  isLoadingDetails: false,
  isSuccess: false,
  isError: false,
};

// Create contexts
export const UsersStateContext = createContext<IUsersStateContext>(INITIAL_STATE);

export const UsersActionContext = createContext<IUsersActionContext | undefined>(undefined);
