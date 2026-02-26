"use client";

import { createAction } from "redux-actions";
import type { AuthUser } from "./context";

export enum AuthActionTypes {
  BOOTSTRAP_SUCCESS = "auth/BOOTSTRAP_SUCCESS",
  LOGIN_SUCCESS = "auth/LOGIN_SUCCESS",
  LOGOUT = "auth/LOGOUT",
  SET_ERROR = "auth/SET_ERROR",
  CLEAR_ERROR = "auth/CLEAR_ERROR",
}

export const bootstrapSuccess = createAction<AuthUser | null>(AuthActionTypes.BOOTSTRAP_SUCCESS);

export const loginSuccess = createAction<AuthUser>(AuthActionTypes.LOGIN_SUCCESS);

export const logoutAction = createAction<void>(AuthActionTypes.LOGOUT);

export const setError = createAction<string>(AuthActionTypes.SET_ERROR);

export const clearError = createAction<void>(AuthActionTypes.CLEAR_ERROR);
