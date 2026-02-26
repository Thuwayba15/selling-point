"use client";

import { useEffect, useRef, useState } from "react";
import { App, Button, Form, Input, Modal, Select } from "antd";
import { withAuthGuard } from "@/hoc/withAuthGuard";
import { useAuthState } from "@/providers/auth";
import { useOpportunitiesState, useOpportunitiesActions } from "@/providers/opportunities";
import { useClientsState, useClientsActions } from "@/providers/clients";
import {
  OpportunitiesHeader,
  OpportunitiesFilters,
  OpportunitiesTable,
  OpportunityDetails,
  OpportunityActions,
  OpportunityForm,
  OpportunitiesPipeline,
  OpportunityStageHistory,
} from "@/components/opportunities";
import { useStyles } from "@/components/opportunities/style";
import { IOpportunity } from "@/providers/opportunities/context";

const OpportunitiesPage = () => {
  const { styles } = useStyles();
  const { message } = App.useApp();
  const { user } = useAuthState();
  const {
    isPending,
    isLoadingDetails,
    isError,
    errorMessage,
    opportunities,
    opportunity,
    pagination,
    pipeline,
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

  // Clients provider
  const clientsState = useClientsState();
  const clientsActions = useClientsActions();

  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);
  const [clientId, setClientId] = useState<string | undefined>(undefined);
  const [stage, setStage] = useState<number | undefined>(undefined);
  const [ownerId, setOwnerId] = useState<string | undefined>(undefined);
  const [showMyOpportunities, setShowMyOpportunities] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<IOpportunity | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [stageForm] = Form.useForm();
  const [assignForm] = Form.useForm();

  const initializedRef = useRef(false);

  // Initialize data on mount
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      // Fetch clients list
      clientsActions.getClients({
        pageNumber: 1,
        pageSize: 1000,
      });
      // Fetch opportunities
      getOpportunities({ pageNumber: currentPage, pageSize });
      getOpportunityPipeline();
    }
  }, []);

  // Map clients for the form
  const clientsList = (clientsState.clients || []).map((client) => ({
    id: client.id,
    name: client.name,
  }));

  const fetchOpportunities = async (
    params: {
      searchTerm?: string;
      clientId?: string;
      stage?: number;
      ownerId?: string;
      pageNumber: number;
      pageSize: number;
    },
    useMy = showMyOpportunities
  ) => {
    if (useMy) {
      await getMyOpportunities({
        stage: params.stage,
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
      });
      return;
    }

    await getOpportunities(params);
  };

  const fetchPipeline = async (overrideOwnerId?: string, useMy = showMyOpportunities) => {
    const pipelineOwnerId = useMy ? user?.id : overrideOwnerId ?? ownerId;
    await getOpportunityPipeline({ ownerId: pipelineOwnerId });
  };

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      fetchOpportunities({ pageNumber: currentPage, pageSize });
      fetchPipeline();
    }
  }, []);

  useEffect(() => {
    if (selectedOpportunity?.id) {
      getOpportunity(selectedOpportunity.id);
      getOpportunityStageHistory(selectedOpportunity.id);
    }
  }, [selectedOpportunity?.id]);

  useEffect(() => {
    if (isError && errorMessage) {
      message.error(errorMessage);
      clearError();
    }
  }, [isError, errorMessage]);

  const handleCreateClick = () => {
    createForm.resetFields();
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async (values: Partial<IOpportunity>) => {
    const success = await createOpportunity(values);
    if (success) {
      message.success("Opportunity created successfully");
      setIsCreateModalOpen(false);
      createForm.resetFields();
      await fetchOpportunities(
        {
          searchTerm,
          clientId,
          stage,
          ownerId,
          pageNumber: 1,
          pageSize,
        },
        showMyOpportunities
      );
      await fetchPipeline(ownerId, showMyOpportunities);
      setCurrentPage(1);
    }
  };

  const handleCreateCancel = () => {
    setIsCreateModalOpen(false);
    createForm.resetFields();
  };

  const handleEdit = () => {
    if (!selectedOpportunity) return;
    editForm.setFieldsValue(selectedOpportunity);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (values: Partial<IOpportunity>) => {
    if (!selectedOpportunity) return;

    const success = await updateOpportunity(selectedOpportunity.id, values);
    if (success) {
      message.success("Opportunity updated successfully");
      setIsEditModalOpen(false);
      editForm.resetFields();
      await fetchOpportunities(
        {
          searchTerm,
          clientId,
          stage,
          ownerId,
          pageNumber: currentPage,
          pageSize,
        },
        showMyOpportunities
      );
      if (selectedOpportunity.id === opportunity?.id) {
        await getOpportunity(selectedOpportunity.id);
      }
      await fetchPipeline(ownerId, showMyOpportunities);
    }
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    editForm.resetFields();
  };

  const handleUpdateStage = () => {
    if (!selectedOpportunity) return;
    stageForm.setFieldsValue({
      stage: selectedOpportunity.stage,
      reason: "",
    });
    setIsStageModalOpen(true);
  };

  const handleStageSubmit = async (values: { stage: number; reason?: string }) => {
    if (!selectedOpportunity) return;

    const success = await updateOpportunityStage(selectedOpportunity.id, values.stage, values.reason);
    if (success) {
      message.success("Stage updated successfully");
      setIsStageModalOpen(false);
      stageForm.resetFields();
      await fetchOpportunities(
        {
          searchTerm,
          clientId,
          stage,
          ownerId,
          pageNumber: currentPage,
          pageSize,
        },
        showMyOpportunities
      );
      await getOpportunity(selectedOpportunity.id);
      await getOpportunityStageHistory(selectedOpportunity.id);
      await fetchPipeline(ownerId, showMyOpportunities);
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
      await fetchOpportunities(
        {
          searchTerm,
          clientId,
          stage,
          ownerId,
          pageNumber: currentPage,
          pageSize,
        },
        showMyOpportunities
      );
      await getOpportunity(selectedOpportunity.id);
      await fetchPipeline(ownerId, showMyOpportunities);
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
      await fetchOpportunities(
        {
          searchTerm,
          clientId,
          stage,
          ownerId,
          pageNumber: currentPage,
          pageSize,
        },
        showMyOpportunities
      );
      await fetchPipeline(ownerId, showMyOpportunities);
    }
  };

  const handleSelectOpportunity = (item: IOpportunity) => {
    setSelectedOpportunity(item);
  };

  const handleApplyFilters = (filters: {
    searchTerm?: string;
    clientId?: string;
    stage?: number;
    ownerId?: string;
  }) => {
    setSearchTerm(filters.searchTerm);
    setClientId(filters.clientId);
    setStage(filters.stage);
    setOwnerId(filters.ownerId);
    setCurrentPage(1);
    fetchOpportunities(
      {
        ...filters,
        pageNumber: 1,
        pageSize,
      },
      showMyOpportunities
    );
    fetchPipeline(filters.ownerId, showMyOpportunities);
  };

  const handleClearFilters = () => {
    setSearchTerm(undefined);
    setClientId(undefined);
    setStage(undefined);
    setOwnerId(undefined);
    setCurrentPage(1);
    fetchOpportunities(
      {
        pageNumber: 1,
        pageSize,
      },
      showMyOpportunities
    );
    fetchPipeline(undefined, showMyOpportunities);
  };

  const handleShowMyOpportunitiesChange = (value: boolean) => {
    setShowMyOpportunities(value);
    if (value) setOwnerId(undefined);
    setCurrentPage(1);
    fetchOpportunities(
      {
        searchTerm,
        clientId,
        stage,
        ownerId,
        pageNumber: 1,
        pageSize,
      },
      value
    );
    fetchPipeline(ownerId, value);
  };

  const handlePaginationChange = (page: number, newPageSize: number) => {
    setCurrentPage(page);
    setPageSize(newPageSize);
    fetchOpportunities(
      {
        searchTerm,
        clientId,
        stage,
        ownerId,
        pageNumber: page,
        pageSize: newPageSize,
      },
      showMyOpportunities
    );
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        <OpportunitiesHeader onCreateClick={handleCreateClick} />

        <OpportunitiesFilters
          onApplyFilters={handleApplyFilters}
          onClear={handleClearFilters}
          clients={clientsList}
          showMyOpportunities={showMyOpportunities}
          onShowMyOpportunitiesChange={handleShowMyOpportunitiesChange}
        />

        <OpportunitiesTable
          opportunities={opportunities || []}
          loading={isPending}
          pagination={pagination}
          selectedOpportunityId={selectedOpportunity?.id}
          onSelectOpportunity={handleSelectOpportunity}
          onPaginationChange={handlePaginationChange}
        />

        {selectedOpportunity && (
          <div className={styles.selectedRow}>
            <div className={styles.detailsPanel}>
              <OpportunityDetails opportunity={opportunity || null} loading={isLoadingDetails} />
            </div>
            <OpportunityActions
              opportunity={selectedOpportunity}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onUpdateStage={handleUpdateStage}
              onAssign={handleAssign}
            />
          </div>
        )}

        {/* Pipeline Overview shows statistics by stage */}
        {/* <div className={styles.insightsRow}>
          <OpportunitiesPipeline pipeline={pipeline} loading={isLoadingDetails} />
          <OpportunityStageHistory
            stageHistory={stageHistory}
            loading={isLoadingDetails}
            hasSelection={Boolean(selectedOpportunity)}
          />
        </div> */}

        <div style={{ marginBottom: "24px" }}>
          <OpportunityStageHistory
            stageHistory={stageHistory}
            loading={isLoadingDetails}
            hasSelection={Boolean(selectedOpportunity)}
          />
        </div>

        <Modal
          title="Create Opportunity"
          open={isCreateModalOpen}
          onCancel={handleCreateCancel}
          footer={null}
          width={640}
        >
          <OpportunityForm
            form={createForm}
            onSubmit={handleCreateSubmit}
            onCancel={handleCreateCancel}
            loading={isPending}
            clients={clientsList}
          />
        </Modal>

        <Modal
          title="Edit Opportunity"
          open={isEditModalOpen}
          onCancel={handleEditCancel}
          footer={null}
          width={640}
        >
          <OpportunityForm
            form={editForm}
            initialValues={selectedOpportunity || undefined}
            onSubmit={handleEditSubmit}
            onCancel={handleEditCancel}
            loading={isPending}
            clients={clientsList}
          />
        </Modal>

        <Modal
          title="Update Stage"
          open={isStageModalOpen}
          onCancel={handleStageCancel}
          footer={null}
          width={480}
        >
          <Form form={stageForm} layout="vertical" onFinish={handleStageSubmit}>
            <Form.Item
              name="stage"
              label="Stage"
              rules={[{ required: true, message: "Please select a stage" }]}
            >
              <Select
                options={[
                  { label: "Lead", value: 1 },
                  { label: "Qualified", value: 2 },
                  { label: "Proposal", value: 3 },
                  { label: "Negotiation", value: 4 },
                  { label: "Closed Won", value: 5 },
                  { label: "Closed Lost", value: 6 },
                ]}
              />
            </Form.Item>

            <Form.Item name="reason" label="Reason">
              <Input.TextArea rows={3} placeholder="Optional reason for stage change" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={isPending} block>
                Update Stage
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Assign Opportunity"
          open={isAssignModalOpen}
          onCancel={handleAssignCancel}
          footer={null}
          width={480}
        >
          <Form form={assignForm} layout="vertical" onFinish={handleAssignSubmit}>
            <Form.Item
              name="userId"
              label="User ID"
              rules={[{ required: true, message: "Please enter a user id" }]}
            >
              <Input placeholder="Sales rep user id" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={isPending} block>
                Assign Opportunity
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default withAuthGuard(OpportunitiesPage);
