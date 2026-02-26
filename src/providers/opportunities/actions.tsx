import { createAction } from "redux-actions";
import {
  IOpportunity,
  IOpportunitiesStateContext,
  IPaginationInfo,
  IOpportunityPipeline,
  IOpportunityStageHistory,
} from "./context";

export enum OpportunitiesActionEnums {
  getOpportunitiesPending = "GET_OPPORTUNITIES_PENDING",
  getOpportunitiesSuccess = "GET_OPPORTUNITIES_SUCCESS",
  getOpportunitiesError = "GET_OPPORTUNITIES_ERROR",

  getMyOpportunitiesPending = "GET_MY_OPPORTUNITIES_PENDING",
  getMyOpportunitiesSuccess = "GET_MY_OPPORTUNITIES_SUCCESS",
  getMyOpportunitiesError = "GET_MY_OPPORTUNITIES_ERROR",

  getOpportunityPending = "GET_OPPORTUNITY_PENDING",
  getOpportunitySuccess = "GET_OPPORTUNITY_SUCCESS",
  getOpportunityError = "GET_OPPORTUNITY_ERROR",

  getOpportunityStageHistoryPending = "GET_OPPORTUNITY_STAGE_HISTORY_PENDING",
  getOpportunityStageHistorySuccess = "GET_OPPORTUNITY_STAGE_HISTORY_SUCCESS",
  getOpportunityStageHistoryError = "GET_OPPORTUNITY_STAGE_HISTORY_ERROR",

  getOpportunityPipelinePending = "GET_OPPORTUNITY_PIPELINE_PENDING",
  getOpportunityPipelineSuccess = "GET_OPPORTUNITY_PIPELINE_SUCCESS",
  getOpportunityPipelineError = "GET_OPPORTUNITY_PIPELINE_ERROR",

  createOpportunityPending = "CREATE_OPPORTUNITY_PENDING",
  createOpportunitySuccess = "CREATE_OPPORTUNITY_SUCCESS",
  createOpportunityError = "CREATE_OPPORTUNITY_ERROR",

  updateOpportunityPending = "UPDATE_OPPORTUNITY_PENDING",
  updateOpportunitySuccess = "UPDATE_OPPORTUNITY_SUCCESS",
  updateOpportunityError = "UPDATE_OPPORTUNITY_ERROR",

  updateOpportunityStagePending = "UPDATE_OPPORTUNITY_STAGE_PENDING",
  updateOpportunityStageSuccess = "UPDATE_OPPORTUNITY_STAGE_SUCCESS",
  updateOpportunityStageError = "UPDATE_OPPORTUNITY_STAGE_ERROR",

  assignOpportunityPending = "ASSIGN_OPPORTUNITY_PENDING",
  assignOpportunitySuccess = "ASSIGN_OPPORTUNITY_SUCCESS",
  assignOpportunityError = "ASSIGN_OPPORTUNITY_ERROR",

  deleteOpportunityPending = "DELETE_OPPORTUNITY_PENDING",
  deleteOpportunitySuccess = "DELETE_OPPORTUNITY_SUCCESS",
  deleteOpportunityError = "DELETE_OPPORTUNITY_ERROR",

  clearError = "CLEAR_ERROR",
  clearOpportunity = "CLEAR_OPPORTUNITY",
}

export const getOpportunitiesPending = createAction<IOpportunitiesStateContext>(
  OpportunitiesActionEnums.getOpportunitiesPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false })
);

export const getOpportunitiesSuccess = createAction<
  IOpportunitiesStateContext,
  { opportunities: IOpportunity[]; pagination?: IPaginationInfo }
>(OpportunitiesActionEnums.getOpportunitiesSuccess, ({ opportunities, pagination }) => ({
  isPending: false,
  isLoadingDetails: false,
  isSuccess: true,
  isError: false,
  opportunities,
  pagination,
}));

export const getOpportunitiesError = createAction<IOpportunitiesStateContext, string>(
  OpportunitiesActionEnums.getOpportunitiesError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  })
);

export const getMyOpportunitiesPending = createAction<IOpportunitiesStateContext>(
  OpportunitiesActionEnums.getMyOpportunitiesPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false })
);

export const getMyOpportunitiesSuccess = createAction<
  IOpportunitiesStateContext,
  { opportunities: IOpportunity[]; pagination?: IPaginationInfo }
>(OpportunitiesActionEnums.getMyOpportunitiesSuccess, ({ opportunities, pagination }) => ({
  isPending: false,
  isLoadingDetails: false,
  isSuccess: true,
  isError: false,
  opportunities,
  pagination,
}));

export const getMyOpportunitiesError = createAction<IOpportunitiesStateContext, string>(
  OpportunitiesActionEnums.getMyOpportunitiesError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  })
);

export const getOpportunityPending = createAction<IOpportunitiesStateContext>(
  OpportunitiesActionEnums.getOpportunityPending,
  () => ({ isPending: false, isLoadingDetails: true, isSuccess: false, isError: false })
);

