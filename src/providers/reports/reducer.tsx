import { handleActions } from "redux-actions";
import { INITIAL_STATE, type IReportsState } from "./context";
import { ReportsActionEnums } from "./actions";

export const ReportsReducer = handleActions<IReportsState, any>(
  {
    // Opportunities Report
    [ReportsActionEnums.GET_OPPORTUNITIES_REPORT_PENDING]: (state) => ({
      ...state,
      isPending: true,
      errorMessage: null,
    }),
    [ReportsActionEnums.GET_OPPORTUNITIES_REPORT_SUCCESS]: (state, action) => ({
      ...state,
      isPending: false,
      opportunitiesReport: action.payload.report,
    }),
    [ReportsActionEnums.GET_OPPORTUNITIES_REPORT_ERROR]: (state, action) => ({
      ...state,
      isPending: false,
      errorMessage: action.payload,
    }),

    // Sales by Period Report
    [ReportsActionEnums.GET_SALES_BY_PERIOD_PENDING]: (state) => ({
      ...state,
      isPending: true,
      errorMessage: null,
    }),
    [ReportsActionEnums.GET_SALES_BY_PERIOD_SUCCESS]: (state, action) => ({
      ...state,
      isPending: false,
      salesByPeriod: action.payload.report,
    }),
    [ReportsActionEnums.GET_SALES_BY_PERIOD_ERROR]: (state, action) => ({
      ...state,
      isPending: false,
      errorMessage: action.payload,
    }),

    // Utilities
    [ReportsActionEnums.CLEAR_ERROR]: (state) => ({
      ...state,
      errorMessage: null,
    }),
  },
  INITIAL_STATE
);
