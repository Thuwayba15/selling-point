"use client";

import { useCallback, useState } from "react";
import { getAxiosInstance } from "@/lib/api";
import type { IClient } from "@/providers/clients/context";
import type { IContact } from "@/providers/contacts/context";
import type { IOpportunity } from "@/providers/opportunities/context";
import type { IContract } from "@/providers/contracts/context";
import type { IDocument } from "@/providers/documents/context";
import type { INote } from "@/providers/notes/context";

interface WorkspaceData {
  contacts: IContact[];
  opportunities: IOpportunity[];
  contracts: IContract[];
  documents: IDocument[];
  notes: INote[];
}

export const useClientWorkspaceData = () => {
  const [workspaceData, setWorkspaceData] = useState<WorkspaceData>({
    contacts: [],
    opportunities: [],
    contracts: [],
    documents: [],
    notes: [],
  });
  const [workspaceLoading, setWorkspaceLoading] = useState(false);

  const loadWorkspaceData = useCallback(async (client: IClient | null) => {
    if (!client?.id) {
      setWorkspaceData({
        contacts: [],
        opportunities: [],
        contracts: [],
        documents: [],
        notes: [],
      });
      return;
    }

    setWorkspaceLoading(true);
    try {
      const api = getAxiosInstance();
      const [contactsRes, opportunitiesRes, contractsRes, documentsRes, notesRes] =
        await Promise.all([
          // Contacts for this client
          api
            .get("/api/contacts", {
              params: { clientId: client.id, pageNumber: 1, pageSize: 100 },
            })
            .catch(() => ({ data: { items: [] } })),
          // Opportunities for this client
          api
            .get("/api/opportunities", {
              params: { clientId: client.id, pageNumber: 1, pageSize: 100 },
            })
            .catch(() => ({ data: { items: [] } })),
          // Contracts for this client
          api
            .get("/api/contracts", {
              params: { clientId: client.id, pageNumber: 1, pageSize: 100 },
            })
            .catch(() => ({ data: { items: [] } })),
          // Documents related to this client (relatedToType=1 for Client)
          api
            .get("/api/documents", {
              params: {
                relatedToType: 1,
                relatedToId: client.id,
                pageNumber: 1,
                pageSize: 100,
              },
            })
            .catch(() => ({ data: { items: [] } })),
          // Notes related to this client (relatedToType=1 for Client)
          api
            .get("/api/notes", {
              params: {
                relatedToType: 1,
                relatedToId: client.id,
                pageNumber: 1,
                pageSize: 100,
              },
            })
            .catch(() => ({ data: { items: [] } })),
        ]);

      setWorkspaceData({
        contacts: (contactsRes.data?.items || contactsRes.data || []) as IContact[],
        opportunities: (opportunitiesRes.data?.items || opportunitiesRes.data || []) as IOpportunity[],
        contracts: (contractsRes.data?.items || contractsRes.data || []) as IContract[],
        documents: (documentsRes.data?.items || documentsRes.data || []) as IDocument[],
        notes: (notesRes.data?.items || notesRes.data || []) as INote[],
      });
    } catch (error) {
      console.error("Error loading workspace data:", error);
      setWorkspaceData({
        contacts: [],
        opportunities: [],
        contracts: [],
        documents: [],
        notes: [],
      });
    } finally {
      setWorkspaceLoading(false);
    }
  }, []);

  return {
    workspaceData,
    workspaceLoading,
    loadWorkspaceData,
  };
};
