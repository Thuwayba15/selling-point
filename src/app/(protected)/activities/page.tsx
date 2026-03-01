"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Modal, Form, App, Tabs, Input, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { withAuthGuard } from "@/hoc/withAuthGuard";
import { useRbac } from "@/hooks/useRbac";
import { useStyles } from "@/components/activities/style";
import {
  ActivitiesFilters,
  ActivitiesTable,
  ActivityDetails,
  ActivityForm,
  type Activity,
} from "@/components/activities";
import { useActivitiesState, useActivitiesActions } from "@/providers/activities";
import { useClientsState, useClientsActions } from "@/providers/clients";
import { useOpportunitiesState, useOpportunitiesActions } from "@/providers/opportunities";
import { useProposalsState, useProposalsActions } from "@/providers/proposals";
import { useContractsState, useContractsActions } from "@/providers/contracts";
import { useUsersState, useUsersActions } from "@/providers/users";
import { RelatedToType, ActivityType, Priority } from "@/providers/activities/context";
import type { IActivity, ActivityStatus } from "@/providers/activities/context";

const ActivitiesPage = () => {
  const { styles } = useStyles();
  const { message, modal } = App.useApp();
  const { can } = useRbac();

  // Provider state and actions
  const activitiesState = useActivitiesState();
  const activitiesActions = useActivitiesActions();
  const clientsState = useClientsState();
  const clientsActions = useClientsActions();
  const opportunitiesState = useOpportunitiesState();
  const opportunitiesActions = useOpportunitiesActions();
  const proposalsState = useProposalsState();
  const proposalsActions = useProposalsActions();
  const contractsState = useContractsState();
  const contractsActions = useContractsActions();
  const usersState = useUsersState();
  const usersActions = useUsersActions();

  // Use ref to track if we've initialized
  const initializedRef = useRef(false);

  // Filter state
  const [filterType, setFilterType] = useState<ActivityType | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<ActivityStatus | undefined>(undefined);
  const [filterPriority, setFilterPriority] = useState<Priority | undefined>(undefined);
  const [filterAssignedToId, setFilterAssignedToId] = useState<string | undefined>(undefined);
  const [filterRelatedToType, setFilterRelatedToType] = useState<RelatedToType | undefined>(
    undefined,
  );
  const [filterRelatedToId, setFilterRelatedToId] = useState<string | undefined>(undefined);

  // Selected activity
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Active tab - start with "my" to match initial data load
  const [activeTab, setActiveTab] = useState<string>("my");

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [completeForm] = Form.useForm();

  // Initialize data on mount ONLY
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      usersActions.getUsers({ isActive: true, pageSize: 1000 });
      activitiesActions.getMyActivities({ pageNumber: 1, pageSize: 10 });
      // Load data for dropdowns
      clientsActions.getClients({ pageSize: 100 });
      opportunitiesActions.getOpportunities({ pageSize: 100 });
      proposalsActions.getProposals({ pageSize: 100 });
      contractsActions.getContracts({ pageSize: 100 });
    }
  }, []);

  // Handle tab change
  const handleTabChange = useCallback(
    (key: string) => {
      setActiveTab(key);
      setCurrentPage(1);
      setSelectedActivity(null);

      switch (key) {
        case "all":
          activitiesActions.getActivities({
            type: filterType,
            status: filterStatus,
            assignedToId: filterAssignedToId,
            relatedToType: filterRelatedToType,
            relatedToId: filterRelatedToId,
            pageNumber: 1,
            pageSize,
          });
          break;
        case "my":
          activitiesActions.getMyActivities({
            status: filterStatus,
            pageNumber: 1,
            pageSize,
          });
          break;
        case "upcoming":
          activitiesActions.getUpcomingActivities({
            daysAhead: 7,
            pageNumber: 1,
            pageSize,
          });
          break;
        case "overdue":
          activitiesActions.getOverdueActivities({
            pageNumber: 1,
            pageSize,
          });
          break;
      }
    },
    [
      filterType,
      filterStatus,
      filterAssignedToId,
      filterRelatedToType,
      filterRelatedToId,
      pageSize,
      activitiesActions,
    ],
  );

  // Handle filter application
  const handleApplyFilters = useCallback(
    (filters: {
      type?: ActivityType;
      status?: ActivityStatus;
      priority?: Priority;
      assignedToId?: string;
      relatedToType?: RelatedToType;
      relatedToId?: string;
    }) => {
      setFilterType(filters.type);
      setFilterStatus(filters.status);
      setFilterPriority(filters.priority);
      setFilterAssignedToId(filters.assignedToId);
      setFilterRelatedToType(filters.relatedToType);
      setFilterRelatedToId(filters.relatedToId);
      setCurrentPage(1);

      if (activeTab === "all") {
        activitiesActions.getActivities({
          type: filters.type,
          status: filters.status,
          assignedToId: filters.assignedToId,
          relatedToType: filters.relatedToType,
          relatedToId: filters.relatedToId,
          pageNumber: 1,
          pageSize,
        });
      } else if (activeTab === "my") {
        activitiesActions.getMyActivities({
          status: filters.status,
          pageNumber: 1,
          pageSize,
        });
      }
    },
    [activeTab, pageSize, activitiesActions],
  );

  // Handle filter clearing
  const handleClearFilters = useCallback(() => {
    setFilterType(undefined);
    setFilterStatus(undefined);
    setFilterPriority(undefined);
    setFilterAssignedToId(undefined);
    setFilterRelatedToType(undefined);
    setFilterRelatedToId(undefined);
    setCurrentPage(1);
    handleTabChange(activeTab);
  }, [activeTab, handleTabChange]);

  // Handle pagination change
  const handlePaginationChange = useCallback(
    (page: number, size: number) => {
      setCurrentPage(page);
      setPageSize(size);

      switch (activeTab) {
        case "all":
          activitiesActions.getActivities({
            type: filterType,
            status: filterStatus,
            assignedToId: filterAssignedToId,
            relatedToType: filterRelatedToType,
            relatedToId: filterRelatedToId,
            pageNumber: page,
            pageSize: size,
          });
          break;
        case "my":
          activitiesActions.getMyActivities({
            status: filterStatus,
            pageNumber: page,
            pageSize: size,
          });
          break;
        case "upcoming":
          activitiesActions.getUpcomingActivities({
            daysAhead: 7,
            pageNumber: page,
            pageSize: size,
          });
          break;
        case "overdue":
          activitiesActions.getOverdueActivities({
            pageNumber: page,
            pageSize: size,
          });
          break;
      }
    },
    [
      activeTab,
      filterType,
      filterStatus,
      filterAssignedToId,
      filterRelatedToType,
      filterRelatedToId,
      activitiesActions,
    ],
  );

  // Load activity details when selected
  useEffect(() => {
    if (selectedActivity?.id) {
      activitiesActions.getActivity(selectedActivity.id);
    }
  }, [selectedActivity?.id]);

  // Show error messages
  useEffect(() => {
    if (activitiesState.isError && activitiesState.errorMessage) {
      message.error(activitiesState.errorMessage);
      activitiesActions.clearError();
    }
  }, [activitiesState.isError, activitiesState.errorMessage]);

  // Handlers
  const handleCreateClick = () => {
    createForm.resetFields();
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async (values: Partial<IActivity>) => {
    try {
      await activitiesActions.createActivity(values);
      message.success("Activity created successfully");
      setIsCreateModalOpen(false);
      createForm.resetFields();
      // Refresh list
      handleTabChange(activeTab);
    } catch (error) {
      message.error("Failed to create activity");
    }
  };

  const handleCreateCancel = () => {
    setIsCreateModalOpen(false);
    createForm.resetFields();
  };

  // Edit handlers
  const handleEdit = async (activity?: Activity) => {
    const activityToEdit = activity || selectedActivity;
    if (!activityToEdit?.id) return;
    
    // Load full activity details if not already loaded
    await activitiesActions.getActivity(activityToEdit.id);
    const fullActivity = activitiesState.activity;
    
    if (!fullActivity) return;
    
    const formValues: Record<string, unknown> = {
      subject: fullActivity.subject || "",
      type: fullActivity.type || ActivityType.Task,
      priority: fullActivity.priority || Priority.Medium,
      dueDate: fullActivity.dueDate ? dayjs(fullActivity.dueDate) : undefined,
      assignedToId: fullActivity.assignedToId || "",
      description: fullActivity.description || "",
      location: fullActivity.location || "",
      duration: fullActivity.duration || undefined,
      relatedToType: fullActivity.relatedToType || undefined,
      relatedToId: fullActivity.relatedToType ? fullActivity.relatedToId : undefined,
    };
    editForm.setFieldsValue(formValues);
    setSelectedActivity(activityToEdit);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (values: Partial<IActivity>) => {
    if (!selectedActivity?.id) return;

    try {
      await activitiesActions.updateActivity(selectedActivity.id, values);
      message.success("Activity updated successfully");
      setIsEditModalOpen(false);
      editForm.resetFields();
      // Refresh the selected activity's details
      await activitiesActions.getActivity(selectedActivity.id);
      // Refresh list
      handleTabChange(activeTab);
    } catch (error) {
      message.error("Failed to update activity");
    }
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    editForm.resetFields();
  };

  // Complete handler
  const handleCompleteClick = (activity?: Activity) => {
    const activityToComplete = activity || selectedActivity;
    if (!activityToComplete?.id) return;
    
    setSelectedActivity(activityToComplete);
    completeForm.resetFields();
    setIsCompleteModalOpen(true);
  };

  const handleCompleteSubmit = async () => {
    if (!selectedActivity?.id) return;

    const values = completeForm.getFieldsValue();
    try {
      await activitiesActions.completeActivity(selectedActivity.id, values.outcome);
      message.success("Activity marked as complete");
      setIsCompleteModalOpen(false);
      completeForm.resetFields();
      // Refresh the selected activity's details
      await activitiesActions.getActivity(selectedActivity.id);
      // Refresh list
      handleTabChange(activeTab);
    } catch (error) {
      message.error("Failed to complete activity");
    }
  };

  const handleCompleteCancel = () => {
    setIsCompleteModalOpen(false);
    completeForm.resetFields();
  };

  // Cancel handler
  const handleCancelActivity = async (activity?: Activity) => {
    const activityToCancel = activity || selectedActivity;
    if (!activityToCancel?.id) return;

    modal.confirm({
      title: "Cancel Activity",
      content: "Are you sure you want to cancel this activity?",
      onOk: async () => {
        try {
          await activitiesActions.cancelActivity(activityToCancel.id);
          message.success("Activity cancelled");
          setSelectedActivity(null);
          // Refresh list
          handleTabChange(activeTab);
        } catch (error) {
          message.error("Failed to cancel activity");
        }
      },
    });
  };

  // View participants handler
  const handleViewParticipants = async () => {
    if (!selectedActivity?.id) return;
    await activitiesActions.getActivityParticipants(selectedActivity.id);
    setIsParticipantsModalOpen(true);
  };

  // Delete handler
  const handleDelete = async (activity?: Activity) => {
    const activityToDelete = activity || selectedActivity;
    if (!activityToDelete?.id) return;

    modal.confirm({
      title: "Delete Activity",
      content: "Are you sure you want to delete this activity? This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          await activitiesActions.deleteActivity(activityToDelete.id);
          message.success("Activity deleted successfully");
          setSelectedActivity(null);
          // Refresh the list
          handleTabChange(activeTab);
        } catch (error) {
          message.error("Failed to delete activity");
        }
      },
    });
  };

  // Select handler
  const handleSelectActivity = (activity: Activity) => {
    setSelectedActivity(activity);
  };

  // Prepare users for dropdowns
  const users = (usersState.users || []).map((user) => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
  }));
  const clients = clientsState.clients || [];
  const opportunities = (opportunitiesState.opportunities || [])
    .filter((o) => o.title)
    .map((o) => ({ id: o.id, title: o.title }));
  const proposals = (proposalsState.proposals || [])
    .filter((p) => p.title)
    .map((p) => ({ id: p.id, title: p.title! }));
  const contracts = (contractsState.contracts || [])
    .filter((c) => c.title)
    .map((c) => ({ id: c.id, title: c.title! }));

  const relatedTypeLabelMap: Record<RelatedToType, string> = {
    [RelatedToType.Client]: "Client",
    [RelatedToType.Opportunity]: "Opportunity",
    [RelatedToType.Proposal]: "Proposal",
    [RelatedToType.Contract]: "Contract",
    [RelatedToType.Activity]: "Activity",
  };

  const clientNameMap = new Map(clients.map((c) => [c.id, c.name]));
  const opportunityNameMap = new Map(opportunities.map((o) => [o.id, o.title]));
  const proposalNameMap = new Map(proposals.map((p) => [p.id, p.title]));
  const contractNameMap = new Map(contracts.map((c) => [c.id, c.title]));

  const getRelatedName = (activity: IActivity) => {
    if (activity.relatedToName) return activity.relatedToName;
    if (!activity.relatedToType || !activity.relatedToId) return undefined;

    switch (activity.relatedToType) {
      case RelatedToType.Client:
        return clientNameMap.get(activity.relatedToId) ?? activity.relatedToId;
      case RelatedToType.Opportunity:
        return opportunityNameMap.get(activity.relatedToId) ?? activity.relatedToId;
      case RelatedToType.Proposal:
        return proposalNameMap.get(activity.relatedToId) ?? activity.relatedToId;
      case RelatedToType.Contract:
        return contractNameMap.get(activity.relatedToId) ?? activity.relatedToId;
      case RelatedToType.Activity:
        return activity.relatedToId;
      default:
        return activity.relatedToId;
    }
  };

  const getRelatedTypeName = (activity: IActivity) => {
    if (activity.relatedToTypeName) return activity.relatedToTypeName;
    if (!activity.relatedToType) return undefined;
    return relatedTypeLabelMap[activity.relatedToType];
  };

  // Map provider data to component props
  const activities: Activity[] = (activitiesState.activities || []).map((activity) => ({
    id: activity.id,
    type: activity.type,
    typeName: activity.typeName,
    subject: activity.subject,
    description: activity.description,
    priority: activity.priority,
    priorityName: activity.priorityName,
    status: activity.status,
    statusName: activity.statusName,
    dueDate: activity.dueDate,
    completedDate: activity.completedDate,
    assignedToName: activity.assignedToName,
    relatedToTypeName: getRelatedTypeName(activity),
    relatedToName: getRelatedName(activity),
    location: activity.location,
  }));

  const renderTabContent = () => (
    <>
      <ActivitiesTable
        activities={activities}
        loading={activitiesState.isPending}
        selectedId={selectedActivity?.id}
        onSelect={handleSelectActivity}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onComplete={handleCompleteClick}
        onCancel={handleCancelActivity}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: activitiesState.pagination?.totalCount || activities.length,
          onChange: handlePaginationChange,
        }}
        headerExtra={
          can("create:activity") ? (
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateClick}>
              New Activity
            </Button>
          ) : null
        }
      />

      {selectedActivity && (
        <ActivityDetails
          activity={activitiesState.activity}
          loading={activitiesState.isLoadingDetails}
        />
      )}
    </>
  );

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        <ActivitiesFilters
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
          loading={activitiesState.isPending}
          users={users}
          clients={clients}
          opportunities={opportunities}
          proposals={proposals}
          contracts={contracts}
        />

      {renderTabContent()}
    </div>

      {/* Create Modal */}
      <Modal
        title="Create New Activity"
        open={isCreateModalOpen}
        onCancel={handleCreateCancel}
        footer={null}
        width={700}
      >
        <ActivityForm
          form={createForm}
          loading={activitiesState.isPending}
          onSubmit={handleCreateSubmit}
          onCancel={handleCreateCancel}
          users={users}
          clients={clients}
          opportunities={opportunities}
          proposals={proposals}
          contracts={contracts}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit Activity"
        open={isEditModalOpen}
        onCancel={handleEditCancel}
        footer={null}
        width={700}
      >
        <ActivityForm
          form={editForm}
          initialValues={activitiesState.activity}
          loading={activitiesState.isPending}
          onSubmit={handleEditSubmit}
          onCancel={handleEditCancel}
          users={users}
          clients={clients}
          opportunities={opportunities}
          proposals={proposals}
          contracts={contracts}
        />
      </Modal>

      {/* Complete Modal */}
      <Modal
        title="Complete Activity"
        open={isCompleteModalOpen}
        onCancel={handleCompleteCancel}
        onOk={handleCompleteSubmit}
        okText="Mark Complete"
        confirmLoading={activitiesState.isPending}
      >
        <Form form={completeForm} layout="vertical">
          <Form.Item label="Outcome" name="outcome">
            <Input.TextArea
              rows={4}
              placeholder="Enter the outcome of this activity (optional)"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Participants Modal */}
      <Modal
        title="Activity Participants"
        open={isParticipantsModalOpen}
        onCancel={() => setIsParticipantsModalOpen(false)}
        footer={null}
      >
        {activitiesState.participants && activitiesState.participants.length > 0 ? (
          <div>
            {activitiesState.participants.map((participant) => (
              <div key={participant.id} className={styles.detailRow}>
                <span className={styles.detailLabel}>{participant.userName}</span>
                <span className={styles.detailValue}>
                  {participant.userEmail} - {participant.responseStatusName}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p>No participants found for this activity.</p>
        )}
      </Modal>
    </div>
  );
};

export default withAuthGuard(ActivitiesPage);
