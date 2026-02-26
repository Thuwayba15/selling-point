"use client";

import type { ReactNode } from "react";
import { useContext, useEffect, useMemo, useReducer } from "react";
import { useRouter } from "next/navigation";

import { storage } from "@/lib/storage";
import { getAxiosInstance, TOKEN_STORAGE_KEY } from "@/lib/api";
import { ROUTES } from "@/lib/routes";

import {
  AUTH_STORAGE_KEY,
  AuthActionsContext,
  AuthStateContext,
  INITIAL_STATE,
  type AuthUser,
  type AuthActions,
  type RegisterPayload,
} from "./context";

import { authReducer } from "./reducer";
import { bootstrapSuccess, loginSuccess, logoutAction, setError, clearError } from "./actions";
import { decodeToken, safeParseJson } from "../../utils/auth/utils";

const LEGACY_AUTH_STORAGE_KEY = "sales.auth.user";

type LoginResponse = {
  token: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  tenantId: string;
  expiresAt?: string;
};

const toAuthUserFromLoginResponse = (data: LoginResponse): AuthUser => ({
  id: data.userId,
  email: data.email,
  firstName: data.firstName,
  lastName: data.lastName,
  roles: (data.roles ?? []) as AuthUser["roles"],
  tenantId: data.tenantId,
  expiresAt: data.expiresAt,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [state, dispatch] = useReducer(authReducer, INITIAL_STATE);

  useEffect(() => {
    const raw = storage.get(AUTH_STORAGE_KEY);
    const user = safeParseJson<AuthUser>(raw);

    if (raw && !user) storage.remove(AUTH_STORAGE_KEY);

    dispatch(bootstrapSuccess(user));
  }, []);

  const actions = useMemo<AuthActions>(() => {
    const login = async (email: string, password: string) => {
      dispatch(clearError());

      try {
        const api = getAxiosInstance();
        const { data } = await api.post<LoginResponse>("/api/auth/login", {
          email,
          password,
        });

        const token = data?.token;
        if (!token) throw new Error("Login response missing token");

        const userFromResponse =
          data?.userId && data?.email && data?.tenantId ? toAuthUserFromLoginResponse(data) : null;

        // Fallback: decode JWT (only if needed)
        const user = userFromResponse ?? decodeToken(token);

        if (!user || !user.id || !user.email) {
          throw new Error("Login response missing user fields");
        }

        storage.set(TOKEN_STORAGE_KEY, token);
        storage.set(AUTH_STORAGE_KEY, JSON.stringify(user));

        dispatch(loginSuccess(user));
        return true;
      } catch (error: any) {
        const message =
          error?.response?.data?.message ??
          error?.message ??
          "Login failed. Please check your credentials.";

        dispatch(setError(message));
        return false;
      }
    };

    const register = async (payload: RegisterPayload) => {
      dispatch(clearError());

      try {
        const api = getAxiosInstance();
        const { data } = await api.post<LoginResponse>("/api/auth/register", payload);

        const token = data?.token;
        if (!token) throw new Error("Registration response missing token");

        const userFromResponse =
          data?.userId && data?.email && data?.tenantId ? toAuthUserFromLoginResponse(data) : null;

        const user = userFromResponse ?? decodeToken(token);

        if (!user || !user.id || !user.email) {
          throw new Error("Registration response missing user fields");
        }

        storage.set(TOKEN_STORAGE_KEY, token);
        storage.set(AUTH_STORAGE_KEY, JSON.stringify(user));

        dispatch(loginSuccess(user));
        return true;
      } catch (error: any) {
        const message =
          error?.response?.data?.message ??
          error?.message ??
          "Registration failed. Please try again.";

        dispatch(setError(message));
        return false;
      }
    };

    const logout = () => {
      storage.remove(TOKEN_STORAGE_KEY);
      storage.remove(AUTH_STORAGE_KEY);
      storage.remove(LEGACY_AUTH_STORAGE_KEY);

      dispatch(logoutAction());
      router.replace(ROUTES.login);
    };

    return { login, register, logout };
  }, [router]);

  return (
    <AuthStateContext.Provider value={state}>
      <AuthActionsContext.Provider value={actions}>{children}</AuthActionsContext.Provider>
    </AuthStateContext.Provider>
  );
};

export const useAuthState = () => {
  const ctx = useContext(AuthStateContext);
  if (!ctx) throw new Error("useAuthState must be used within AuthProvider");
  return ctx;
};

export const useAuthActions = () => {
  const ctx = useContext(AuthActionsContext);
  if (!ctx) throw new Error("useAuthActions must be used within AuthProvider");
  return ctx;
};

export type { RegisterPayload };
