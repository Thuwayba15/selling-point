"use client";

import { useState, useMemo } from "react";
import { Button, Space, Card, Empty, App, Table, Tag, Pagination } from "antd";
import { EditOutlined, DeleteOutlined, StarOutlined, StarFilled, PlusOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useRbac } from "@/hooks/useRbac";
import { useWorkspacePagination } from "@/hooks/useWorkspacePagination";
import { WorkspaceTabActions } from "@/components/opportunities/WorkspaceTabActions";
import { ContactsFilters } from "@/components/contacts";
import type { IContact } from "@/providers/contacts/context";
import { useStyles } from "../style";

interface ContactsTabProps {
  contacts: IContact[];
  loading?: boolean;
  onCreateEntity?: () => void;
  onEdit: (contact: IContact) => void;
  onDelete: (contact: IContact) => Promise<void>;
  onSetPrimary?: (contact: IContact) => Promise<void>;
  toolbarClassName?: string;
  paginationClassName?: string;
}

export const ContactsTab = ({
  contacts,
  loading = false,
  onCreateEntity,
  onEdit,
  onDelete,
  onSetPrimary,
  toolbarClassName,
  paginationClassName,
}: ContactsTabProps) => {
  const { can } = useRbac();
  const { modal } = App.useApp();
  const { styles } = useStyles();
  const [searchTerm, setSearchTerm] = useState("");
  const [settingPrimaryLoading, setSettingPrimaryLoading] = useState<string | null>(null);
  const [filters, setFilters] = useState<{ searchTerm?: string; clientId?: string }>({});

  // Filter contacts by search and client
  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        const matchesSearch =
          (contact.firstName?.toLowerCase().includes(term) ?? false) ||
          (contact.lastName?.toLowerCase().includes(term) ?? false) ||
          (contact.email?.toLowerCase().includes(term) ?? false) ||
          (contact.phoneNumber?.toLowerCase().includes(term) ?? false);
        if (!matchesSearch) return false;
      }
      return true;
    });
  }, [contacts, filters]);

  const { currentPage, pageSize, total, paginatedItems, setCurrentPage } =
    useWorkspacePagination(filteredContacts);

  const handleApplyFilters = (newFilters: { searchTerm?: string; clientId?: string }) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const handleSetPrimary = async (contact: IContact) => {
    if (!onSetPrimary) return;
    setSettingPrimaryLoading(contact.id);
    try {
      await onSetPrimary(contact);
    } finally {
      setSettingPrimaryLoading(null);
    }
  };

  const handleDeleteClick = (contact: IContact) => {
    modal.confirm({
      title: "Delete Contact",
      content: `Are you sure you want to delete "${contact.firstName} ${contact.lastName}"?`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await onDelete(contact);
        } catch (error) {
          // Error already handled by parent
        }
      },
    });
  };

  const columns: ColumnsType<IContact> = [
    {
      title: "Name",
      key: "name",
      render: (_, record) => `${record.firstName || ""} ${record.lastName || ""}`.trim() || "—",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => email || "—",
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (phone) => phone || "—",
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
      render: (position) => position || "—",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => (
        <Tag color={isActive ? "green" : "default"}>{isActive ? "Active" : "Inactive"}</Tag>
      ),
    },
    {
      title: "Primary",
      key: "isPrimaryContact",
      width: 80,
      align: "center",
      render: (_, record) => (
        <>
          {record.isPrimaryContact && <StarFilled style={{ color: "#faad14", fontSize: "16px" }} />}
        </>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space size="small">
          {can("update:contact") && onSetPrimary && !record.isPrimaryContact && (
            <Button
              type="text"
              size="small"
              icon={<StarOutlined />}
              onClick={() => handleSetPrimary(record)}
              loading={settingPrimaryLoading === record.id}
              title="Mark as Primary"
            />
          )}
          {can("update:contact") && (
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              title="Edit"
            />
          )}
          {can("delete:contact") && (
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteClick(record)}
              title="Delete"
            />
          )}
        </Space>
      ),
    },
  ];

  if (contacts.length === 0) {
    return <Empty description="No contacts found" />;
  }

  return (
    <>
      <div className={styles.toolbarContainer}>
        <WorkspaceTabActions
          entityType="contact"
          onCreateClick={() => onCreateEntity?.()}
          compact
        />
        <ContactsFilters
          onApplyFilters={handleApplyFilters}
          onClear={handleClearFilters}
          clients={[]} // TODO: Pass actual client options
        />
      </div>

      {/* Table */}
      {filteredContacts.length === 0 ? (
        <Empty description={searchTerm ? "No contacts match your search" : "No contacts found"} />
      ) : (
        <>
          <Card style={{ border: "none", boxShadow: "none", padding: "0" }}>
            <Table<IContact>
              columns={columns}
              dataSource={paginatedItems}
              loading={loading}
              rowKey="id"
              pagination={false}
              size="middle"
              scroll={{ x: "max-content" }}
            />
          </Card>

          {/* Pagination */}
          {total > 0 && (
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={total}
              onChange={setCurrentPage}
              className={paginationClassName}
            />
          )}
        </>
      )}
    </>
  );
};
