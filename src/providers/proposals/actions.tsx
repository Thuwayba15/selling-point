import { createAction } from "redux-actions";
import {
  IProposal,
  IProposalsStateContext,
  IPaginationInfo,
} from "./context";

export enum ProposalsActionEnums {
  getProposalsPending = "GET_PROPOSALS_PENDING",
  getProposalsSuccess = "GET_PROPOSALS_SUCCESS",
  getProposalsError = "GET_PROPOSALS_ERROR",

  getProposalPending = "GET_PROPOSAL_PENDING",
  getProposalSuccess = "GET_PROPOSAL_SUCCESS",
  getProposalError = "GET_PROPOSAL_ERROR",

  createProposalPending = "CREATE_PROPOSAL_PENDING",
  createProposalSuccess = "CREATE_PROPOSAL_SUCCESS",
  createProposalError = "CREATE_PROPOSAL_ERROR",

  updateProposalPending = "UPDATE_PROPOSAL_PENDING",
  updateProposalSuccess = "UPDATE_PROPOSAL_SUCCESS",
  updateProposalError = "UPDATE_PROPOSAL_ERROR",

  addLineItemPending = "ADD_LINE_ITEM_PENDING",
  addLineItemSuccess = "ADD_LINE_ITEM_SUCCESS",
  addLineItemError = "ADD_LINE_ITEM_ERROR",

  updateLineItemPending = "UPDATE_LINE_ITEM_PENDING",
  updateLineItemSuccess = "UPDATE_LINE_ITEM_SUCCESS",
  updateLineItemError = "UPDATE_LINE_ITEM_ERROR",

  deleteLineItemPending = "DELETE_LINE_ITEM_PENDING",
  deleteLineItemSuccess = "DELETE_LINE_ITEM_SUCCESS",
  deleteLineItemError = "DELETE_LINE_ITEM_ERROR",

  submitProposalPending = "SUBMIT_PROPOSAL_PENDING",
  submitProposalSuccess = "SUBMIT_PROPOSAL_SUCCESS",
  submitProposalError = "SUBMIT_PROPOSAL_ERROR",

  approveProposalPending = "APPROVE_PROPOSAL_PENDING",
  approveProposalSuccess = "APPROVE_PROPOSAL_SUCCESS",
  approveProposalError = "APPROVE_PROPOSAL_ERROR",

  rejectProposalPending = "REJECT_PROPOSAL_PENDING",
  rejectProposalSuccess = "REJECT_PROPOSAL_SUCCESS",
  rejectProposalError = "REJECT_PROPOSAL_ERROR",

  deleteProposalPending = "DELETE_PROPOSAL_PENDING",
  deleteProposalSuccess = "DELETE_PROPOSAL_SUCCESS",
  deleteProposalError = "DELETE_PROPOSAL_ERROR",

  clearError = "CLEAR_ERROR",
  clearProposal = "CLEAR_PROPOSAL",
}

// Get Proposals
export const getProposalsPending = createAction<IProposalsStateContext>(
  ProposalsActionEnums.getProposalsPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false })
);

export const getProposalsSuccess = createAction<
  IProposalsStateContext,
  { proposals: IProposal[]; pagination?: IPaginationInfo }
>(ProposalsActionEnums.getProposalsSuccess, ({ proposals, pagination }) => ({
  isPending: false,
  isLoadingDetails: false,
  isSuccess: true,
  isError: false,
  proposals,
  pagination,
}));

export const getProposalsError = createAction<IProposalsStateContext, string>(
  ProposalsActionEnums.getProposalsError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  })
);

// Get Single Proposal
export const getProposalPending = createAction<IProposalsStateContext>(
  ProposalsActionEnums.getProposalPending,
  () => ({ isPending: false, isLoadingDetails: true, isSuccess: false, isError: false })
);

export const getProposalSuccess = createAction<IProposalsStateContext, IProposal>(
  ProposalsActionEnums.getProposalSuccess,
  (proposal: IProposal) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
    proposal,
  })
);

export const getProposalError = createAction<IProposalsStateContext, string>(
  ProposalsActionEnums.getProposalError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  })
);

// Create Proposal
export const createProposalPending = createAction<IProposalsStateContext>(
  ProposalsActionEnums.createProposalPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false })
);

export const createProposalSuccess = createAction<IProposalsStateContext, IProposal>(
  ProposalsActionEnums.createProposalSuccess,
  (proposal: IProposal) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
    proposal,
  })
);

