"use client";

import { useCallback, useState } from "react";
import { getAxiosInstance } from "@/lib/api";
import { useOpportunitiesActions } from "@/providers/opportunities";
import { IOpportunity } from "@/providers/opportunities/context";
import type { IUser } from "@/providers/users/context";

interface WorkspaceData {
  activities: Array<{ id: string; title: string; subtitle?: string }>;
  pricingRequests: Array<{ id: string; title: string; subtitle?: string }>;
  proposals: Array<{ id: string; title: string; subtitle?: string }>;
  contracts: Array<{ id: string; title: string; subtitle?: string }>;
  documents: Array<{ id: string; title: string; subtitle?: string }>;
  notes: Array<{ id: string; title: string; subtitle?: string }>;
}

export const useOpportunityWorkspaceData = () => {
  const [workspaceData, setWorkspaceData] = useState<WorkspaceData>({
    activities: [],
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
          activities: [],
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
        const [activitiesRes, pricingRequestsRes, proposalsRes, contractsRes, documentsRes, notesRes] =
          await Promise.all([
            api
              .get("/api/activities", {
                params: {
                  relatedToType: 2,
                  relatedToId: selectedOpportunity.id,
                  pageNumber: 1,
                  pageSize: 10,
                },
              })
              .catch(() => ({ data: { items: [] } })),
            api
              .get("/api/pricingrequests", {
                params: { pageNumber: 1, pageSize: 100 },
              })
              .catch(() => ({ data: { items: [] } })),
            api
              .get("/api/proposals", {
                params: { opportunityId: selectedOpportunity.id, pageNumber: 1, pageSize: 10 },
              })
              .catch(() => ({ data: { items: [] } })),
            api
              .get("/api/contracts", {
                params: { clientId: selectedOpportunity.clientId, pageNumber: 1, pageSize: 10 },
              })
              .catch(() => ({ data: { items: [] } })),
            api
              .get("/api/documents", {
                params: {
                  relatedToType: 2,
                  relatedToId: selectedOpportunity.id,
                  pageNumber: 1,
                  pageSize: 10,
                },
              })
              .catch(() => ({ data: { items: [] } })),
            api
              .get("/api/notes", {
                params: {
                  relatedToType: 2,
                  relatedToId: selectedOpportunity.id,
                  pageNumber: 1,
                  pageSize: 10,
                },
              })
              .catch(() => ({ data: { items: [] } })),
          ]);

        setWorkspaceData({
          activities: (activitiesRes.data?.items || activitiesRes.data || []).map(
            (item: { id: string; title?: string; typeName?: string; statusName?: string }) => ({
              id: item.id,
              title: item.title || item.typeName || "Activity",
              subtitle: item.statusName,
            }),
          ),
          pricingRequests: (pricingRequestsRes.data?.items || pricingRequestsRes.data || [])
            .filter((item: { opportunityId?: string }) => item.opportunityId === selectedOpportunity.id)
            .map((item: { id: string; title?: string; statusName?: string }) => ({
              id: item.id,
              title: item.title || "Pricing Request",
              subtitle: item.statusName,
            })),
          proposals: (proposalsRes.data?.items || proposalsRes.data || []).map(
            (item: { id: string; title?: string; statusName?: string }) => ({
              id: item.id,
              title: item.title || "Proposal",
              subtitle: item.statusName,
            }),
          ),
          contracts: (contractsRes.data?.items || contractsRes.data || []).map(
            (item: { id: string; contractNumber?: string; statusName?: string }) => ({
              id: item.id,
              title: item.contractNumber || "Contract",
              subtitle: item.statusName,
            }),
          ),
          documents: (documentsRes.data?.items || documentsRes.data || []).map(
            (item: { id: string; fileName?: string; categoryName?: string }) => ({
              id: item.id,
              title: item.fileName || "Document",
              subtitle: item.categoryName,
            }),
          ),
          notes: (notesRes.data?.items || notesRes.data || []).map(
            (item: { id: string; content?: string; createdByName?: string }) => ({
              id: item.id,
              title: item.content || "Note",
              subtitle: item.createdByName,
            }),
          ),
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
