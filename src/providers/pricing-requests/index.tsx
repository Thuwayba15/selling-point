"use client";

import type { ReactNode } from "react";
import { useContext, useMemo, useReducer } from "react";
import { getAxiosInstance } from "@/lib/api";

import {
  INITIAL_STATE,
  PricingRequestsStateContext,
  PricingRequestsActionsContext,
  type IPricingRequest,
  type IPricingRequestsActionContext,
} from "./context";

import { pricingRequestsReducer } from "./reducer";
import {
  getPricingRequestsPending,
  getPricingRequestsSuccess,
  getPricingRequestsError,
  getPendingPricingRequestsPending,
  getPendingPricingRequestsSuccess,
  getPendingPricingRequestsError,
  getMyPricingRequestsPending,
  getMyPricingRequestsSuccess,
  getMyPricingRequestsError,
  getPricingRequestPending,
  getPricingRequestSuccess,
  getPricingRequestError,
  createPricingRequestPending,
  createPricingRequestSuccess,
  createPricingRequestError,
  updatePricingRequestPending,
  updatePricingRequestSuccess,
  updatePricingRequestError,
  assignPricingRequestPending,
  assignPricingRequestSuccess,
  assignPricingRequestError,
  completePricingRequestPending,
  completePricingRequestSuccess,
  completePricingRequestError,
  clearError,
  clearPricingRequest,
} from "./actions";

export const PricingRequestsProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(pricingRequestsReducer, INITIAL_STATE);

  const actions = useMemo<IPricingRequestsActionContext>(() => {
    const getPricingRequests = async (params?: {
      status?: number;
      priority?: number;
      assignedToId?: string;
      pageNumber?: number;
      pageSize?: number;
    }) => {
      dispatch(getPricingRequestsPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.get("/api/pricingrequests", { params });

        dispatch(
          getPricingRequestsSuccess({
            pricingRequests: data.items || [],
            pagination: {
              currentPage: data.currentPage ?? data.pageNumber ?? params?.pageNumber ?? 1,
              pageSize: data.pageSize ?? params?.pageSize ?? 10,
              totalCount: data.totalCount ?? 0,
              totalPages: data.totalPages ?? 0,
            },
          }),
        );
      } catch (error: any) {
        const message =
          error?.response?.data?.message || error?.message || "Failed to fetch pricing requests";
        dispatch(getPricingRequestsError(message));
      }
    };

    const getPendingPricingRequests = async (params?: {
      pageNumber?: number;
      pageSize?: number;
    }) => {
      dispatch(getPendingPricingRequestsPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.get("/api/pricingrequests/pending", { params });

        dispatch(
          getPendingPricingRequestsSuccess({
            pricingRequests: data.items || [],
            pagination: {
              currentPage: data.currentPage ?? data.pageNumber ?? params?.pageNumber ?? 1,
              pageSize: data.pageSize ?? params?.pageSize ?? 10,
              totalCount: data.totalCount ?? 0,
              totalPages: data.totalPages ?? 0,
            },
          }),
        );
      } catch (error: any) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch pending pricing requests";
        dispatch(getPendingPricingRequestsError(message));
      }
    };

    const getMyPricingRequests = async (params?: { pageNumber?: number; pageSize?: number }) => {
      dispatch(getMyPricingRequestsPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.get("/api/pricingrequests/my-requests", { params });

        dispatch(
          getMyPricingRequestsSuccess({
            pricingRequests: data.items || [],
            pagination: {
              currentPage: data.currentPage ?? data.pageNumber ?? params?.pageNumber ?? 1,
              pageSize: data.pageSize ?? params?.pageSize ?? 10,
              totalCount: data.totalCount ?? 0,
              totalPages: data.totalPages ?? 0,
            },
          }),
        );
      } catch (error: any) {
        const message =
          error?.response?.data?.message || error?.message || "Failed to fetch my pricing requests";
        dispatch(getMyPricingRequestsError(message));
      }
    };

    const getPricingRequest = async (id: string) => {
      dispatch(getPricingRequestPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.get(`/api/pricingrequests/${id}`);

        dispatch(getPricingRequestSuccess(data));
      } catch (error: any) {
        const message =
          error?.response?.data?.message || error?.message || "Failed to fetch pricing request";
        dispatch(getPricingRequestError(message));
      }
    };

    const createPricingRequest = async (
      pricingRequest: Partial<IPricingRequest>,
    ): Promise<boolean> => {
      dispatch(createPricingRequestPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.post("/api/pricingrequests", pricingRequest);

        dispatch(createPricingRequestSuccess(data));
        return true;
      } catch (error: any) {
        const message =
          error?.response?.data?.message || error?.message || "Failed to create pricing request";
        dispatch(createPricingRequestError(message));
        return false;
      }
    };

    const updatePricingRequest = async (
      id: string,
      pricingRequest: Partial<IPricingRequest>,
    ): Promise<boolean> => {
      dispatch(updatePricingRequestPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.put(`/api/pricingrequests/${id}`, pricingRequest);

        dispatch(updatePricingRequestSuccess(data));
        return true;
      } catch (error: any) {
        const message =
          error?.response?.data?.message || error?.message || "Failed to update pricing request";
        dispatch(updatePricingRequestError(message));
        return false;
      }
    };

    const assignPricingRequest = async (id: string, userId: string): Promise<boolean> => {
      dispatch(assignPricingRequestPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.post(`/api/pricingrequests/${id}/assign`, { userId });

        dispatch(assignPricingRequestSuccess(data));
        return true;
      } catch (error: any) {
        const message =
          error?.response?.data?.message || error?.message || "Failed to assign pricing request";
        dispatch(assignPricingRequestError(message));
        return false;
      }
    };

    const completePricingRequest = async (id: string): Promise<boolean> => {
      dispatch(completePricingRequestPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.put(`/api/pricingrequests/${id}/complete`);

        dispatch(completePricingRequestSuccess(data));
        return true;
      } catch (error: any) {
        const message =
          error?.response?.data?.message || error?.message || "Failed to complete pricing request";
        dispatch(completePricingRequestError(message));
        return false;
      }
    };

    return {
      getPricingRequests,
      getPendingPricingRequests,
      getMyPricingRequests,
      getPricingRequest,
      createPricingRequest,
      updatePricingRequest,
      assignPricingRequest,
      completePricingRequest,
      clearError: () => dispatch(clearError()),
      clearPricingRequest: () => dispatch(clearPricingRequest()),
    };
  }, []);

  return (
    <PricingRequestsStateContext.Provider value={state}>
      <PricingRequestsActionsContext.Provider value={actions}>
        {children}
      </PricingRequestsActionsContext.Provider>
    </PricingRequestsStateContext.Provider>
  );
};

export const usePricingRequestsState = () => {
  const ctx = useContext(PricingRequestsStateContext);
  if (!ctx) throw new Error("usePricingRequestsState must be used within PricingRequestsProvider");
  return ctx;
};

export const usePricingRequestsActions = () => {
  const ctx = useContext(PricingRequestsActionsContext);
  if (!ctx)
    throw new Error("usePricingRequestsActions must be used within PricingRequestsProvider");
  return ctx;
};
