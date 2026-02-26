import { createAction } from "redux-actions";
import {
  IContract,
  IContractRenewal,
  IContractsStateContext,
  IPaginationInfo,
} from "./context";

export enum ContractsActionEnums {
  getContractsPending = "GET_CONTRACTS_PENDING",
  getContractsSuccess = "GET_CONTRACTS_SUCCESS",
  getContractsError = "GET_CONTRACTS_ERROR",

  getContractPending = "GET_CONTRACT_PENDING",
  getContractSuccess = "GET_CONTRACT_SUCCESS",
  getContractError = "GET_CONTRACT_ERROR",

  getExpiringContractsPending = "GET_EXPIRING_CONTRACTS_PENDING",
  getExpiringContractsSuccess = "GET_EXPIRING_CONTRACTS_SUCCESS",
  getExpiringContractsError = "GET_EXPIRING_CONTRACTS_ERROR",

  getClientContractsPending = "GET_CLIENT_CONTRACTS_PENDING",
  getClientContractsSuccess = "GET_CLIENT_CONTRACTS_SUCCESS",
  getClientContractsError = "GET_CLIENT_CONTRACTS_ERROR",

  createContractPending = "CREATE_CONTRACT_PENDING",
  createContractSuccess = "CREATE_CONTRACT_SUCCESS",
  createContractError = "CREATE_CONTRACT_ERROR",

  updateContractPending = "UPDATE_CONTRACT_PENDING",
  updateContractSuccess = "UPDATE_CONTRACT_SUCCESS",
  updateContractError = "UPDATE_CONTRACT_ERROR",

  activateContractPending = "ACTIVATE_CONTRACT_PENDING",
  activateContractSuccess = "ACTIVATE_CONTRACT_SUCCESS",
  activateContractError = "ACTIVATE_CONTRACT_ERROR",

  cancelContractPending = "CANCEL_CONTRACT_PENDING",
  cancelContractSuccess = "CANCEL_CONTRACT_SUCCESS",
  cancelContractError = "CANCEL_CONTRACT_ERROR",

  deleteContractPending = "DELETE_CONTRACT_PENDING",
  deleteContractSuccess = "DELETE_CONTRACT_SUCCESS",
  deleteContractError = "DELETE_CONTRACT_ERROR",

  createRenewalPending = "CREATE_RENEWAL_PENDING",
  createRenewalSuccess = "CREATE_RENEWAL_SUCCESS",
  createRenewalError = "CREATE_RENEWAL_ERROR",

  completeRenewalPending = "COMPLETE_RENEWAL_PENDING",
  completeRenewalSuccess = "COMPLETE_RENEWAL_SUCCESS",
  completeRenewalError = "COMPLETE_RENEWAL_ERROR",

  clearError = "CLEAR_ERROR",
  clearContract = "CLEAR_CONTRACT",
}

// Get Contracts
export const getContractsPending = createAction<IContractsStateContext>(
  ContractsActionEnums.getContractsPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false })
);

export const getContractsSuccess = createAction<
  IContractsStateContext,
  { contracts: IContract[]; pagination?: IPaginationInfo }
>(ContractsActionEnums.getContractsSuccess, ({ contracts, pagination }) => ({
  isPending: false,
  isLoadingDetails: false,
  isSuccess: true,
  isError: false,
  contracts,
  pagination,
}));

export const getContractsError = createAction<IContractsStateContext, string>(
  ContractsActionEnums.getContractsError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  })
);

// Get Single Contract
export const getContractPending = createAction<IContractsStateContext>(
  ContractsActionEnums.getContractPending,
  () => ({ isPending: false, isLoadingDetails: true, isSuccess: false, isError: false })
);

export const getContractSuccess = createAction<IContractsStateContext, IContract>(
  ContractsActionEnums.getContractSuccess,
  (contract: IContract) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
    contract,
  })
);

export const getContractError = createAction<IContractsStateContext, string>(
  ContractsActionEnums.getContractError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  })
);

// Get Expiring Contracts
export const getExpiringContractsPending = createAction<IContractsStateContext>(
  ContractsActionEnums.getExpiringContractsPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false })
);

export const getExpiringContractsSuccess = createAction<
  IContractsStateContext,
  { expiringContracts: IContract[] }
