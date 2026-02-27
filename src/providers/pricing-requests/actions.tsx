import { createAction } from "redux-actions";
import { IPricingRequest, IPricingRequestsStateContext, IPaginationInfo } from "./context";

export enum PricingRequestsActionEnums {
  getPricingRequestsPending = "GET_PRICING_REQUESTS_PENDING",
  getPricingRequestsSuccess = "GET_PRICING_REQUESTS_SUCCESS",
  getPricingRequestsError = "GET_PRICING_REQUESTS_ERROR",

  getPendingPricingRequestsPending = "GET_PENDING_PRICING_REQUESTS_PENDING",
  getPendingPricingRequestsSuccess = "GET_PENDING_PRICING_REQUESTS_SUCCESS",
  getPendingPricingRequestsError = "GET_PENDING_PRICING_REQUESTS_ERROR",

  getMyPricingRequestsPending = "GET_MY_PRICING_REQUESTS_PENDING",
  getMyPricingRequestsSuccess = "GET_MY_PRICING_REQUESTS_SUCCESS",
  getMyPricingRequestsError = "GET_MY_PRICING_REQUESTS_ERROR",

  getPricingRequestPending = "GET_PRICING_REQUEST_PENDING",
  getPricingRequestSuccess = "GET_PRICING_REQUEST_SUCCESS",
  getPricingRequestError = "GET_PRICING_REQUEST_ERROR",

  createPricingRequestPending = "CREATE_PRICING_REQUEST_PENDING",
  createPricingRequestSuccess = "CREATE_PRICING_REQUEST_SUCCESS",
  createPricingRequestError = "CREATE_PRICING_REQUEST_ERROR",

  updatePricingRequestPending = "UPDATE_PRICING_REQUEST_PENDING",
  updatePricingRequestSuccess = "UPDATE_PRICING_REQUEST_SUCCESS",
  updatePricingRequestError = "UPDATE_PRICING_REQUEST_ERROR",

  assignPricingRequestPending = "ASSIGN_PRICING_REQUEST_PENDING",
  assignPricingRequestSuccess = "ASSIGN_PRICING_REQUEST_SUCCESS",
  assignPricingRequestError = "ASSIGN_PRICING_REQUEST_ERROR",

  completePricingRequestPending = "COMPLETE_PRICING_REQUEST_PENDING",
  completePricingRequestSuccess = "COMPLETE_PRICING_REQUEST_SUCCESS",
  completePricingRequestError = "COMPLETE_PRICING_REQUEST_ERROR",

  clearError = "CLEAR_ERROR",
  clearPricingRequest = "CLEAR_PRICING_REQUEST",
}

// Get Pricing Requests
export const getPricingRequestsPending = createAction<IPricingRequestsStateContext>(
  PricingRequestsActionEnums.getPricingRequestsPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false }),
);

export const getPricingRequestsSuccess = createAction<
  IPricingRequestsStateContext,
  { pricingRequests: IPricingRequest[]; pagination?: IPaginationInfo }
>(PricingRequestsActionEnums.getPricingRequestsSuccess, ({ pricingRequests, pagination }) => ({
  isPending: false,
  isLoadingDetails: false,
  isSuccess: true,
  isError: false,
  pricingRequests,
  pagination,
}));

export const getPricingRequestsError = createAction<IPricingRequestsStateContext, string>(
  PricingRequestsActionEnums.getPricingRequestsError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

// Get Pending Pricing Requests
export const getPendingPricingRequestsPending = createAction<IPricingRequestsStateContext>(
  PricingRequestsActionEnums.getPendingPricingRequestsPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false }),
);

export const getPendingPricingRequestsSuccess = createAction<
  IPricingRequestsStateContext,
  { pricingRequests: IPricingRequest[]; pagination?: IPaginationInfo }
>(
  PricingRequestsActionEnums.getPendingPricingRequestsSuccess,
  ({ pricingRequests, pagination }) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
    pricingRequests,
    pagination,
  }),
);

export const getPendingPricingRequestsError = createAction<IPricingRequestsStateContext, string>(
  PricingRequestsActionEnums.getPendingPricingRequestsError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

// Get My Pricing Requests
export const getMyPricingRequestsPending = createAction<IPricingRequestsStateContext>(
  PricingRequestsActionEnums.getMyPricingRequestsPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false }),
);

