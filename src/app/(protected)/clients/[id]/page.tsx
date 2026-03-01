"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { App, Form, Modal } from "antd";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import { withAuthGuard } from "@/hoc/withAuthGuard";
import { useClientsState, useClientsActions } from "@/providers/clients";
import { useContactsActions } from "@/providers/contacts";
import { useUsersActions, useUsersState } from "@/providers/users";
import {
  ClientWorkspaceContent,
  useClientWorkspaceData,
  useClientEntityModals,
  EntityModalsRenderer,
  ClientForm,
  type EntityType,
} from "@/components/clients";
import { useStyles } from "@/components/clients/style";
import type { IClient } from "@/providers/clients/context";
import type { IContact } from "@/providers/contacts/context";
import type { IOpportunity } from "@/providers/opportunities/context";
import type { IContract } from "@/providers/contracts/context";
import type { IDocument } from "@/providers/documents/context";
import type { INote } from "@/providers/notes/context";

type WorkspaceEntity = IContact | IOpportunity | IContract | IDocument | INote;

const ClientWorkspacePage = () => {
  const { styles } = useStyles();
  const { message } = App.useApp();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();

  const clientId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  // State & hooks
  const { isPending, isLoadingDetails, isError, errorMessage, client } = useClientsState();
  const { getClient, updateClient, deleteClient, clearError, clearClient } = useClientsActions();
  const contactsActions = useContactsActions();

  const usersState = useUsersState();
  const usersActions = useUsersActions();

  // Local state - declare before callbacks that use them
  const [selectedClient, setSelectedClient] = useState<IClient | null>(null);
  const [workspaceTab, setWorkspaceTab] = useState("contacts");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Forms
  const [editForm] = Form.useForm();
  const [editClientForm] = Form.useForm();

  const initializedRef = useRef(false);

  // Custom hooks
  const { workspaceData, workspaceLoading, fetchWorkspaceData, forceRefresh } = useClientWorkspaceData();
  
  const refreshWorkspace = useCallback(async () => {
    if (selectedClient) {
      await fetchWorkspaceData(selectedClient, true);
    }
  }, [selectedClient, fetchWorkspaceData]);
  
  const entityModals = useClientEntityModals(refreshWorkspace);

  // Initialize page - load client data
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      usersActions.getUsers({ isActive: true, pageNumber: 1, pageSize: 1000 });
    }
  }, []);

  // Load client details when clientId changes
  useEffect(() => {
    if (!clientId) return;
    getClient(clientId);
  }, [clientId]);

  // Update selected client when client data is loaded
  useEffect(() => {
    if (client?.id && client.id === clientId && (!selectedClient || selectedClient.id !== client.id)) {
      setSelectedClient(client);
    }
  }, [client?.id, clientId]);

  // Set page title
  useEffect(() => {
    if (selectedClient?.name) {
      document.title = `${selectedClient.name} - Workspace | Selling Point`;
    } else {
      document.title = "Client Workspace | Selling Point";
    }
  }, [selectedClient?.name]);

  // Load workspace data when selected client changes
  useEffect(() => {
    if (selectedClient?.id) {
      fetchWorkspaceData(selectedClient);
    }
  }, [selectedClient?.id]);

  // Refresh data when page becomes visible (user navigates back)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && selectedClient) {
        // Force refresh when page becomes visible
        fetchWorkspaceData(selectedClient, true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [selectedClient, fetchWorkspaceData]);

  // Refresh data when window gets focus (user switches back to tab)
  useEffect(() => {
    const handleFocus = () => {
      if (selectedClient) {
        fetchWorkspaceData(selectedClient, true);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [selectedClient, fetchWorkspaceData]);

  // Handle back button
  const handleBackToClients = useCallback(() => {
    const queryParams = new URLSearchParams(searchParams);
    const path = queryParams.toString() ? `/clients?${queryParams.toString()}` : "/clients";
    router.push(path);
  }, [router, searchParams]);

  // Entity action handlers
  const handleDeleteClient = useCallback(async () => {
    if (!selectedClient?.id) return;

    return new Promise<void>((resolve) => {
      Modal.confirm({
        title: "Delete Client",
        content: `Are you sure you want to delete "${selectedClient.name}"? This action cannot be undone.`,
        okText: "Delete",
        okType: "danger",
        onOk: async () => {
          try {
            await deleteClient(selectedClient.id);
            message.success("Client deleted successfully");
            handleBackToClients();
            resolve();
          } catch (error) {
            message.error("Failed to delete client");
            resolve();
          }
        },
      });
    });
  }, [selectedClient?.id, selectedClient?.name, deleteClient, message, handleBackToClients]);

  const handleEditClient = useCallback(() => {
    if (!selectedClient) return;
    editClientForm.setFieldsValue(selectedClient);
    setIsEditModalOpen(true);
  }, [selectedClient, editClientForm]);

  const handleEditClientSubmit = useCallback(async (values: Partial<IClient>) => {
    if (!selectedClient?.id) return;

    try {
      await updateClient(selectedClient.id, values);
      message.success("Client updated successfully");
      setIsEditModalOpen(false);
      editClientForm.resetFields();
      await getClient(selectedClient.id);
    } catch (error) {
      message.error("Failed to update client");
    }
  }, [selectedClient?.id, updateClient, message, editClientForm, getClient]);

  const handleEditClientCancel = useCallback(() => {
    setIsEditModalOpen(false);
    editClientForm.resetFields();
  }, [editClientForm]);

  const handleSetPrimaryContact = useCallback(async (contact: IContact) => {
    try {
      await contactsActions.setPrimaryContact(contact.id);
      message.success("Primary contact updated successfully");
      await fetchWorkspaceData(selectedClient!, true);
    } catch (error) {
      message.error("Failed to update primary contact");
    }
  }, [selectedClient, fetchWorkspaceData, contactsActions, message]);

  const handleCreateEntity = useCallback((type: EntityType) => {
    entityModals.openCreateModal(type);
  }, [entityModals]);

  const handleEditEntity = useCallback((type: EntityType, entity: WorkspaceEntity) => {
    entityModals.openEditModal(type, entity);
  }, [entityModals]);

  const handleDeleteEntity = useCallback(async (type: EntityType, entity: WorkspaceEntity) => {
    await entityModals.handleDeleteEntity(type, entity, selectedClient?.id || "");
  }, [entityModals, selectedClient?.id]);

  return (
    <div className={styles.pageContainer}>
      <ClientWorkspaceContent
        client={selectedClient}
        isLoadingDetails={isLoadingDetails}
        isLoading={workspaceLoading}
        workspaceData={workspaceData}
        activeTab={workspaceTab}
        onTabChange={setWorkspaceTab}
        onEdit={handleEditClient}
        onDelete={handleDeleteClient}
        onCreateEntity={handleCreateEntity}
        onEditEntity={handleEditEntity}
        onDeleteEntity={handleDeleteEntity}
        onSetPrimaryContact={handleSetPrimaryContact}
        onRefreshWorkspace={refreshWorkspace}
        onBackToClients={handleBackToClients}
        entityModals={entityModals}
      />

      <EntityModalsRenderer
        entityModals={entityModals}
        selectedClient={selectedClient}
        workspaceData={workspaceData}
        onRefresh={refreshWorkspace}
      />

      {/* Edit Client Modal */}
      <Modal
        title="Edit Client"
        open={isEditModalOpen}
        onCancel={handleEditClientCancel}
        footer={null}
        width={600}
      >
        <ClientForm
          form={editClientForm}
          initialValues={selectedClient || undefined}
          loading={isPending}
          onSubmit={handleEditClientSubmit}
          onCancel={handleEditClientCancel}
        />
      </Modal>
    </div>
  );
};

export default withAuthGuard(ClientWorkspacePage);
