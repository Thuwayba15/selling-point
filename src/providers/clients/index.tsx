"use client";

import { useContext, useReducer } from "react";
import { getAxiosInstance } from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";
import { INITIAL_STATE, IClient, ClientsActionContext, ClientsStateContext } from "./context";
import { ClientsReducer } from "./reducer";
import {
  getClientsPending,
  getClientsSuccess,
  getClientsError,
  getClientPending,
  getClientSuccess,
  getClientError,
  getClientStatsPending,
  getClientStatsSuccess,
  getClientStatsError,
  createClientPending,
  createClientSuccess,
  createClientError,
  updateClientPending,
  updateClientSuccess,
  updateClientError,
  deleteClientPending,
  deleteClientSuccess,
  deleteClientError,
  clearError as clearErrorAction,
  clearClient as clearClientAction,
} from "./actions";

export const ClientsProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(ClientsReducer, INITIAL_STATE);
  const api = getAxiosInstance();

  // ============================================================================
  // Get Clients (with filters)
  // GET /api/clients
  // ============================================================================
  const getClients = async (params?: {
    searchTerm?: string;
    industry?: string;
    clientType?: number;
    isActive?: boolean;
    pageNumber?: number;
    pageSize?: number;
  }) => {
    dispatch(getClientsPending());
    try {
      // Add isDeleted=false to filter out soft-deleted clients
      const response = await api.get("/api/clients", {
        params: { ...params, isDeleted: false },
      });
      const data = response.data;
      dispatch(
        getClientsSuccess({
          clients: data.items || data,
          pagination: {
            currentPage: data.currentPage ?? data.pageNumber ?? params?.pageNumber ?? 1,
            pageSize: data.pageSize ?? params?.pageSize ?? 10,
            totalCount: data.totalCount ?? 0,
            totalPages: data.totalPages ?? 0,
          },
        }),
      );
    } catch (error: unknown) {
      console.error("Error fetching clients:", error);
      dispatch(getClientsError(getErrorMessage(error, "Failed to fetch clients")));
    }
  };

  // ============================================================================
  // Get Single Client
  // GET /api/clients/{id}
  // ============================================================================
  const getClient = async (id: string) => {
    dispatch(getClientPending());
    try {
      const response = await api.get(`/api/clients/${id}`);
      dispatch(getClientSuccess(response.data));
    } catch (error: unknown) {
      console.error("Error fetching client:", error);
      dispatch(getClientError(getErrorMessage(error, "Failed to fetch client")));
    }
  };

  // ============================================================================
  // Get Client Stats
  // GET /api/clients/{id}/stats
  // ============================================================================
  const getClientStats = async (id: string) => {
    dispatch(getClientStatsPending());
    try {
      const response = await api.get(`/api/clients/${id}/stats`);
      dispatch(getClientStatsSuccess(response.data));
    } catch (error: unknown) {
      console.error("Error fetching client stats:", error);
      dispatch(
        getClientStatsError(getErrorMessage(error, "Failed to fetch client stats")),
      );
    }
  };

  // ============================================================================
  // Create Client
  // POST /api/clients
  // ============================================================================
  const createClient = async (client: Partial<IClient>) => {
    dispatch(createClientPending());
    try {
      const response = await api.post("/api/clients", client);
      dispatch(createClientSuccess(response.data));
    } catch (error: unknown) {
      console.error("Error creating client:", error);
      dispatch(createClientError(getErrorMessage(error, "Failed to create client")));
    }
  };

  // ============================================================================
  // Update Client
  // PUT /api/clients/{id}
  // ============================================================================
  const updateClient = async (id: string, client: Partial<IClient>) => {
    dispatch(updateClientPending());
    try {
      const response = await api.put(`/api/clients/${id}`, client);
      dispatch(updateClientSuccess(response.data));
    } catch (error: unknown) {
      console.error("Error updating client:", error);
      dispatch(updateClientError(getErrorMessage(error, "Failed to update client")));
    }
  };

  // ============================================================================
  // Delete Client
  // DELETE /api/clients/{id}
  // ============================================================================
  const deleteClient = async (id: string) => {
    dispatch(deleteClientPending());
    try {
      await api.delete(`/api/clients/${id}`);
      dispatch(deleteClientSuccess());
    } catch (error: unknown) {
      console.error("Error deleting client:", error);
      dispatch(deleteClientError(getErrorMessage(error, "Failed to delete client")));
    }
  };

  // ============================================================================
  // Utility Actions
  // ============================================================================
  const clearError = () => {
    dispatch(clearErrorAction());
  };

  const clearClient = () => {
    dispatch(clearClientAction());
  };

  return (
    <ClientsStateContext.Provider value={state}>
      <ClientsActionContext.Provider
        value={{
          getClients,
          getClient,
          getClientStats,
          createClient,
          updateClient,
          deleteClient,
          clearError,
          clearClient,
        }}
      >
        {children}
      </ClientsActionContext.Provider>
    </ClientsStateContext.Provider>
  );
};

// ============================================================================
// Custom Hooks
// ============================================================================
export const useClientsState = () => {
  const context = useContext(ClientsStateContext);
  if (!context) {
    throw new Error("useClientsState must be used within a ClientsProvider");
  }
  return context;
};

export const useClientsActions = () => {
  const context = useContext(ClientsActionContext);
  if (!context) {
    throw new Error("useClientsActions must be used within a ClientsProvider");
  }
  return context;
};
