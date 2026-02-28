"use client";

import { useCallback, useState } from "react";
import { getAxiosInstance } from "@/lib/api";
import { IOpportunity } from "@/providers/opportunities/context";
import type { IUser } from "@/providers/users/context";
import type { IProposal } from "@/providers/proposals/context";
import type { IPricingRequest } from "@/providers/pricing-requests/context";
import type { IContract } from "@/providers/contracts/context";
import type { IDocument } from "@/providers/documents/context";
import type { INote } from "@/providers/notes/context";

interface WorkspaceData {
  pricingRequests: IPricingRequest[];
  proposals: IProposal[];
  contracts: IContract[];
  documents: IDocument[];
  notes: INote[];
}

export const useOpportunityWorkspaceData = () => {
  const [workspaceData, setWorkspaceData] = useState<WorkspaceData>({
    pricingRequests: [],
    proposals: [],
    contracts: [],
    documents: [],
    notes: [],
  });
  const [workspaceLoading, setWorkspaceLoading] = useState(false);
  const [assignableUsers, setAssignableUsers] = useState<Array<{ id: string; label: string }>>([]);

  const loadWorkspaceData = useCallback(
    async (selectedOpportunity: IOpportunity | null) => {
      if (!selectedOpportunity?.id) {
        setWorkspaceData({
          pricingRequests: [],
          proposals: [],
          contracts: [],
          documents: [],
          notes: [],
        });
        return;
      }

      setWorkspaceLoading(true);
      try {
        const api = getAxiosInstance();
        const [pricingRequestsRes, proposalsRes, contractsRes, documentsRes, notesRes] =
          await Promise.all([
            // Pricing requests - fetch all and filter by opportunityId
            api
              .get("/api/pricingrequests", {
                params: { pageNumber: 1, pageSize: 100 },
              })
              .catch(() => ({ data: { items: [] } })),
            // Proposals for this opportunity
            api
              .get("/api/proposals", {
                params: { opportunityId: selectedOpportunity.id, pageNumber: 1, pageSize: 100 },
              })
              .catch(() => ({ data: { items: [] } })),
            // Contracts for this opportunity's client
            api
              .get("/api/contracts", {
                params: { clientId: selectedOpportunity.clientId, pageNumber: 1, pageSize: 100 },
              })
              .catch(() => ({ data: { items: [] } })),
            // Documents related to this opportunity (relatedToType=2 for Opportunity)
            api
              .get("/api/documents", {
                params: {
                  relatedToType: 2,
                  relatedToId: selectedOpportunity.id,
                  pageNumber: 1,
                  pageSize: 100,
                },
              })
              .catch(() => ({ data: { items: [] } })),
            // Notes related to this opportunity (relatedToType=2 for Opportunity)
            api
              .get("/api/notes", {
                params: {
                  relatedToType: 2,
                  relatedToId: selectedOpportunity.id,
                  pageNumber: 1,
                  pageSize: 100,
                },
              })
              .catch(() => ({ data: { items: [] } })),
          ]);

        setWorkspaceData({
          pricingRequests: (pricingRequestsRes.data?.items || pricingRequestsRes.data || []).filter(
            (item: IPricingRequest) => item.opportunityId === selectedOpportunity.id
          ) as IPricingRequest[],
          proposals: (proposalsRes.data?.items || proposalsRes.data || []) as IProposal[],
          contracts: (contractsRes.data?.items || contractsRes.data || []) as IContract[],
          documents: (documentsRes.data?.items || documentsRes.data || []) as IDocument[],
          notes: (notesRes.data?.items || notesRes.data || []) as INote[],
        });
      } finally {
        setWorkspaceLoading(false);
      }
    },
    [],
  );

  const loadUsers = useCallback(async () => {
    try {
      const api = getAxiosInstance();
      const { data } = await api.get("/api/users", {
        params: { isActive: true, pageNumber: 1, pageSize: 1000 },
      });
      const users = (data?.items || data || []) as IUser[];
      setAssignableUsers(
        users.map((item) => ({
          id: item.id,
          label:
            item.fullName ||
            `${item.firstName || ""} ${item.lastName || ""}`.trim() ||
            item.email,
        })),
      );
    } catch {
      setAssignableUsers([]);
    }
  }, []);

  const loadContacts = useCallback(
    async (clientId: string | undefined) => {
      if (!clientId) {
        return [];
      }
      try {
        const api = getAxiosInstance();
        const { data } = await api.get("/api/contacts", {
          params: {
            clientId,
            isActive: true,
            pageNumber: 1,
            pageSize: 1000,
          },
        });
        return (data?.items || data || []) as Array<{
          id: string;
          firstName: string;
          lastName: string;
          email: string;
        }>;
      } catch {
        return [];
      }
    },
    [],
  );

  return {
    workspaceData,
    workspaceLoading,
    assignableUsers,
    loadWorkspaceData,
    loadUsers,
    loadContacts,
  };
};