export const createProposalError = createAction<IProposalsStateContext, string>(
  ProposalsActionEnums.createProposalError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  })
);

// Update Proposal
export const updateProposalPending = createAction<IProposalsStateContext>(
  ProposalsActionEnums.updateProposalPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false })
);

export const updateProposalSuccess = createAction<IProposalsStateContext, IProposal>(
  ProposalsActionEnums.updateProposalSuccess,
  (proposal: IProposal) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
    proposal,
  })
);

export const updateProposalError = createAction<IProposalsStateContext, string>(
  ProposalsActionEnums.updateProposalError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  })
);

// Add Line Item
export const addLineItemPending = createAction<IProposalsStateContext>(
  ProposalsActionEnums.addLineItemPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false })
);

export const addLineItemSuccess = createAction<IProposalsStateContext, IProposal>(
  ProposalsActionEnums.addLineItemSuccess,
  (proposal: IProposal) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
    proposal,
  })
);

export const addLineItemError = createAction<IProposalsStateContext, string>(
  ProposalsActionEnums.addLineItemError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  })
);

// Update Line Item
export const updateLineItemPending = createAction<IProposalsStateContext>(
  ProposalsActionEnums.updateLineItemPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false })
);

export const updateLineItemSuccess = createAction<IProposalsStateContext, IProposal>(
  ProposalsActionEnums.updateLineItemSuccess,
  (proposal: IProposal) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
    proposal,
  })
);

export const updateLineItemError = createAction<IProposalsStateContext, string>(
  ProposalsActionEnums.updateLineItemError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  })
);

// Delete Line Item
export const deleteLineItemPending = createAction<IProposalsStateContext>(
  ProposalsActionEnums.deleteLineItemPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false })
);

export const deleteLineItemSuccess = createAction<IProposalsStateContext, IProposal>(
  ProposalsActionEnums.deleteLineItemSuccess,
  (proposal: IProposal) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
    proposal,
  })
);

export const deleteLineItemError = createAction<IProposalsStateContext, string>(
  ProposalsActionEnums.deleteLineItemError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  })
);

// Submit Proposal
export const submitProposalPending = createAction<IProposalsStateContext>(
  ProposalsActionEnums.submitProposalPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false })
);

export const submitProposalSuccess = createAction<IProposalsStateContext, IProposal>(
  ProposalsActionEnums.submitProposalSuccess,
  (proposal: IProposal) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
    proposal,
  })
);

export const submitProposalError = createAction<IProposalsStateContext, string>(
  ProposalsActionEnums.submitProposalError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  })
);

// Approve Proposal
export const approveProposalPending = createAction<IProposalsStateContext>(
  ProposalsActionEnums.approveProposalPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false })
);

export const approveProposalSuccess = createAction<IProposalsStateContext, IProposal>(
  ProposalsActionEnums.approveProposalSuccess,
  (proposal: IProposal) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
    proposal,
  })
);

export const approveProposalError = createAction<IProposalsStateContext, string>(
  ProposalsActionEnums.approveProposalError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  })
);

// Reject Proposal
export const rejectProposalPending = createAction<IProposalsStateContext>(
  ProposalsActionEnums.rejectProposalPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false })
);

export const rejectProposalSuccess = createAction<IProposalsStateContext, IProposal>(
  ProposalsActionEnums.rejectProposalSuccess,
  (proposal: IProposal) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
    proposal,
  })
);

export const rejectProposalError = createAction<IProposalsStateContext, string>(
  ProposalsActionEnums.rejectProposalError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  })
);

// Delete Proposal
export const deleteProposalPending = createAction<IProposalsStateContext>(
  ProposalsActionEnums.deleteProposalPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false })
);

export const deleteProposalSuccess = createAction<IProposalsStateContext>(
  ProposalsActionEnums.deleteProposalSuccess,
  () => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
    proposal: undefined,
  })
);

export const deleteProposalError = createAction<IProposalsStateContext, string>(
  ProposalsActionEnums.deleteProposalError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  })
);

// Clear Error
export const clearError = createAction<IProposalsStateContext>(
  ProposalsActionEnums.clearError,
  () => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: false,
    errorMessage: undefined,
  })
);

// Clear Proposal
export const clearProposal = createAction<IProposalsStateContext>(
  ProposalsActionEnums.clearProposal,
  () => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: false,
    proposal: undefined,
  })
);
