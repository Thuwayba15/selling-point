"use client";

import { createContext } from "react";

// Enums from API documentation
export enum DocumentCategory {
  Proposal = 1,
  Contract = 2,
  Presentation = 3,
  RFP = 4,
  Other = 5,
}

export enum RelatedToType {
  Client = 1,
  Opportunity = 2,
  Proposal = 3,
  Contract = 4,
}

// Interface for a single document
export interface IDocument {
  id: string;
  fileName: string;
  originalFileName?: string;
  fileSize?: number;
  contentType?: string;
  category: DocumentCategory;
  categoryName?: string;
  relatedToType: RelatedToType;
  relatedToTypeName?: string;
  relatedToId: string;
  relatedToName?: string;
  description?: string;
  filePath?: string;
  uploadedById?: string;
  uploadedByName?: string;
  uploadedAt?: string;
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
export interface IDocumentsStateContext {
  isPending: boolean;
  isLoadingDetails: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage?: string;

  document?: IDocument;
  documents?: IDocument[];
  pagination?: IPaginationInfo;
}

// Interface defining all the actions that can be performed
export interface IDocumentsActionContext {
  getDocuments: (params?: {
    relatedToType?: RelatedToType;
    relatedToId?: string;
    category?: DocumentCategory;
    pageNumber?: number;
    pageSize?: number;
  }) => Promise<void>;
  getDocument: (id: string) => Promise<void>;
  uploadDocument: (
    file: File,
    data: {
      category: DocumentCategory;
      relatedToType: RelatedToType;
      relatedToId: string;
      description?: string;
    },
  ) => Promise<boolean>;
  downloadDocument: (id: string, fileName: string) => Promise<void>;
  deleteDocument: (id: string) => Promise<boolean>;
  clearError: () => void;
  clearDocument: () => void;
}

// Initial state object
export const INITIAL_STATE: IDocumentsStateContext = {
  isPending: false,
  isLoadingDetails: false,
  isSuccess: false,
  isError: false,
};

// Create contexts
export const DocumentsStateContext = createContext<IDocumentsStateContext>(INITIAL_STATE);
export const DocumentsActionsContext = createContext<IDocumentsActionContext | null>(null);
