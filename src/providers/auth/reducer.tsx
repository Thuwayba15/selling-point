"use client";

import { handleActions } from "redux-actions";
import type { Action } from "redux-actions";

import { INITIAL_STATE, type AuthState, type AuthUser } from "./context";
import { AuthActionTypes } from "./actions";

type PayloadAction<T> = Action<T>;

export const authReducer = handleActions<AuthState, any>(
  {
    [AuthActionTypes.BOOTSTRAP_SUCCESS]: (state, action: PayloadAction<AuthUser | null>) => {
      const user = action.payload ?? null;

      return {
        ...state,
        isBootstrapped: true,
        isAuthenticated: Boolean(user),
        user,
        errorMessage: null,
      };
    },

    [AuthActionTypes.LOGIN_SUCCESS]: (state, action: PayloadAction<AuthUser>) => {
      const user = action.payload ?? null;

      return {
        ...state,
        isBootstrapped: true,
        isAuthenticated: Boolean(user),
        user,
        errorMessage: null,
      };
    },

    [AuthActionTypes.LOGOUT]: (state) => ({
      ...state,
      isAuthenticated: false,
      user: null,
      errorMessage: null,
    }),

    [AuthActionTypes.SET_ERROR]: (state, action: PayloadAction<string>) => ({
      ...state,
      errorMessage: action.payload ?? "Something went wrong.",
    }),

    [AuthActionTypes.CLEAR_ERROR]: (state) => ({
      ...state,
      errorMessage: null,
    }),
  },
  INITIAL_STATE,
);
