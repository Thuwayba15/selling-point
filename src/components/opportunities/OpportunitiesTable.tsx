"use client";

import { Card, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { IOpportunity, IPaginationInfo } from "@/providers/opportunities/context";
import { useStyles } from "./style";

interface OpportunitiesTableProps {
  opportunities: IOpportunity[];
  loading: boolean;
  pagination?: IPaginationInfo;
  selectedOpportunityId?: string;
  onSelectOpportunity: (opportunity: IOpportunity) => void;
  onPaginationChange: (page: number, pageSize: number) => void;
}

const STAGE_LABELS: Record<number, string> = {
  1: "Lead",
  2: "Qualified",
  3: "Proposal",
  4: "Negotiation",
  5: "Closed Won",
  6: "Closed Lost",
};

const STAGE_COLORS: Record<number, string> = {
  1: "default",      // Lead - gray
  2: "blue",         // Qualified - blue
  3: "cyan",         // Proposal - cyan
  4: "gold",         // Negotiation - gold
  5: "success",      // Closed Won - green
  6: "error",        // Closed Lost - red
};

export const OpportunitiesTable = ({
  opportunities,
  loading,
  pagination,
  selectedOpportunityId,
  onSelectOpportunity,
  onPaginationChange,
}: OpportunitiesTableProps) => {
  const { styles } = useStyles();

  const columns: ColumnsType<IOpportunity> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => (a.title || "").localeCompare(b.title || ""),
    },
    {
      title: "Client",
      dataIndex: "clientName",
      key: "clientName",
      render: (clientName) => clientName || "—",
    },
    {
      title: "Stage",
      dataIndex: "stage",
      key: "stage",
      render: (stage) => (
        <Tag color={STAGE_COLORS[stage] || "default"}>
          {STAGE_LABELS[stage] || "—"}
        </Tag>
      ),
    },
    {
      title: "Probability",
      dataIndex: "probability",
      key: "probability",
      render: (probability) => (typeof probability === "number" ? `${probability}%` : "—"),
    },
    {
      title: "Estimated Value",
      dataIndex: "estimatedValue",
      key: "estimatedValue",
      render: (value, record) => {
        if (typeof value !== "number") return "—";
        const currency = record.currency || "";
        return `${currency} ${value.toLocaleString()}`.trim();
      },
    },
  ];

  return (
    <Card className={styles.tableCard} title="Opportunities List">
      <Table
        columns={columns}
        dataSource={opportunities}
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
                showTotal: (total) => `Total ${total} opportunities`,
                onChange: onPaginationChange,
              }
            : false
        }
        onRow={(record) => ({
          onClick: () => onSelectOpportunity(record),
        })}
        rowClassName={(record) =>
          `${styles.tableRow} ${record.id === selectedOpportunityId ? "ant-table-row-selected" : ""}`
        }
      />
    </Card>
  );
};
