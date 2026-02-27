"use client";

import type { ReactNode } from "react";
import { useContext, useMemo, useReducer } from "react";
import { getAxiosInstance } from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";

import {
  INITIAL_STATE,
  ProposalsStateContext,
  ProposalsActionsContext,
  type IProposal,
  type IProposalLineItem,
  type IProposalsActionContext,
} from "./context";

import { proposalsReducer } from "./reducer";
import {
  getProposalsPending,
  getProposalsSuccess,
  getProposalsError,
  getProposalPending,
  getProposalSuccess,
  getProposalError,
  createProposalPending,
  createProposalSuccess,
  createProposalError,
  updateProposalPending,
  updateProposalSuccess,
  updateProposalError,
  addLineItemPending,
  addLineItemSuccess,
  addLineItemError,
  updateLineItemPending,
  updateLineItemSuccess,
  updateLineItemError,
  deleteLineItemPending,
  deleteLineItemSuccess,
  deleteLineItemError,
  submitProposalPending,
  submitProposalSuccess,
  submitProposalError,
  approveProposalPending,
  approveProposalSuccess,
  approveProposalError,
  rejectProposalPending,
  rejectProposalSuccess,
  rejectProposalError,
  deleteProposalPending,
  deleteProposalSuccess,
  deleteProposalError,
  clearError,
  clearProposal,
} from "./actions";

export const ProposalsProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(proposalsReducer, INITIAL_STATE);

  const actions = useMemo<IProposalsActionContext>(() => {
    const getProposals = async (params?: {
      status?: number;
      clientId?: string;
      opportunityId?: string;
      pageNumber?: number;
      pageSize?: number;
    }) => {
      dispatch(getProposalsPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.get("/api/proposals", { params });

        dispatch(
          getProposalsSuccess({
            proposals: data.items || [],
            pagination: {
              currentPage: data.currentPage ?? data.pageNumber ?? params?.pageNumber ?? 1,
              pageSize: data.pageSize ?? params?.pageSize ?? 10,
              totalCount: data.totalCount ?? 0,
              totalPages: data.totalPages ?? 0,
            },
          }),
        );
      } catch (error: unknown) {
        const message = getErrorMessage(error, "Failed to fetch proposals");
        dispatch(getProposalsError(message));
      }
    };

    const getProposal = async (id: string) => {
      dispatch(getProposalPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.get(`/api/proposals/${id}`);

        dispatch(getProposalSuccess(data));
      } catch (error: unknown) {
        const message = getErrorMessage(error, "Failed to fetch proposal");
        dispatch(getProposalError(message));
      }
    };

    const createProposal = async (proposal: Partial<IProposal>): Promise<boolean> => {
      dispatch(createProposalPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.post("/api/proposals", proposal);

        dispatch(createProposalSuccess(data));
        return true;
      } catch (error: unknown) {
        const message = getErrorMessage(error, "Failed to create proposal");
        dispatch(createProposalError(message));
        return false;
      }
    };

    const updateProposal = async (id: string, proposal: Partial<IProposal>): Promise<boolean> => {
      dispatch(updateProposalPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.put(`/api/proposals/${id}`, proposal);

        dispatch(updateProposalSuccess(data));
        return true;
      } catch (error: unknown) {
        const message = getErrorMessage(error, "Failed to update proposal");
        dispatch(updateProposalError(message));
        return false;
      }
    };

    const addLineItem = async (
      proposalId: string,
      lineItem: Partial<IProposalLineItem>,
    ): Promise<boolean> => {
      dispatch(addLineItemPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.post(`/api/proposals/${proposalId}/line-items`, lineItem);

        dispatch(addLineItemSuccess(data));
        return true;
      } catch (error: unknown) {
        const message = getErrorMessage(error, "Failed to add line item");
        dispatch(addLineItemError(message));
        return false;
      }
    };

    const updateLineItem = async (
      proposalId: string,
      lineItemId: string,
      lineItem: Partial<IProposalLineItem>,
    ): Promise<boolean> => {
      dispatch(updateLineItemPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.put(
          `/api/proposals/${proposalId}/line-items/${lineItemId}`,
          lineItem,
        );

        dispatch(updateLineItemSuccess(data));
        return true;
      } catch (error: unknown) {
        const message = getErrorMessage(error, "Failed to update line item");
        dispatch(updateLineItemError(message));
        return false;
      }
    };

    const deleteLineItem = async (proposalId: string, lineItemId: string): Promise<boolean> => {
      dispatch(deleteLineItemPending());

      try {
        const api = getAxiosInstance();
        await api.delete(`/api/proposals/${proposalId}/line-items/${lineItemId}`);

        dispatch(deleteLineItemSuccess({ id: proposalId } as IProposal));
        return true;
      } catch (error: unknown) {
        const message = getErrorMessage(error, "Failed to delete line item");
        dispatch(deleteLineItemError(message));
        return false;
      }
    };

    const submitProposal = async (id: string): Promise<boolean> => {
      dispatch(submitProposalPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.put(`/api/proposals/${id}/submit`);

        dispatch(submitProposalSuccess(data));
        return true;
      } catch (error: unknown) {
        const message = getErrorMessage(error, "Failed to submit proposal");
        dispatch(submitProposalError(message));
        return false;
      }
    };

    const approveProposal = async (id: string): Promise<boolean> => {
      dispatch(approveProposalPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.put(`/api/proposals/${id}/approve`);

        dispatch(approveProposalSuccess(data));
        return true;
      } catch (error: unknown) {
        const message = getErrorMessage(error, "Failed to approve proposal");
        dispatch(approveProposalError(message));
        return false;
      }
    };

    const rejectProposal = async (id: string, reason: string): Promise<boolean> => {
      dispatch(rejectProposalPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.put(`/api/proposals/${id}/reject`, { reason });

        dispatch(rejectProposalSuccess(data));
        return true;
      } catch (error: unknown) {
        const message = getErrorMessage(error, "Failed to reject proposal");
        dispatch(rejectProposalError(message));
        return false;
      }
    };

    const deleteProposal = async (id: string): Promise<boolean> => {
      dispatch(deleteProposalPending());

      try {
        const api = getAxiosInstance();
        await api.delete(`/api/proposals/${id}`);

        dispatch(deleteProposalSuccess());
        return true;
      } catch (error: unknown) {
        const message = getErrorMessage(error, "Failed to delete proposal");
        dispatch(deleteProposalError(message));
        return false;
      }
    };

    return {
      getProposals,
      getProposal,
      createProposal,
      updateProposal,
      addLineItem,
      updateLineItem,
      deleteLineItem,
      submitProposal,
      approveProposal,
      rejectProposal,
      deleteProposal,
      clearError: () => dispatch(clearError()),
      clearProposal: () => dispatch(clearProposal()),
    };
  }, []);

  return (
    <ProposalsStateContext.Provider value={state}>
      <ProposalsActionsContext.Provider value={actions}>
        {children}
      </ProposalsActionsContext.Provider>
    </ProposalsStateContext.Provider>
  );
};

export const useProposalsState = () => {
  const ctx = useContext(ProposalsStateContext);
  if (!ctx) throw new Error("useProposalsState must be used within ProposalsProvider");
  return ctx;
};

export const useProposalsActions = () => {
  const ctx = useContext(ProposalsActionsContext);
  if (!ctx) throw new Error("useProposalsActions must be used within ProposalsProvider");
  return ctx;
};
