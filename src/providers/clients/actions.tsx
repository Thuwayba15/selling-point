import { createAction } from "redux-actions";
import { IClient, IClientsStateContext, IClientStats, IPaginationInfo } from "./context";

// Enum defining the type of actions that can be dispatched
export enum ClientsActionEnums {
  // Get all clients
  getClientsPending = "GET_CLIENTS_PENDING",
  getClientsSuccess = "GET_CLIENTS_SUCCESS",
  getClientsError = "GET_CLIENTS_ERROR",

  // Get single client
  getClientPending = "GET_CLIENT_PENDING",
  getClientSuccess = "GET_CLIENT_SUCCESS",
  getClientError = "GET_CLIENT_ERROR",

  // Get client stats
  getClientStatsPending = "GET_CLIENT_STATS_PENDING",
  getClientStatsSuccess = "GET_CLIENT_STATS_SUCCESS",
  getClientStatsError = "GET_CLIENT_STATS_ERROR",

  // Create client
  createClientPending = "CREATE_CLIENT_PENDING",
  createClientSuccess = "CREATE_CLIENT_SUCCESS",
  createClientError = "CREATE_CLIENT_ERROR",

  // Update client
  updateClientPending = "UPDATE_CLIENT_PENDING",
  updateClientSuccess = "UPDATE_CLIENT_SUCCESS",
  updateClientError = "UPDATE_CLIENT_ERROR",

  // Delete client
  deleteClientPending = "DELETE_CLIENT_PENDING",
  deleteClientSuccess = "DELETE_CLIENT_SUCCESS",
  deleteClientError = "DELETE_CLIENT_ERROR",

  // Utility actions
  clearError = "CLEAR_ERROR",
  clearClient = "CLEAR_CLIENT",
}

// ============================================================================
// Get Clients Actions
// ============================================================================
export const getClientsPending = createAction<IClientsStateContext>(
  ClientsActionEnums.getClientsPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false }),
);

export const getClientsSuccess = createAction<
  IClientsStateContext,
  { clients: IClient[]; pagination?: IPaginationInfo }
>(ClientsActionEnums.getClientsSuccess, ({ clients, pagination }) => ({
  isPending: false,
  isLoadingDetails: false,
  isSuccess: true,
  isError: false,
  clients,
  pagination,
}));

export const getClientsError = createAction<IClientsStateContext, string>(
  ClientsActionEnums.getClientsError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

// ============================================================================
// Get Single Client Actions
// ============================================================================
export const getClientPending = createAction<IClientsStateContext>(
  ClientsActionEnums.getClientPending,
  () => ({ isPending: false, isLoadingDetails: true, isSuccess: false, isError: false }),
);

export const getClientSuccess = createAction<IClientsStateContext, IClient>(
  ClientsActionEnums.getClientSuccess,
  (client: IClient) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
    client,
  }),
);

export const getClientError = createAction<IClientsStateContext, string>(
  ClientsActionEnums.getClientError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

// ============================================================================
// Get Client Stats Actions
// ============================================================================
export const getClientStatsPending = createAction<IClientsStateContext>(
  ClientsActionEnums.getClientStatsPending,
  () => ({ isPending: false, isLoadingDetails: true, isSuccess: false, isError: false }),
);

export const getClientStatsSuccess = createAction<IClientsStateContext, IClientStats>(
  ClientsActionEnums.getClientStatsSuccess,
  (clientStats: IClientStats) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
    clientStats,
  }),
);

export const getClientStatsError = createAction<IClientsStateContext, string>(
  ClientsActionEnums.getClientStatsError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

// ============================================================================
// Create Client Actions
// ============================================================================
export const createClientPending = createAction<IClientsStateContext>(
  ClientsActionEnums.createClientPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false }),
);

export const createClientSuccess = createAction<IClientsStateContext, IClient>(
  ClientsActionEnums.createClientSuccess,
  (client: IClient) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
    client,
  }),
);

export const createClientError = createAction<IClientsStateContext, string>(
  ClientsActionEnums.createClientError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

// ============================================================================
// Update Client Actions
// ============================================================================
export const updateClientPending = createAction<IClientsStateContext>(
  ClientsActionEnums.updateClientPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false }),
);

export const updateClientSuccess = createAction<IClientsStateContext, IClient>(
  ClientsActionEnums.updateClientSuccess,
  (client: IClient) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
    client,
  }),
);

export const updateClientError = createAction<IClientsStateContext, string>(
  ClientsActionEnums.updateClientError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

// ============================================================================
// Delete Client Actions
// ============================================================================
export const deleteClientPending = createAction<IClientsStateContext>(
  ClientsActionEnums.deleteClientPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false }),
);

export const deleteClientSuccess = createAction<IClientsStateContext>(
  ClientsActionEnums.deleteClientSuccess,
  () => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
    client: undefined,
  }),
);

export const deleteClientError = createAction<IClientsStateContext, string>(
  ClientsActionEnums.deleteClientError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

// ============================================================================
// Utility Actions
// ============================================================================
export const clearError = createAction<IClientsStateContext>(ClientsActionEnums.clearError, () => ({
  isPending: false,
  isLoadingDetails: false,
  isSuccess: false,
  isError: false,
  errorMessage: undefined,
}));

export const clearClient = createAction<IClientsStateContext>(
  ClientsActionEnums.clearClient,
  () => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: false,
    client: undefined,
    clientStats: undefined,
  }),
);
