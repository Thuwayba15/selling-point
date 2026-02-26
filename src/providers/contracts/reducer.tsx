import { handleActions } from "redux-actions";
import type { Action } from "redux-actions";

import { INITIAL_STATE, type IContractsStateContext } from "./context";
import { ContractsActionEnums } from "./actions";

export const contractsReducer = handleActions<
  IContractsStateContext,
  IContractsStateContext
>(
  {
    [ContractsActionEnums.getContractsPending]: (
      state: IContractsStateContext,
      action: Action<IContractsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContractsActionEnums.getContractsSuccess]: (
      state: IContractsStateContext,
      action: Action<IContractsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContractsActionEnums.getContractsError]: (
      state: IContractsStateContext,
      action: Action<IContractsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContractsActionEnums.getContractPending]: (
      state: IContractsStateContext,
      action: Action<IContractsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContractsActionEnums.getContractSuccess]: (
      state: IContractsStateContext,
      action: Action<IContractsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContractsActionEnums.getContractError]: (
      state: IContractsStateContext,
      action: Action<IContractsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContractsActionEnums.getExpiringContractsPending]: (
      state: IContractsStateContext,
      action: Action<IContractsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContractsActionEnums.getExpiringContractsSuccess]: (
      state: IContractsStateContext,
      action: Action<IContractsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContractsActionEnums.getExpiringContractsError]: (
      state: IContractsStateContext,
      action: Action<IContractsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContractsActionEnums.getClientContractsPending]: (
      state: IContractsStateContext,
      action: Action<IContractsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContractsActionEnums.getClientContractsSuccess]: (
      state: IContractsStateContext,
      action: Action<IContractsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContractsActionEnums.getClientContractsError]: (
      state: IContractsStateContext,
      action: Action<IContractsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContractsActionEnums.createContractPending]: (
      state: IContractsStateContext,
      action: Action<IContractsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContractsActionEnums.createContractSuccess]: (
      state: IContractsStateContext,
      action: Action<IContractsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContractsActionEnums.createContractError]: (
      state: IContractsStateContext,
      action: Action<IContractsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContractsActionEnums.updateContractPending]: (
      state: IContractsStateContext,
      action: Action<IContractsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContractsActionEnums.updateContractSuccess]: (
      state: IContractsStateContext,
      action: Action<IContractsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContractsActionEnums.updateContractError]: (
      state: IContractsStateContext,
      action: Action<IContractsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContractsActionEnums.activateContractPending]: (
      state: IContractsStateContext,
      action: Action<IContractsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContractsActionEnums.activateContractSuccess]: (
      state: IContractsStateContext,
      action: Action<IContractsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContractsActionEnums.activateContractError]: (
      state: IContractsStateContext,
      action: Action<IContractsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContractsActionEnums.cancelContractPending]: (
      state: IContractsStateContext,
      action: Action<IContractsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContractsActionEnums.cancelContractSuccess]: (
      state: IContractsStateContext,
      action: Action<IContractsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContractsActionEnums.cancelContractError]: (
      state: IContractsStateContext,
      action: Action<IContractsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContractsActionEnums.deleteContractPending]: (
      state: IContractsStateContext,
      action: Action<IContractsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContractsActionEnums.deleteContractSuccess]: (
      state: IContractsStateContext,
      action: Action<IContractsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContractsActionEnums.deleteContractError]: (
      state: IContractsStateContext,
      action: Action<IContractsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContractsActionEnums.createRenewalPending]: (
      state: IContractsStateContext,
      action: Action<IContractsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContractsActionEnums.createRenewalSuccess]: (
      state: IContractsStateContext,
      action: Action<IContractsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContractsActionEnums.createRenewalError]: (
      state: IContractsStateContext,
      action: Action<IContractsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContractsActionEnums.completeRenewalPending]: (
      state: IContractsStateContext,
      action: Action<IContractsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContractsActionEnums.completeRenewalSuccess]: (
      state: IContractsStateContext,
      action: Action<IContractsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContractsActionEnums.completeRenewalError]: (
      state: IContractsStateContext,
      action: Action<IContractsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContractsActionEnums.clearError]: (
      state: IContractsStateContext,
      action: Action<IContractsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContractsActionEnums.clearContract]: (
      state: IContractsStateContext,
      action: Action<IContractsStateContext>
    ) => ({ ...state, ...action.payload }),
  },
  INITIAL_STATE
);
