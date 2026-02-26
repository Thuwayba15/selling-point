"use client";

import { createAction } from "redux-actions";
import type { Opportunity, OpportunitiesQuery, PagedResponse } from "../../domains/opportunities/types";

export enum OpportunitiesActionTypes {
  SET_QUERY = "OPPORTUNITIES/SET_QUERY",
  RESET_QUERY = "OPPORTUNITIES/RESET_QUERY",

  REQUEST = "OPPORTUNITIES/REQUEST",
  FAILURE = "OPPORTUNITIES/FAILURE",

  SET_LIST = "OPPORTUNITIES/SET_LIST",
  SET_MY_LIST = "OPPORTUNITIES/SET_MY_LIST",
}

export const setQueryAction = createAction<Partial<OpportunitiesQuery>>(
  OpportunitiesActionTypes.SET_QUERY,
);

export const resetQueryAction = createAction(OpportunitiesActionTypes.RESET_QUERY);

export const requestAction = createAction(OpportunitiesActionTypes.REQUEST);

export const failureAction = createAction<{ errorMessage: string }>(
  OpportunitiesActionTypes.FAILURE,
);

export const setListAction = createAction<PagedResponse<Opportunity>>(
  OpportunitiesActionTypes.SET_LIST,
);

export const setMyListAction = createAction<PagedResponse<Opportunity>>(
  OpportunitiesActionTypes.SET_MY_LIST,
);