"use client";

import { createContext } from "react";

export interface IProposalLineItem {
  id: string;
  productServiceName?: string;
  description?: string;
  quantity?: number;
  unitPrice?: number;
  discount?: number;
  taxRate?: number;
  total?: number;
  totalPrice?: number; // API returns this field
}

export interface IProposal {
  id: string;
  title?: string;
  clientId?: string;
  clientName?: string;
  opportunityId?: string;
  opportunityTitle?: string;
  status?: number; // 1=Draft, 2=Submitted, 3=Rejected, 4=Approved
  description?: string;
  currency?: string;
  validUntil?: string;
  subtotal?: number;
  tax?: number;
  totalAmount?: number;
  lineItems?: IProposalLineItem[];
  rejectionReason?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IPaginationInfo {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface IProposalsStateContext {
  isPending: boolean;
  isLoadingDetails: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage?: string;

  proposal?: IProposal;
  proposals?: IProposal[];
  pagination?: IPaginationInfo;
}

export interface IProposalsActionContext {
  getProposals: (params?: {
    status?: number;
    clientId?: string;
    opportunityId?: string;
    pageNumber?: number;
    pageSize?: number;
  }) => Promise<void>;
  getProposal: (id: string) => Promise<void>;
  createProposal: (proposal: ICreateProposalPayload) => Promise<boolean>;
  updateProposal: (id: string, proposal: IUpdateProposalPayload) => Promise<boolean>;
  addLineItem: (proposalId: string, lineItem: Partial<IProposalLineItem>) => Promise<boolean>;
  updateLineItem: (
    proposalId: string,
    lineItemId: string,
    lineItem: Partial<IProposalLineItem>,
  ) => Promise<boolean>;
  deleteLineItem: (proposalId: string, lineItemId: string) => Promise<boolean>;
  submitProposal: (id: string) => Promise<boolean>;
  approveProposal: (id: string) => Promise<boolean>;
  rejectProposal: (id: string, reason: string) => Promise<boolean>;
  deleteProposal: (id: string) => Promise<boolean>;
  clearError: () => void;
  clearProposal: () => void;
}

export const INITIAL_STATE: IProposalsStateContext = {
  isPending: false,
  isLoadingDetails: false,
  isSuccess: false,
  isError: false,
};

export type ICreateProposalPayload = Omit<Partial<IProposal>, "lineItems"> & {
  lineItems?: Array<Partial<IProposalLineItem>>;
};

export type IUpdateProposalPayload = Omit<Partial<IProposal>, "lineItems"> & {
  lineItems?: Array<Partial<IProposalLineItem>>;
};

export const ProposalsStateContext = createContext<IProposalsStateContext>(INITIAL_STATE);
export const ProposalsActionsContext = createContext<IProposalsActionContext | null>(null);
