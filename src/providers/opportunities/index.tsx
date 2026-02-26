"use client";

import { useContext, useMemo, useReducer } from "react";

import { createOpportunity, getMyOpportunities, getOpportunities, updateOpportunityStage } from "../../domains/opportunities/api";
import type { Opportunity, PagedResponse } from "../../domains/opportunities/types";
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

const replaceInPaged = (paged: PagedResponse<Opportunity> | null, updated: Opportunity) => {
  if (!paged) return paged;
  const items = paged.items.map((it) => (it.id === updated.id ? updated : it));
  return { ...paged, items };
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

    const create = async (payload: any) => {
      dispatch(requestAction());
      try {
        const created = await createOpportunity(payload);
        // simplest: refresh current tab after create (keeps pagination/filters consistent)
        await fetchCurrentTab();
        return { ok: true as const, data: created };
      } catch (err) {
        dispatch(failureAction({ errorMessage: getErrorMessage(err) }));
        return { ok: false as const };
      }
    };

    const updateStage = async (id: string, payload: any) => {
      dispatch(requestAction());
      try {
        const updated = await updateOpportunityStage(id, payload);

        if (state.query.tab === "mine") {
          dispatch(setMyListAction(replaceInPaged(state.myList, updated) ?? (state.myList as any)));
        } else {
          dispatch(setListAction(replaceInPaged(state.list, updated) ?? (state.list as any)));
        }

        return { ok: true as const, data: updated };
      } catch (err) {
        dispatch(failureAction({ errorMessage: getErrorMessage(err) }));
        return { ok: false as const };
      }
    };

    return {
      setQuery,
      resetQuery,
      fetchAll,
      fetchMine,
      fetchCurrentTab,
      createOpportunity: create,
      updateStage,
    };
  }, [state.query, state.list, state.myList]);

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