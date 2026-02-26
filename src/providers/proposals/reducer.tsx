import { handleActions } from "redux-actions";
import type { Action } from "redux-actions";

import { INITIAL_STATE, type IProposalsStateContext } from "./context";
import { ProposalsActionEnums } from "./actions";

export const proposalsReducer = handleActions<
  IProposalsStateContext,
  IProposalsStateContext
>(
  {
    [ProposalsActionEnums.getProposalsPending]: (
      state: IProposalsStateContext,
      action: Action<IProposalsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ProposalsActionEnums.getProposalsSuccess]: (
      state: IProposalsStateContext,
      action: Action<IProposalsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ProposalsActionEnums.getProposalsError]: (
      state: IProposalsStateContext,
      action: Action<IProposalsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ProposalsActionEnums.getProposalPending]: (
      state: IProposalsStateContext,
      action: Action<IProposalsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ProposalsActionEnums.getProposalSuccess]: (
      state: IProposalsStateContext,
      action: Action<IProposalsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ProposalsActionEnums.getProposalError]: (
      state: IProposalsStateContext,
      action: Action<IProposalsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ProposalsActionEnums.createProposalPending]: (
      state: IProposalsStateContext,
      action: Action<IProposalsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ProposalsActionEnums.createProposalSuccess]: (
      state: IProposalsStateContext,
      action: Action<IProposalsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ProposalsActionEnums.createProposalError]: (
      state: IProposalsStateContext,
      action: Action<IProposalsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ProposalsActionEnums.updateProposalPending]: (
      state: IProposalsStateContext,
      action: Action<IProposalsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ProposalsActionEnums.updateProposalSuccess]: (
      state: IProposalsStateContext,
      action: Action<IProposalsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ProposalsActionEnums.updateProposalError]: (
      state: IProposalsStateContext,
      action: Action<IProposalsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ProposalsActionEnums.addLineItemPending]: (
      state: IProposalsStateContext,
      action: Action<IProposalsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ProposalsActionEnums.addLineItemSuccess]: (
      state: IProposalsStateContext,
      action: Action<IProposalsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ProposalsActionEnums.addLineItemError]: (
      state: IProposalsStateContext,
      action: Action<IProposalsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ProposalsActionEnums.updateLineItemPending]: (
      state: IProposalsStateContext,
      action: Action<IProposalsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ProposalsActionEnums.updateLineItemSuccess]: (
      state: IProposalsStateContext,
      action: Action<IProposalsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ProposalsActionEnums.updateLineItemError]: (
      state: IProposalsStateContext,
      action: Action<IProposalsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ProposalsActionEnums.deleteLineItemPending]: (
      state: IProposalsStateContext,
      action: Action<IProposalsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ProposalsActionEnums.deleteLineItemSuccess]: (
      state: IProposalsStateContext,
      action: Action<IProposalsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ProposalsActionEnums.deleteLineItemError]: (
      state: IProposalsStateContext,
      action: Action<IProposalsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ProposalsActionEnums.submitProposalPending]: (
      state: IProposalsStateContext,
      action: Action<IProposalsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ProposalsActionEnums.submitProposalSuccess]: (
      state: IProposalsStateContext,
      action: Action<IProposalsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ProposalsActionEnums.submitProposalError]: (
      state: IProposalsStateContext,
      action: Action<IProposalsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ProposalsActionEnums.approveProposalPending]: (
      state: IProposalsStateContext,
      action: Action<IProposalsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ProposalsActionEnums.approveProposalSuccess]: (
      state: IProposalsStateContext,
      action: Action<IProposalsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ProposalsActionEnums.approveProposalError]: (
      state: IProposalsStateContext,
      action: Action<IProposalsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ProposalsActionEnums.rejectProposalPending]: (
      state: IProposalsStateContext,
      action: Action<IProposalsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ProposalsActionEnums.rejectProposalSuccess]: (
      state: IProposalsStateContext,
      action: Action<IProposalsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ProposalsActionEnums.rejectProposalError]: (
      state: IProposalsStateContext,
      action: Action<IProposalsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ProposalsActionEnums.deleteProposalPending]: (
      state: IProposalsStateContext,
      action: Action<IProposalsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ProposalsActionEnums.deleteProposalSuccess]: (
      state: IProposalsStateContext,
      action: Action<IProposalsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ProposalsActionEnums.deleteProposalError]: (
      state: IProposalsStateContext,
      action: Action<IProposalsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ProposalsActionEnums.clearError]: (
      state: IProposalsStateContext,
      action: Action<IProposalsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ProposalsActionEnums.clearProposal]: (
      state: IProposalsStateContext,
      action: Action<IProposalsStateContext>
    ) => ({ ...state, ...action.payload }),
  },
  INITIAL_STATE
);