export const getOpportunitySuccess = createAction<IOpportunitiesStateContext, IOpportunity>(
  OpportunitiesActionEnums.getOpportunitySuccess,
  (opportunity: IOpportunity) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
    opportunity,
  })
);

export const getOpportunityError = createAction<IOpportunitiesStateContext, string>(
  OpportunitiesActionEnums.getOpportunityError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  })
);

export const getOpportunityStageHistoryPending = createAction<IOpportunitiesStateContext>(
  OpportunitiesActionEnums.getOpportunityStageHistoryPending,
  () => ({ isPending: false, isLoadingDetails: true, isSuccess: false, isError: false })
);

export const getOpportunityStageHistorySuccess = createAction<
  IOpportunitiesStateContext,
  IOpportunityStageHistory[]
>(OpportunitiesActionEnums.getOpportunityStageHistorySuccess, (stageHistory) => ({
  isPending: false,
  isLoadingDetails: false,
  isSuccess: true,
  isError: false,
  stageHistory,
}));

export const getOpportunityStageHistoryError = createAction<IOpportunitiesStateContext, string>(
  OpportunitiesActionEnums.getOpportunityStageHistoryError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  })
);

export const getOpportunityPipelinePending = createAction<IOpportunitiesStateContext>(
  OpportunitiesActionEnums.getOpportunityPipelinePending,
  () => ({ isPending: false, isLoadingDetails: true, isSuccess: false, isError: false })
);

export const getOpportunityPipelineSuccess = createAction<
  IOpportunitiesStateContext,
  IOpportunityPipeline
>(OpportunitiesActionEnums.getOpportunityPipelineSuccess, (pipeline) => ({
  isPending: false,
  isLoadingDetails: false,
  isSuccess: true,
  isError: false,
  pipeline,
}));

export const getOpportunityPipelineError = createAction<IOpportunitiesStateContext, string>(
  OpportunitiesActionEnums.getOpportunityPipelineError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  })
);

export const createOpportunityPending = createAction<IOpportunitiesStateContext>(
  OpportunitiesActionEnums.createOpportunityPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false })
);

export const createOpportunitySuccess = createAction<IOpportunitiesStateContext, IOpportunity>(
  OpportunitiesActionEnums.createOpportunitySuccess,
  (opportunity: IOpportunity) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
    opportunity,
  })
);

export const createOpportunityError = createAction<IOpportunitiesStateContext, string>(
  OpportunitiesActionEnums.createOpportunityError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  })
);

export const updateOpportunityPending = createAction<IOpportunitiesStateContext>(
  OpportunitiesActionEnums.updateOpportunityPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false })
);

export const updateOpportunitySuccess = createAction<IOpportunitiesStateContext, IOpportunity>(
  OpportunitiesActionEnums.updateOpportunitySuccess,
  (opportunity: IOpportunity) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
    opportunity,
  })
);

export const updateOpportunityError = createAction<IOpportunitiesStateContext, string>(
  OpportunitiesActionEnums.updateOpportunityError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  })
);

export const updateOpportunityStagePending = createAction<IOpportunitiesStateContext>(
  OpportunitiesActionEnums.updateOpportunityStagePending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false })
);

export const updateOpportunityStageSuccess = createAction<IOpportunitiesStateContext, IOpportunity>(
  OpportunitiesActionEnums.updateOpportunityStageSuccess,
  (opportunity: IOpportunity) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
    opportunity,
  })
);

export const updateOpportunityStageError = createAction<IOpportunitiesStateContext, string>(
  OpportunitiesActionEnums.updateOpportunityStageError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  })
);

export const assignOpportunityPending = createAction<IOpportunitiesStateContext>(
  OpportunitiesActionEnums.assignOpportunityPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false })
);

export const assignOpportunitySuccess = createAction<IOpportunitiesStateContext, IOpportunity>(
  OpportunitiesActionEnums.assignOpportunitySuccess,
  (opportunity: IOpportunity) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
    opportunity,
  })
);

export const assignOpportunityError = createAction<IOpportunitiesStateContext, string>(
  OpportunitiesActionEnums.assignOpportunityError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  })
);

export const deleteOpportunityPending = createAction<IOpportunitiesStateContext>(
  OpportunitiesActionEnums.deleteOpportunityPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false })
);

export const deleteOpportunitySuccess = createAction<string>(
  OpportunitiesActionEnums.deleteOpportunitySuccess,
  (id: string) => id
);

export const deleteOpportunityError = createAction<IOpportunitiesStateContext, string>(
  OpportunitiesActionEnums.deleteOpportunityError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  })
);

export const clearError = createAction<IOpportunitiesStateContext>(
  OpportunitiesActionEnums.clearError,
  () => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: false,
    errorMessage: undefined,
  })
);

export const clearOpportunity = createAction<IOpportunitiesStateContext>(
  OpportunitiesActionEnums.clearOpportunity,
  () => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: false,
    opportunity: undefined,
    stageHistory: undefined,
  })
);
