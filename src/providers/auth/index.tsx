"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { useRouter } from "next/navigation";

import { storage } from "@/lib/storage";
import { ROUTES } from "@/lib/routes";

import { AUTH_STORAGE_KEY, INITIAL_STATE, type AuthState, type AuthUser } from "./context";
import { authReducer } from "./reducer";
import { bootstrapSuccess, loginSuccess, logoutAction } from "./actions";

type AuthActions = {
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthStateContext = createContext<AuthState | null>(null);
const AuthActionsContext = createContext<AuthActions | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [state, dispatch] = useReducer(authReducer, INITIAL_STATE);

  useEffect(() => {
    const raw = storage.get(AUTH_STORAGE_KEY);
    const user = raw ? (JSON.parse(raw) as AuthUser) : null;
    dispatch(bootstrapSuccess(user));
  }, []);

  const actions = useMemo<AuthActions>(() => {
    const login = async (email: string, _password: string) => {
      // TEMP: fake login (swap to API later)
      const role: AuthUser["role"] = email.toLowerCase().includes("admin") ? "admin" : "client";
      const user: AuthUser = { id: crypto.randomUUID(), email, role };

      storage.set(AUTH_STORAGE_KEY, JSON.stringify(user));
      dispatch(loginSuccess(user));
      return true;
    };

    const register = async (email: string, password: string) => {
      return login(email, password);
    };

    const logout = () => {
      storage.remove(AUTH_STORAGE_KEY);
      dispatch(logoutAction());
      router.replace(ROUTES.login);
    };

    return { login, register, logout };
  }, [router]);

  return (
    <AuthStateContext.Provider value={state}>
      <AuthActionsContext.Provider value={actions}>
        {children}
      </AuthActionsContext.Provider>
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