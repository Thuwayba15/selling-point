"use client";

import { Card, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { IContact, IPaginationInfo } from "@/providers/contacts/context";
import { useStyles } from "./style";

interface ContactsTableProps {
  contacts: IContact[];
  loading: boolean;
  pagination?: IPaginationInfo;
  selectedContactId?: string;
  onSelectContact: (contact: IContact) => void;
  onPaginationChange: (page: number, pageSize: number) => void;
}

export const ContactsTable = ({
  contacts,
  loading,
  pagination,
  selectedContactId,
  onSelectContact,
  onPaginationChange,
}: ContactsTableProps) => {
  const { styles } = useStyles();

  const columns: ColumnsType<IContact> = [
    {
      title: "Name",
      key: "name",
      render: (_, record) => (
        <span>
          {record.firstName} {record.lastName}
          {record.isPrimaryContact && (
            <Tag color="gold" className={styles.primaryBadge}>
              Primary
            </Tag>
          )}
        </span>
      ),
      sorter: (a, b) =>
        `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
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
      title: "Client",
      dataIndex: "clientName",
      key: "clientName",
      render: (clientName) => clientName || "—",
    },
  ];

  return (
    <Card className={styles.tableCard} title="Contacts List">
      <Table
        columns={columns}
        dataSource={contacts}
        loading={loading}
        rowKey="id"
        scroll={{ x: "max-content" }}
        pagination={
          pagination
            ? {
                current: pagination.currentPage,
                pageSize: pagination.pageSize,
                total: pagination.totalCount,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} contacts`,
                onChange: onPaginationChange,
              }
            : false
        }
        onRow={(record) => ({
          onClick: () => onSelectContact(record),
        })}
        rowClassName={(record) =>
          `${styles.clickableRow} ${record.id === selectedContactId ? "ant-table-row-selected" : ""}`
        }
      />
    </Card>
  );
};
