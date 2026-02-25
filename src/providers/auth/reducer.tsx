import { AuthActionType, type AuthAction, type AuthState } from "./context";

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case AuthActionType.BOOTSTRAP_SUCCESS: {
      const user = action.payload.user;
      return {
        ...state,
        isBootstrapped: true,
        user,
        isAuthenticated: Boolean(user),
        errorMessage: null,
      };
    }

    case AuthActionType.LOGIN_SUCCESS:
      return {
        ...state,
        isBootstrapped: true,
        isAuthenticated: true,
        user: action.payload.user,
        errorMessage: null,
      };

    case AuthActionType.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        errorMessage: null,
      };

    case AuthActionType.SET_ERROR:
      return { ...state, errorMessage: action.payload.message };

    case AuthActionType.CLEAR_ERROR:
      return { ...state, errorMessage: null };

    default:
      return state;
  }
};