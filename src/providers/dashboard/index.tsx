"use client";

import type { ReactNode } from "react";
import { useCallback, useContext, useMemo, useReducer } from "react";
import { getAxiosInstance } from "@/lib/api";

import {
  INITIAL_STATE,
  DashboardStateContext,
  DashboardActionsContext,
  type IDashboardActionContext,
} from "./context";

import { dashboardReducer } from "./reducer";
import {
  getDashboardOverviewPending,
  getDashboardOverviewSuccess,
  getDashboardOverviewError,
  getPipelineMetricsPending,
  getPipelineMetricsSuccess,
  getPipelineMetricsError,
  getSalesPerformancePending,
  getSalesPerformanceSuccess,
  getSalesPerformanceError,
  getActivitySummaryPending,
  getActivitySummarySuccess,
  getActivitySummaryError,
  getExpiringContractsPending,
  getExpiringContractsSuccess,
  getExpiringContractsError,
  clearError,
} from "./actions";

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(dashboardReducer, INITIAL_STATE);

  // Define callback at top level, not inside useMemo
  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, []);

  const actions = useMemo<IDashboardActionContext>(() => {
    // Get dashboard overview
    const getDashboardOverview = async () => {
      dispatch(getDashboardOverviewPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.get("/api/dashboard/overview");

        dispatch(getDashboardOverviewSuccess({ overview: data }));
      } catch (error: any) {
        const message =
          error?.response?.data?.message || error?.message || "Failed to fetch dashboard overview";
        dispatch(getDashboardOverviewError(message));
      }
    };

    // Get pipeline metrics
    const getPipelineMetrics = async () => {
      dispatch(getPipelineMetricsPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.get("/api/dashboard/pipeline-metrics");

        dispatch(getPipelineMetricsSuccess({ pipelineMetrics: data }));
      } catch (error: any) {
        const message =
          error?.response?.data?.message || error?.message || "Failed to fetch pipeline metrics";
        dispatch(getPipelineMetricsError(message));
      }
    };

    // Get sales performance
    const getSalesPerformance = async (topCount: number = 5) => {
      dispatch(getSalesPerformancePending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.get("/api/dashboard/sales-performance", {
          params: { topCount },
        });

        dispatch(getSalesPerformanceSuccess({ salesPerformance: data || [] }));
      } catch (error: any) {
        const message =
          error?.response?.data?.message || error?.message || "Failed to fetch sales performance";
        dispatch(getSalesPerformanceError(message));
      }
    };

    // Get activity summary
    const getActivitySummary = async () => {
      dispatch(getActivitySummaryPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.get("/api/dashboard/activities-summary");

        dispatch(getActivitySummarySuccess({ activitySummary: data }));
      } catch (error: any) {
        const message =
          error?.response?.data?.message || error?.message || "Failed to fetch activity summary";
        dispatch(getActivitySummaryError(message));
      }
    };

    // Get expiring contracts
    const getExpiringContracts = async (days: number = 30) => {
      dispatch(getExpiringContractsPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.get("/api/dashboard/contracts-expiring", {
          params: { days },
        });

        dispatch(
          getExpiringContractsSuccess({
            expiringContracts: {
              contracts: data?.contracts || data || [],
              totalCount: data?.totalCount || (Array.isArray(data) ? data.length : 0),
            },
          }),
        );
      } catch (error: any) {
        const message =
          error?.response?.data?.message || error?.message || "Failed to fetch expiring contracts";
        dispatch(getExpiringContractsError(message));
      }
    };

    return {
      getDashboardOverview,
      getPipelineMetrics,
      getSalesPerformance,
      getActivitySummary,
      getExpiringContracts,
      clearError: handleClearError,
    };
  }, [handleClearError]);

  return (
    <DashboardStateContext.Provider value={state}>
      <DashboardActionsContext.Provider value={actions}>
        {children}
      </DashboardActionsContext.Provider>
    </DashboardStateContext.Provider>
  );
};

// Hook to access dashboard state
export const useDashboardState = () => {
  const context = useContext(DashboardStateContext);
  if (!context) {
    throw new Error("useDashboardState must be used within a DashboardProvider");
  }
  return context;
};

// Hook to access dashboard actions
export const useDashboardActions = () => {
  const context = useContext(DashboardActionsContext);
  if (!context) {
    throw new Error("useDashboardActions must be used within a DashboardProvider");
  }
  return context;
};
