"use client";

import { createContext } from "react";

// Interface for a single client
export interface IClient {
  id: string;
  name: string;
  industry: string;
  clientType: number; // 1=Government, 2=Private, 3=Partner
  companySize?: string;
  website?: string;
  billingAddress?: string;
  taxNumber?: string;
  isActive: boolean;
  createdById?: string;
  createdByName?: string;
  createdAt?: string;
  updatedAt?: string;
  contactsCount?: number;
  opportunitiesCount?: number;
  contractsCount?: number;
}

// Interface for client statistics
export interface IClientStats {
  totalContacts: number;
  totalOpportunities: number;
  totalContracts: number;
  totalContractValue: number;
  activeOpportunities: number;
}

// Interface for pagination info
export interface IPaginationInfo {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

// Interface defining the state shape for our context
export interface IClientsStateContext {
  isPending: boolean;
  isLoadingDetails: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage?: string;

  // Data
  client?: IClient;
  clients?: IClient[];
  clientStats?: IClientStats;
  pagination?: IPaginationInfo;
}

// Interface defining all the actions that can be performed
export interface IClientsActionContext {
  // List operations
  getClients: (params?: {
    searchTerm?: string;
    industry?: string;
    clientType?: number;
    isActive?: boolean;
    pageNumber?: number;
    pageSize?: number;
  }) => Promise<void>;

  // Single client operations
  getClient: (id: string) => Promise<void>;
  getClientStats: (id: string) => Promise<void>;

  // CRUD operations
  createClient: (client: Partial<IClient>) => Promise<void>;
  updateClient: (id: string, client: Partial<IClient>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;

  // State management
  clearError: () => void;
  clearClient: () => void;
}

// Initial state object
export const INITIAL_STATE: IClientsStateContext = {
  isPending: false,
  isLoadingDetails: false,
  isSuccess: false,
  isError: false,
};

// Create contexts
export const ClientsStateContext = createContext<IClientsStateContext>(INITIAL_STATE);
export const ClientsActionContext = createContext<IClientsActionContext | null>(null);
