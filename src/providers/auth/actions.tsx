import { AuthActionType, type AuthUser, type AuthAction } from "./context";

export const bootstrapSuccess = (user: AuthUser | null): AuthAction => ({
  type: AuthActionType.BOOTSTRAP_SUCCESS,
  payload: { user },
});

export const loginSuccess = (user: AuthUser): AuthAction => ({
  type: AuthActionType.LOGIN_SUCCESS,
  payload: { user },
});

export const logoutAction = (): AuthAction => ({ type: AuthActionType.LOGOUT });

export const setError = (message: string): AuthAction => ({
  type: AuthActionType.SET_ERROR,
  payload: { message },
});

export const clearError = (): AuthAction => ({ type: AuthActionType.CLEAR_ERROR });