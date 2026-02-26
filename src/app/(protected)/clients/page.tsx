"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { message } from "antd";
import { withAuthGuard } from "@/hoc/withAuthGuard";
import { useStyles } from "@/components/clients/style";
import {
  ClientsHeader,
  ClientsFilters,
  ClientsTable,
  ClientDetails,
  ClientStatsComponent,
  ClientActions,
  type Client,
} from "@/components/clients";
import { useClientsState, useClientsActions } from "@/providers/clients";

const ClientsPage = () => {
  const { styles } = useStyles();

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
    [searchTerm, industry, clientType, isActive, actions]
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
    console.log("Create client");
    message.info("Create client modal will be implemented next");
  };

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
  };

  const handleEdit = () => {
    console.log("Edit client", selectedClient?.id);
    message.info("Edit client modal will be implemented next");
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
    contactEmail: client.contactEmail,
    phoneNumber: client.phoneNumber,
    address: client.address,
    city: client.city,
    country: client.country,
    websiteUrl: client.websiteUrl,
    companySize: client.companySize,
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
    </div>
  );
};

export default withAuthGuard(ClientsPage);