"use client";

import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { App, Button, Form, Modal } from "antd";
import { withAuthGuard } from "@/hoc/withAuthGuard";
import { useProposalsState, useProposalsActions } from "@/providers/proposals";
import {
  useClientsState,
  useClientsActions,
} from "@/providers/clients";
import {
  useOpportunitiesState,
  useOpportunitiesActions,
} from "@/providers/opportunities";
import {
  ProposalsHeader,
  ProposalsFilters,
  ProposalsTable,
  ProposalDetails,
  ProposalActions,
  ProposalForm,
} from "@/components/proposals";
import { useStyles } from "@/components/proposals/style";
import { IProposal, IProposalLineItem } from "@/providers/proposals/context";
import { useRbac } from "@/hooks/useRbac";

const ProposalsPage = () => {
  const { styles } = useStyles();
  const { message } = App.useApp();
  const { can } = useRbac();

  const {
    isPending,
    isLoadingDetails,
    isError,
    errorMessage,
    proposals,
    proposal,
    pagination,
  } = useProposalsState();

  const {
    getProposals,
    getProposal,
    createProposal,
    updateProposal,
    addLineItem,
    updateLineItem,
    deleteLineItem,
    submitProposal,
    approveProposal,
    rejectProposal,
    deleteProposal,
    clearError,
    clearProposal,
  } = useProposalsActions();

  // Clients provider for dropdown
  const clientsState = useClientsState();
  const clientsActions = useClientsActions();

  // Opportunities provider for dropdown
  const opportunitiesState = useOpportunitiesState();
  const opportunitiesActions = useOpportunitiesActions();

  const [status, setStatus] = useState<number | undefined>(undefined);
  const [clientId, setClientId] = useState<string | undefined>(undefined);
  const [opportunityId, setOpportunityId] = useState<string | undefined>(undefined);
  const [selectedProposal, setSelectedProposal] = useState<IProposal | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const initializedRef = useRef(false);

  // Initialize data on mount
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      // Fetch clients for dropdown
      clientsActions.getClients({ pageNumber: 1, pageSize: 1000 });
      // Fetch opportunities for dropdown
      opportunitiesActions.getOpportunities({
        pageNumber: 1,
        pageSize: 1000,
      });
      // Fetch proposals
      getProposals({ pageNumber: currentPage, pageSize });
    }
  }, []);

  // Load proposal details when selected
  useEffect(() => {
    if (selectedProposal?.id) {
      getProposal(selectedProposal.id);
    }
  }, [selectedProposal?.id]);

  // Show error messages
  useEffect(() => {
    if (isError && errorMessage) {
      message.error(errorMessage);
      clearError();
    }
  }, [isError, errorMessage]);

  // Map clients and opportunities for the form
  const clientsList = (clientsState.clients || []).map((client) => ({
    id: client.id,
    name: client.name || "",
  }));

  const opportunitiesList = (opportunitiesState.opportunities || []).map((opp) => ({
    id: opp.id,
    title: opp.title || "",
  }));

  const fetchProposals = async (
    params: {
      status?: number;
      clientId?: string;
      opportunityId?: string;
      pageNumber: number;
      pageSize: number;
    }
  ) => {
    await getProposals(params);
  };

  const handleCreateClick = () => {
    createForm.resetFields();
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async (
    values: Partial<IProposal>,
    lineItems?: IProposalLineItem[]
  ) => {
    const success = await createProposal(values);
    if (success) {
      message.success("Proposal created successfully");
      setIsCreateModalOpen(false);
      createForm.resetFields();
      setCurrentPage(1);
      
      // Refresh proposals list
      await fetchProposals({
        status,
        clientId,
        opportunityId,
        pageNumber: 1,
        pageSize,
      });
    }
  };

  const handleCreateCancel = () => {
    setIsCreateModalOpen(false);
    createForm.resetFields();
  };

  const handleEdit = () => {
    if (!selectedProposal) return;
    const formValues = {
      ...selectedProposal,
      validUntil: selectedProposal.validUntil ? dayjs(selectedProposal.validUntil) : undefined,
    };
    editForm.setFieldsValue(formValues);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (
    values: Partial<IProposal>,
    lineItems?: IProposalLineItem[]
  ) => {
    if (!selectedProposal) return;

    const success = await updateProposal(selectedProposal.id, values);
    if (success) {
      message.success("Proposal updated successfully");
      setIsEditModalOpen(false);
      editForm.resetFields();
      
      // Sync line items if provided
      if (lineItems && selectedProposal.id) {
        const existingLineItems = proposal?.lineItems || [];
        
        // Identify new items (no id) and add them
        const newItems = lineItems.filter(item => !item.id || item.id.startsWith('temp-'));
        for (const item of newItems) {
          const { id, ...lineItemData } = item;
          await addLineItem(selectedProposal.id, lineItemData);
        }
        
        // Identify removed items and delete them
        const removedItems = existingLineItems.filter(
          existingItem => !lineItems.find(item => item.id === existingItem.id)
        );
        for (const item of removedItems) {
          if (item.id) {
            await deleteLineItem(selectedProposal.id, item.id);
          }
        }
      }
      
      await fetchProposals({
        status,
        clientId,
        opportunityId,
        pageNumber: currentPage,
        pageSize,
      });
      if (selectedProposal.id === proposal?.id) {
        await getProposal(selectedProposal.id);
      }
    }
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    editForm.resetFields();
  };

  const handleSubmit = async () => {
    if (!selectedProposal) return;

    const success = await submitProposal(selectedProposal.id);
    if (success) {
      message.success("Proposal submitted for approval");
      await fetchProposals({
        status,
        clientId,
        opportunityId,
        pageNumber: currentPage,
        pageSize,
      });
      await getProposal(selectedProposal.id);
    }
  };

  const handleApprove = async () => {
    if (!selectedProposal) return;

    const success = await approveProposal(selectedProposal.id);
    if (success) {
      message.success("Proposal approved");
      await fetchProposals({
        status,
        clientId,
        opportunityId,
        pageNumber: currentPage,
        pageSize,
      });
      await getProposal(selectedProposal.id);
    }
  };

  const handleReject = async (reason: string) => {
    if (!selectedProposal) return;

    const success = await rejectProposal(selectedProposal.id, reason);
    if (success) {
      message.success("Proposal rejected");
      await fetchProposals({
        status,
        clientId,
        opportunityId,
        pageNumber: currentPage,
        pageSize,
      });
      await getProposal(selectedProposal.id);
    }
  };

  const handleDelete = async () => {
    if (!selectedProposal) return;

    const success = await deleteProposal(selectedProposal.id);
    if (success) {
      message.success("Proposal deleted successfully");
      setSelectedProposal(null);
      await fetchProposals({
        status,
        clientId,
        opportunityId,
        pageNumber: currentPage,
        pageSize,
      });
    }
  };

  const handleSelectProposal = (item: IProposal) => {
    setSelectedProposal(item);
  };

  const handleApplyFilters = (filters: {
    status?: number;
    clientId?: string;
    opportunityId?: string;
  }) => {
    setStatus(filters.status);
    setClientId(filters.clientId);
    setOpportunityId(filters.opportunityId);
    setCurrentPage(1);
    fetchProposals({
      ...filters,
      pageNumber: 1,
      pageSize,
    });
  };

  const handleClearFilters = () => {
    setStatus(undefined);
    setClientId(undefined);
    setOpportunityId(undefined);
    setCurrentPage(1);
    fetchProposals({
      pageNumber: 1,
      pageSize,
    });
  };

  const handlePaginationChange = (page: number, newPageSize: number) => {
    setCurrentPage(page);
    setPageSize(newPageSize);
    fetchProposals({
      status,
      clientId,
      opportunityId,
      pageNumber: page,
      pageSize: newPageSize,
    });
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        <ProposalsHeader onCreateClick={handleCreateClick} />

        <ProposalsFilters onApplyFilters={handleApplyFilters} onClear={handleClearFilters} />

        <ProposalsTable
          proposals={proposals || []}
          loading={isPending}
          pagination={pagination}
          selectedProposalId={selectedProposal?.id}
          onSelectProposal={handleSelectProposal}
          onPaginationChange={handlePaginationChange}
        />

        {selectedProposal && (
          <div className={styles.selectedRow}>
            <div className={styles.detailsPanel}>
              <ProposalDetails proposal={proposal || null} loading={isLoadingDetails} />
            </div>
            <div className={styles.actionsCard}>
              <ProposalActions
                proposal={proposal || null}
                onEdit={handleEdit}
                onSubmit={handleSubmit}
                onApprove={handleApprove}
                onReject={handleReject}
                onDelete={handleDelete}
              />
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        title="Create New Proposal"
        open={isCreateModalOpen}
        onCancel={handleCreateCancel}
        footer={null}
        width={800}
      >
        <ProposalForm
          form={createForm}
          loading={isPending}
          onSubmit={handleCreateSubmit}
          onCancel={handleCreateCancel}
          opportunities={opportunitiesList}
          clients={clientsList}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit Proposal"
        open={isEditModalOpen}
        onCancel={handleEditCancel}
        footer={null}
        width={800}
      >
        <ProposalForm
          form={editForm}
          initialValues={selectedProposal || undefined}
          loading={isPending}
          onSubmit={handleEditSubmit}
          onCancel={handleEditCancel}
          opportunities={opportunitiesList}
          clients={clientsList}
        />
      </Modal>
    </div>
  );
};

export default withAuthGuard(ProposalsPage);