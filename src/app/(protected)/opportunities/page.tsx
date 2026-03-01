"use client";

import { useEffect, useRef, useState } from "react";
import { App, Button, Form, Input, Modal, Select } from "antd";
import { useRouter } from "next/navigation";
import { withAuthGuard } from "@/hoc/withAuthGuard";
import { getAxiosInstance } from "@/lib/api";
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
  OpportunityStageHistory,
} from "@/components/opportunities";
import { EntityWorkspaceTabs, WorkspaceEntityList, type WorkspaceTabItem } from "@/components/common";
import { useStyles } from "@/components/opportunities/style";
import { IOpportunity } from "@/providers/opportunities/context";
import type { IUser } from "@/providers/users/context";

const OpportunitiesPage = () => {
  const router = useRouter();
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
  const [workspaceTab, setWorkspaceTab] = useState("overview");
  const [workspaceLoading, setWorkspaceLoading] = useState(false);
  const [workspaceData, setWorkspaceData] = useState<{
    activities: Array<{ id: string; title: string; subtitle?: string }>;
    pricingRequests: Array<{ id: string; title: string; subtitle?: string }>;
    proposals: Array<{ id: string; title: string; subtitle?: string }>;
    contracts: Array<{ id: string; title: string; subtitle?: string }>;
    documents: Array<{ id: string; title: string; subtitle?: string }>;
    notes: Array<{ id: string; title: string; subtitle?: string }>;
  }>({
    activities: [],
    pricingRequests: [],
    proposals: [],
    contracts: [],
    documents: [],
    notes: [],
  });
  const [assignableUsers, setAssignableUsers] = useState<Array<{ id: string; label: string }>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [createModalClientId, setCreateModalClientId] = useState<string | undefined>(undefined);
  const [editModalClientId, setEditModalClientId] = useState<string | undefined>(undefined);
  const [createModalContacts, setCreateModalContacts] = useState<Array<{ id: string; firstName: string; lastName: string; email: string }>>([]);
  const [editModalContacts, setEditModalContacts] = useState<Array<{ id: string; firstName: string; lastName: string; email: string }>>([]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [stageForm] = Form.useForm();
  const [assignForm] = Form.useForm();

  const initializedRef = useRef(false);
  const isSalesRep = Boolean(user?.roles?.includes("SalesRep"));

  // Initialize data on mount
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      // Fetch clients list
      clientsActions.getClients({
        isActive: true,
        pageNumber: 1,
        pageSize: 1000,
      });
      // Fetch opportunities
      getOpportunities({ isActive: true, pageNumber: currentPage, pageSize });
      getOpportunityPipeline();
    }
  }, []);

  // Fetch users for assignment dropdown
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const api = getAxiosInstance();
        const { data } = await api.get("/api/users", {
          params: { isActive: true, pageNumber: 1, pageSize: 1000 },
        });
        const users = (data?.items || data || []) as IUser[];
        const options = users.map((item) => ({
          id: item.id,
          label: item.fullName || `${item.firstName || ""} ${item.lastName || ""}`.trim() || item.email,
        }));
        setAssignableUsers(options);
      } catch (error) {
        setAssignableUsers([]);
      }
    };

    loadUsers();
  }, []);

  // Fetch contacts for create modal when clientId changes
  useEffect(() => {
    if (!createModalClientId) {
      setCreateModalContacts([]);
      return;
    }
    const loadContacts = async () => {
      try {
        const api = getAxiosInstance();
        const { data } = await api.get("/api/contacts", {
          params: { clientId: createModalClientId, isActive: true, pageNumber: 1, pageSize: 1000 },
        });
        const contactsData = (data?.items || data || []) as Array<{ id: string; firstName: string; lastName: string; email: string }>;
        setCreateModalContacts(contactsData);
      } catch (error) {
        setCreateModalContacts([]);
      }
    };
    loadContacts();
  }, [createModalClientId]);

  // Fetch contacts for edit modal when clientId changes
  useEffect(() => {
    if (!editModalClientId) {
      setEditModalContacts([]);
      return;
    }
    const loadContacts = async () => {
      try {
        const api = getAxiosInstance();
        const { data } = await api.get("/api/contacts", {
          params: { clientId: editModalClientId, isActive: true, pageNumber: 1, pageSize: 1000 },
        });
        const contactsData = (data?.items || data || []) as Array<{ id: string; firstName: string; lastName: string; email: string }>;
        setEditModalContacts(contactsData);
      } catch (error) {
        setEditModalContacts([]);
      }
    };
    loadContacts();
  }, [editModalClientId]);

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
    useMy = showMyOpportunities,
  ) => {
    if (useMy) {
      await getMyOpportunities({
        stage: params.stage,
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
      });
      return;
    }

      await getOpportunities({ ...params, isActive: true });
  };

  const fetchPipeline = async (overrideOwnerId?: string, useMy = showMyOpportunities) => {
    const pipelineOwnerId = useMy ? user?.id : (overrideOwnerId ?? ownerId);
    await getOpportunityPipeline({ ownerId: pipelineOwnerId });
  };

  useEffect(() => {
    if (selectedOpportunity?.id) {
      getOpportunity(selectedOpportunity.id);
      getOpportunityStageHistory(selectedOpportunity.id);
    }
  }, [selectedOpportunity?.id]);

  useEffect(() => {
    const loadWorkspaceData = async () => {
      if (!selectedOpportunity?.id) {
        setWorkspaceData({
          activities: [],
          pricingRequests: [],
          proposals: [],
          contracts: [],
          documents: [],
          notes: [],
        });
        return;
      }

      setWorkspaceLoading(true);
      try {
        const api = getAxiosInstance();
        const [activitiesRes, pricingRequestsRes, proposalsRes, contractsRes, documentsRes, notesRes] =
          await Promise.all([
            api
              .get("/api/activities", {
                params: {
                  relatedToType: 2,
                  relatedToId: selectedOpportunity.id,
                  pageNumber: 1,
                  pageSize: 10,
                },
              })
              .catch(() => ({ data: { items: [] } })),
            api
              .get("/api/pricingrequests", {
                params: { pageNumber: 1, pageSize: 100 },
              })
              .catch(() => ({ data: { items: [] } })),
            api
              .get("/api/proposals", {
                params: { opportunityId: selectedOpportunity.id, pageNumber: 1, pageSize: 10 },
              })
              .catch(() => ({ data: { items: [] } })),
            api
              .get("/api/contracts", {
                params: {
                  clientId: selectedOpportunity.clientId,
                  pageNumber: 1,
                  pageSize: 10,
                },
              })
              .catch(() => ({ data: { items: [] } })),
            api
              .get("/api/documents", {
                params: {
                  relatedToType: 2,
                  relatedToId: selectedOpportunity.id,
                  pageNumber: 1,
                  pageSize: 10,
                },
              })
              .catch(() => ({ data: { items: [] } })),
            api
              .get("/api/notes", {
                params: {
                  relatedToType: 2,
                  relatedToId: selectedOpportunity.id,
                  pageNumber: 1,
                  pageSize: 10,
                },
              })
              .catch(() => ({ data: { items: [] } })),
          ]);

        const activities = (activitiesRes.data?.items || activitiesRes.data || []).map(
          (item: { id: string; title?: string; typeName?: string; statusName?: string }) => ({
            id: item.id,
            title: item.title || item.typeName || "Activity",
            subtitle: item.statusName,
          }),
        );

        const pricingRequests = (pricingRequestsRes.data?.items || pricingRequestsRes.data || [])
          .filter((item: { opportunityId?: string }) => item.opportunityId === selectedOpportunity.id)
          .map((item: { id: string; title?: string; statusName?: string }) => ({
            id: item.id,
            title: item.title || "Pricing Request",
            subtitle: item.statusName,
          }));

        const proposals = (proposalsRes.data?.items || proposalsRes.data || []).map(
          (item: { id: string; title?: string; statusName?: string }) => ({
            id: item.id,
            title: item.title || "Proposal",
            subtitle: item.statusName,
          }),
        );

        const contracts = (contractsRes.data?.items || contractsRes.data || []).map(
          (item: { id: string; contractNumber?: string; statusName?: string }) => ({
            id: item.id,
            title: item.contractNumber || "Contract",
            subtitle: item.statusName,
          }),
        );

        const documents = (documentsRes.data?.items || documentsRes.data || []).map(
          (item: { id: string; fileName?: string; categoryName?: string }) => ({
            id: item.id,
            title: item.fileName || "Document",
            subtitle: item.categoryName,
          }),
        );

        const notes = (notesRes.data?.items || notesRes.data || []).map(
          (item: { id: string; content?: string; createdByName?: string }) => ({
            id: item.id,
            title: item.content || "Note",
            subtitle: item.createdByName,
          }),
        );

        setWorkspaceData({ activities, pricingRequests, proposals, contracts, documents, notes });
      } finally {
        setWorkspaceLoading(false);
      }
    };

    loadWorkspaceData();
  }, [selectedOpportunity?.id, selectedOpportunity?.clientId]);

  useEffect(() => {
    if (isError && errorMessage) {
      message.error(errorMessage);
      clearError();
    }
  }, [isError, errorMessage]);

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
      await fetchOpportunities(
        {
          searchTerm,
          clientId,
          stage,
          ownerId,
          pageNumber: 1,
          pageSize,
        },
        showMyOpportunities,
      );
      await fetchPipeline(ownerId, showMyOpportunities);
      setCurrentPage(1);
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
      await fetchOpportunities(
        {
          searchTerm,
          clientId,
          stage,
          ownerId,
          pageNumber: currentPage,
          pageSize,
        },
        showMyOpportunities,
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
      await fetchOpportunities(
        {
          searchTerm,
          clientId,
          stage,
          ownerId,
          pageNumber: currentPage,
          pageSize,
        },
        showMyOpportunities,
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
        showMyOpportunities,
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
        showMyOpportunities,
      );
      await fetchPipeline(ownerId, showMyOpportunities);
    }
  };

  const handleSelectOpportunity = (item: IOpportunity) => {
    const query = new URLSearchParams();

    if (searchTerm) query.set("searchTerm", searchTerm);
    if (clientId) query.set("clientId", clientId);
    if (stage) query.set("stage", String(stage));
    if (ownerId) query.set("ownerId", ownerId);
    if (showMyOpportunities) query.set("my", "1");
    query.set("page", String(currentPage));
    query.set("pageSize", String(pageSize));

    const queryString = query.toString();
    router.push(`/opportunities/${item.id}${queryString ? `?${queryString}` : ""}`);
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
      showMyOpportunities,
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
      showMyOpportunities,
    );
    fetchPipeline(undefined, showMyOpportunities);
  };

  const handleShowMyOpportunitiesChange = (value: boolean) => {
    if (!isSalesRep) return;
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
      value,
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
      showMyOpportunities,
    );
  };

  const workspaceItems: WorkspaceTabItem[] = [
    {
      key: "overview",
      label: "Overview",
      content: (
        <>
          <div className={styles.selectedRow}>
            <div className={styles.detailsPanel}>
              <OpportunityDetails opportunity={opportunity || null} loading={isLoadingDetails} />
            </div>
            {selectedOpportunity && (
              <OpportunityActions
                opportunity={selectedOpportunity}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onUpdateStage={handleUpdateStage}
                onAssign={handleAssign}
              />
            )}
          </div>
          <div className={styles.sectionSpacing}>
            <OpportunityStageHistory
              stageHistory={stageHistory}
              loading={isLoadingDetails}
              hasSelection={Boolean(selectedOpportunity)}
            />
          </div>
        </>
      ),
    },
    {
      key: "activities",
      label: "Activities",
      content: (
        <WorkspaceEntityList
          items={workspaceData.activities}
          emptyText={workspaceLoading ? "Loading activities..." : "No activities for this opportunity"}
        />
      ),
    },
    {
      key: "pricing",
      label: "Pricing Requests",
      content: (
        <WorkspaceEntityList
          items={workspaceData.pricingRequests}
          emptyText={workspaceLoading ? "Loading pricing requests..." : "No pricing requests for this opportunity"}
        />
      ),
    },
    {
      key: "proposals",
      label: "Proposals",
      content: (
        <WorkspaceEntityList
          items={workspaceData.proposals}
          emptyText={workspaceLoading ? "Loading proposals..." : "No proposals for this opportunity"}
        />
      ),
    },
    {
      key: "contracts",
      label: "Contracts",
      content: (
        <WorkspaceEntityList
          items={workspaceData.contracts}
          emptyText={workspaceLoading ? "Loading contracts..." : "No contracts linked to this opportunity's client"}
        />
      ),
    },
    {
      key: "documents",
      label: "Documents",
      content: (
        <WorkspaceEntityList
          items={workspaceData.documents}
          emptyText={workspaceLoading ? "Loading documents..." : "No documents for this opportunity"}
        />
      ),
    },
    {
      key: "notes",
      label: "Notes",
      content: (
        <WorkspaceEntityList
          items={workspaceData.notes}
          emptyText={workspaceLoading ? "Loading notes..." : "No notes for this opportunity"}
        />
      ),
    },
  ];

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        <OpportunitiesFilters
          onApplyFilters={handleApplyFilters}
          onClear={handleClearFilters}
          clients={clientsList}
          showMyOpportunities={showMyOpportunities}
          onShowMyOpportunitiesChange={handleShowMyOpportunitiesChange}
          showMyOpportunitiesToggle={isSalesRep}
        />

        <OpportunitiesTable
          opportunities={opportunities || []}
          loading={isPending}
          pagination={pagination}
          selectedOpportunityId={selectedOpportunity?.id}
          onSelectOpportunity={handleSelectOpportunity}
          onPaginationChange={handlePaginationChange}
          headerExtra={
            user ? (
              <Button type="primary" onClick={handleCreateClick}>
                Create Opportunity
              </Button>
            ) : null
          }
        />

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
            contacts={createModalContacts}
            onClientChange={setCreateModalClientId}
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
            contacts={editModalContacts}
            onClientChange={setEditModalClientId}
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

            <Form.Item name="notes" label="Notes">
              <Input.TextArea rows={3} placeholder="Optional notes for stage change" />
            </Form.Item>

            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => prevValues.stage !== currentValues.stage}
            >
              {({ getFieldValue }) =>
                getFieldValue("stage") === 6 ? (
                  <Form.Item
                    name="lossReason"
                    label="Loss Reason"
                    rules={[{ required: true, message: "Loss reason is required for Closed Lost" }]}
                  >
                    <Input.TextArea rows={3} placeholder="Reason for lost opportunity" />
                  </Form.Item>
                ) : null
              }
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
              label="Assign To"
              rules={[{ required: true, message: "Please select a user" }]}
            >
              <Select
                placeholder="Select a user"
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
                options={assignableUsers.map((item) => ({
                  value: item.id,
                  label: item.label,
                }))}
              />
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
