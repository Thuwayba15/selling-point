"use client";

import { useEffect, useRef, useState } from "react";
import { App, Modal } from "antd";
import { withAuthGuard } from "@/hoc/withAuthGuard";
import { useProposalsState, useProposalsActions } from "@/providers/proposals";
import { useClientsState, useClientsActions } from "@/providers/clients";
import { useOpportunitiesState, useOpportunitiesActions } from "@/providers/opportunities";
import {
  ProposalsHeader,
  ProposalsFilters,
  ProposalsTable,
  ProposalDetails,
  ProposalActions,
  ProposalForm,
  CreateProposalForm,
  EditProposalForm,
} from "@/components/proposals";
import { useStyles } from "@/components/proposals/style";
import { IProposal } from "@/providers/proposals/context";
import { useRbac } from "@/hooks/useRbac";
import { calculateProposalTotals } from "@/utils/proposal";
import type { CreateProposalPayload } from "@/components/proposals/CreateProposalForm";
import type { UpdateProposalPayload } from "@/components/proposals/EditProposalForm";

const ProposalsPage = () => {
  const { styles } = useStyles();
  const { message } = App.useApp();
  const { can } = useRbac();

  const { isPending, isLoadingDetails, isError, errorMessage, proposals, proposal, pagination } =
    useProposalsState();

  const {
    getProposals,
    getProposal,
    createProposal,
    updateProposal,
    addLineItem,
    deleteLineItem,
    submitProposal,
    approveProposal,
    rejectProposal,
    deleteProposal,
    clearError,
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
      console.log("[Load proposal details] selectedProposal.id:", selectedProposal.id);
      getProposal(selectedProposal.id);
    }
  }, [selectedProposal?.id]);

  // Update displayed totals when proposal data changes
  useEffect(() => {
    if (proposal?.id && selectedProposal?.id === proposal.id) {
      console.log("[useEffect] Proposal updated with totals:", {
        subtotal: proposal.subtotal,
        tax: proposal.tax,
        totalAmount: proposal.totalAmount,
      });
    }
  }, [proposal?.subtotal, proposal?.tax, proposal?.totalAmount, proposal?.id, selectedProposal?.id]);

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

  const fetchProposals = async (params: {
    status?: number;
    clientId?: string;
    opportunityId?: string;
    pageNumber: number;
    pageSize: number;
  }) => {
    await getProposals(params);
  };

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async (payload: CreateProposalPayload) => {
    const success = await createProposal(payload);
    if (success) {
      message.success("Proposal created successfully");
      setIsCreateModalOpen(false);
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
  };

  const handleEdit = async () => {
    if (!selectedProposal?.id) return;
    console.log("[handleEdit] Selected proposal:", selectedProposal);
    console.log("[handleEdit] Fetching fresh proposal data for ID:", selectedProposal.id);
    // Always fetch fresh proposal data before editing to ensure all fields are populated
    await getProposal(selectedProposal.id);
    console.log("[handleEdit] After getProposal, proposal state:", proposal);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (payload: UpdateProposalPayload) => {
    if (!selectedProposal) return;

    const { lineItems, ...proposalData } = payload;

    // Calculate totals from form line items before any API calls
    const totals = lineItems && lineItems.length > 0 
      ? calculateProposalTotals(lineItems) 
      : { subtotal: 0, tax: 0, totalAmount: 0 };

    // Single update call with all data including totals
    const success = await updateProposal(selectedProposal.id, {
      ...proposalData,
      ...totals,
      currency: "R",
    });

    if (success) {
      // Handle line items
      if (lineItems && selectedProposal.id) {
        const existingLineItems = proposal?.lineItems || [];
        const existingIds = new Set(existingLineItems.map(item => item.id));

        const newItems = lineItems.filter(item => !item.id || !existingIds.has(item.id));
        for (const item of newItems) {
          await addLineItem(selectedProposal.id, {
            productServiceName: item.productServiceName,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount,
            taxRate: item.taxRate,
          });
        }

        const newItemIds = new Set(lineItems.filter(item => item.id).map(item => item.id));
        const deletedItems = existingLineItems.filter(item => item.id && !newItemIds.has(item.id));
        for (const item of deletedItems) {
          if (item.id) await deleteLineItem(selectedProposal.id, item.id);
        }
      }

      message.success("Proposal updated successfully");
      setIsEditModalOpen(false);

      await fetchProposals({ status, clientId, opportunityId, pageNumber: currentPage, pageSize });
      await getProposal(selectedProposal.id);
    }
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
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
        <CreateProposalForm
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
        {proposal && (
          <EditProposalForm
            proposal={proposal}
            loading={isPending}
            onSubmit={handleEditSubmit}
            onCancel={handleEditCancel}
            opportunities={opportunitiesList}
            clients={clientsList}
          />
        )}
      </Modal>
    </div>
  );
};

export default withAuthGuard(ProposalsPage);
