"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Modal, Form, App, Button } from "antd";
import { useRouter } from "next/navigation";
import { withAuthGuard } from "@/hoc/withAuthGuard";
import { useAuthState } from "@/providers/auth";
import { useStyles } from "@/components/clients/style";
import { ClientsFilters, ClientsTable, ClientForm, type Client } from "@/components/clients";
import { useClientsState, useClientsActions } from "@/providers/clients";
import type { IClient } from "@/providers/clients/context";

const ClientsPage = () => {
  const router = useRouter();
  const { styles } = useStyles();
  const { message } = App.useApp();
  const { user } = useAuthState();

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

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm] = Form.useForm();

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
  const handleApplyFilters = useCallback(
    (filters: {
      searchTerm?: string;
      industry?: string;
      clientType?: number;
      isActive?: boolean;
    }) => {
      setSearchTerm(filters.searchTerm || "");
      setIndustry(filters.industry || "");
      setClientType(filters.clientType || undefined);
      setIsActive(filters.isActive);
      setCurrentPage(1); // Reset to page 1 when filters change
      actions.getClients({
        ...filters,
        pageNumber: 1,
        pageSize,
      });
    },
    [pageSize],
  );

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
  }, [pageSize]);

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
    [searchTerm, industry, clientType, isActive],
  );

  // Load client details when selected for sidebar
  useEffect(() => {
    if (state.isError && state.errorMessage) {
      message.error(state.errorMessage);
      actions.clearError();
    }
  }, [state.isError, state.errorMessage, message]);

  // Handler: Select client and navigate to workspace
  const handleSelectClient = (client: Client) => {
    // Build query params to preserve filter state
    const params = new URLSearchParams();
    if (searchTerm) params.append("searchTerm", searchTerm);
    if (industry) params.append("industry", industry);
    if (clientType) params.append("clientType", String(clientType));
    if (isActive !== undefined) params.append("isActive", String(isActive));
    params.append("page", String(currentPage));
    params.append("pageSize", String(pageSize));

    router.push(`/clients/${client.id}?${params.toString()}`);
  };

  // Handler: Create Client
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

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        <ClientsFilters
          onApplyFilters={handleApplyFilters}
          onClear={handleClearFilters}
          initialSearchTerm={searchTerm}
          initialIndustry={industry}
          initialClientType={clientType}
          initialIsActive={isActive}
        />

        <ClientsTable
          clients={clients}
          loading={state.isPending}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: state.pagination?.totalCount || clients.length,
          }}
          onSelectClient={handleSelectClient}
          onPaginationChange={handlePaginationChange}
          headerExtra={
            user ? (
              <Button type="primary" onClick={handleCreateClick}>
                Create Client
              </Button>
            ) : null
          }
        />

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
      </div>
    </div>
  );
};

export default withAuthGuard(ClientsPage);
