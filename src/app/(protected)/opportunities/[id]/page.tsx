"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { App, Form, Modal } from "antd";
import { useParams } from "next/navigation";
import dayjs from "dayjs";
import { withAuthGuard } from "@/hoc/withAuthGuard";
import { useRbac } from "@/hooks/useRbac";
import { useAuthState } from "@/providers/auth";
import { useOpportunitiesState, useOpportunitiesActions } from "@/providers/opportunities";
import { useClientsState, useClientsActions } from "@/providers/clients";
import { useUsersActions, useUsersState } from "@/providers/users";
import {
  CreateOpportunityModal,
  EditOpportunityModal,
  UpdateStageModal,
  AssignOpportunityModal,
  OpportunitiesFiltersSection,
  OpportunityWorkspaceContent,
  useOpportunityWorkspaceData,
  useOpportunityFilters,
  useEntityModals,
  useEntityActions,
  EntityModalsRenderer,
  type EntityType,
} from "@/components/opportunities";
import { useStyles } from "@/components/opportunities/style";
import { IOpportunity } from "@/providers/opportunities/context";

const OpportunityWorkspacePage = () => {
  const { styles } = useStyles();
  const { message } = App.useApp();
  const params = useParams<{ id: string }>();
  const { user } = useAuthState();

  const opportunityId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  // State & hooks
  const {
    isPending,
    isLoadingDetails,
    isError,
    errorMessage,
    opportunity,
    stageHistory,
  } = useOpportunitiesState();

  const {
    getOpportunities,
    getMyOpportunities,
    getOpportunity,
    getOpportunityStageHistory,
    getOpportunityPipeline,
    createOpportunity,
    updateOpportunity,
    updateOpportunityStage,
    assignOpportunity,
    deleteOpportunity,
    clearError,
    clearOpportunity,
  } = useOpportunitiesActions();

  const clientsState = useClientsState();
  const clientsActions = useClientsActions();
  const usersState = useUsersState();
  const usersActions = useUsersActions();

  // Custom hooks
  const filters = useOpportunityFilters(opportunityId);
  const { workspaceData, workspaceLoading, assignableUsers, loadWorkspaceData, loadUsers, loadContacts } = useOpportunityWorkspaceData();
  const entityModals = useEntityModals();

  // Local state
  const [selectedOpportunity, setSelectedOpportunity] = useState<IOpportunity | null>(null);
  const [workspaceTab, setWorkspaceTab] = useState("overview");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [createModalClientId, setCreateModalClientId] = useState<string | undefined>(undefined);
  const [editModalClientId, setEditModalClientId] = useState<string | undefined>(undefined);
  const [createModalContacts, setCreateModalContacts] = useState<
    Array<{ id: string; firstName: string; lastName: string; email: string }>
  >([]);
  const [editModalContacts, setEditModalContacts] = useState<
    Array<{ id: string; firstName: string; lastName: string; email: string }>
  >([]);

  // Forms
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [stageForm] = Form.useForm();
  const [assignForm] = Form.useForm();

  const initializedRef = useRef(false);
  const isSalesRep = Boolean(user?.roles?.includes("SalesRep"));

  // Entity actions
  const refreshWorkspace = async () => {
    if (selectedOpportunity) {
      await loadWorkspaceData(selectedOpportunity);
    }
  };

  const {
    handleActivityCreate,
    handleActivityEdit,
    handleProposalCreate,
    handleProposalEdit,
    handlePricingRequestCreate,
    handlePricingRequestEdit,
    handlePricingRequestAssign,
    handlePricingRequestComplete,
    handleContractCreate,
    handleContractEdit,
    handleDocumentCreate,
    handleNoteCreate,
    handleNoteEdit,
    handleDeleteEntity,
  } = useEntityActions({
    selectedOpportunity,
    selectedEntity: entityModals.selectedEntity,
    onRefresh: refreshWorkspace,
    usersList: usersState.users || [],
    clientsList: (clientsState.clients || []).map((c) => ({ id: c.id, name: c.name })),
    opportunitiesList: selectedOpportunity?.id
      ? [{ id: selectedOpportunity.id, title: selectedOpportunity.title || "Opportunity" }]
      : [],
    proposalsList: (workspaceData?.proposals || [])
      .map((p) => ({ id: p.id, title: p.title || "Proposal" }))
      .filter((p): p is { id: string; title: string } => Boolean(p.id)),
    contractsList: (workspaceData?.contracts || [])
      .map((c) => ({ id: c.id, title: c.title || c.contractNumber || "Contract" }))
      .filter((c): c is { id: string; title: string } => Boolean(c.id)),
  });

  // Memoized lists
  const clientsList = useMemo(
    () => (clientsState.clients || []).map((client) => ({ id: client.id, name: client.name })),
    [clientsState.clients],
  );

  const usersList = useMemo(
    () =>
      (usersState.users || []).map((item) => ({
        id: item.id,
        firstName: item.firstName,
        lastName: item.lastName,
      })),
    [usersState.users],
  );

  const opportunitiesList = useMemo(
    () =>
      selectedOpportunity?.id
        ? [{ id: selectedOpportunity.id, title: selectedOpportunity.title || "Opportunity" }]
        : [],
    [selectedOpportunity?.id, selectedOpportunity?.title],
  );

  const proposalsList = useMemo(
    () =>
      (workspaceData?.proposals || [])
        .map((proposal) => ({ id: proposal.id, title: proposal.title || "Proposal" }))
        .filter((item): item is { id: string; title: string } => Boolean(item.id)),
    [workspaceData?.proposals],
  );

  const contractsList = useMemo(
    () =>
      (workspaceData?.contracts || [])
        .map((contract) => ({
          id: contract.id,
          title: contract.title || contract.contractNumber || "Contract",
        }))
        .filter((item): item is { id: string; title: string } => Boolean(item.id)),
    [workspaceData?.contracts],
  );

  // Fetch opportunities
  const fetchOpportunities = async () => {
    const useMy = filters.showMyOpportunities;
    if (useMy) {
      await getMyOpportunities({
        stage: filters.stage,
        pageNumber: filters.currentPage,
        pageSize: filters.pageSize,
      });
    } else {
      await getOpportunities({
        searchTerm: filters.searchTerm,
        clientId: filters.clientId,
        stage: filters.stage,
        ownerId: filters.ownerId,
        pageNumber: filters.currentPage,
        pageSize: filters.pageSize,
        isActive: true,
      });
    }
  };

  // Initialize page
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      clientsActions.getClients({ isActive: true, pageNumber: 1, pageSize: 1000 });
      fetchOpportunities();
      loadUsers();
      usersActions.getUsers({ isActive: true, pageNumber: 1, pageSize: 1000 });
      getOpportunityPipeline({
        ownerId: filters.initialShowMine ? user?.id : filters.initialOwnerId,
      });
    }
  }, []);

  // Load opportunity details
  useEffect(() => {
    if (!opportunityId) return;
    getOpportunity(opportunityId);
    getOpportunityStageHistory(opportunityId);
  }, [opportunityId]);

  // Update selected opportunity
  useEffect(() => {
    if (opportunity?.id && opportunity.id === opportunityId) {
      setSelectedOpportunity(opportunity);
    }
  }, [opportunity?.id, opportunityId]);

  // Load workspace data
  useEffect(() => {
    loadWorkspaceData(selectedOpportunity);
  }, [selectedOpportunity?.id, selectedOpportunity?.clientId]);

  // Load contacts
  useEffect(() => {
    if (!createModalClientId) {
      setCreateModalContacts([]);
      return;
    }
    loadContacts(createModalClientId).then(setCreateModalContacts);
  }, [createModalClientId]);

  useEffect(() => {
    if (!editModalClientId) {
      setEditModalContacts([]);
      return;
    }
    loadContacts(editModalClientId).then(setEditModalContacts);
  }, [editModalClientId]);

  // Handle errors
  useEffect(() => {
    if (isError && errorMessage) {
      message.error(errorMessage);
      clearError();
    }
  }, [isError, errorMessage]);

  // Opportunity modal handlers
  const handleCreateClick = () => {
    createForm.resetFields();
    setCreateModalClientId(undefined);
    setCreateModalContacts([]);
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async (values: Partial<IOpportunity>) => {
    const success = await createOpportunity(values);
    if (success) {
      message.success("Opportunity created successfully");
      setIsCreateModalOpen(false);
      createForm.resetFields();
      await fetchOpportunities();
      filters.setCurrentPage(1);
    }
  };

  const handleCreateCancel = () => {
    setIsCreateModalOpen(false);
    createForm.resetFields();
    setCreateModalClientId(undefined);
    setCreateModalContacts([]);
  };

  const handleEdit = () => {
    if (!selectedOpportunity) return;
    editForm.setFieldsValue(selectedOpportunity);
    setEditModalClientId(selectedOpportunity.clientId);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (values: Partial<IOpportunity>) => {
    if (!selectedOpportunity) return;
    const success = await updateOpportunity(selectedOpportunity.id, values);
    if (success) {
      message.success("Opportunity updated successfully");
      setIsEditModalOpen(false);
      editForm.resetFields();
      await fetchOpportunities();
      await getOpportunity(selectedOpportunity.id);
      await getOpportunityStageHistory(selectedOpportunity.id);
    }
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    editForm.resetFields();
    setEditModalClientId(undefined);
    setEditModalContacts([]);
  };

  const handleUpdateStage = () => {
    if (!selectedOpportunity) return;
    stageForm.setFieldsValue({
      stage: selectedOpportunity.stage,
      notes: "",
      lossReason: "",
    });
    setIsStageModalOpen(true);
  };

  const handleStageSubmit = async (values: { stage: number; notes?: string; lossReason?: string }) => {
    if (!selectedOpportunity) return;

    const success = await updateOpportunityStage(
      selectedOpportunity.id,
      values.stage,
      values.notes,
      values.lossReason,
    );
    if (success) {
      message.success("Stage updated successfully");
      setIsStageModalOpen(false);
      stageForm.resetFields();
      await getOpportunity(selectedOpportunity.id);
      await getOpportunityStageHistory(selectedOpportunity.id);
      await fetchOpportunities();
    }
  };

  const handleStageCancel = () => {
    setIsStageModalOpen(false);
    stageForm.resetFields();
  };

  const handleAssign = () => {
    if (!selectedOpportunity) return;
    assignForm.resetFields();
    setIsAssignModalOpen(true);
  };

  const handleAssignSubmit = async (values: { userId: string }) => {
    if (!selectedOpportunity) return;
    const success = await assignOpportunity(selectedOpportunity.id, values.userId);
    if (success) {
      message.success("Opportunity assigned successfully");
      setIsAssignModalOpen(false);
      assignForm.resetFields();
      await getOpportunity(selectedOpportunity.id);
      await fetchOpportunities();
    }
  };

  const handleAssignCancel = () => {
    setIsAssignModalOpen(false);
    assignForm.resetFields();
  };

  const handleDelete = async () => {
    if (!selectedOpportunity) return;
    const success = await deleteOpportunity(selectedOpportunity.id);
    if (success) {
      message.success("Opportunity deleted successfully");
      setSelectedOpportunity(null);
      clearOpportunity();
      filters.navigateToList();
    }
  };

  // Entity handlers
  const handleCreateEntity = (type: EntityType) => {
    if (!selectedOpportunity) return;
    const { canCreate, defaultValues } = { canCreate: true, defaultValues: {} };
    if (!canCreate) return;
    entityModals.forms[type].create.setFieldsValue(defaultValues);
    entityModals.openCreateModal(type);
  };

  const handleEditEntity = (type: EntityType, entity: any) => {
    entityModals.openEditModal(type, entity);
    if (type === "activity") {
      entityModals.forms.activity.edit.setFieldsValue({
        ...entity,
        dueDate: entity?.dueDate ? dayjs(entity.dueDate) : undefined,
      });
    } else if (type === "contract") {
      entityModals.forms.contract.edit.setFieldsValue({
        ...entity,
        startDate: entity?.startDate ? dayjs(entity.startDate) : undefined,
        endDate: entity?.endDate ? dayjs(entity.endDate) : undefined,
      });
    }
  };

  const handleAssignEntity = (type: EntityType, entity: any) => {
    if (type === "pricingRequest") {
      entityModals.openAssignModal(type, entity);
    }
  };

  const handleCompleteEntity = async (type: EntityType, entity: any) => {
    if (type === "pricingRequest") {
      await handlePricingRequestComplete(entity);
    }
  };

  const handleApplyFilters = async (filterValues: {
    searchTerm?: string;
    clientId?: string;
    stage?: number;
    ownerId?: string;
  }) => {
    filters.applyFilters(filterValues);
    await fetchOpportunities();
  };

  const handleClearFilters = async () => {
    filters.clearFilters();
    await fetchOpportunities();
  };

  const handleShowMyOpportunitiesChange = async (value: boolean) => {
    if (!isSalesRep) return;

    filters.toggleShowMyOpportunities(value);
    await fetchOpportunities();
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        <OpportunitiesFiltersSection
          onCreateClick={handleCreateClick}
          onApplyFilters={handleApplyFilters}
          onClear={handleClearFilters}
          clients={clientsList}
          showMyOpportunities={filters.showMyOpportunities}
          onShowMyOpportunitiesChange={handleShowMyOpportunitiesChange}
          showMyOpportunitiesToggle={isSalesRep}
          initialSearchTerm={filters.searchTerm || ""}
          initialClientId={filters.clientId}
          initialStage={filters.stage}
          initialOwnerId={filters.ownerId}
          opportunityId={opportunityId}
          onBackToList={() => filters.navigateToList(filters.buildQueryString())}
        />

        <OpportunityWorkspaceContent
          opportunity={opportunity || null}
          selectedOpportunity={selectedOpportunity}
          stageHistory={stageHistory || []}
          isLoadingDetails={isLoadingDetails}
          isLoading={workspaceLoading}
          workspaceData={workspaceData}
          activeTab={workspaceTab}
          onTabChange={setWorkspaceTab}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onUpdateStage={handleUpdateStage}
          onAssign={handleAssign}
          onCreateEntity={handleCreateEntity}
          onEditEntity={handleEditEntity}
          onAssignEntity={handleAssignEntity}
          onCompleteEntity={handleCompleteEntity}
          onDeleteEntity={handleDeleteEntity}
        />

        <CreateOpportunityModal
          isOpen={isCreateModalOpen}
          form={createForm}
          loading={isPending}
          clients={clientsList}
          contacts={createModalContacts}
          onClientChange={setCreateModalClientId}
          onCancel={handleCreateCancel}
          onSubmit={handleCreateSubmit}
        />

        <EditOpportunityModal
          isOpen={isEditModalOpen}
          form={editForm}
          loading={isPending}
          clients={clientsList}
          contacts={editModalContacts}
          initialValues={selectedOpportunity || undefined}
          onClientChange={setEditModalClientId}
          onCancel={handleEditCancel}
          onSubmit={handleEditSubmit}
        />

        <UpdateStageModal
          isOpen={isStageModalOpen}
          form={stageForm}
          loading={isPending}
          onCancel={handleStageCancel}
          onSubmit={handleStageSubmit}
        />

        <AssignOpportunityModal
          isOpen={isAssignModalOpen}
          form={assignForm}
          loading={isPending}
          users={assignableUsers}
          onCancel={handleAssignCancel}
          onSubmit={handleAssignSubmit}
        />

        <EntityModalsRenderer
          modals={entityModals.modals}
          forms={entityModals.forms}
          selectedEntity={entityModals.selectedEntity}
          isPending={isPending}
          onActivityCreate={handleActivityCreate}
          onActivityEdit={handleActivityEdit}
          onProposalCreate={handleProposalCreate}
          onProposalEdit={handleProposalEdit}
          onPricingRequestCreate={handlePricingRequestCreate}
          onPricingRequestEdit={handlePricingRequestEdit}
          onPricingRequestAssign={handlePricingRequestAssign}
          onContractCreate={handleContractCreate}
          onContractEdit={handleContractEdit}
          onDocumentCreate={handleDocumentCreate}
          onNoteCreate={() => handleNoteCreate(entityModals.forms.note.create)}
          onNoteEdit={() => handleNoteEdit(entityModals.forms.note.edit)}
          closeCreateModal={entityModals.closeCreateModal}
          closeEditModal={entityModals.closeEditModal}
          closeAssignModal={entityModals.closeAssignModal}
          activityUsers={usersList}
          activityClients={clientsList}
          opportunities={opportunitiesList}
          proposals={proposalsList}
          contracts={contractsList}
          clients={clientsList}
          assignableUsers={assignableUsers}
        />
      </div>
    </div>
  );
};

export default withAuthGuard(OpportunityWorkspacePage);
