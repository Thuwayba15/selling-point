"use client";

import { useContext, useMemo, useReducer } from "react";

import { getMyOpportunities, getOpportunities } from "../../domains/opportunities/api";
import { OpportunitiesActionsContext, OpportunitiesStateContext, INITIAL_STATE } from "./context";
import {
  failureAction,
  requestAction,
  resetQueryAction,
  setListAction,
  setMyListAction,
  setQueryAction,
} from "./actions";
import { OpportunitiesReducer } from "./reducer";

const getErrorMessage = (err: unknown) => {
  const e = err as any;
  return e?.response?.data?.message ?? e?.message ?? "Request failed";
};

export const OpportunitiesProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(OpportunitiesReducer, INITIAL_STATE);

  const actions = useMemo(() => {
    const setQuery = (patch: Partial<typeof state.query>) => dispatch(setQueryAction(patch));

    const resetQuery = () => dispatch(resetQueryAction());

    const fetchAll = async () => {
      dispatch(requestAction());
      try {
        const data = await getOpportunities(state.query);
        dispatch(setListAction(data));
      } catch (err) {
        dispatch(failureAction({ errorMessage: getErrorMessage(err) }));
      }
    };

    const fetchMine = async () => {
      dispatch(requestAction());
      try {
        const data = await getMyOpportunities(state.query);
        dispatch(setMyListAction(data));
      } catch (err) {
        dispatch(failureAction({ errorMessage: getErrorMessage(err) }));
      }
    };

    const fetchCurrentTab = async () => {
      if (state.query.tab === "mine") return fetchMine();
      return fetchAll();
    };

    return {
      setQuery,
      resetQuery,
      fetchAll,
      fetchMine,
      fetchCurrentTab,
    };
  }, [state.query]);

  return (
    <OpportunitiesStateContext.Provider value={state}>
      <OpportunitiesActionsContext.Provider value={actions}>
        {children}
      </OpportunitiesActionsContext.Provider>
    </OpportunitiesStateContext.Provider>
  );
};

export const useOpportunitiesState = () => useContext(OpportunitiesStateContext);
export const useOpportunitiesActions = () => useContext(OpportunitiesActionsContext);