"use client";

import { useEffect, useRef, useState } from "react";
import { App, Button, Form, Input, Modal, Select } from "antd";
import { withAuthGuard } from "@/hoc/withAuthGuard";
import { getAxiosInstance } from "@/lib/api";
import { usePricingRequestsState, usePricingRequestsActions } from "@/providers/pricing-requests";
import { useOpportunitiesState, useOpportunitiesActions } from "@/providers/opportunities";
import {
  PricingRequestsHeader,
  PricingRequestsFilters,
  PricingRequestsTable,
  PricingRequestDetails,
  PricingRequestActions,
  PricingRequestForm,
} from "@/components/pricing-requests";
import { useStyles } from "@/components/pricing-requests/style";
import { IPricingRequest } from "@/providers/pricing-requests/context";
import { useRbac } from "@/hooks/useRbac";
import type { IUser } from "@/providers/users/context";

const PricingRequestsPage = () => {
  const { styles } = useStyles();
  const { message } = App.useApp();
  const { can } = useRbac();

  const {
    isPending,
    isLoadingDetails,
    isError,
    errorMessage,
    pricingRequests,
    pricingRequest,
    pagination,
  } = usePricingRequestsState();

  const {
    getPricingRequests,
    getPendingPricingRequests,
    getMyPricingRequests,
    getPricingRequest,
    createPricingRequest,
    updatePricingRequest,
    assignPricingRequest,
    completePricingRequest,
    clearError,
    clearPricingRequest,
  } = usePricingRequestsActions();

  // Opportunities provider for dropdown
  const opportunitiesState = useOpportunitiesState();
  const opportunitiesActions = useOpportunitiesActions();

  const [status, setStatus] = useState<number | undefined>(undefined);
  const [priority, setPriority] = useState<number | undefined>(undefined);
  const [assignedToId, setAssignedToId] = useState<string | undefined>(undefined);
  const [selectedPricingRequest, setSelectedPricingRequest] = useState<IPricingRequest | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewMode, setViewMode] = useState<"all" | "pending" | "mine">("all");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignableUsers, setAssignableUsers] = useState<Array<{ id: string; label: string }>>([]);
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [assignForm] = Form.useForm();

  const initializedRef = useRef(false);

  // Initialize data on mount
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      // Fetch opportunities for dropdown
      opportunitiesActions.getOpportunities({
        pageNumber: 1,
        pageSize: 1000,
      });
      // Fetch pricing requests
      getPricingRequests({ pageNumber: currentPage, pageSize });
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

  // Load pricing request details when selected
  useEffect(() => {
    if (selectedPricingRequest?.id) {
      getPricingRequest(selectedPricingRequest.id);
    }
  }, [selectedPricingRequest?.id]);

  // Show error messages
  useEffect(() => {
    if (isError && errorMessage) {
      message.error(errorMessage);
      clearError();
    }
  }, [isError, errorMessage]);

  // Map opportunities for the form
  const opportunitiesList = (opportunitiesState.opportunities || []).map((opp) => ({
    id: opp.id,
    title: opp.title,
  }));

  const fetchPricingRequests = async (
    params: {
      status?: number;
      priority?: number;
      assignedToId?: string;
      pageNumber: number;
      pageSize: number;
    },
    mode: "all" | "pending" | "mine" = viewMode,
  ) => {
    if (mode === "pending") {
      await getPendingPricingRequests({
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
      });
      return;
    }

    if (mode === "mine") {
      await getMyPricingRequests({
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
      });
      return;
    }

    await getPricingRequests(params);
  };

  const handleCreateClick = () => {
    createForm.resetFields();
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async (values: Partial<IPricingRequest>) => {
    const success = await createPricingRequest(values);
    if (success) {
      message.success("Pricing request created successfully");
      setIsCreateModalOpen(false);
      createForm.resetFields();
      await fetchPricingRequests(
        {
          status,
          priority,
          assignedToId,
          pageNumber: 1,
          pageSize,
        },
        viewMode,
      );
      setCurrentPage(1);
    }
  };

  const handleCreateCancel = () => {
    setIsCreateModalOpen(false);
    createForm.resetFields();
  };

  const handleEdit = () => {
    if (!selectedPricingRequest) return;
    editForm.setFieldsValue(selectedPricingRequest);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (values: Partial<IPricingRequest>) => {
    if (!selectedPricingRequest) return;

    const success = await updatePricingRequest(selectedPricingRequest.id, values);
    if (success) {
      message.success("Pricing request updated successfully");
      setIsEditModalOpen(false);
      editForm.resetFields();
      await fetchPricingRequests(
        {
          status,
          priority,
          assignedToId,
          pageNumber: currentPage,
          pageSize,
        },
        viewMode,
      );
      if (selectedPricingRequest.id === pricingRequest?.id) {
        await getPricingRequest(selectedPricingRequest.id);
      }
    }
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    editForm.resetFields();
  };

  const handleAssign = () => {
    if (!selectedPricingRequest) return;
    assignForm.resetFields();
    setIsAssignModalOpen(true);
  };

  const handleAssignSubmit = async (values: { userId: string }) => {
    if (!selectedPricingRequest) return;

    const success = await assignPricingRequest(selectedPricingRequest.id, values.userId);
    if (success) {
      message.success("Pricing request assigned successfully");
      setIsAssignModalOpen(false);
      assignForm.resetFields();
      await fetchPricingRequests(
        {
          status,
          priority,
          assignedToId,
          pageNumber: currentPage,
          pageSize,
        },
        viewMode,
      );
      await getPricingRequest(selectedPricingRequest.id);
    }
  };

  const handleAssignCancel = () => {
    setIsAssignModalOpen(false);
    assignForm.resetFields();
  };

  const handleComplete = async () => {
    if (!selectedPricingRequest) return;

    const success = await completePricingRequest(selectedPricingRequest.id);
    if (success) {
      message.success("Pricing request marked as complete");
      await fetchPricingRequests(
        {
          status,
          priority,
          assignedToId,
          pageNumber: currentPage,
          pageSize,
        },
        viewMode,
      );
      await getPricingRequest(selectedPricingRequest.id);
    }
  };

  const handleSelectPricingRequest = (item: IPricingRequest) => {
    setSelectedPricingRequest(item);
  };

  const handleApplyFilters = (filters: {
    status?: number;
    priority?: number;
    assignedToId?: string;
  }) => {
    setStatus(filters.status);
    setPriority(filters.priority);
    setAssignedToId(filters.assignedToId);
    setCurrentPage(1);
    fetchPricingRequests(
      {
        ...filters,
        pageNumber: 1,
        pageSize,
      },
      viewMode,
    );
  };

  const handleClearFilters = () => {
    setStatus(undefined);
    setPriority(undefined);
    setAssignedToId(undefined);
    setCurrentPage(1);
    fetchPricingRequests(
      {
        pageNumber: 1,
        pageSize,
      },
      viewMode,
    );
  };

  const handlePaginationChange = (page: number, newPageSize: number) => {
    setCurrentPage(page);
    setPageSize(newPageSize);
    fetchPricingRequests(
      {
        status,
        priority,
        assignedToId,
        pageNumber: page,
        pageSize: newPageSize,
      },
      viewMode,
    );
  };

  const handleViewModeChange = (mode: "all" | "pending" | "mine") => {
    setViewMode(mode);
    setCurrentPage(1);
    fetchPricingRequests(
      {
        status,
        priority,
        assignedToId,
        pageNumber: 1,
        pageSize,
      },
      mode,
    );
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        <PricingRequestsHeader onCreateClick={handleCreateClick} />

        {/* View mode buttons */}
        <div className={styles.viewModeButtons}>
          <Button
            type={viewMode === "all" ? "primary" : "default"}
            onClick={() => handleViewModeChange("all")}
            className={styles.buttonSpacing}
          >
            All Requests
          </Button>
          {can("view:all-pricing-requests") && (
            <Button
              type={viewMode === "pending" ? "primary" : "default"}
              onClick={() => handleViewModeChange("pending")}
              className={styles.buttonSpacing}
            >
              Pending
            </Button>
          )}
          <Button
            type={viewMode === "mine" ? "primary" : "default"}
            onClick={() => handleViewModeChange("mine")}
          >
            My Requests
          </Button>
        </div>

        {viewMode === "all" && (
          <PricingRequestsFilters
            onApplyFilters={handleApplyFilters}
            onClear={handleClearFilters}
          />
        )}

        <PricingRequestsTable
          pricingRequests={pricingRequests || []}
          loading={isPending}
          pagination={pagination}
          selectedPricingRequestId={selectedPricingRequest?.id}
          onSelectPricingRequest={handleSelectPricingRequest}
          onPaginationChange={handlePaginationChange}
        />

        {selectedPricingRequest && (
          <div className={styles.selectedRow}>
            <div className={styles.detailsPanel}>
              <PricingRequestDetails
                pricingRequest={pricingRequest || null}
                loading={isLoadingDetails}
              />
            </div>
            <PricingRequestActions
              pricingRequest={selectedPricingRequest}
              onEdit={handleEdit}
              onAssign={handleAssign}
              onComplete={handleComplete}
            />
          </div>
        )}

        {/* Create Modal */}
        <Modal
          title="Create Pricing Request"
          open={isCreateModalOpen}
          onCancel={handleCreateCancel}
          footer={null}
          width={640}
        >
          <PricingRequestForm
            form={createForm}
            onSubmit={handleCreateSubmit}
            onCancel={handleCreateCancel}
            loading={isPending}
            opportunities={opportunitiesList}
          />
        </Modal>

        {/* Edit Modal */}
        <Modal
          title="Edit Pricing Request"
          open={isEditModalOpen}
          onCancel={handleEditCancel}
          footer={null}
          width={640}
        >
          <PricingRequestForm
            form={editForm}
            initialValues={selectedPricingRequest || undefined}
            onSubmit={handleEditSubmit}
            onCancel={handleEditCancel}
            loading={isPending}
            opportunities={opportunitiesList}
          />
        </Modal>

        {/* Assign Modal */}
        <Modal
          title="Assign Pricing Request"
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
                Assign Request
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default withAuthGuard(PricingRequestsPage);
