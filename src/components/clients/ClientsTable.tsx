"use client";

import type { ReactNode } from "react";
import { Card, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useStyles } from "./style";

export interface Client {
  id: string;
  name: string;
  industry: string;
  clientType: number;
  isActive: boolean;
  companySize?: string;
  website?: string;
  billingAddress?: string;
  taxNumber?: string;
  createdAt?: string;
}

interface ClientsTableProps {
  clients: Client[];
  loading: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
  };
  selectedClientId?: string;
  onSelectClient: (client: Client) => void;
  onPaginationChange: (page: number, pageSize: number) => void;
  headerExtra?: ReactNode;
}

const CLIENT_TYPE_MAP: Record<number, { label: string; color: string }> = {
  1: { label: "Government", color: "blue" },
  2: { label: "Private", color: "cyan" },
  3: { label: "Partner", color: "purple" },
};

export const ClientsTable = ({
  clients,
  loading,
  pagination,
  selectedClientId,
  onSelectClient,
  onPaginationChange,
  headerExtra,
}: ClientsTableProps) => {
  const { styles } = useStyles();

  const columns: ColumnsType<Client> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
    },
    {
      title: "Industry",
      dataIndex: "industry",
      key: "industry",
      render: (industry) => industry || "—",
    },
    {
      title: "Type",
      dataIndex: "clientType",
      key: "clientType",
      render: (type: number) => {
        const typeInfo = CLIENT_TYPE_MAP[type] || { label: "Unknown", color: "default" };
        return <Tag color={typeInfo.color}>{typeInfo.label}</Tag>;
      },
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => (
        <Tag color={isActive ? "green" : "default"}>{isActive ? "Active" : "Inactive"}</Tag>
      ),
    },
  ];

  return (
    <div className={styles.opportunitiesListContainer}>
      <Card
        className={styles.tableCard}
        title="Select an item for more details"
        extra={headerExtra}
      >
        <Table
          columns={columns}
          dataSource={clients}
          loading={loading}
          rowKey="id"
          scroll={{ x: "max-content" }}
          pagination={
            pagination
              ? {
                  current: pagination.current,
                  pageSize: pagination.pageSize,
                  total: pagination.total,
                  showSizeChanger: true,
                  showTotal: (total) => `Total ${total} clients`,
                  onChange: onPaginationChange,
                }
              : false
          }
          onRow={(record) => ({
            onClick: () => onSelectClient(record),
          })}
          rowClassName={(record) =>
            `${styles.tableRow} ${record.id === selectedClientId ? "ant-table-row-selected" : ""}`
          }
        />
      </Card>
    </div>
  );
};
