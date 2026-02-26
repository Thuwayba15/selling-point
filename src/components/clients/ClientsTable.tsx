import React from "react";
import { Table, Card, Tag } from "antd";
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
  selectedId?: string;
  onSelect: (client: Client) => void;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
}

const CLIENT_TYPE_MAP: Record<number, { label: string; color: string }> = {
  1: { label: "Government", color: "blue" },
  2: { label: "Private", color: "cyan" },
  3: { label: "Partner", color: "purple" },
};

export const ClientsTable: React.FC<ClientsTableProps> = ({
  clients,
  loading,
  selectedId,
  onSelect,
  pagination,
}) => {
  const { styles } = useStyles();

  const columns: ColumnsType<Client> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "30%",
      ellipsis: true,
    },
    {
      title: "Industry",
      dataIndex: "industry",
      key: "industry",
      width: "20%",
      ellipsis: true,
    },
    {
      title: "Type",
      dataIndex: "clientType",
      key: "clientType",
      width: "15%",
      render: (type: number) => {
        const typeInfo = CLIENT_TYPE_MAP[type] || { label: "Unknown", color: "default" };
        return <Tag color={typeInfo.color}>{typeInfo.label}</Tag>;
      },
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      width: "15%",
      render: (isActive: boolean) => (
        <Tag color={isActive ? "green" : "default"}>{isActive ? "Active" : "Inactive"}</Tag>
      ),
    },
    {
      title: "Email",
      dataIndex: "contactEmail",
      key: "contactEmail",
      width: "20%",
      ellipsis: true,
    },
  ];

  return (
    <Card className={styles.tableCard} loading={loading}>
      <Table<Client>
        columns={columns}
        dataSource={clients}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onRow={(record) => ({
          onClick: () => onSelect(record),
          className: selectedId === record.id ? styles.selectedRow : "",
        })}
      />
    </Card>
  );
};
