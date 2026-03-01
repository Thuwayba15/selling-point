import { createAction } from "redux-actions";
import { IUser, IUsersStateContext, IPaginationInfo } from "./context";

// Enum defining the type of actions that can be dispatched
export enum UsersActionEnums {
  // Get all users
  getUsersPending = "GET_USERS_PENDING",
  getUsersSuccess = "GET_USERS_SUCCESS",
  getUsersError = "GET_USERS_ERROR",

  // Get single user
  getUserPending = "GET_USER_PENDING",
  getUserSuccess = "GET_USER_SUCCESS",
  getUserError = "GET_USER_ERROR",

  // Utility actions
  clearError = "CLEAR_ERROR",
  clearUser = "CLEAR_USER",
}

// Get Users Actions
export const getUsersPending = createAction<IUsersStateContext>(
  UsersActionEnums.getUsersPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false }),
);

export const getUsersSuccess = createAction<
  IUsersStateContext,
  { users: IUser[]; pagination?: IPaginationInfo }
>(UsersActionEnums.getUsersSuccess, ({ users, pagination }) => ({
  isPending: false,
  isLoadingDetails: false,
  isSuccess: true,
  isError: false,
  users,
  pagination,
}));

export const getUsersError = createAction<IUsersStateContext, string>(
  UsersActionEnums.getUsersError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

// Get Single User Actions
export const getUserPending = createAction<IUsersStateContext>(
  UsersActionEnums.getUserPending,
  () => ({ isPending: false, isLoadingDetails: true, isSuccess: false, isError: false }),
);

export const getUserSuccess = createAction<IUsersStateContext, IUser>(
  UsersActionEnums.getUserSuccess,
  (user: IUser) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
    user,
  }),
);

export const getUserError = createAction<IUsersStateContext, string>(
  UsersActionEnums.getUserError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

// Utility Actions
export const clearError = createAction<IUsersStateContext>(UsersActionEnums.clearError, () => ({
  isPending: false,
  isLoadingDetails: false,
  isSuccess: false,
  isError: false,
  errorMessage: undefined,
}));

export const clearUser = createAction<IUsersStateContext>(UsersActionEnums.clearUser, () => ({
  isPending: false,
  isLoadingDetails: false,
  isSuccess: false,
  isError: false,
  user: undefined,
}));
