import { createAction } from "redux-actions";
import {
  IDashboardStateContext,
  IDashboardOverview,
  IPipelineMetrics,
  ISalesPerformance,
  IActivitySummary,
  IExpiringContractsList,
} from "./context";

// Action enum
export enum DashboardActionEnums {
  // Get overview
  getDashboardOverviewPending = "GET_DASHBOARD_OVERVIEW_PENDING",
  getDashboardOverviewSuccess = "GET_DASHBOARD_OVERVIEW_SUCCESS",
  getDashboardOverviewError = "GET_DASHBOARD_OVERVIEW_ERROR",

  // Get pipeline metrics
  getPipelineMetricsPending = "GET_PIPELINE_METRICS_PENDING",
  getPipelineMetricsSuccess = "GET_PIPELINE_METRICS_SUCCESS",
  getPipelineMetricsError = "GET_PIPELINE_METRICS_ERROR",

  // Get sales performance
  getSalesPerformancePending = "GET_SALES_PERFORMANCE_PENDING",
  getSalesPerformanceSuccess = "GET_SALES_PERFORMANCE_SUCCESS",
  getSalesPerformanceError = "GET_SALES_PERFORMANCE_ERROR",

  // Get activity summary
  getActivitySummaryPending = "GET_ACTIVITY_SUMMARY_PENDING",
  getActivitySummarySuccess = "GET_ACTIVITY_SUMMARY_SUCCESS",
  getActivitySummaryError = "GET_ACTIVITY_SUMMARY_ERROR",

  // Get expiring contracts
  getExpiringContractsPending = "GET_EXPIRING_CONTRACTS_PENDING",
  getExpiringContractsSuccess = "GET_EXPIRING_CONTRACTS_SUCCESS",
  getExpiringContractsError = "GET_EXPIRING_CONTRACTS_ERROR",

  // Utility
  clearError = "CLEAR_ERROR",
}

// Dashboard Overview Actions
export const getDashboardOverviewPending = createAction<IDashboardStateContext>(
  DashboardActionEnums.getDashboardOverviewPending,
  () => ({ isPending: true, isSuccess: false, isError: false }),
);

export const getDashboardOverviewSuccess = createAction<
  IDashboardStateContext,
  { overview: IDashboardOverview }
>(DashboardActionEnums.getDashboardOverviewSuccess, ({ overview }) => ({
  isPending: false,
  isSuccess: true,
  isError: false,
  overview,
}));

export const getDashboardOverviewError = createAction<IDashboardStateContext, string>(
  DashboardActionEnums.getDashboardOverviewError,
  (errorMessage: string) => ({
    isPending: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

// Pipeline Metrics Actions
export const getPipelineMetricsPending = createAction<IDashboardStateContext>(
  DashboardActionEnums.getPipelineMetricsPending,
  () => ({ isPending: true, isSuccess: false, isError: false }),
);

export const getPipelineMetricsSuccess = createAction<
  IDashboardStateContext,
  { pipelineMetrics: IPipelineMetrics }
>(DashboardActionEnums.getPipelineMetricsSuccess, ({ pipelineMetrics }) => ({
  isPending: false,
  isSuccess: true,
  isError: false,
  pipelineMetrics,
}));

export const getPipelineMetricsError = createAction<IDashboardStateContext, string>(
  DashboardActionEnums.getPipelineMetricsError,
  (errorMessage: string) => ({
    isPending: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

// Sales Performance Actions
export const getSalesPerformancePending = createAction<IDashboardStateContext>(
  DashboardActionEnums.getSalesPerformancePending,
  () => ({ isPending: true, isSuccess: false, isError: false }),
);

export const getSalesPerformanceSuccess = createAction<
  IDashboardStateContext,
  { salesPerformance: ISalesPerformance[] }
>(DashboardActionEnums.getSalesPerformanceSuccess, ({ salesPerformance }) => ({
  isPending: false,
  isSuccess: true,
  isError: false,
  salesPerformance,
}));

export const getSalesPerformanceError = createAction<IDashboardStateContext, string>(
  DashboardActionEnums.getSalesPerformanceError,
  (errorMessage: string) => ({
    isPending: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

// Activity Summary Actions
export const getActivitySummaryPending = createAction<IDashboardStateContext>(
  DashboardActionEnums.getActivitySummaryPending,
  () => ({ isPending: true, isSuccess: false, isError: false }),
);

export const getActivitySummarySuccess = createAction<
  IDashboardStateContext,
  { activitySummary: IActivitySummary }
>(DashboardActionEnums.getActivitySummarySuccess, ({ activitySummary }) => ({
  isPending: false,
  isSuccess: true,
  isError: false,
  activitySummary,
}));

export const getActivitySummaryError = createAction<IDashboardStateContext, string>(
  DashboardActionEnums.getActivitySummaryError,
  (errorMessage: string) => ({
    isPending: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

// Expiring Contracts Actions
export const getExpiringContractsPending = createAction<IDashboardStateContext>(
  DashboardActionEnums.getExpiringContractsPending,
  () => ({ isPending: true, isSuccess: false, isError: false }),
);

export const getExpiringContractsSuccess = createAction<
  IDashboardStateContext,
  { expiringContracts: IExpiringContractsList }
>(DashboardActionEnums.getExpiringContractsSuccess, ({ expiringContracts }) => ({
  isPending: false,
  isSuccess: true,
  isError: false,
  expiringContracts,
}));

export const getExpiringContractsError = createAction<IDashboardStateContext, string>(
  DashboardActionEnums.getExpiringContractsError,
  (errorMessage: string) => ({
    isPending: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

// Utility Actions
export const clearError = createAction<IDashboardStateContext>(
  DashboardActionEnums.clearError,
  () => ({ isPending: false, isSuccess: false, isError: false, errorMessage: undefined }),
);
