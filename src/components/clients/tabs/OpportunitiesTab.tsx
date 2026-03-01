"use client";

import { useState } from "react";
import { Card, Empty, App, Table, Tag, Pagination } from "antd";
import { useRouter } from "next/navigation";
import type { ColumnsType } from "antd/es/table";
import { useRbac } from "@/hooks/useRbac";
import { useWorkspacePagination } from "@/hooks/useWorkspacePagination";
import { WorkspaceTabActions } from "@/components/opportunities/WorkspaceTabActions";
import type { IOpportunity } from "@/providers/opportunities/context";
import { useStyles } from "../style";

interface OpportunitiesTabProps {
  opportunities: IOpportunity[];
  loading?: boolean;
  onCreateEntity?: () => void;
  onEdit: (opportunity: IOpportunity) => void;
  onDelete: (opportunity: IOpportunity) => Promise<void>;
  toolbarClassName?: string;
  paginationClassName?: string;
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
  1: "default", // Lead - gray
  2: "blue", // Qualified - blue
  3: "cyan", // Proposal - cyan
  4: "gold", // Negotiation - gold
  5: "success", // Closed Won - green
  6: "error", // Closed Lost - red
};

export const OpportunitiesTab = ({
  opportunities,
  loading = false,
  onCreateEntity,
  onEdit,
  onDelete,
  toolbarClassName,
  paginationClassName,
}: OpportunitiesTabProps) => {
  const { can } = useRbac();
  const { styles } = useStyles();
  const router = useRouter();

  const { currentPage, pageSize, setCurrentPage } = useWorkspacePagination(opportunities);

  const columns: ColumnsType<IOpportunity> = [
    {
      title: "Title",
      key: "title",
      render: (_, record) => (
        <span
          onClick={(e) => {
            e.stopPropagation(); // Prevent row click from firing twice
            window.location.href = `/opportunities/${record.id}`;
          }}
          style={{
            cursor: "pointer",
            color: "#1890ff",
            textDecoration: "underline",
          }}
        >
          {record.title || "—"}
        </span>
      ),
    },
    {
      title: "Stage",
      dataIndex: "stage",
      key: "stage",
      render: (stage) => {
        const color = STAGE_COLORS[stage] || "default";
        const label = STAGE_LABELS[stage] || "—";
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "Value",
      dataIndex: "estimatedValue",
      key: "estimatedValue",
      render: (value, record) => {
        if (!value || typeof value !== "number") return "—";
        const currency = record.currency || "";
        return `${currency} ${value.toLocaleString()}`.trim();
      },
    },
    {
      title: "Probability",
      dataIndex: "probability",
      key: "probability",
      render: (prob) => (typeof prob === "number" ? `${prob}%` : "—"),
    },
    {
      title: "Expected Close",
      dataIndex: "expectedCloseDate",
      key: "expectedCloseDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "—"),
    },
  ];

  return (
    <>
      <div className={styles.toolbarContainer}>
        <WorkspaceTabActions
          entityType="opportunity"
          onCreateClick={() => onCreateEntity?.()}
          compact
        />
      </div>

      {/* Table */}
      {opportunities.length === 0 ? (
        <Empty description="No opportunities found" />
      ) : (
        <>
          <Card style={{ border: "none", boxShadow: "none", padding: "0" }}>
            <Table<IOpportunity>
              columns={columns}
              dataSource={opportunities}
              loading={loading}
              rowKey="id"
              pagination={false}
              size="middle"
              scroll={{ x: "max-content" }}
              onRow={(record) => ({
                onClick: () => {
                  window.location.href = `/opportunities/${record.id}`;
                },
                style: { cursor: "pointer" },
              })}
            />
          </Card>

          {/* Pagination */}
          {opportunities.length > 0 && (
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={opportunities.length}
              onChange={setCurrentPage}
              className={paginationClassName}
            />
          )}
        </>
      )}
    </>
  );
};
