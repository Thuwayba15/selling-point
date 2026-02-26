"use client";

import type { ReactNode } from "react";
import { useContext, useMemo, useReducer } from "react";
import { getAxiosInstance } from "@/lib/api";

import {
  INITIAL_STATE,
  ContractsStateContext,
  ContractsActionsContext,
  type IContract,
  type IContractRenewal,
  type IContractsActionContext,
} from "./context";

import { contractsReducer } from "./reducer";
import {
  getContractsPending,
  getContractsSuccess,
  getContractsError,
  getContractPending,
  getContractSuccess,
  getContractError,
  getExpiringContractsPending,
  getExpiringContractsSuccess,
  getExpiringContractsError,
  getClientContractsPending,
  getClientContractsSuccess,
  getClientContractsError,
  createContractPending,
  createContractSuccess,
  createContractError,
  updateContractPending,
  updateContractSuccess,
  updateContractError,
  activateContractPending,
  activateContractSuccess,
  activateContractError,
  cancelContractPending,
  cancelContractSuccess,
  cancelContractError,
  deleteContractPending,
  deleteContractSuccess,
  deleteContractError,
  createRenewalPending,
  createRenewalSuccess,
  createRenewalError,
  completeRenewalPending,
  completeRenewalSuccess,
  completeRenewalError,
  clearError,
  clearContract,
} from "./actions";

export const ContractsProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(contractsReducer, INITIAL_STATE);

  const actions = useMemo<IContractsActionContext>(() => {
    const getContracts = async (params?: {
      clientId?: string;
      status?: number;
      pageNumber?: number;
      pageSize?: number;
    }) => {
      dispatch(getContractsPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.get("/api/contracts", { params });

        dispatch(
          getContractsSuccess({
            contracts: data.items || [],
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
          error?.response?.data?.message || error?.message || "Failed to fetch contracts";
        dispatch(getContractsError(message));
      }
    };

    const getContract = async (id: string) => {
      dispatch(getContractPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.get(`/api/contracts/${id}`);

        dispatch(getContractSuccess(data));
      } catch (error: any) {
        const message =
          error?.response?.data?.message || error?.message || "Failed to fetch contract";
        dispatch(getContractError(message));
      }
    };

    const getExpiringContracts = async (daysUntilExpiry: number = 90) => {
      dispatch(getExpiringContractsPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.get("/api/contracts/expiring", {
          params: { daysUntilExpiry },
        });

        dispatch(
          getExpiringContractsSuccess({
            expiringContracts: Array.isArray(data) ? data : data.items || [],
          }),
        );
      } catch (error: any) {
        const message =
          error?.response?.data?.message || error?.message || "Failed to fetch expiring contracts";
        dispatch(getExpiringContractsError(message));
      }
    };

    const getClientContracts = async (clientId: string) => {
      dispatch(getClientContractsPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.get(`/api/contracts/client/${clientId}`);

        dispatch(
          getClientContractsSuccess({
            contracts: Array.isArray(data) ? data : data.items || [],
          }),
        );
      } catch (error: any) {
        const message =
          error?.response?.data?.message || error?.message || "Failed to fetch client contracts";
        dispatch(getClientContractsError(message));
      }
    };

    const createContract = async (contract: Partial<IContract>): Promise<boolean> => {
      dispatch(createContractPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.post("/api/contracts", contract);

        dispatch(createContractSuccess(data));
        return true;
      } catch (error: any) {
        const message =
          error?.response?.data?.message || error?.message || "Failed to create contract";
        dispatch(createContractError(message));
        return false;
      }
    };

    const updateContract = async (id: string, contract: Partial<IContract>): Promise<boolean> => {
      dispatch(updateContractPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.put(`/api/contracts/${id}`, contract);

        dispatch(updateContractSuccess(data));
        return true;
      } catch (error: any) {
        const message =
          error?.response?.data?.message || error?.message || "Failed to update contract";
        dispatch(updateContractError(message));
        return false;
      }
    };

    const activateContract = async (id: string): Promise<boolean> => {
      dispatch(activateContractPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.put(`/api/contracts/${id}/activate`);

        dispatch(activateContractSuccess(data));
        return true;
      } catch (error: any) {
        const message =
          error?.response?.data?.message || error?.message || "Failed to activate contract";
        dispatch(activateContractError(message));
        return false;
      }
    };

    const cancelContract = async (id: string): Promise<boolean> => {
      dispatch(cancelContractPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.put(`/api/contracts/${id}/cancel`);

        dispatch(cancelContractSuccess(data));
        return true;
      } catch (error: any) {
        const message =
          error?.response?.data?.message || error?.message || "Failed to cancel contract";
        dispatch(cancelContractError(message));
        return false;
      }
    };

    const deleteContract = async (id: string): Promise<boolean> => {
      dispatch(deleteContractPending());

      try {
        const api = getAxiosInstance();
        await api.delete(`/api/contracts/${id}`);

        dispatch(deleteContractSuccess());
        return true;
      } catch (error: any) {
        const message =
          error?.response?.data?.message || error?.message || "Failed to delete contract";
        dispatch(deleteContractError(message));
        return false;
      }
    };

    const createRenewal = async (
      contractId: string,
      renewal: Partial<IContractRenewal>,
    ): Promise<boolean> => {
      dispatch(createRenewalPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.post(`/api/contracts/${contractId}/renewals`, renewal);

        dispatch(createRenewalSuccess(data));
        return true;
      } catch (error: any) {
        const message =
          error?.response?.data?.message || error?.message || "Failed to create renewal";
        dispatch(createRenewalError(message));
        return false;
      }
    };

    const completeRenewal = async (renewalId: string): Promise<boolean> => {
      dispatch(completeRenewalPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.put(`/api/contracts/renewals/${renewalId}/complete`);

        dispatch(completeRenewalSuccess(data));
        return true;
      } catch (error: any) {
        const message =
          error?.response?.data?.message || error?.message || "Failed to complete renewal";
        dispatch(completeRenewalError(message));
        return false;
      }
    };

    return {
      getContracts,
      getContract,
      getExpiringContracts,
      getClientContracts,
      createContract,
      updateContract,
      activateContract,
      cancelContract,
      deleteContract,
      createRenewal,
      completeRenewal,
      clearError: () => dispatch(clearError()),
      clearContract: () => dispatch(clearContract()),
    };
  }, []);

  return (
    <ContractsStateContext.Provider value={state}>
      <ContractsActionsContext.Provider value={actions}>
        {children}
      </ContractsActionsContext.Provider>
    </ContractsStateContext.Provider>
  );
};

export const useContractsState = () => {
  const ctx = useContext(ContractsStateContext);
  if (!ctx) throw new Error("useContractsState must be used within ContractsProvider");
  return ctx;
};

export const useContractsActions = () => {
  const ctx = useContext(ContractsActionsContext);
  if (!ctx) throw new Error("useContractsActions must be used within ContractsProvider");
  return ctx;
};
