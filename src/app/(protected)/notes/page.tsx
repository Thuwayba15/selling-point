"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { App, Button, Card, Col, Form, Input, Modal, Row, Select, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { withAuthGuard } from "@/hoc/withAuthGuard";
import { useAuthState } from "@/providers/auth";
import { useNotesActions, useNotesState } from "@/providers/notes";
import type { INote, RelatedToType } from "@/providers/notes/context";
import { useClientsState, useClientsActions } from "@/providers/clients";
import { useOpportunitiesState, useOpportunitiesActions } from "@/providers/opportunities";
import { useProposalsState, useProposalsActions } from "@/providers/proposals";
import { useContractsState, useContractsActions } from "@/providers/contracts";

const RELATED_TO_OPTIONS = [
  { value: 1, label: "Client" },
  { value: 2, label: "Opportunity" },
  { value: 3, label: "Proposal" },
  { value: 4, label: "Contract" },
  { value: 5, label: "Activity" },
];

const relatedTypeLabelMap: Record<number, string> = {
  1: "Client",
  2: "Opportunity",
  3: "Proposal",
  4: "Contract",
  5: "Activity",
};

const NotesPage = () => {
  const { message, modal } = App.useApp();
  const { user } = useAuthState();
  const notesState = useNotesState();
  const notesActions = useNotesActions();

  // Related entity providers
  const clientsState = useClientsState();
  const clientsActions = useClientsActions();
  const opportunitiesState = useOpportunitiesState();
  const opportunitiesActions = useOpportunitiesActions();
  const proposalsState = useProposalsState();
  const proposalsActions = useProposalsActions();
  const contractsState = useContractsState();
  const contractsActions = useContractsActions();

  const [filterForm] = Form.useForm();
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const [selectedNote, setSelectedNote] = useState<INote | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [filterRelatedToType, setFilterRelatedToType] = useState<RelatedToType | undefined>(
    undefined,
  );
  const [filterRelatedToId, setFilterRelatedToId] = useState<string | undefined>(undefined);
  const [noteLookupId, setNoteLookupId] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const initializedRef = useRef(false);

  // Watch form values for dynamic dropdowns
  const filterWatchedType = Form.useWatch("relatedToType", filterForm);
  const createWatchedType = Form.useWatch("relatedToType", createForm);

  // Map entity data to dropdown options
  const clientOptions = (clientsState.clients || []).map((client) => ({
    value: client.id,
    label: client.name,
  }));

  const opportunityOptions = (opportunitiesState.opportunities || []).map((opp) => ({
    value: opp.id,
    label: opp.title,
  }));

  const proposalOptions = (proposalsState.proposals || []).map((proposal) => ({
    value: proposal.id,
    label: `Proposal ${proposal.id}`,
  }));

  const contractOptions = (contractsState.contracts || []).map((contract) => ({
    value: contract.id,
    label: contract.contractNumber || contract.id,
  }));

  // Helper function to get entity name by ID
  const getRelatedEntityName = (type: RelatedToType, id: string): string => {
    switch (type) {
      case 1: // Client
        return clientsState.clients?.find((c) => c.id === id)?.name || id;
      case 2: // Opportunity
        return opportunitiesState.opportunities?.find((o) => o.id === id)?.title || id;
      case 3: // Proposal
        return `Proposal ${id}`;
      case 4: // Contract
        return contractsState.contracts?.find((c) => c.id === id)?.contractNumber || id;
      case 5: // Activity
        return `Activity ${id}`;
      default:
        return id;
    }
  };

  const fetchNotes = useCallback(
    async (page = 1, size = pageSize) => {
      await notesActions.getNotes({
        relatedToType: filterRelatedToType,
        relatedToId: filterRelatedToId,
        pageNumber: page,
        pageSize: size,
      });
    },
    [filterRelatedToType, filterRelatedToId, pageSize, notesActions],
  );

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      // Fetch all entity data for dropdowns
      clientsActions.getClients({ pageNumber: 1, pageSize: 1000 });
      opportunitiesActions.getOpportunities({ pageNumber: 1, pageSize: 1000 });
      proposalsActions.getProposals({ pageNumber: 1, pageSize: 1000 });
      contractsActions.getContracts({ pageNumber: 1, pageSize: 1000 });
      // Fetch notes
      fetchNotes(1, pageSize);
    }
  }, [fetchNotes, pageSize]);

  useEffect(() => {
    if (notesState.isError && notesState.errorMessage) {
      message.error(notesState.errorMessage);
      notesActions.clearError();
    }
  }, [notesState.isError, notesState.errorMessage]);

  useEffect(() => {
    if (notesState.note) {
      setSelectedNote(notesState.note);
    }
  }, [notesState.note]);

  const handleApplyFilters = async () => {
    const values = filterForm.getFieldsValue();
    setFilterRelatedToType(values.relatedToType);
    setFilterRelatedToId(values.relatedToId);
    setCurrentPage(1);
    await notesActions.getNotes({
      relatedToType: values.relatedToType,
      relatedToId: values.relatedToId,
      pageNumber: 1,
      pageSize,
    });
  };

  const handleClearFilters = async () => {
    filterForm.resetFields();
    setFilterRelatedToType(undefined);
    setFilterRelatedToId(undefined);
    setCurrentPage(1);
    await notesActions.getNotes({ pageNumber: 1, pageSize });
  };

  const handlePaginationChange = async (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
    await notesActions.getNotes({
      relatedToType: filterRelatedToType,
      relatedToId: filterRelatedToId,
      pageNumber: page,
      pageSize: size,
    });
  };

  const handleCreateOpen = () => {
    createForm.resetFields();
    setIsCreateOpen(true);
  };

  const handleCreateSubmit = async () => {
    const values = createForm.getFieldsValue();
    try {
      await notesActions.createNote({
        content: values.content,
        relatedToType: values.relatedToType,
        relatedToId: values.relatedToId,
        isPrivate: values.isPrivate ?? false,
      });
      message.success("Note created successfully");
      setIsCreateOpen(false);
      await fetchNotes(currentPage, pageSize);
    } catch (error) {
      message.error("Failed to create note");
    }
  };

  const handleEditOpen = () => {
    if (!selectedNote) return;
    editForm.setFieldsValue({
      content: selectedNote.content,
      isPrivate: selectedNote.isPrivate ?? false,
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedNote?.id) return;
    const values = editForm.getFieldsValue();
    try {
      await notesActions.updateNote(selectedNote.id, {
        content: values.content,
        isPrivate: values.isPrivate ?? false,
      });
      message.success("Note updated successfully");
      setIsEditOpen(false);
      await notesActions.getNote(selectedNote.id);
      await fetchNotes(currentPage, pageSize);
    } catch (error) {
      message.error("Failed to update note");
    }
  };

  const handleDelete = () => {
    if (!selectedNote?.id) return;
    modal.confirm({
      title: "Delete Note",
      content: "Are you sure you want to delete this note?",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          await notesActions.deleteNote(selectedNote.id);
          message.success("Note deleted successfully");
          setSelectedNote(null);
          await fetchNotes(currentPage, pageSize);
        } catch (error) {
          message.error("Failed to delete note");
        }
      },
    });
  };

  const handleGetNote = async () => {
    if (!noteLookupId) return;
    await notesActions.getNote(noteLookupId);
  };

  const columns: ColumnsType<INote> = [
    {
      title: "Related To Type",
      dataIndex: "relatedToType",
      key: "relatedToType",
      render: (value: number) => relatedTypeLabelMap[value] || value,
    },
    {
      title: "Related To",
      dataIndex: "relatedToId",
      key: "relatedToId",
      render: (value: string, record: INote) => getRelatedEntityName(record.relatedToType, value),
    },
    {
      title: "Note",
      dataIndex: "content",
      key: "content",
      ellipsis: true,
    },
    {
      title: "Owner",
      dataIndex: "createdByName",
      key: "createdByName",
      render: (value: string, record: INote) => (
        <span>
          {value || "Unknown"}
          {record.createdById === user?.id && (
            <Tag color="blue" style={{ marginLeft: 8 }}>
              You
            </Tag>
          )}
        </span>
      ),
    },
    {
      title: "Private",
      dataIndex: "isPrivate",
      key: "isPrivate",
      render: (value: boolean) =>
        value ? <Tag color="red">Private</Tag> : <Tag color="green">Public</Tag>,
    },
    {
      title: "Updated",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (value?: string) => (value ? dayjs(value).format("MMM DD, YYYY") : "-"),
    },
  ];

  return (
    <Space orientation="vertical" size="middle">
      <Card title="Filters">
        <Form form={filterForm} layout="vertical">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Form.Item label="Related To Type" name="relatedToType">
                <Select
                  placeholder="Related to type"
                  options={RELATED_TO_OPTIONS}
                  allowClear
                  onChange={() => filterForm.setFieldValue("relatedToId", undefined)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Related To" name="relatedToId">
                {!filterWatchedType ? (
                  <Select placeholder="Select type first" disabled />
                ) : filterWatchedType === 1 ? (
                  <Select
                    placeholder="Select client"
                    options={clientOptions}
                    allowClear
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                    }
                  />
                ) : filterWatchedType === 2 ? (
                  <Select
                    placeholder="Select opportunity"
                    options={opportunityOptions}
                    allowClear
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                    }
                  />
                ) : filterWatchedType === 3 ? (
                  <Select
                    placeholder="Select proposal"
                    options={proposalOptions}
                    allowClear
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                    }
                  />
                ) : filterWatchedType === 4 ? (
                  <Select
                    placeholder="Select contract"
                    options={contractOptions}
                    allowClear
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                    }
                  />
                ) : (
                  <Input placeholder="Activity ID" />
                )}
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Get Note By ID">
                <Input
                  placeholder="Note id"
                  value={noteLookupId}
                  onChange={(event) => setNoteLookupId(event.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Space>
          <Button type="primary" onClick={handleApplyFilters} loading={notesState.isPending}>
            Apply Filters
          </Button>
          <Button onClick={handleClearFilters} loading={notesState.isPending}>
            Clear Filters
          </Button>
          <Button onClick={handleGetNote} loading={notesState.isPending}>
            Get Note
          </Button>
        </Space>
      </Card>

      <Card title="Actions">
        <Space>
          <Button type="primary" onClick={handleCreateOpen}>
            Create Note
          </Button>
          <Button
            onClick={handleEditOpen}
            disabled={!selectedNote || selectedNote.createdById !== user?.id}
          >
            Update Note
          </Button>
          <Button
            danger
            onClick={handleDelete}
            disabled={!selectedNote || selectedNote.createdById !== user?.id}
          >
            Delete Note
          </Button>
        </Space>
      </Card>

      <Card title="Notes List" loading={notesState.isPending}>
        <Table
          columns={columns}
          dataSource={notesState.notes || []}
          rowKey="id"
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: notesState.pagination?.totalCount || 0,
            onChange: handlePaginationChange,
          }}
          onRow={(record) => ({
            onClick: () => setSelectedNote(record),
          })}
        />
      </Card>

      <Card title="Selected Note">
        {selectedNote ? (
          <Space orientation="vertical">
            <div>ID: {selectedNote.id}</div>
            <div>
              Related To Type:{" "}
              {relatedTypeLabelMap[selectedNote.relatedToType] || selectedNote.relatedToType}
            </div>
            <div>
              Related To:{" "}
              {getRelatedEntityName(selectedNote.relatedToType, selectedNote.relatedToId)}
            </div>
            <div>Content: {selectedNote.content}</div>
            <div>
              Created By: {selectedNote.createdByName || "Unknown"}
              {selectedNote.createdById === user?.id && (
                <Tag color="blue" style={{ marginLeft: 8 }}>
                  You
                </Tag>
              )}
            </div>
            <div>Private: {selectedNote.isPrivate ? "Yes" : "No"}</div>
            <div>
              Created:{" "}
              {selectedNote.createdAt ? dayjs(selectedNote.createdAt).format("MMM DD, YYYY") : "-"}
            </div>
            <div>
              Updated:{" "}
              {selectedNote.updatedAt ? dayjs(selectedNote.updatedAt).format("MMM DD, YYYY") : "-"}
            </div>
            {selectedNote.createdById !== user?.id && (
              <div style={{ marginTop: 8 }}>
                <Tag color="orange">You can only update your own notes</Tag>
              </div>
            )}
          </Space>
        ) : (
          <div>Select a note to view details.</div>
        )}
      </Card>

      <Modal
        title="Create Note"
        open={isCreateOpen}
        onCancel={() => setIsCreateOpen(false)}
        onOk={handleCreateSubmit}
        okText="Create"
        confirmLoading={notesState.isPending}
      >
        <Form form={createForm} layout="vertical">
          <Form.Item
            label="Content"
            name="content"
            rules={[{ required: true, message: "Content is required" }]}
          >
            <Input.TextArea rows={4} placeholder="Enter note content" />
          </Form.Item>
          <Form.Item
            label="Related To Type"
            name="relatedToType"
            rules={[{ required: true, message: "Related to type is required" }]}
          >
            <Select
              placeholder="Select related to type"
              options={RELATED_TO_OPTIONS}
              onChange={() => createForm.setFieldValue("relatedToId", undefined)}
            />
          </Form.Item>
          <Form.Item
            label="Related To"
            name="relatedToId"
            rules={[{ required: true, message: "Related entity is required" }]}
          >
            {!createWatchedType ? (
              <Select placeholder="Select type first" disabled />
            ) : createWatchedType === 1 ? (
              <Select
                placeholder="Select client"
                options={clientOptions}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
              />
            ) : createWatchedType === 2 ? (
              <Select
                placeholder="Select opportunity"
                options={opportunityOptions}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
              />
            ) : createWatchedType === 3 ? (
              <Select
                placeholder="Select proposal"
                options={proposalOptions}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
              />
            ) : createWatchedType === 4 ? (
              <Select
                placeholder="Select contract"
                options={contractOptions}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
              />
            ) : (
              <Input placeholder="Activity ID" />
            )}
          </Form.Item>
          <Form.Item label="Private" name="isPrivate">
            <Select
              options={[
                { value: false, label: "Public" },
                { value: true, label: "Private" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Update Note"
        open={isEditOpen}
        onCancel={() => setIsEditOpen(false)}
        onOk={handleEditSubmit}
        okText="Update"
        confirmLoading={notesState.isPending}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            label="Content"
            name="content"
            rules={[{ required: true, message: "Content is required" }]}
          >
            <Input.TextArea rows={4} placeholder="Update note content" />
          </Form.Item>
          <Form.Item label="Private" name="isPrivate">
            <Select
              options={[
                { value: false, label: "Public" },
                { value: true, label: "Private" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
};

export default withAuthGuard(NotesPage);
