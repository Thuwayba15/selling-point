import { handleActions } from "redux-actions";
import { INITIAL_STATE, IUsersStateContext } from "./context";
import { UsersActionEnums } from "./actions";

export const UsersReducer = handleActions<IUsersStateContext, IUsersStateContext>(
  {
    // Get Users
    [UsersActionEnums.getUsersPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [UsersActionEnums.getUsersSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [UsersActionEnums.getUsersError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    // Get Single User
    [UsersActionEnums.getUserPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [UsersActionEnums.getUserSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [UsersActionEnums.getUserError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    // Utility Actions
    [UsersActionEnums.clearError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [UsersActionEnums.clearUser]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
  },
  INITIAL_STATE,
);
