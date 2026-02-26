'use client';

import { createContext } from "react";

export interface IContractRenewal {
  id: string;
  contractId?: string;
  renewalDate?: string;
  newEndDate?: string;
  status?: number; // 1=Pending, 2=Completed
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IContract {
  id: string;
  clientId?: string;
  clientName?: string;
  contractNumber?: string;
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status?: number; // 1=Draft, 2=Active, 3=Expired, 4=Renewed, 5=Cancelled
  contractValue?: number;
  currency?: string;
  terms?: string;
  renewalNoticePeriod?: number;
  isExpiringSoon?: boolean;
  daysUntilExpiry?: number;
  renewals?: IContractRenewal[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IPaginationInfo {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface IContractsStateContext {
  isPending: boolean;
  isLoadingDetails: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage?: string;

  contract?: IContract;
  contracts?: IContract[];
  expiringContracts?: IContract[];
  pagination?: IPaginationInfo;
}

export interface IContractsActionContext {
  getContracts: (params?: {
    clientId?: string;
    status?: number;
    pageNumber?: number;
    pageSize?: number;
  }) => Promise<void>;
  getContract: (id: string) => Promise<void>;
  getExpiringContracts: (daysUntilExpiry?: number) => Promise<void>;
  getClientContracts: (clientId: string) => Promise<void>;
  createContract: (contract: Partial<IContract>) => Promise<boolean>;
  updateContract: (id: string, contract: Partial<IContract>) => Promise<boolean>;
  activateContract: (id: string) => Promise<boolean>;
  cancelContract: (id: string) => Promise<boolean>;
  deleteContract: (id: string) => Promise<boolean>;
  createRenewal: (contractId: string, renewal: Partial<IContractRenewal>) => Promise<boolean>;
  completeRenewal: (renewalId: string) => Promise<boolean>;
  clearError: () => void;
  clearContract: () => void;
}

export const INITIAL_STATE: IContractsStateContext = {
  isPending: false,
  isLoadingDetails: false,
  isSuccess: false,
  isError: false,
};

export const ContractsStateContext = createContext<IContractsStateContext>(
  INITIAL_STATE
);

export const ContractsActionsContext = createContext<
  IContractsActionContext | undefined
>(undefined);
