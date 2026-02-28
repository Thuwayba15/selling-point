"use client";

import { createContext } from "react";

export const AUTH_STORAGE_KEY = "auth.user";

export type UserRole = "Admin" | "SalesManager" | "BusinessDevelopmentManager" | "SalesRep";

export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: UserRole[];
  tenantId: string;
  expiresAt?: string;
};

export type AuthState = {
  isBootstrapped: boolean;
  isAuthenticated: boolean;
  user: AuthUser | null;
  errorMessage: string | null;
};

export const INITIAL_STATE: AuthState = {
  isBootstrapped: false,
  isAuthenticated: false,
  user: null,
  errorMessage: null,
};

export type RegisterPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  tenantName?: string;
  inviteToken?: string;
  tenantId?: string;
  role?: UserRole;
};

export type AuthActions = {
  login: (email: string, password: string) => Promise<boolean>;
  register: (payload: RegisterPayload) => Promise<boolean>;
  logout: () => void;
};

export const AuthStateContext = createContext<AuthState | null>(null);
export const AuthActionsContext = createContext<AuthActions | null>(null);
