"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Modal, Form, App } from "antd";
import { withAuthGuard } from "@/hoc/withAuthGuard";
import { getAxiosInstance } from "@/lib/api";
import { useStyles } from "@/components/clients/style";
import {
  ClientsHeader,
  ClientsFilters,
  ClientsTable,
  ClientDetails,
  ClientStatsComponent,
  ClientActions,
  ClientForm,
  type Client,
} from "@/components/clients";
import { EntityWorkspaceTabs, WorkspaceEntityList, type WorkspaceTabItem } from "@/components/common";
import { useClientsState, useClientsActions } from "@/providers/clients";
import type { IClient } from "@/providers/clients/context";

const ClientsPage = () => {
  const { styles } = useStyles();
  const { message } = App.useApp();

  // Provider state and actions
  const state = useClientsState();
  const actions = useClientsActions();

  // Use ref to track if we've initialized
  const initializedRef = useRef(false);

  // Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [industry, setIndustry] = useState<string | undefined>(undefined);
  const [clientType, setClientType] = useState<number | undefined>(undefined);
  const [isActive, setIsActive] = useState<boolean | undefined>(true); // Default to active clients only

  // Selected Client State
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [workspaceTab, setWorkspaceTab] = useState("overview");
  const [workspaceLoading, setWorkspaceLoading] = useState(false);
  const [workspaceData, setWorkspaceData] = useState<{
    contacts: Array<{ id: string; title: string; subtitle?: string }>;
    opportunities: Array<{ id: string; title: string; subtitle?: string }>;
    contracts: Array<{ id: string; title: string; subtitle?: string }>;
    documents: Array<{ id: string; title: string; subtitle?: string }>;
    notes: Array<{ id: string; title: string; subtitle?: string }>;
    activities: Array<{ id: string; title: string; subtitle?: string }>;
  }>(
    {
      contacts: [],
      opportunities: [],
      contracts: [],
      documents: [],
      notes: [],
      activities: [],
    },
  );

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // Initialize data on mount
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      actions.getClients({
        isActive: true, // Default to showing only active clients
        pageNumber: 1,
        pageSize: 10,
      });
    }
  }, []);

  // Handle filter application - user clicks Apply Filters button
  const handleApplyFilters = useCallback(() => {
    setCurrentPage(1); // Reset to page 1 when filters change
    actions.getClients({
      searchTerm,
      industry,
      clientType,
      isActive,
      pageNumber: 1,
      pageSize,
    });
  }, [searchTerm, industry, clientType, isActive, pageSize, actions]);

  // Handle filter clearing
  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setIndustry(undefined);
    setClientType(undefined);
    setIsActive(undefined);
    setCurrentPage(1);
    actions.getClients({
      pageNumber: 1,
      pageSize,
    });
  }, [pageSize, actions]);

  // Handle pagination change
  const handlePaginationChange = useCallback(
    (page: number, size: number) => {
      setCurrentPage(page);
      setPageSize(size);

      actions.getClients({
        searchTerm,
        industry,
        clientType,
        isActive,
        pageNumber: page,
        pageSize: size,
      });
    },
    [searchTerm, industry, clientType, isActive, actions],
  );

  // Load client details when selected
  useEffect(() => {
    if (selectedClient?.id) {
      actions.getClient(selectedClient.id);
      actions.getClientStats(selectedClient.id);
    }
  }, [selectedClient?.id]);

  useEffect(() => {
    const loadWorkspaceData = async () => {
      if (!selectedClient?.id) {
        setWorkspaceData({
          contacts: [],
          opportunities: [],
          contracts: [],
          documents: [],
          notes: [],
          activities: [],
        });
        return;
      }

      setWorkspaceLoading(true);
      try {
        const api = getAxiosInstance();
        const [contactsRes, opportunitiesRes, contractsRes, documentsRes, notesRes, activitiesRes] =
          await Promise.all([
            api.get(`/api/contacts/by-client/${selectedClient.id}`).catch(() => ({ data: [] })),
            api
              .get("/api/opportunities", {
                params: { clientId: selectedClient.id, pageNumber: 1, pageSize: 10 },
              })
              .catch(() => ({ data: { items: [] } })),
            api
              .get("/api/contracts", {
                params: { clientId: selectedClient.id, pageNumber: 1, pageSize: 10 },
              })
              .catch(() => ({ data: { items: [] } })),
            api
              .get("/api/documents", {
                params: { relatedToType: 1, relatedToId: selectedClient.id, pageNumber: 1, pageSize: 10 },
              })
              .catch(() => ({ data: { items: [] } })),
            api
              .get("/api/notes", {
                params: { relatedToType: 1, relatedToId: selectedClient.id, pageNumber: 1, pageSize: 10 },
              })
              .catch(() => ({ data: { items: [] } })),
            api
              .get("/api/activities", {
                params: { relatedToType: 1, relatedToId: selectedClient.id, pageNumber: 1, pageSize: 10 },
              })
              .catch(() => ({ data: { items: [] } })),
          ]);

        const contacts = (contactsRes.data?.items || contactsRes.data || []).map(
          (item: {
            id: string;
            firstName?: string;
            lastName?: string;
            email?: string;
          }) => ({
            id: item.id,
            title: `${item.firstName || ""} ${item.lastName || ""}`.trim() || "Unnamed Contact",
            subtitle: item.email,
          }),
        );

        const opportunities = (opportunitiesRes.data?.items || opportunitiesRes.data || []).map(
          (item: {
            id: string;
            title?: string;
            stageName?: string;
            statusName?: string;
          }) => ({
            id: item.id,
            title: item.title || "Untitled Opportunity",
            subtitle: item.stageName || item.statusName,
          }),
        );

        const contracts = (contractsRes.data?.items || contractsRes.data || []).map(
          (item: {
            id: string;
            contractNumber?: string;
            statusName?: string;
          }) => ({
            id: item.id,
            title: item.contractNumber || "Contract",
            subtitle: item.statusName,
          }),
        );

        const documents = (documentsRes.data?.items || documentsRes.data || []).map(
          (item: {
            id: string;
            fileName?: string;
            categoryName?: string;
          }) => ({
            id: item.id,
            title: item.fileName || "Document",
            subtitle: item.categoryName,
          }),
        );

        const notes = (notesRes.data?.items || notesRes.data || []).map(
          (item: {
            id: string;
            content?: string;
            createdByName?: string;
          }) => ({
            id: item.id,
            title: item.content || "Note",
            subtitle: item.createdByName,
          }),
        );

        const activities = (activitiesRes.data?.items || activitiesRes.data || []).map(
          (item: {
            id: string;
            title?: string;
            typeName?: string;
            statusName?: string;
          }) => ({
            id: item.id,
            title: item.title || item.typeName || "Activity",
            subtitle: item.statusName,
          }),
        );

        setWorkspaceData({ contacts, opportunities, contracts, documents, notes, activities });
      } finally {
        setWorkspaceLoading(false);
      }
    };

    loadWorkspaceData();
  }, [selectedClient?.id]);

  // Show error messages
  useEffect(() => {
    if (state.isError && state.errorMessage) {
      message.error(state.errorMessage);
      actions.clearError();
    }
  }, [state.isError, state.errorMessage]);

  // Handlers: Create Client
  const handleCreateClick = () => {
    createForm.resetFields();
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async (values: Partial<IClient>) => {
    try {
      await actions.createClient(values);
      message.success("Client created successfully");
      setIsCreateModalOpen(false);
      createForm.resetFields();
      // Refresh list
      await actions.getClients({
        searchTerm,
        industry,
        clientType,
        isActive,
        pageNumber: 1,
        pageSize,
      });
      setCurrentPage(1);
    } catch (error) {
      message.error("Failed to create client");
    }
  };

  const handleCreateCancel = () => {
    setIsCreateModalOpen(false);
    createForm.resetFields();
  };

  // Handlers: Edit Client
  const handleEdit = () => {
    if (!selectedClient) return;
    editForm.setFieldsValue(selectedClient);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (values: Partial<IClient>) => {
    if (!selectedClient?.id) return;

    try {
      await actions.updateClient(selectedClient.id, values);
      message.success("Client updated successfully");
      setIsEditModalOpen(false);
      editForm.resetFields();
      // Refresh the selected client's details
      await actions.getClient(selectedClient.id);
      // Refresh list
      await actions.getClients({
        searchTerm,
        industry,
        clientType,
        isActive,
        pageNumber: currentPage,
        pageSize,
      });
    } catch (error) {
      message.error("Failed to update client");
    }
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    editForm.resetFields();
  };

  // Handlers: Delete Client
  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
    setWorkspaceTab("overview");
  };

  const handleDelete = async () => {
    if (!selectedClient?.id) return;

    try {
      await actions.deleteClient(selectedClient.id);
      message.success("Client marked as inactive");
      setSelectedClient(null);
      
      // Refresh the list to remove the deleted client
      await actions.getClients({
        searchTerm,
        industry,
        clientType,
        isActive,
        pageNumber: currentPage,
        pageSize,
      });
    } catch (error) {
      message.error("Failed to delete client");
    }
  };

  // Data Mapping: Convert provider data to component props
  const clients: Client[] = (state.clients || []).map((client) => ({
    id: client.id,
    name: client.name,
    industry: client.industry,
    clientType: client.clientType,
    isActive: client.isActive,
    companySize: client.companySize,
    website: client.website,
    billingAddress: client.billingAddress,
    taxNumber: client.taxNumber,
    createdAt: client.createdAt,
  }));

  const workspaceItems: WorkspaceTabItem[] = [
    {
      key: "overview",
      label: "Overview",
      content: (
        <>
          <ClientDetails client={selectedClient} />
          {selectedClient && (
            <>
              <ClientStatsComponent stats={state.clientStats} loading={state.isLoadingDetails} />
              <ClientActions
                clientId={selectedClient.id}
                clientName={selectedClient.name}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </>
          )}
        </>
      ),
    },
    {
      key: "contacts",
      label: "Contacts",
      content: (
        <WorkspaceEntityList
          items={workspaceData.contacts}
          emptyText={workspaceLoading ? "Loading contacts..." : "No contacts for this client"}
        />
      ),
    },
    {
      key: "opportunities",
      label: "Opportunities",
      content: (
        <WorkspaceEntityList
          items={workspaceData.opportunities}
          emptyText={workspaceLoading ? "Loading opportunities..." : "No opportunities for this client"}
        />
      ),
    },
    {
      key: "contracts",
      label: "Contracts",
      content: (
        <WorkspaceEntityList
          items={workspaceData.contracts}
          emptyText={workspaceLoading ? "Loading contracts..." : "No contracts for this client"}
        />
      ),
    },
    {
      key: "documents",
      label: "Documents",
      content: (
        <WorkspaceEntityList
          items={workspaceData.documents}
          emptyText={workspaceLoading ? "Loading documents..." : "No documents for this client"}
        />
      ),
    },
    {
      key: "notes",
      label: "Notes",
      content: (
        <WorkspaceEntityList
          items={workspaceData.notes}
          emptyText={workspaceLoading ? "Loading notes..." : "No notes for this client"}
        />
      ),
    },
    {
      key: "activities",
      label: "Activities",
      content: (
        <WorkspaceEntityList
          items={workspaceData.activities}
          emptyText={workspaceLoading ? "Loading activities..." : "No activities for this client"}
        />
      ),
    },
  ];

  return (
    <div className={styles.pageContainer}>
      <ClientsHeader onCreateClick={handleCreateClick} />

      <ClientsFilters
        searchTerm={searchTerm}
        industry={industry}
        clientType={clientType}
        isActive={isActive}
        onSearchChange={setSearchTerm}
        onIndustryChange={setIndustry}
        onClientTypeChange={setClientType}
        onActiveChange={setIsActive}
        onApplyFilters={handleApplyFilters}
        onClear={handleClearFilters}
      />

      <div className={styles.mainContent}>
        <ClientsTable
          clients={clients}
          loading={state.isPending}
          selectedId={selectedClient?.id}
          onSelect={handleSelectClient}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: state.pagination?.totalCount || clients.length,
            onChange: handlePaginationChange,
          }}
        />

        <div className={styles.detailsPanel}>
          {selectedClient ? (
            <EntityWorkspaceTabs
              title={`${selectedClient.name} Workspace`}
              items={workspaceItems}
              activeKey={workspaceTab}
              onChange={setWorkspaceTab}
            />
          ) : (
            <ClientDetails client={null} />
          )}
        </div>
      </div>

      {/* Create Modal */}
      <Modal
        title="Create New Client"
        open={isCreateModalOpen}
        onCancel={handleCreateCancel}
        footer={null}
        width={600}
      >
        <ClientForm
          form={createForm}
          loading={state.isPending}
          onSubmit={handleCreateSubmit}
          onCancel={handleCreateCancel}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit Client"
        open={isEditModalOpen}
        onCancel={handleEditCancel}
        footer={null}
        width={600}
      >
        <ClientForm
          form={editForm}
          initialValues={selectedClient || undefined}
          loading={state.isPending}
          onSubmit={handleEditSubmit}
          onCancel={handleEditCancel}
        />
      </Modal>
    </div>
  );
};

export default withAuthGuard(ClientsPage);
