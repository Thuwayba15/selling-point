"use client";

import { useContext, useReducer, useMemo } from "react";
import { getAxiosInstance } from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";
import {
  INITIAL_STATE,
  ReportsStateContext,
  ReportsActionsContext,
  type OpportunityStage,
  type GroupBy,
} from "./context";
import { ReportsReducer } from "./reducer";
import {
  getOpportunitiesReportPending,
  getOpportunitiesReportSuccess,
  getOpportunitiesReportError,
  getSalesByPeriodPending,
  getSalesByPeriodSuccess,
  getSalesByPeriodError,
  clearError as clearErrorAction,
} from "./actions";

export const ReportsProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(ReportsReducer, INITIAL_STATE);

  const actions = useMemo(() => {
    const getOpportunitiesReport = async (params?: {
      startDate?: string;
      endDate?: string;
      stage?: OpportunityStage;
      ownerId?: string;
    }) => {
      dispatch(getOpportunitiesReportPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.get("/api/reports/opportunities", { params });

        dispatch(
          getOpportunitiesReportSuccess({
            report: data || [],
          }),
        );
      } catch (error: unknown) {
        const message = getErrorMessage(error, "Failed to fetch opportunities report");
        dispatch(getOpportunitiesReportError(message));
      }
    };

    const getSalesByPeriodReport = async (params?: {
      startDate?: string;
      endDate?: string;
      groupBy?: GroupBy;
    }) => {
      dispatch(getSalesByPeriodPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.get("/api/reports/sales-by-period", { params });

        dispatch(
          getSalesByPeriodSuccess({
            report: data || [],
          }),
        );
      } catch (error: unknown) {
        const message = getErrorMessage(error, "Failed to fetch sales by period report");
        dispatch(getSalesByPeriodError(message));
      }
    };

    const clearError = () => {
      dispatch(clearErrorAction());
    };

    return {
      getOpportunitiesReport,
      getSalesByPeriodReport,
      clearError,
    };
  }, []);

  return (
    <ReportsStateContext.Provider value={state}>
      <ReportsActionsContext.Provider value={actions}>{children}</ReportsActionsContext.Provider>
    </ReportsStateContext.Provider>
  );
};

// Custom Hooks
export const useReportsState = () => {
  const context = useContext(ReportsStateContext);
  if (!context) {
    throw new Error("useReportsState must be used within a ReportsProvider");
  }
  return context;
};

export const useReportsActions = () => {
  const context = useContext(ReportsActionsContext);
  if (!context) {
    throw new Error("useReportsActions must be used within a ReportsProvider");
  }
  return context;
};
