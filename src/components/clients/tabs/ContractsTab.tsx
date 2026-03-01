"use client";

import { Table, Tag, Button, Space, Card, Empty } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useRbac } from "@/hooks/useRbac";
import type { IContract } from "@/providers/contracts/context";

interface ContractsTabProps {
  contracts: IContract[];
  loading?: boolean;
  onEdit: (contract: IContract) => void;
  onDelete: (contract: IContract) => Promise<void>;
}

const STATUS_COLORS: Record<string, string> = {
  Draft: "default",
  Active: "green",
  Completed: "blue",
  Expired: "orange",
  Terminated: "red",
};

export const ContractsTab = ({ contracts, loading = false, onEdit, onDelete }: ContractsTabProps) => {
  const { can } = useRbac();

  const columns: ColumnsType<IContract> = [
    {
      title: "Contract Number",
      dataIndex: "contractNumber",
      key: "contractNumber",
      render: (number) => number || "—",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (title) => title || "—",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color = STATUS_COLORS[status] || "default";
        return <Tag color={color}>{status || "—"}</Tag>;
      },
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "—"),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "—"),
    },
    {
      title: "Value",
      dataIndex: "contractValue",
      key: "contractValue",
      render: (value) => {
        if (!value) return "—";
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(value);
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space size="small">
          {can("update:contract") && (
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              title="Edit"
            />
          )}
          {can("delete:contract") && (
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(record)}
              title="Delete"
            />
          )}
        </Space>
      ),
    },
  ];

  if (contracts.length === 0) {
    return <Empty description="No contracts found" />;
  }

  return (
    <Card
      style={{
        border: "none",
        boxShadow: "none",
      }}
    >
      <Table<IContract>
        columns={columns}
        dataSource={contracts}
        loading={loading}
        rowKey="id"
        pagination={false}
      />
    </Card>
  );
};
