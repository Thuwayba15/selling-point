"use client";

import { handleActions } from "redux-actions";
import { INITIAL_STATE, type OpportunitiesState } from "./context";
import {
  OpportunitiesActionTypes,
  failureAction,
  requestAction,
  resetQueryAction,
  setListAction,
  setMyListAction,
  setQueryAction,
} from "./actions";

export const OpportunitiesReducer = handleActions<OpportunitiesState, any>(
  {
    [OpportunitiesActionTypes.SET_QUERY]: (state, action: ReturnType<typeof setQueryAction>) => ({
      ...state,
      query: { ...state.query, ...(action.payload ?? {}) },
    }),

    [OpportunitiesActionTypes.RESET_QUERY]: (state, _action: ReturnType<typeof resetQueryAction>) => ({
      ...state,
      query: INITIAL_STATE.query,
    }),

    [OpportunitiesActionTypes.REQUEST]: (state, _action: ReturnType<typeof requestAction>) => ({
      ...state,
      isPending: true,
      isError: false,
      errorMessage: null,
    }),

    [OpportunitiesActionTypes.FAILURE]: (state, action: ReturnType<typeof failureAction>) => ({
      ...state,
      isPending: false,
      isError: true,
      errorMessage: action.payload?.errorMessage ?? "Request failed",
    }),

    [OpportunitiesActionTypes.SET_LIST]: (state, action: ReturnType<typeof setListAction>) => ({
      ...state,
      isPending: false,
      list: action.payload ?? null,
    }),

    [OpportunitiesActionTypes.SET_MY_LIST]: (state, action: ReturnType<typeof setMyListAction>) => ({
      ...state,
      isPending: false,
      myList: action.payload ?? null,
    }),
  },
  INITIAL_STATE,
);