export const getMyPricingRequestsSuccess = createAction<
  IPricingRequestsStateContext,
  { pricingRequests: IPricingRequest[]; pagination?: IPaginationInfo }
>(PricingRequestsActionEnums.getMyPricingRequestsSuccess, ({ pricingRequests, pagination }) => ({
  isPending: false,
  isLoadingDetails: false,
  isSuccess: true,
  isError: false,
  pricingRequests,
  pagination,
}));

export const getMyPricingRequestsError = createAction<IPricingRequestsStateContext, string>(
  PricingRequestsActionEnums.getMyPricingRequestsError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

// Get Single Pricing Request
export const getPricingRequestPending = createAction<IPricingRequestsStateContext>(
  PricingRequestsActionEnums.getPricingRequestPending,
  () => ({ isPending: false, isLoadingDetails: true, isSuccess: false, isError: false }),
);

export const getPricingRequestSuccess = createAction<IPricingRequestsStateContext, IPricingRequest>(
  PricingRequestsActionEnums.getPricingRequestSuccess,
  (pricingRequest: IPricingRequest) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
    pricingRequest,
  }),
);

export const getPricingRequestError = createAction<IPricingRequestsStateContext, string>(
  PricingRequestsActionEnums.getPricingRequestError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

// Create Pricing Request
export const createPricingRequestPending = createAction<IPricingRequestsStateContext>(
  PricingRequestsActionEnums.createPricingRequestPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false }),
);

export const createPricingRequestSuccess = createAction<
  IPricingRequestsStateContext,
  IPricingRequest
>(PricingRequestsActionEnums.createPricingRequestSuccess, (pricingRequest: IPricingRequest) => ({
  isPending: false,
  isLoadingDetails: false,
  isSuccess: true,
  isError: false,
  pricingRequest,
}));

export const createPricingRequestError = createAction<IPricingRequestsStateContext, string>(
  PricingRequestsActionEnums.createPricingRequestError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

// Update Pricing Request
export const updatePricingRequestPending = createAction<IPricingRequestsStateContext>(
  PricingRequestsActionEnums.updatePricingRequestPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false }),
);

export const updatePricingRequestSuccess = createAction<
  IPricingRequestsStateContext,
  IPricingRequest
>(PricingRequestsActionEnums.updatePricingRequestSuccess, (pricingRequest: IPricingRequest) => ({
  isPending: false,
  isLoadingDetails: false,
  isSuccess: true,
  isError: false,
  pricingRequest,
}));

export const updatePricingRequestError = createAction<IPricingRequestsStateContext, string>(
  PricingRequestsActionEnums.updatePricingRequestError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

// Assign Pricing Request
export const assignPricingRequestPending = createAction<IPricingRequestsStateContext>(
  PricingRequestsActionEnums.assignPricingRequestPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false }),
);

export const assignPricingRequestSuccess = createAction<
  IPricingRequestsStateContext,
  IPricingRequest
>(PricingRequestsActionEnums.assignPricingRequestSuccess, (pricingRequest: IPricingRequest) => ({
  isPending: false,
  isLoadingDetails: false,
  isSuccess: true,
  isError: false,
  pricingRequest,
}));

export const assignPricingRequestError = createAction<IPricingRequestsStateContext, string>(
  PricingRequestsActionEnums.assignPricingRequestError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

// Complete Pricing Request
export const completePricingRequestPending = createAction<IPricingRequestsStateContext>(
  PricingRequestsActionEnums.completePricingRequestPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false }),
);

export const completePricingRequestSuccess = createAction<
  IPricingRequestsStateContext,
  IPricingRequest
>(PricingRequestsActionEnums.completePricingRequestSuccess, (pricingRequest: IPricingRequest) => ({
  isPending: false,
  isLoadingDetails: false,
  isSuccess: true,
  isError: false,
  pricingRequest,
}));

export const completePricingRequestError = createAction<IPricingRequestsStateContext, string>(
  PricingRequestsActionEnums.completePricingRequestError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

// Clear Error
export const clearError = createAction<IPricingRequestsStateContext>(
  PricingRequestsActionEnums.clearError,
  () => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: false,
    errorMessage: undefined,
  }),
);

// Clear Pricing Request
export const clearPricingRequest = createAction<IPricingRequestsStateContext>(
  PricingRequestsActionEnums.clearPricingRequest,
  () => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: false,
    pricingRequest: undefined,
  }),
);
