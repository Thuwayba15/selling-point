"use client";

import { createContext } from "react";

export interface IPricingRequest {
  id: string;
  opportunityId?: string;
  opportunityTitle?: string;
  clientId?: string;
  clientName?: string;
  requestedByName?: string;
  assignedToId?: string;
  assignedToName?: string;
  status?: number; // 1=Pending, 2=InProgress, 3=Completed
  priority?: number; // 1=Low, 2=Medium, 3=High, 4=Urgent
  description?: string;
  requiredByDate?: string;
  estimatedValue?: number;
  currency?: string;
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

export interface IPricingRequestsStateContext {
  isPending: boolean;
  isLoadingDetails: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage?: string;

  pricingRequest?: IPricingRequest;
  pricingRequests?: IPricingRequest[];
  pagination?: IPaginationInfo;
}

export interface IPricingRequestsActionContext {
  getPricingRequests: (params?: {
    status?: number;
    priority?: number;
    assignedToId?: string;
    pageNumber?: number;
    pageSize?: number;
  }) => Promise<void>;
  getPendingPricingRequests: (params?: { pageNumber?: number; pageSize?: number }) => Promise<void>;
  getMyPricingRequests: (params?: { pageNumber?: number; pageSize?: number }) => Promise<void>;
  getPricingRequest: (id: string) => Promise<void>;
  createPricingRequest: (pricingRequest: Partial<IPricingRequest>) => Promise<boolean>;
  updatePricingRequest: (id: string, pricingRequest: Partial<IPricingRequest>) => Promise<boolean>;
  assignPricingRequest: (id: string, userId: string) => Promise<boolean>;
  completePricingRequest: (id: string) => Promise<boolean>;
  clearError: () => void;
  clearPricingRequest: () => void;
}

export const INITIAL_STATE: IPricingRequestsStateContext = {
  isPending: false,
  isLoadingDetails: false,
  isSuccess: false,
  isError: false,
};

export const PricingRequestsStateContext =
  createContext<IPricingRequestsStateContext>(INITIAL_STATE);
export const PricingRequestsActionsContext = createContext<IPricingRequestsActionContext | null>(
  null,
);
