"use client";

import { useCallback, useState, useEffect, useRef } from "react";
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
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const lastFetchTime = useRef<number>(0);

  const fetchWorkspaceData = useCallback(async (client: IClient | null, forceRefresh = false) => {
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

    // Skip if we fetched recently (within 30 seconds) unless force refresh
    const now = Date.now();
    if (!forceRefresh && now - lastFetchTime.current < 30000) {
      console.log('Skipping fetch - using cached data');
      return; // Use cached data
    }

    console.log('Fetching workspace data for client:', client.id, 'forceRefresh:', forceRefresh);
    lastFetchTime.current = now;
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

      const newWorkspaceData = {
        contacts: contactsRes.data?.items || [],
        opportunities: opportunitiesRes.data?.items || [],
        contracts: contractsRes.data?.items || [],
        documents: documentsRes.data?.items || [],
        notes: notesRes.data?.items || [],
      };
      
      console.log('Workspace data fetched:', {
        contacts: newWorkspaceData.contacts.length,
        opportunities: newWorkspaceData.opportunities.length,
        contracts: newWorkspaceData.contracts.length,
        documents: newWorkspaceData.documents.length,
        notes: newWorkspaceData.notes.length,
      });
      
      setWorkspaceData(newWorkspaceData);
    } catch (error) {
      console.error("Failed to fetch workspace data:", error);
    } finally {
      setWorkspaceLoading(false);
    }
  }, []);

  // Force refresh function
  const forceRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Auto-refresh when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger > 0) {
      // This will trigger a refresh on the next fetchWorkspaceData call
      lastFetchTime.current = 0;
    }
  }, [refreshTrigger]);

  return { workspaceData, workspaceLoading, fetchWorkspaceData, forceRefresh };
};
