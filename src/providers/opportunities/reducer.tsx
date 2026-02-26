import { handleActions } from "redux-actions";
import type { Action } from "redux-actions";

import { INITIAL_STATE, type IOpportunitiesStateContext } from "./context";
import { OpportunitiesActionEnums } from "./actions";

export const opportunitiesReducer = handleActions<
  IOpportunitiesStateContext,
  IOpportunitiesStateContext
>(
  {
    [OpportunitiesActionEnums.getOpportunitiesPending]: (
      state: IOpportunitiesStateContext,
      action: Action<IOpportunitiesStateContext>,
    ) => ({ ...state, ...action.payload }),

    [OpportunitiesActionEnums.getOpportunitiesSuccess]: (
      state: IOpportunitiesStateContext,
      action: Action<IOpportunitiesStateContext>,
    ) => ({ ...state, ...action.payload }),

    [OpportunitiesActionEnums.getOpportunitiesError]: (
      state: IOpportunitiesStateContext,
      action: Action<IOpportunitiesStateContext>,
    ) => ({ ...state, ...action.payload }),

    [OpportunitiesActionEnums.getMyOpportunitiesPending]: (
      state: IOpportunitiesStateContext,
      action: Action<IOpportunitiesStateContext>,
    ) => ({ ...state, ...action.payload }),

    [OpportunitiesActionEnums.getMyOpportunitiesSuccess]: (
      state: IOpportunitiesStateContext,
      action: Action<IOpportunitiesStateContext>,
    ) => ({ ...state, ...action.payload }),

    [OpportunitiesActionEnums.getMyOpportunitiesError]: (
      state: IOpportunitiesStateContext,
      action: Action<IOpportunitiesStateContext>,
    ) => ({ ...state, ...action.payload }),

    [OpportunitiesActionEnums.getOpportunityPending]: (
      state: IOpportunitiesStateContext,
      action: Action<IOpportunitiesStateContext>,
    ) => ({ ...state, ...action.payload }),

    [OpportunitiesActionEnums.getOpportunitySuccess]: (
      state: IOpportunitiesStateContext,
      action: Action<IOpportunitiesStateContext>,
    ) => ({ ...state, ...action.payload }),

    [OpportunitiesActionEnums.getOpportunityError]: (
      state: IOpportunitiesStateContext,
      action: Action<IOpportunitiesStateContext>,
    ) => ({ ...state, ...action.payload }),

    [OpportunitiesActionEnums.getOpportunityStageHistoryPending]: (
      state: IOpportunitiesStateContext,
      action: Action<IOpportunitiesStateContext>,
    ) => ({ ...state, ...action.payload }),

    [OpportunitiesActionEnums.getOpportunityStageHistorySuccess]: (
      state: IOpportunitiesStateContext,
      action: Action<IOpportunitiesStateContext>,
    ) => ({ ...state, ...action.payload }),

    [OpportunitiesActionEnums.getOpportunityStageHistoryError]: (
      state: IOpportunitiesStateContext,
      action: Action<IOpportunitiesStateContext>,
    ) => ({ ...state, ...action.payload }),

    [OpportunitiesActionEnums.getOpportunityPipelinePending]: (
      state: IOpportunitiesStateContext,
      action: Action<IOpportunitiesStateContext>,
    ) => ({ ...state, ...action.payload }),

    [OpportunitiesActionEnums.getOpportunityPipelineSuccess]: (
      state: IOpportunitiesStateContext,
      action: Action<IOpportunitiesStateContext>,
    ) => ({ ...state, ...action.payload }),

    [OpportunitiesActionEnums.getOpportunityPipelineError]: (
      state: IOpportunitiesStateContext,
      action: Action<IOpportunitiesStateContext>,
    ) => ({ ...state, ...action.payload }),

    [OpportunitiesActionEnums.createOpportunityPending]: (
      state: IOpportunitiesStateContext,
      action: Action<IOpportunitiesStateContext>,
    ) => ({ ...state, ...action.payload }),

    [OpportunitiesActionEnums.createOpportunitySuccess]: (
      state: IOpportunitiesStateContext,
      action: Action<IOpportunitiesStateContext>,
    ) => ({ ...state, ...action.payload }),

    [OpportunitiesActionEnums.createOpportunityError]: (
      state: IOpportunitiesStateContext,
      action: Action<IOpportunitiesStateContext>,
    ) => ({ ...state, ...action.payload }),

    [OpportunitiesActionEnums.updateOpportunityPending]: (
      state: IOpportunitiesStateContext,
      action: Action<IOpportunitiesStateContext>,
    ) => ({ ...state, ...action.payload }),

    [OpportunitiesActionEnums.updateOpportunitySuccess]: (
      state: IOpportunitiesStateContext,
      action: Action<IOpportunitiesStateContext>,
    ) => ({ ...state, ...action.payload }),

    [OpportunitiesActionEnums.updateOpportunityError]: (
      state: IOpportunitiesStateContext,
      action: Action<IOpportunitiesStateContext>,
    ) => ({ ...state, ...action.payload }),

    [OpportunitiesActionEnums.updateOpportunityStagePending]: (
      state: IOpportunitiesStateContext,
      action: Action<IOpportunitiesStateContext>,
    ) => ({ ...state, ...action.payload }),

    [OpportunitiesActionEnums.updateOpportunityStageSuccess]: (
      state: IOpportunitiesStateContext,
      action: Action<IOpportunitiesStateContext>,
    ) => ({ ...state, ...action.payload }),

    [OpportunitiesActionEnums.updateOpportunityStageError]: (
      state: IOpportunitiesStateContext,
      action: Action<IOpportunitiesStateContext>,
    ) => ({ ...state, ...action.payload }),

    [OpportunitiesActionEnums.assignOpportunityPending]: (
      state: IOpportunitiesStateContext,
      action: Action<IOpportunitiesStateContext>,
    ) => ({ ...state, ...action.payload }),

    [OpportunitiesActionEnums.assignOpportunitySuccess]: (
      state: IOpportunitiesStateContext,
      action: Action<IOpportunitiesStateContext>,
    ) => ({ ...state, ...action.payload }),

    [OpportunitiesActionEnums.assignOpportunityError]: (
      state: IOpportunitiesStateContext,
      action: Action<IOpportunitiesStateContext>,
    ) => ({ ...state, ...action.payload }),

    [OpportunitiesActionEnums.deleteOpportunityPending]: (
      state: IOpportunitiesStateContext,
      action: Action<IOpportunitiesStateContext>,
    ) => ({ ...state, ...action.payload }),

    [OpportunitiesActionEnums.deleteOpportunitySuccess]: (
      state: IOpportunitiesStateContext,
      action: Action<IOpportunitiesStateContext>,
    ) => ({ ...state, ...action.payload }),

    [OpportunitiesActionEnums.deleteOpportunityError]: (
      state: IOpportunitiesStateContext,
      action: Action<IOpportunitiesStateContext>,
    ) => ({ ...state, ...action.payload }),

    [OpportunitiesActionEnums.clearError]: (
      state: IOpportunitiesStateContext,
      action: Action<IOpportunitiesStateContext>,
    ) => ({ ...state, ...action.payload }),

    [OpportunitiesActionEnums.clearOpportunity]: (
      state: IOpportunitiesStateContext,
      action: Action<IOpportunitiesStateContext>,
    ) => ({ ...state, ...action.payload }),
  },
  INITIAL_STATE,
);
