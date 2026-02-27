"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Modal, Form, App } from "antd";
import { withAuthGuard } from "@/hoc/withAuthGuard";
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

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [industry, setIndustry] = useState<string | undefined>(undefined);
  const [clientType, setClientType] = useState<number | undefined>(undefined);
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);

  // Selected client
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // Initialize data on mount ONLY
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      actions.getClients({
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

  // Load client details and stats when selected
  useEffect(() => {
    if (selectedClient?.id) {
      actions.getClient(selectedClient.id);
      actions.getClientStats(selectedClient.id);
    }
  }, [selectedClient?.id]);

  // Show error messages
  useEffect(() => {
    if (state.isError && state.errorMessage) {
      message.error(state.errorMessage);
      actions.clearError();
    }
  }, [state.isError, state.errorMessage]);

  // Handlers
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

  // Edit handlers
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

  // Delete and select handlers
  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
  };

  const handleDelete = async () => {
    if (!selectedClient?.id) return;

    await actions.deleteClient(selectedClient.id);
    message.success("Client deleted successfully");
    setSelectedClient(null);
    // Refresh the list
    await actions.getClients({
      searchTerm,
      industry,
      clientType,
      isActive,
      pageNumber: currentPage,
      pageSize,
    });
  };

  // Map provider data to component props
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
