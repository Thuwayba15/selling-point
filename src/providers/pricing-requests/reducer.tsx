import { handleActions } from "redux-actions";
import type { Action } from "redux-actions";

import { INITIAL_STATE, type IPricingRequestsStateContext } from "./context";
import { PricingRequestsActionEnums } from "./actions";

export const pricingRequestsReducer = handleActions<
  IPricingRequestsStateContext,
  IPricingRequestsStateContext
>(
  {
    [PricingRequestsActionEnums.getPricingRequestsPending]: (
      state: IPricingRequestsStateContext,
      action: Action<IPricingRequestsStateContext>
    ) => ({ ...state, ...action.payload }),

    [PricingRequestsActionEnums.getPricingRequestsSuccess]: (
      state: IPricingRequestsStateContext,
      action: Action<IPricingRequestsStateContext>
    ) => ({ ...state, ...action.payload }),

    [PricingRequestsActionEnums.getPricingRequestsError]: (
      state: IPricingRequestsStateContext,
      action: Action<IPricingRequestsStateContext>
    ) => ({ ...state, ...action.payload }),

    [PricingRequestsActionEnums.getPendingPricingRequestsPending]: (
      state: IPricingRequestsStateContext,
      action: Action<IPricingRequestsStateContext>
    ) => ({ ...state, ...action.payload }),

    [PricingRequestsActionEnums.getPendingPricingRequestsSuccess]: (
      state: IPricingRequestsStateContext,
      action: Action<IPricingRequestsStateContext>
    ) => ({ ...state, ...action.payload }),

    [PricingRequestsActionEnums.getPendingPricingRequestsError]: (
      state: IPricingRequestsStateContext,
      action: Action<IPricingRequestsStateContext>
    ) => ({ ...state, ...action.payload }),

    [PricingRequestsActionEnums.getMyPricingRequestsPending]: (
      state: IPricingRequestsStateContext,
      action: Action<IPricingRequestsStateContext>
    ) => ({ ...state, ...action.payload }),

    [PricingRequestsActionEnums.getMyPricingRequestsSuccess]: (
      state: IPricingRequestsStateContext,
      action: Action<IPricingRequestsStateContext>
    ) => ({ ...state, ...action.payload }),

    [PricingRequestsActionEnums.getMyPricingRequestsError]: (
      state: IPricingRequestsStateContext,
      action: Action<IPricingRequestsStateContext>
    ) => ({ ...state, ...action.payload }),

    [PricingRequestsActionEnums.getPricingRequestPending]: (
      state: IPricingRequestsStateContext,
      action: Action<IPricingRequestsStateContext>
    ) => ({ ...state, ...action.payload }),

    [PricingRequestsActionEnums.getPricingRequestSuccess]: (
      state: IPricingRequestsStateContext,
      action: Action<IPricingRequestsStateContext>
    ) => ({ ...state, ...action.payload }),

    [PricingRequestsActionEnums.getPricingRequestError]: (
      state: IPricingRequestsStateContext,
      action: Action<IPricingRequestsStateContext>
    ) => ({ ...state, ...action.payload }),

    [PricingRequestsActionEnums.createPricingRequestPending]: (
      state: IPricingRequestsStateContext,
      action: Action<IPricingRequestsStateContext>
    ) => ({ ...state, ...action.payload }),

    [PricingRequestsActionEnums.createPricingRequestSuccess]: (
      state: IPricingRequestsStateContext,
      action: Action<IPricingRequestsStateContext>
    ) => ({ ...state, ...action.payload }),

    [PricingRequestsActionEnums.createPricingRequestError]: (
      state: IPricingRequestsStateContext,
      action: Action<IPricingRequestsStateContext>
    ) => ({ ...state, ...action.payload }),

    [PricingRequestsActionEnums.updatePricingRequestPending]: (
      state: IPricingRequestsStateContext,
      action: Action<IPricingRequestsStateContext>
    ) => ({ ...state, ...action.payload }),

    [PricingRequestsActionEnums.updatePricingRequestSuccess]: (
      state: IPricingRequestsStateContext,
      action: Action<IPricingRequestsStateContext>
    ) => ({ ...state, ...action.payload }),

    [PricingRequestsActionEnums.updatePricingRequestError]: (
      state: IPricingRequestsStateContext,
      action: Action<IPricingRequestsStateContext>
    ) => ({ ...state, ...action.payload }),

    [PricingRequestsActionEnums.assignPricingRequestPending]: (
      state: IPricingRequestsStateContext,
      action: Action<IPricingRequestsStateContext>
    ) => ({ ...state, ...action.payload }),

    [PricingRequestsActionEnums.assignPricingRequestSuccess]: (
      state: IPricingRequestsStateContext,
      action: Action<IPricingRequestsStateContext>
    ) => ({ ...state, ...action.payload }),

    [PricingRequestsActionEnums.assignPricingRequestError]: (
      state: IPricingRequestsStateContext,
      action: Action<IPricingRequestsStateContext>
    ) => ({ ...state, ...action.payload }),

    [PricingRequestsActionEnums.completePricingRequestPending]: (
      state: IPricingRequestsStateContext,
      action: Action<IPricingRequestsStateContext>
    ) => ({ ...state, ...action.payload }),

    [PricingRequestsActionEnums.completePricingRequestSuccess]: (
      state: IPricingRequestsStateContext,
      action: Action<IPricingRequestsStateContext>
    ) => ({ ...state, ...action.payload }),

    [PricingRequestsActionEnums.completePricingRequestError]: (
      state: IPricingRequestsStateContext,
      action: Action<IPricingRequestsStateContext>
    ) => ({ ...state, ...action.payload }),

    [PricingRequestsActionEnums.clearError]: (
      state: IPricingRequestsStateContext,
      action: Action<IPricingRequestsStateContext>
    ) => ({ ...state, ...action.payload }),

    [PricingRequestsActionEnums.clearPricingRequest]: (
      state: IPricingRequestsStateContext,
      action: Action<IPricingRequestsStateContext>
    ) => ({ ...state, ...action.payload }),
  },
  INITIAL_STATE
);
