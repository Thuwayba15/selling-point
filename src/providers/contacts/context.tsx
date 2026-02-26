'use client';

import { createContext } from "react";

// Interface for a single contact
export interface IContact {
  id: string;
  clientId: string;
  clientName?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  position?: string;
  isPrimaryContact: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Interface for pagination info
export interface IPaginationInfo {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

// Interface defining the state shape for our context
export interface IContactsStateContext {
  isPending: boolean;
  isLoadingDetails: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage?: string;

  // Data
  contact?: IContact;
  contacts?: IContact[];
  pagination?: IPaginationInfo;
}

// Interface defining action methods available to consumers
export interface IContactsActionContext {
  getContacts: (params?: {
    clientId?: string;
    searchTerm?: string;
    pageNumber?: number;
    pageSize?: number;
  }) => Promise<void>;
  getContactsByClient: (clientId: string) => Promise<void>;
  getContact: (id: string) => Promise<void>;
  createContact: (contact: Omit<IContact, "id" | "createdAt" | "updatedAt" | "clientName">) => Promise<boolean>;
  updateContact: (id: string, contact: Partial<IContact>) => Promise<boolean>;
  setPrimaryContact: (id: string) => Promise<boolean>;
  deleteContact: (id: string) => Promise<boolean>;
  clearError: () => void;
  clearContact: () => void;
}

// Initial state
export const INITIAL_STATE: IContactsStateContext = {
  isPending: false,
  isLoadingDetails: false,
  isSuccess: false,
  isError: false,
};

// Create contexts
export const ContactsStateContext = createContext<IContactsStateContext>(INITIAL_STATE);
export const ContactsActionsContext = createContext<IContactsActionContext | undefined>(undefined);
