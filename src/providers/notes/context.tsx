"use client";

import { createContext } from "react";

// Enum from API documentation
export enum RelatedToType {
  Client = 1,
  Opportunity = 2,
  Proposal = 3,
  Contract = 4,
  Activity = 5,
}

// Interface for a single note
export interface INote {
  id: string;
  content?: string;
  relatedToType: RelatedToType;
  relatedToId: string;
  isPrivate?: boolean;
  createdById?: string;
  createdByName?: string;
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
export interface INotesStateContext {
  isPending: boolean;
  isLoadingDetails: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage?: string;

  note?: INote;
  notes?: INote[];
  pagination?: IPaginationInfo;
}

// Interface defining all the actions that can be performed
export interface INotesActionContext {
  getNotes: (params?: {
    relatedToType?: RelatedToType;
    relatedToId?: string;
    pageNumber?: number;
    pageSize?: number;
  }) => Promise<void>;

  getNote: (id: string) => Promise<void>;
  createNote: (note: Partial<INote>) => Promise<boolean>;
  updateNote: (id: string, note: Partial<INote>) => Promise<boolean>;
  deleteNote: (id: string) => Promise<boolean>;

  clearError: () => void;
  clearNote: () => void;
}

// Initial state
export const INITIAL_STATE: INotesStateContext = {
  isPending: false,
  isLoadingDetails: false,
  isSuccess: false,
  isError: false,
};

// Create contexts
export const NotesStateContext = createContext<INotesStateContext>(INITIAL_STATE);
export const NotesActionContext = createContext<INotesActionContext | undefined>(undefined);
