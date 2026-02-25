export type UserRole = "admin" | "client";

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
};

export type AuthState = {
  isBootstrapped: boolean;
  isAuthenticated: boolean;
  user: AuthUser | null;
  errorMessage: string | null;
};

export const AUTH_STORAGE_KEY = "sales.auth.user";

export const INITIAL_STATE: AuthState = {
  isBootstrapped: false,
  isAuthenticated: false,
  user: null,
  errorMessage: null,
};

export enum AuthActionType {
  BOOTSTRAP_SUCCESS = "AUTH/BOOTSTRAP_SUCCESS",
  LOGIN_SUCCESS = "AUTH/LOGIN_SUCCESS",
  LOGOUT = "AUTH/LOGOUT",
  SET_ERROR = "AUTH/SET_ERROR",
  CLEAR_ERROR = "AUTH/CLEAR_ERROR",
}

export type AuthAction =
  | { type: AuthActionType.BOOTSTRAP_SUCCESS; payload: { user: AuthUser | null } }
  | { type: AuthActionType.LOGIN_SUCCESS; payload: { user: AuthUser } }
  | { type: AuthActionType.LOGOUT }
  | { type: AuthActionType.SET_ERROR; payload: { message: string } }
  | { type: AuthActionType.CLEAR_ERROR };