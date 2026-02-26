'use client';

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
  createProposal: (proposal: Partial<IProposal>) => Promise<boolean>;
  updateProposal: (id: string, proposal: Partial<IProposal>) => Promise<boolean>;
  addLineItem: (proposalId: string, lineItem: Partial<IProposalLineItem>) => Promise<boolean>;
  updateLineItem: (proposalId: string, lineItemId: string, lineItem: Partial<IProposalLineItem>) => Promise<boolean>;
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

export const ProposalsStateContext = createContext<IProposalsStateContext>(INITIAL_STATE);
export const ProposalsActionsContext = createContext<IProposalsActionContext | null>(null);
