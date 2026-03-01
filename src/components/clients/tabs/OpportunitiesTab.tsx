"use client";

import { Table, Tag, Button, Space, Card, Empty } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import type { ColumnsType } from "antd/es/table";
import { useRbac } from "@/hooks/useRbac";
import type { IOpportunity } from "@/providers/opportunities/context";

interface OpportunitiesTabProps {
  opportunities: IOpportunity[];
  loading?: boolean;
  clientId: string;
  onCreate: () => void;
  onEdit: (opportunity: IOpportunity) => void;
  onDelete: (opportunity: IOpportunity) => Promise<void>;
}

const STAGE_COLORS: Record<string, string> = {
  Lead: "blue",
  Proposal: "cyan",
  "In Progress": "orange",
  Won: "green",
  Lost: "red",
  Closed: "gray",
};

export const OpportunitiesTab = ({
  opportunities,
  loading = false,
  clientId,
  onCreate,
  onEdit,
  onDelete,
}: OpportunitiesTabProps) => {
  const router = useRouter();
  const { can } = useRbac();

  const handleSelectOpportunity = (id: string) => {
    router.push(`/opportunities/${id}`);
  };

  const columns: ColumnsType<IOpportunity> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (title, record) => (
        <Button
          type="link"
          style={{ padding: 0 }}
          onClick={() => handleSelectOpportunity(record.id)}
        >
          {title || "—"}
        </Button>
      ),
    },
    {
      title: "Stage",
      dataIndex: "stage",
      key: "stage",
      render: (stage) => {
        const color = STAGE_COLORS[stage] || "default";
        return <Tag color={color}>{stage || "—"}</Tag>;
      },
    },
    {
      title: "Value",
      dataIndex: "estimatedValue",
      key: "estimatedValue",
      render: (value) => {
        if (!value) return "—";
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(value);
      },
    },
    {
      title: "Probability",
      dataIndex: "probability",
      key: "probability",
      render: (prob) => (prob ? `${prob}%` : "—"),
    },
    {
      title: "Expected Close",
      dataIndex: "expectedCloseDate",
      key: "expectedCloseDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "—"),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space size="small">
          {can("update:opportunity") && (
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              title="Edit"
            />
          )}
          {can("delete:opportunity") && (
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

  return (
    <Card
      style={{
        border: "none",
        boxShadow: "none",
      }}
      extra={
        can("create:opportunity") && (
          <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
            Create Opportunity
          </Button>
        )
      }
    >
      {opportunities.length === 0 ? (
        <Empty description="No opportunities found" />
      ) : (
        <Table<IOpportunity>
          columns={columns}
          dataSource={opportunities}
          loading={loading}
          rowKey="id"
          pagination={false}
        />
      )}
    </Card>
  );
};
