"use client";

import { useContext, useReducer, useMemo } from "react";
import axios from "axios";
import { getAxiosInstance, TOKEN_STORAGE_KEY } from "@/lib/api";
import { storage } from "@/lib/storage";
import { getErrorMessage } from "@/lib/errors";
import {
  INITIAL_STATE,
  DocumentsStateContext,
  DocumentsActionsContext,
  type IDocument,
  type DocumentCategory,
  type RelatedToType,
} from "./context";
import { DocumentsReducer } from "./reducer";
import {
  getDocumentsPending,
  getDocumentsSuccess,
  getDocumentsError,
  getDocumentPending,
  getDocumentSuccess,
  getDocumentError,
  uploadDocumentPending,
  uploadDocumentSuccess,
  uploadDocumentError,
  deleteDocumentPending,
  deleteDocumentSuccess,
  deleteDocumentError,
  clearError as clearErrorAction,
  clearDocument as clearDocumentAction,
} from "./actions";

export const DocumentsProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(DocumentsReducer, INITIAL_STATE);

  const actions = useMemo(() => {
    const getDocuments = async (params?: {
      relatedToType?: RelatedToType;
      relatedToId?: string;
      category?: DocumentCategory;
      pageNumber?: number;
      pageSize?: number;
    }) => {
      dispatch(getDocumentsPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.get("/api/documents", { params });

        dispatch(
          getDocumentsSuccess({
            documents: data.items || [],
            pagination: {
              currentPage: data.pageNumber || 1,
              pageSize: data.pageSize || 10,
              totalCount: data.totalCount || 0,
              totalPages: data.totalPages || 0,
            },
          }),
        );
      } catch (error: unknown) {
        const message = getErrorMessage(error, "Failed to fetch documents");
        dispatch(getDocumentsError(message));
      }
    };

    const getDocument = async (id: string) => {
      dispatch(getDocumentPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.get(`/api/documents/${id}`);

        dispatch(getDocumentSuccess({ document: data }));
      } catch (error: unknown) {
        const message = getErrorMessage(error, "Failed to fetch document");
        dispatch(getDocumentError(message));
      }
    };

    const uploadDocument = async (
      file: File,
      data: {
        category: DocumentCategory;
        relatedToType: RelatedToType;
        relatedToId: string;
        description?: string;
      },
    ): Promise<boolean> => {
      dispatch(uploadDocumentPending());

      try {
        const api = getAxiosInstance();

        // Create a clean File object (Ant Design mutates the original by adding uid property)
        const cleanFile = new File([file], file.name, {
          type: file.type,
          lastModified: file.lastModified,
        });

        const formData = new FormData();
        // API expects PascalCase field names per swagger.md (not lowercase as in docs.md)
        formData.append("File", cleanFile);
        formData.append("Category", data.category.toString());
        formData.append("RelatedToType", data.relatedToType.toString());
        formData.append("RelatedToId", data.relatedToId);
        if (data.description) {
          formData.append("Description", data.description);
        }

        // Use axios directly (not the instance) to avoid Content-Type: application/json default header
        const token = storage.get(TOKEN_STORAGE_KEY);
        const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axios.post(`${baseURL}/api/documents/upload`, formData, {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        });

        dispatch(uploadDocumentSuccess());
        return true;
      } catch (error: unknown) {
        const message = getErrorMessage(error, "Failed to upload document");
        if (error && typeof error === "object" && "response" in error) {
          const axiosError = error as any;
        }
        dispatch(uploadDocumentError(message));
        return false;
      }
    };

    const downloadDocument = async (id: string, fileName: string) => {
      try {
        const api = getAxiosInstance();
        const response = await api.get(`/api/documents/${id}/download`, {
          responseType: "blob",
        });

        // Create a blob URL and trigger download
        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error: unknown) {
        const message = getErrorMessage(error, "Failed to download document");
        dispatch(getDocumentsError(message));
      }
    };

    const deleteDocument = async (id: string): Promise<boolean> => {
      dispatch(deleteDocumentPending());

      try {
        const api = getAxiosInstance();
        await api.delete(`/api/documents/${id}`);

        dispatch(deleteDocumentSuccess());
        return true;
      } catch (error: unknown) {
        const message = getErrorMessage(error, "Failed to delete document");
        dispatch(deleteDocumentError(message));
        return false;
      }
    };

    const clearError = () => {
      dispatch(clearErrorAction());
    };

    const clearDocument = () => {
      dispatch(clearDocumentAction());
    };

    return {
      getDocuments,
      getDocument,
      uploadDocument,
      downloadDocument,
      deleteDocument,
      clearError,
      clearDocument,
    };
  }, []);

  return (
    <DocumentsStateContext.Provider value={state}>
      <DocumentsActionsContext.Provider value={actions}>
        {children}
      </DocumentsActionsContext.Provider>
    </DocumentsStateContext.Provider>
  );
};

// Custom Hooks
export const useDocumentsState = () => {
  const context = useContext(DocumentsStateContext);
  if (!context) {
    throw new Error("useDocumentsState must be used within a DocumentsProvider");
  }
  return context;
};

export const useDocumentsActions = () => {
  const context = useContext(DocumentsActionsContext);
  if (!context) {
    throw new Error("useDocumentsActions must be used within a DocumentsProvider");
  }
  return context;
};
