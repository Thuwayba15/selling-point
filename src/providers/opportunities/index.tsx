"use client";

import type { ReactNode } from "react";
import { useContext, useMemo, useReducer } from "react";
import { getAxiosInstance } from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";

import {
  INITIAL_STATE,
  OpportunitiesStateContext,
  OpportunitiesActionsContext,
  type IOpportunity,
  type IOpportunitiesActionContext,
} from "./context";

import { opportunitiesReducer } from "./reducer";
import {
  getOpportunitiesPending,
  getOpportunitiesSuccess,
  getOpportunitiesError,
  getMyOpportunitiesPending,
  getMyOpportunitiesSuccess,
  getMyOpportunitiesError,
  getOpportunityPending,
  getOpportunitySuccess,
  getOpportunityError,
  getOpportunityStageHistoryPending,
  getOpportunityStageHistorySuccess,
  getOpportunityStageHistoryError,
  getOpportunityPipelinePending,
  getOpportunityPipelineSuccess,
  getOpportunityPipelineError,
  createOpportunityPending,
  createOpportunitySuccess,
  createOpportunityError,
  updateOpportunityPending,
  updateOpportunitySuccess,
  updateOpportunityError,
  updateOpportunityStagePending,
  updateOpportunityStageSuccess,
  updateOpportunityStageError,
  assignOpportunityPending,
  assignOpportunitySuccess,
  assignOpportunityError,
  deleteOpportunityPending,
  deleteOpportunitySuccess,
  deleteOpportunityError,
  clearError,
  clearOpportunity,
} from "./actions";

