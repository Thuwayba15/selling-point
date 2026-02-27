"use client";

import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { App, Button, Form, Modal, Table, Tabs } from "antd";
import { withAuthGuard } from "@/hoc/withAuthGuard";
import { useContractsState, useContractsActions } from "@/providers/contracts";
import { useClientsState, useClientsActions } from "@/providers/clients";
import { useOpportunitiesState, useOpportunitiesActions } from "@/providers/opportunities";
import { useProposalsState, useProposalsActions } from "@/providers/proposals";
import { useAuthState } from "@/providers/auth";
import {
  ContractsHeader,
  ContractsFilters,
  ContractsTable,
  ContractDetails,
  ContractActions,
  ContractForm,
} from "@/components/contracts";
import { useStyles } from "@/components/contracts/style";
import { IContract } from "@/providers/contracts/context";
import { useRbac } from "@/hooks/useRbac";

const ContractsPage = () => {
  const { styles } = useStyles();
  const { message } = App.useApp();
  const { can } = useRbac();
  const { user } = useAuthState();

  const {
    isPending,
    isLoadingDetails,
    isError,
    errorMessage,
    contracts,
    contract,
    expiringContracts,
    pagination,
  } = useContractsState();

  const {
    getContracts,
    getContract,
    getExpiringContracts,
    createContract,
    updateContract,
    activateContract,
    cancelContract,
    deleteContract,
    clearError,
    clearContract,
  } = useContractsActions();

  // Clients provider for dropdown
  const clientsState = useClientsState();
  const clientsActions = useClientsActions();

  // Opportunities provider for dropdown
  const opportunitiesState = useOpportunitiesState();
  const opportunitiesActions = useOpportunitiesActions();

  // Proposals provider for dropdown
  const proposalsState = useProposalsState();
  const proposalsActions = useProposalsActions();

  const [status, setStatus] = useState<number | undefined>(undefined);
  const [clientId, setClientId] = useState<string | undefined>(undefined);
  const [selectedContract, setSelectedContract] = useState<IContract | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeTab, setActiveTab] = useState("all");

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
      opportunitiesActions.getOpportunities({ pageNumber: 1, pageSize: 1000 });
      // Fetch proposals for dropdown
      proposalsActions.getProposals({ pageNumber: 1, pageSize: 1000 });
      // Fetch all contracts
      getContracts({ pageNumber: currentPage, pageSize });
      // Fetch expiring contracts
      getExpiringContracts(90);
    }
  }, []);

  // Load contract details when selected
  useEffect(() => {
    if (selectedContract?.id) {
      getContract(selectedContract.id);
    }
  }, [selectedContract?.id]);

  // Show errors
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

  const handleCreateSubmit = async (values: Partial<IContract>) => {
    // Automatically set ownerId to current user if not set
    const contractData = {
      ...values,
      ownerId: values.ownerId || user?.id,
    };
    const success = await createContract(contractData);
    if (success) {
      message.success("Contract created successfully");
      setIsCreateModalOpen(false);
      createForm.resetFields();
      // Refresh contracts list
      getContracts({ pageNumber: 1, pageSize, status, clientId });
      setCurrentPage(1);
    }
  };

  const handleEditClick = () => {
    if (contract) {
      editForm.setFieldsValue({
        ...contract,
        startDate: contract.startDate ? dayjs(contract.startDate) : undefined,
        endDate: contract.endDate ? dayjs(contract.endDate) : undefined,
      });
      setIsEditModalOpen(true);
    }
  };

  const handleEditSubmit = async (values: Partial<IContract>) => {
    if (!contract?.id) return;

    // Automatically set ownerId to current user if not set
    const contractData = {
      ...values,
      ownerId: values.ownerId || user?.id,
    };
    const success = await updateContract(contract.id, contractData);
    if (success) {
      message.success("Contract updated successfully");
      setIsEditModalOpen(false);
      editForm.resetFields();
      // Refresh contract details
      getContract(contract.id);
      // Refresh contracts list
      getContracts({ pageNumber: currentPage, pageSize, status, clientId });
    }
  };

  const handleActivate = async () => {
    if (!contract?.id) return;

    const success = await activateContract(contract.id);
    if (success) {
      message.success("Contract activated successfully");
      getContract(contract.id);
      getContracts({ pageNumber: currentPage, pageSize, status, clientId });
    }
  };

  const handleCancel = async () => {
    if (!contract?.id) return;

    const success = await cancelContract(contract.id);
    if (success) {
      message.success("Contract cancelled successfully");
      getContract(contract.id);
      getContracts({ pageNumber: currentPage, pageSize, status, clientId });
    }
  };

  const handleDelete = async () => {
    if (!contract?.id) return;

    const success = await deleteContract(contract.id);
    if (success) {
      message.success("Contract deleted successfully");
      setSelectedContract(null);
      clearContract();
      getContracts({ pageNumber: 1, pageSize, status, clientId });
      setCurrentPage(1);
    }
  };

  const handleStatusChange = (newStatus: number | undefined) => {
    setStatus(newStatus);
  };

  const handleClientIdChange = (newClientId: string | undefined) => {
    setClientId(newClientId);
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    getContracts({ pageNumber: 1, pageSize, status, clientId });
  };

  const handleClearFilters = () => {
    setStatus(undefined);
    setClientId(undefined);
    setCurrentPage(1);
    getContracts({ pageNumber: 1, pageSize, status: undefined, clientId: undefined });
  };

  const handlePaginationChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    getContracts({ pageNumber: page, pageSize, status, clientId });
  };

  // Initialize contracts on mount
  useEffect(() => {
    getContracts({ pageNumber: 1, pageSize });
  }, []);

  const clientOptions = clientsState.clients
    ? clientsState.clients.map((client) => ({ id: client.id || "", name: client.name || "" }))
    : [];

  const opportunityOptions = opportunitiesState.opportunities
    ? opportunitiesState.opportunities.map((opp) => ({ id: opp.id || "", title: opp.title || "" }))
    : [];

  const proposalOptions = proposalsState.proposals
    ? proposalsState.proposals.map((prop) => ({ id: prop.id || "", title: prop.title || "" }))
    : [];

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        <ContractsHeader onCreateClick={handleCreateClick} />

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: "all",
              label: "All Contracts",
              children: (
                <>
                  <ContractsFilters
                    status={status}
                    clientId={clientId}
                    onStatusChange={handleStatusChange}
                    onClientIdChange={handleClientIdChange}
                    onApplyFilters={handleApplyFilters}
                    onClear={handleClearFilters}
                    clients={clientOptions}
                  />

                  <ContractsTable
                    contracts={contracts || []}
                    loading={isPending}
                    pagination={pagination}
                    selectedContractId={selectedContract?.id}
                    onSelectContract={setSelectedContract}
                    onPaginationChange={handlePaginationChange}
                  />

                  {selectedContract && (
                    <div className={styles.selectedRow}>
                      <div className={styles.detailsPanel}>
                        <ContractDetails contract={selectedContract} loading={isLoadingDetails} />
                      </div>
                      <div className={styles.actionsCard}>
                        <ContractActions
                          contract={selectedContract}
                          onEdit={handleEditClick}
                          onActivate={handleActivate}
                          onCancel={handleCancel}
                          onDelete={handleDelete}
                          loading={isPending}
                        />
                      </div>
                    </div>
                  )}
                </>
              ),
            },
            {
              key: "expiring",
              label: "Expiring Soon",
              children: (
                <Table
                  columns={[
                    {
                      title: "Contract Number",
                      dataIndex: "contractNumber",
                      key: "contractNumber",
                    },
                    {
                      title: "Title",
                      dataIndex: "title",
                      key: "title",
                    },
                    {
                      title: "Client",
                      dataIndex: "clientName",
                      key: "clientName",
                    },
                    {
                      title: "End Date",
                      dataIndex: "endDate",
                      key: "endDate",
                      render: (date) => (date ? new Date(date).toLocaleDateString() : "—"),
                    },
                    {
                      title: "Days Until Expiry",
                      dataIndex: "daysUntilExpiry",
                      key: "daysUntilExpiry",
                      render: (days) => (days !== undefined ? `${days} days` : "—"),
                    },
                    {
                      title: "Action",
                      key: "action",
                      render: (_, record) =>
                        can("create:contract") ? (
                          <Button
                            type="link"
                            size="small"
                            onClick={() => setSelectedContract(record)}
                          >
                            Create Renewal
                          </Button>
                        ) : null,
                    },
                  ]}
                  dataSource={expiringContracts || []}
                  loading={isPending}
                  rowKey="id"
                  pagination={false}
                />
              ),
            },
          ]}
        />
      </div>

      <Modal
        title="Create New Contract"
        open={isCreateModalOpen}
        onCancel={() => {
          setIsCreateModalOpen(false);
          createForm.resetFields();
        }}
        footer={null}
        width={700}
      >
        <ContractForm
          form={createForm}
          loading={isPending}
          onSubmit={handleCreateSubmit}
          onCancel={() => {
            setIsCreateModalOpen(false);
            createForm.resetFields();
          }}
          clients={clientOptions}
          opportunities={opportunityOptions}
          proposals={proposalOptions}
        />
      </Modal>

      <Modal
        title="Edit Contract"
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          editForm.resetFields();
        }}
        footer={null}
        width={700}
      >
        <ContractForm
          form={editForm}
          initialValues={contract}
          loading={isPending}
          onSubmit={handleEditSubmit}
          onCancel={() => {
            setIsEditModalOpen(false);
            editForm.resetFields();
          }}
          clients={clientOptions}
          opportunities={opportunityOptions}
          proposals={proposalOptions}
        />
      </Modal>
    </div>
  );
};

export default withAuthGuard(ContractsPage);
