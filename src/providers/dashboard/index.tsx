"use client";

import type { ReactNode } from "react";
import { useCallback, useContext, useMemo, useReducer } from "react";
import { getAxiosInstance } from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";

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

        // Ensure we have valid data structure with defaults for missing fields
        const overview = data || {
          opportunities: { totalCount: 0, wonCount: 0, winRate: 0, pipelineValue: 0 },
          pipeline: { stages: [], weightedPipelineValue: 0 },
          activities: { upcomingCount: 0, overdueCount: 0, completedTodayCount: 0 },
          contracts: { totalActiveCount: 0, expiringThisMonthCount: 0, totalContractValue: 0 },
          revenue: { thisMonth: 0, thisQuarter: 0, thisYear: 0, monthlyTrend: [] },
        };

        dispatch(getDashboardOverviewSuccess({ overview }));
      } catch (error: unknown) {
        const message = getErrorMessage(error, "Failed to fetch dashboard overview");
        dispatch(getDashboardOverviewError(message));
      }
    };

    // Get pipeline metrics
    const getPipelineMetrics = async () => {
      dispatch(getPipelineMetricsPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.get("/api/dashboard/pipeline-metrics");

        // API returns flat structure: { stage, stageName, count, totalValue, averageProbability, conversionToNext }
        // Map totalValue to value field for component compatibility
        interface APIStageMetrics {
          stage: number;
          stageName: string;
          count: number;
          totalValue: number;
          averageProbability?: number;
          conversionToNext?: number;
        }
        
        const transformedStages = (data?.stages || []).map((stage: APIStageMetrics) => {
          const avgDealSize = stage.count > 0 ? stage.totalValue / stage.count : 0;
          return {
            stage: stage.stage,
            stageName: stage.stageName,
            count: stage.count || 0,
            value: stage.totalValue || 0,  // Use totalValue as the value for the chart
            avgDealSize,
            totalValue: stage.totalValue,
            averageProbability: stage.averageProbability,
            conversionToNext: stage.conversionToNext,
          };
        });

        const pipelineData = {
          stages: transformedStages,
          totalCount: data?.totalCount || 0,
          totalValue: data?.totalValue || 0,
          weightedValue: data?.weightedPipelineValue || data?.weightedValue || 0,
        };

        dispatch(getPipelineMetricsSuccess({ pipelineMetrics: pipelineData }));
      } catch (error: unknown) {
        const message = getErrorMessage(error, "Failed to fetch pipeline metrics");
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

        // API returns { topPerformers: [...], averageDealsPerUser, averageRevenuePerUser }
        // Extract and transform the topPerformers array
        const topPerformers = Array.isArray(data) ? data : data?.topPerformers || [];
        
        interface APIPerformer {
          userId: string;
          userName: string;
          opportunitiesCount: number;
          wonCount: number;
          lostCount: number;
          totalRevenue: number;
          winRate: number;
        }
        
        const salesPerformanceData = topPerformers.map((performer: APIPerformer) => ({
          userId: performer.userId,
          userName: performer.userName || 'Unknown',
          opportunitiesCount: performer.opportunitiesCount || 0,
          wonCount: performer.wonCount || 0,
          lostCount: performer.lostCount || 0,
          totalRevenue: performer.totalRevenue || 0,
          winRate: performer.opportunitiesCount > 0 
            ? (performer.wonCount / performer.opportunitiesCount) * 100 
            : 0,
        }));

        dispatch(getSalesPerformanceSuccess({ salesPerformance: salesPerformanceData }));
      } catch (error: unknown) {
        const message = getErrorMessage(error, "Failed to fetch sales performance");
        dispatch(getSalesPerformanceError(message));
      }
    };

    // Get activity summary
    const getActivitySummary = async () => {
      dispatch(getActivitySummaryPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.get("/api/dashboard/activities-summary");

        // API returns { totalCount, upcomingCount, overdueCount, completedTodayCount, completedThisWeekCount, byType: { 1: count, 2: count, ... } }
        const activityData = data || {
          totalCount: 0,
          upcomingCount: 0,
          overdueCount: 0,
          completedTodayCount: 0,
          completedThisWeekCount: 0,
          byType: {},
        };

        dispatch(getActivitySummarySuccess({ activitySummary: activityData }));
      } catch (error: unknown) {
        const message = getErrorMessage(error, "Failed to fetch activity summary");
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

        // API returns either { contracts: [...], totalCount } or just an array
        const contractsList = Array.isArray(data)
          ? {
              contracts: data,
              totalCount: data.length,
            }
          : {
              contracts: data?.contracts || [],
              totalCount: data?.totalCount || (data?.contracts?.length || 0),
            };

        dispatch(getExpiringContractsSuccess({ expiringContracts: contractsList }));
      } catch (error: unknown) {
        const message = getErrorMessage(error, "Failed to fetch expiring contracts");
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
