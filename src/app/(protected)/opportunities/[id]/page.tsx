"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { App, Form, Modal } from "antd";
import { useParams } from "next/navigation";
import dayjs from "dayjs";
import { withAuthGuard } from "@/hoc/withAuthGuard";
import { useOpportunitiesState, useOpportunitiesActions } from "@/providers/opportunities";
import { useClientsState, useClientsActions } from "@/providers/clients";
import { useUsersActions, useUsersState } from "@/providers/users";
import {
  EditOpportunityModal,
  UpdateStageModal,
  AssignOpportunityModal,
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
import type { IActivity } from "@/providers/activities/context";
import type { IProposal } from "@/providers/proposals/context";
import type { IPricingRequest } from "@/providers/pricing-requests/context";
import type { IContract } from "@/providers/contracts/context";
import type { IDocument } from "@/providers/documents/context";
import type { INote } from "@/providers/notes/context";

type WorkspaceEntity = IActivity | IProposal | IPricingRequest | IContract | IDocument | INote;

const OpportunityWorkspacePage = () => {
  const { styles } = useStyles();
  const { message } = App.useApp();
  const params = useParams<{ id: string }>();

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
    getOpportunity,
    getOpportunityStageHistory,
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [editModalClientId, setEditModalClientId] = useState<string | undefined>(undefined);
  const [editModalContacts, setEditModalContacts] = useState<
    Array<{ id: string; firstName: string; lastName: string; email: string }>
  >([]);

  // Forms
  const [editForm] = Form.useForm();
  const [stageForm] = Form.useForm();
  const [assignForm] = Form.useForm();

  const initializedRef = useRef(false);

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
    handleProposalSubmit,
    handleProposalApprove,
    handleProposalReject,
    handlePricingRequestCreate,
    handlePricingRequestEdit,
    handlePricingRequestAssign,
    handlePricingRequestComplete,
    handleContractCreate,
    handleContractEdit,
    handleContractActivate,
    handleContractCancel,
    handleDocumentCreate,
    handleNoteCreate,
    handleNoteEdit,
    handleDeleteEntity,
  } = useEntityActions({
    selectedOpportunity,
    selectedEntity: entityModals.selectedEntity,
    onRefresh: refreshWorkspace,
    usersList: (usersState.users || []).map(u => ({ value: u.id, label: `${u.firstName} ${u.lastName}` })),
    clientsList: (clientsState.clients || []).map((c) => ({ value: c.id, label: c.name })),
    opportunitiesList: selectedOpportunity?.id
      ? [{ value: selectedOpportunity.id, label: selectedOpportunity.title || "Opportunity" }]
      : [],
    proposalsList: (workspaceData?.proposals || [])
      .map((p) => ({ value: p.id, label: p.title || "Proposal" }))
      .filter((p): p is { value: string; label: string } => Boolean(p.value)),
    contractsList: (workspaceData?.contracts || [])
      .map((c) => ({ value: c.id, label: c.title || c.contractNumber || "Contract" }))
      .filter((c): c is { value: string; label: string } => Boolean(c.value)),
  });

  // Memoized lists
  const clientsList = useMemo(
    () => (clientsState.clients || []).map((client) => ({ value: client.id, label: client.name })),
    [clientsState.clients],
  );

  const usersList = useMemo(
    () =>
      (usersState.users || []).map((item) => ({
        value: item.id,
        label: `${item.firstName} ${item.lastName}`,
      })),
    [usersState.users],
  );

  const opportunitiesList = useMemo(
    () =>
      selectedOpportunity?.id
        ? [{ value: selectedOpportunity.id, label: selectedOpportunity.title || "Opportunity" }]
        : [],
    [selectedOpportunity?.id, selectedOpportunity?.title],
  );

  const proposalsList = useMemo(
    () =>
      (workspaceData?.proposals || [])
        .map((proposal) => ({ value: proposal.id, label: proposal.title || "Proposal" }))
        .filter((item): item is { value: string; label: string } => Boolean(item.value)),
    [workspaceData?.proposals],
  );

  const contractsList = useMemo(
    () =>
      (workspaceData?.contracts || [])
        .map((contract) => ({
          value: contract.id,
          label: contract.title || contract.contractNumber || "Contract",
        }))
        .filter((item): item is { value: string; label: string } => Boolean(item.value)),
    [workspaceData?.contracts],
  );

  // Fetch opportunities
  // Initialize page
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      clientsActions.getClients({ isActive: true, pageNumber: 1, pageSize: 1000 });
      loadUsers();
      usersActions.getUsers({ isActive: true, pageNumber: 1, pageSize: 1000 });
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

  // Set page title
  useEffect(() => {
    if (selectedOpportunity?.title) {
      document.title = `${selectedOpportunity.title} - Workspace | Selling Point`;
    } else {
      document.title = "Opportunity Workspace | Selling Point";
    }
  }, [selectedOpportunity?.title]);

  // Load workspace data
  useEffect(() => {
    loadWorkspaceData(selectedOpportunity);
  }, [selectedOpportunity?.id, selectedOpportunity?.clientId]);

  // Load contacts for edit modal
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

  const handleEditEntity = (type: EntityType, entity: WorkspaceEntity) => {
    entityModals.openEditModal(type, entity);
    if (type === "activity" && 'dueDate' in entity) {
      entityModals.forms.activity.edit.setFieldsValue({
        ...entity,
        dueDate: entity?.dueDate ? dayjs(entity.dueDate) : undefined,
      });
    } else if (type === "contract" && 'startDate' in entity && 'endDate' in entity) {
      entityModals.forms.contract.edit.setFieldsValue({
        ...entity,
        startDate: entity?.startDate ? dayjs(entity.startDate) : undefined,
        endDate: entity?.endDate ? dayjs(entity.endDate) : undefined,
      });
    }
  };

  const handleAssignEntity = (type: EntityType, entity: WorkspaceEntity) => {
    if (type === "pricingRequest") {
      entityModals.openAssignModal(type, entity);
    }
  };

  const handleCompleteEntity = async (type: EntityType, entity: WorkspaceEntity) => {
    if (type === "pricingRequest") {
      await handlePricingRequestComplete(entity);
    }
  };

  const handleActivateEntity = async (type: EntityType, entity: WorkspaceEntity) => {
    if (type === "contract") {
      await handleContractActivate(entity);
    }
  };

  const handleCancelEntity = async (type: EntityType, entity: WorkspaceEntity) => {
    if (type === "contract") {
      await handleContractCancel(entity);
    }
  };

  const handleSubmitEntity = async (type: EntityType, entity: WorkspaceEntity) => {
    if (type === "proposal") {
      await handleProposalSubmit(entity);
    }
  };

  const handleApproveEntity = async (type: EntityType, entity: WorkspaceEntity) => {
    if (type === "proposal") {
      await handleProposalApprove(entity);
    }
  };

  const handleRejectEntity = async (type: EntityType, entity: WorkspaceEntity) => {
    if (type === "proposal") {
      await handleProposalReject(entity);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
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
          onActivateEntity={handleActivateEntity}
          onCancelEntity={handleCancelEntity}
          onSubmitEntity={handleSubmitEntity}
          onApproveEntity={handleApproveEntity}
          onRejectEntity={handleRejectEntity}
          onDeleteEntity={handleDeleteEntity}
          onRefreshWorkspace={refreshWorkspace}
          onBackToOpportunities={() => filters.navigateToList(filters.buildQueryString())}
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
          selectedEntity={entityModals.selectedEntity || undefined}
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
