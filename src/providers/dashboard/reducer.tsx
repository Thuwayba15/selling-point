import { handleActions } from "redux-actions";
import type { Action } from "redux-actions";

import { INITIAL_STATE, type IDashboardStateContext } from "./context";
import {
  DashboardActionEnums,
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

export const dashboardReducer = handleActions<IDashboardStateContext, IDashboardStateContext>(
  {
    // Dashboard overview
    [DashboardActionEnums.getDashboardOverviewPending]: (
      state: IDashboardStateContext,
      action: Action<IDashboardStateContext>,
    ) => ({ ...state, ...action.payload }),

    [DashboardActionEnums.getDashboardOverviewSuccess]: (
      state: IDashboardStateContext,
      action: Action<IDashboardStateContext>,
    ) => ({ ...state, ...action.payload }),

    [DashboardActionEnums.getDashboardOverviewError]: (
      state: IDashboardStateContext,
      action: Action<IDashboardStateContext>,
    ) => ({ ...state, ...action.payload }),

    // Pipeline metrics
    [DashboardActionEnums.getPipelineMetricsPending]: (
      state: IDashboardStateContext,
      action: Action<IDashboardStateContext>,
    ) => ({ ...state, ...action.payload }),

    [DashboardActionEnums.getPipelineMetricsSuccess]: (
      state: IDashboardStateContext,
      action: Action<IDashboardStateContext>,
    ) => ({ ...state, ...action.payload }),

    [DashboardActionEnums.getPipelineMetricsError]: (
      state: IDashboardStateContext,
      action: Action<IDashboardStateContext>,
    ) => ({ ...state, ...action.payload }),

    // Sales performance
    [DashboardActionEnums.getSalesPerformancePending]: (
      state: IDashboardStateContext,
      action: Action<IDashboardStateContext>,
    ) => ({ ...state, ...action.payload }),

    [DashboardActionEnums.getSalesPerformanceSuccess]: (
      state: IDashboardStateContext,
      action: Action<IDashboardStateContext>,
    ) => ({ ...state, ...action.payload }),

    [DashboardActionEnums.getSalesPerformanceError]: (
      state: IDashboardStateContext,
      action: Action<IDashboardStateContext>,
    ) => ({ ...state, ...action.payload }),

    // Activity summary
    [DashboardActionEnums.getActivitySummaryPending]: (
      state: IDashboardStateContext,
      action: Action<IDashboardStateContext>,
    ) => ({ ...state, ...action.payload }),

    [DashboardActionEnums.getActivitySummarySuccess]: (
      state: IDashboardStateContext,
      action: Action<IDashboardStateContext>,
    ) => ({ ...state, ...action.payload }),

    [DashboardActionEnums.getActivitySummaryError]: (
      state: IDashboardStateContext,
      action: Action<IDashboardStateContext>,
    ) => ({ ...state, ...action.payload }),

    // Expiring contracts
    [DashboardActionEnums.getExpiringContractsPending]: (
      state: IDashboardStateContext,
      action: Action<IDashboardStateContext>,
    ) => ({ ...state, ...action.payload }),

    [DashboardActionEnums.getExpiringContractsSuccess]: (
      state: IDashboardStateContext,
      action: Action<IDashboardStateContext>,
    ) => ({ ...state, ...action.payload }),

    [DashboardActionEnums.getExpiringContractsError]: (
      state: IDashboardStateContext,
      action: Action<IDashboardStateContext>,
    ) => ({ ...state, ...action.payload }),

    // Utility
    [DashboardActionEnums.clearError]: (
      state: IDashboardStateContext,
      action: Action<IDashboardStateContext>,
    ) => ({ ...state, ...action.payload }),
  },
  INITIAL_STATE,
);
