"use client";

import { createAction } from "redux-actions";
import type { IDocumentsStateContext, IDocument, IPaginationInfo } from "./context";

// Action enums
export enum DocumentsActionEnums {
  // Get documents
  getDocumentsPending = "GET_DOCUMENTS_PENDING",
  getDocumentsSuccess = "GET_DOCUMENTS_SUCCESS",
  getDocumentsError = "GET_DOCUMENTS_ERROR",

  // Get document
  getDocumentPending = "GET_DOCUMENT_PENDING",
  getDocumentSuccess = "GET_DOCUMENT_SUCCESS",
  getDocumentError = "GET_DOCUMENT_ERROR",

  // Upload document
  uploadDocumentPending = "UPLOAD_DOCUMENT_PENDING",
  uploadDocumentSuccess = "UPLOAD_DOCUMENT_SUCCESS",
  uploadDocumentError = "UPLOAD_DOCUMENT_ERROR",

  // Delete document
  deleteDocumentPending = "DELETE_DOCUMENT_PENDING",
  deleteDocumentSuccess = "DELETE_DOCUMENT_SUCCESS",
  deleteDocumentError = "DELETE_DOCUMENT_ERROR",

  // Utility actions
  clearError = "CLEAR_ERROR",
  clearDocument = "CLEAR_DOCUMENT",
}

// Get Documents Actions
export const getDocumentsPending = createAction<IDocumentsStateContext>(
  DocumentsActionEnums.getDocumentsPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false }),
);

export const getDocumentsSuccess = createAction<
  IDocumentsStateContext,
  { documents: IDocument[]; pagination?: IPaginationInfo }
>(DocumentsActionEnums.getDocumentsSuccess, ({ documents, pagination }) => ({
  isPending: false,
  isLoadingDetails: false,
  isSuccess: true,
  isError: false,
  documents,
  pagination,
}));

export const getDocumentsError = createAction<IDocumentsStateContext, string>(
  DocumentsActionEnums.getDocumentsError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

// Get Document Actions
export const getDocumentPending = createAction<IDocumentsStateContext>(
  DocumentsActionEnums.getDocumentPending,
  () => ({ isPending: false, isLoadingDetails: true, isSuccess: false, isError: false }),
);

export const getDocumentSuccess = createAction<IDocumentsStateContext, { document: IDocument }>(
  DocumentsActionEnums.getDocumentSuccess,
  ({ document }) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
    document,
  }),
);

export const getDocumentError = createAction<IDocumentsStateContext, string>(
  DocumentsActionEnums.getDocumentError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

// Upload Document Actions
export const uploadDocumentPending = createAction<IDocumentsStateContext>(
  DocumentsActionEnums.uploadDocumentPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false }),
);

export const uploadDocumentSuccess = createAction<IDocumentsStateContext>(
  DocumentsActionEnums.uploadDocumentSuccess,
  () => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
  }),
);

export const uploadDocumentError = createAction<IDocumentsStateContext, string>(
  DocumentsActionEnums.uploadDocumentError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

// Delete Document Actions
export const deleteDocumentPending = createAction<IDocumentsStateContext>(
  DocumentsActionEnums.deleteDocumentPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false }),
);

export const deleteDocumentSuccess = createAction<IDocumentsStateContext>(
  DocumentsActionEnums.deleteDocumentSuccess,
  () => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
  }),
);

export const deleteDocumentError = createAction<IDocumentsStateContext, string>(
  DocumentsActionEnums.deleteDocumentError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

// Utility Actions
export const clearError = createAction<IDocumentsStateContext>(
  DocumentsActionEnums.clearError,
  () => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: false,
    errorMessage: undefined,
  }),
);

export const clearDocument = createAction<IDocumentsStateContext>(
  DocumentsActionEnums.clearDocument,
  () => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: false,
    document: undefined,
  }),
);
