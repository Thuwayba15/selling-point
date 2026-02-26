"use client";

import { createContext } from "react";
import type { Opportunity, OpportunitiesQuery, PagedResponse } from "../../domains/opportunities/types";

export type OpportunitiesState = {
  query: OpportunitiesQuery;

  list: PagedResponse<Opportunity> | null;
  myList: PagedResponse<Opportunity> | null;

  isPending: boolean;
  isError: boolean;
  errorMessage: string | null;
};

export const INITIAL_STATE: OpportunitiesState = {
  query: {
    tab: "all",
    searchTerm: "",
    stage: undefined,
    page: 1, // UI page (1-based)
    pageSize: 10,
  },

  list: null,
  myList: null,

  isPending: false,
  isError: false,
  errorMessage: null,
};

export type OpportunitiesActionsContext = {
  // local UI state
  setQuery: (patch: Partial<OpportunitiesQuery>) => void;
  resetQuery: () => void;

  // data fetching
  fetchCurrentTab: () => Promise<void>;
  fetchAll: () => Promise<void>;
  fetchMine: () => Promise<void>;
};

export const OpportunitiesStateContext = createContext<OpportunitiesState>(INITIAL_STATE);

export const OpportunitiesActionsContext = createContext<OpportunitiesActionsContext>({
  setQuery: () => undefined,
  resetQuery: () => undefined,
  fetchCurrentTab: async () => undefined,
  fetchAll: async () => undefined,
  fetchMine: async () => undefined,
});