export const OpportunitiesProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(opportunitiesReducer, INITIAL_STATE);

  const actions = useMemo<IOpportunitiesActionContext>(() => {
    const getOpportunities = async (params?: {
      clientId?: string;
      stage?: number;
      ownerId?: string;
      searchTerm?: string;
      isActive?: boolean;
      pageNumber?: number;
      pageSize?: number;
    }) => {
      dispatch(getOpportunitiesPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.get("/api/opportunities", {
          params: { ...params, isActive: params?.isActive ?? true },
        });

        const activeOpportunities = (data.items || []).filter(
          (item: IOpportunity) => item.isActive !== false,
        );

        dispatch(
          getOpportunitiesSuccess({
            opportunities: activeOpportunities,
            pagination: {
              currentPage: data.currentPage ?? data.pageNumber ?? params?.pageNumber ?? 1,
              pageSize: data.pageSize ?? params?.pageSize ?? 10,
              totalCount: data.totalCount ?? 0,
              totalPages: data.totalPages ?? 0,
            },
          }),
        );
      } catch (error: unknown) {
        const message = getErrorMessage(error, "Failed to fetch opportunities");
        dispatch(getOpportunitiesError(message));
      }
    };

    const getMyOpportunities = async (params?: {
      stage?: number;
      pageNumber?: number;
      pageSize?: number;
    }) => {
      dispatch(getMyOpportunitiesPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.get("/api/opportunities/my-opportunities", { params });

        const activeOpportunities = (data.items || []).filter(
          (item: IOpportunity) => item.isActive !== false,
        );

        dispatch(
          getMyOpportunitiesSuccess({
            opportunities: activeOpportunities,
            pagination: {
              currentPage: data.currentPage ?? data.pageNumber ?? params?.pageNumber ?? 1,
              pageSize: data.pageSize ?? params?.pageSize ?? 10,
              totalCount: data.totalCount ?? 0,
              totalPages: data.totalPages ?? 0,
            },
          }),
        );
      } catch (error: unknown) {
        const message = getErrorMessage(error, "Failed to fetch opportunities");
        dispatch(getMyOpportunitiesError(message));
      }
    };

    const getOpportunity = async (id: string) => {
      dispatch(getOpportunityPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.get(`/api/opportunities/${id}`);

        dispatch(getOpportunitySuccess(data));
      } catch (error: unknown) {
        const message = getErrorMessage(error, "Failed to fetch opportunity");
        dispatch(getOpportunityError(message));
      }
    };

    const getOpportunityStageHistory = async (id: string) => {
      dispatch(getOpportunityStageHistoryPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.get(`/api/opportunities/${id}/stage-history`);

        dispatch(getOpportunityStageHistorySuccess(data || []));
      } catch (error: unknown) {
        const message = getErrorMessage(error, "Failed to fetch stage history");
        dispatch(getOpportunityStageHistoryError(message));
      }
    };

    const getOpportunityPipeline = async (params?: { ownerId?: string }) => {
      dispatch(getOpportunityPipelinePending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.get("/api/opportunities/pipeline", { params });
        const normalized = {
          stages: data?.stages || data?.stageBreakdown || data?.items || [],
          totalValue: data?.totalValue,
          weightedValue: data?.weightedValue,
          conversionRate: data?.conversionRate,
        };

        dispatch(getOpportunityPipelineSuccess(normalized));
      } catch (error: unknown) {
        const message = getErrorMessage(error, "Failed to fetch pipeline");
        dispatch(getOpportunityPipelineError(message));
      }
    };

    const createOpportunity = async (opportunity: Partial<IOpportunity>): Promise<boolean> => {
      dispatch(createOpportunityPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.post("/api/opportunities", opportunity);

        dispatch(createOpportunitySuccess(data));
        return true;
      } catch (error: unknown) {
        const message = getErrorMessage(error, "Failed to create opportunity");
        dispatch(createOpportunityError(message));
        return false;
      }
    };

    const updateOpportunity = async (
      id: string,
      opportunity: Partial<IOpportunity>,
    ): Promise<boolean> => {
      dispatch(updateOpportunityPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.put(`/api/opportunities/${id}`, opportunity);

        dispatch(updateOpportunitySuccess(data));
        return true;
      } catch (error: unknown) {
        const message = getErrorMessage(error, "Failed to update opportunity");
        dispatch(updateOpportunityError(message));
        return false;
      }
    };

    const updateOpportunityStage = async (
      id: string,
      stage: number,
      notes?: string,
      lossReason?: string,
    ): Promise<boolean> => {
      dispatch(updateOpportunityStagePending());

      try {
        const api = getAxiosInstance();
        const payload = {
          stage,
          notes,
          lossReason: stage === 6 ? (lossReason ?? null) : null,
        };
        const { data } = await api.put(`/api/opportunities/${id}/stage`, payload);

        dispatch(updateOpportunityStageSuccess(data));
        return true;
      } catch (error: unknown) {
        const message = getErrorMessage(error, "Failed to update opportunity stage");
        dispatch(updateOpportunityStageError(message));
        return false;
      }
    };

    const assignOpportunity = async (id: string, userId: string): Promise<boolean> => {
      dispatch(assignOpportunityPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.post(`/api/opportunities/${id}/assign`, { userId });

        dispatch(assignOpportunitySuccess(data));
        return true;
      } catch (error: unknown) {
        const message = getErrorMessage(error, "Failed to assign opportunity");
        dispatch(assignOpportunityError(message));
        return false;
      }
    };

    const deleteOpportunity = async (id: string): Promise<boolean> => {
      dispatch(deleteOpportunityPending());

      try {
        const api = getAxiosInstance();
        await api.delete(`/api/opportunities/${id}`);

        dispatch(deleteOpportunitySuccess(id));
        return true;
      } catch (error: unknown) {
        const message = getErrorMessage(error, "Failed to delete opportunity");
        dispatch(deleteOpportunityError(message));
        return false;
      }
    };

    return {
      getOpportunities,
      getMyOpportunities,
      getOpportunity,
      getOpportunityStageHistory,
      getOpportunityPipeline,
      createOpportunity,
      updateOpportunity,
      updateOpportunityStage,
      assignOpportunity,
      deleteOpportunity,
      clearError: () => dispatch(clearError()),
      clearOpportunity: () => dispatch(clearOpportunity()),
    };
  }, []);

  return (
    <OpportunitiesStateContext.Provider value={state}>
      <OpportunitiesActionsContext.Provider value={actions}>
        {children}
      </OpportunitiesActionsContext.Provider>
    </OpportunitiesStateContext.Provider>
  );
};

export const useOpportunitiesState = () => {
  const ctx = useContext(OpportunitiesStateContext);
  if (!ctx) throw new Error("useOpportunitiesState must be used within OpportunitiesProvider");
  return ctx;
};

export const useOpportunitiesActions = () => {
  const ctx = useContext(OpportunitiesActionsContext);
  if (!ctx) throw new Error("useOpportunitiesActions must be used within OpportunitiesProvider");
  return ctx;
};
