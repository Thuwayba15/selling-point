import { createAction } from "redux-actions";
import type { IOpportunityReportItem, ISalesByPeriodItem } from "./context";

// Action Types
export enum ReportsActionEnums {
  // Opportunities Report
  GET_OPPORTUNITIES_REPORT_PENDING = "GET_OPPORTUNITIES_REPORT_PENDING",
  GET_OPPORTUNITIES_REPORT_SUCCESS = "GET_OPPORTUNITIES_REPORT_SUCCESS",
  GET_OPPORTUNITIES_REPORT_ERROR = "GET_OPPORTUNITIES_REPORT_ERROR",

  // Sales by Period Report
  GET_SALES_BY_PERIOD_PENDING = "GET_SALES_BY_PERIOD_PENDING",
  GET_SALES_BY_PERIOD_SUCCESS = "GET_SALES_BY_PERIOD_SUCCESS",
  GET_SALES_BY_PERIOD_ERROR = "GET_SALES_BY_PERIOD_ERROR",

  // Utilities
  CLEAR_ERROR = "CLEAR_ERROR",
}

// Action Creators - Opportunities Report
export const getOpportunitiesReportPending = createAction(
  ReportsActionEnums.GET_OPPORTUNITIES_REPORT_PENDING
);
export const getOpportunitiesReportSuccess = createAction<{
  report: IOpportunityReportItem[];
}>(ReportsActionEnums.GET_OPPORTUNITIES_REPORT_SUCCESS);
export const getOpportunitiesReportError = createAction<string>(
  ReportsActionEnums.GET_OPPORTUNITIES_REPORT_ERROR
);

// Action Creators - Sales by Period Report
export const getSalesByPeriodPending = createAction(
  ReportsActionEnums.GET_SALES_BY_PERIOD_PENDING
);
export const getSalesByPeriodSuccess = createAction<{
  report: ISalesByPeriodItem[];
}>(ReportsActionEnums.GET_SALES_BY_PERIOD_SUCCESS);
export const getSalesByPeriodError = createAction<string>(
  ReportsActionEnums.GET_SALES_BY_PERIOD_ERROR
);

// Utility Actions
export const clearError = createAction(ReportsActionEnums.CLEAR_ERROR);