>(ContractsActionEnums.getExpiringContractsSuccess, ({ expiringContracts }) => ({
  isPending: false,
  isLoadingDetails: false,
  isSuccess: true,
  isError: false,
  expiringContracts,
}));

export const getExpiringContractsError = createAction<IContractsStateContext, string>(
  ContractsActionEnums.getExpiringContractsError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  })
);

// Get Client Contracts
export const getClientContractsPending = createAction<IContractsStateContext>(
  ContractsActionEnums.getClientContractsPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false })
);

export const getClientContractsSuccess = createAction<
  IContractsStateContext,
  { contracts: IContract[] }
>(ContractsActionEnums.getClientContractsSuccess, ({ contracts }) => ({
  isPending: false,
  isLoadingDetails: false,
  isSuccess: true,
  isError: false,
  contracts,
}));

export const getClientContractsError = createAction<IContractsStateContext, string>(
  ContractsActionEnums.getClientContractsError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  })
);

// Create Contract
export const createContractPending = createAction<IContractsStateContext>(
  ContractsActionEnums.createContractPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false })
);

export const createContractSuccess = createAction<IContractsStateContext, IContract>(
  ContractsActionEnums.createContractSuccess,
  (contract: IContract) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
    contract,
  })
);

export const createContractError = createAction<IContractsStateContext, string>(
  ContractsActionEnums.createContractError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  })
);

// Update Contract
export const updateContractPending = createAction<IContractsStateContext>(
  ContractsActionEnums.updateContractPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false })
);

export const updateContractSuccess = createAction<IContractsStateContext, IContract>(
  ContractsActionEnums.updateContractSuccess,
  (contract: IContract) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
    contract,
  })
);

export const updateContractError = createAction<IContractsStateContext, string>(
  ContractsActionEnums.updateContractError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  })
);

// Activate Contract
export const activateContractPending = createAction<IContractsStateContext>(
  ContractsActionEnums.activateContractPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false })
);

export const activateContractSuccess = createAction<IContractsStateContext, IContract>(
  ContractsActionEnums.activateContractSuccess,
  (contract: IContract) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
    contract,
  })
);

export const activateContractError = createAction<IContractsStateContext, string>(
  ContractsActionEnums.activateContractError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  })
);

// Cancel Contract
export const cancelContractPending = createAction<IContractsStateContext>(
  ContractsActionEnums.cancelContractPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false })
);

export const cancelContractSuccess = createAction<IContractsStateContext, IContract>(
  ContractsActionEnums.cancelContractSuccess,
  (contract: IContract) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
    contract,
  })
);

export const cancelContractError = createAction<IContractsStateContext, string>(
  ContractsActionEnums.cancelContractError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  })
);

// Delete Contract
export const deleteContractPending = createAction<IContractsStateContext>(
  ContractsActionEnums.deleteContractPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false })
);

export const deleteContractSuccess = createAction<IContractsStateContext>(
  ContractsActionEnums.deleteContractSuccess,
  () => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
  })
);

export const deleteContractError = createAction<IContractsStateContext, string>(
  ContractsActionEnums.deleteContractError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  })
);

// Create Renewal
export const createRenewalPending = createAction<IContractsStateContext>(
  ContractsActionEnums.createRenewalPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false })
);

export const createRenewalSuccess = createAction<IContractsStateContext, IContractRenewal>(
  ContractsActionEnums.createRenewalSuccess,
  (renewal: IContractRenewal) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
  })
);

export const createRenewalError = createAction<IContractsStateContext, string>(
  ContractsActionEnums.createRenewalError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  })
);

// Complete Renewal
export const completeRenewalPending = createAction<IContractsStateContext>(
  ContractsActionEnums.completeRenewalPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false })
);

export const completeRenewalSuccess = createAction<IContractsStateContext, IContractRenewal>(
  ContractsActionEnums.completeRenewalSuccess,
  (renewal: IContractRenewal) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
  })
);

export const completeRenewalError = createAction<IContractsStateContext, string>(
  ContractsActionEnums.completeRenewalError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  })
);

// Clear
export const clearError = createAction<IContractsStateContext>(
  ContractsActionEnums.clearError,
  () => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: false,
    errorMessage: undefined,
  })
);

export const clearContract = createAction<IContractsStateContext>(
  ContractsActionEnums.clearContract,
  () => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: false,
    contract: undefined,
  })
);
