"use client";

import { Card, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { IPricingRequest, IPaginationInfo } from "@/providers/pricing-requests/context";
import { useStyles } from "./style";

interface PricingRequestsTableProps {
  pricingRequests: IPricingRequest[];
  loading: boolean;
  pagination?: IPaginationInfo;
  selectedPricingRequestId?: string;
  onSelectPricingRequest: (pricingRequest: IPricingRequest) => void;
  onPaginationChange: (page: number, pageSize: number) => void;
}

const STATUS_LABELS: Record<number, string> = {
  1: "Pending",
  2: "In Progress",
  3: "Completed",
};

const STATUS_COLORS: Record<number, string> = {
  1: "default",
  2: "processing",
  3: "success",
};

const PRIORITY_LABELS: Record<number, string> = {
  1: "Low",
  2: "Medium",
  3: "High",
  4: "Urgent",
};

const PRIORITY_COLORS: Record<number, string> = {
  1: "default",
  2: "blue",
  3: "orange",
  4: "red",
};

export const PricingRequestsTable = ({
  pricingRequests,
  loading,
  pagination,
  selectedPricingRequestId,
  onSelectPricingRequest,
  onPaginationChange,
}: PricingRequestsTableProps) => {
  const { styles } = useStyles();

  const columns: ColumnsType<IPricingRequest> = [
    {
      title: "Opportunity",
      dataIndex: "opportunityTitle",
      key: "opportunityTitle",
      render: (opportunityTitle) => opportunityTitle || "—",
    },
    {
      title: "Client",
      dataIndex: "clientName",
      key: "clientName",
      render: (clientName) => clientName || "—",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={STATUS_COLORS[status] || "default"}>
          {STATUS_LABELS[status] || "—"}
        </Tag>
      ),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (priority) => (
        <Tag color={PRIORITY_COLORS[priority] || "default"}>
          {PRIORITY_LABELS[priority] || "—"}
        </Tag>
      ),
    },
    {
      title: "Assigned To",
      dataIndex: "assignedToName",
      key: "assignedToName",
      render: (assignedToName) => assignedToName || "Unassigned",
    },
    {
      title: "Required By",
      dataIndex: "requiredByDate",
      key: "requiredByDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "—"),
    },
  ];

  return (
    <Card className={styles.tableCard} title="Pricing Requests List">
      <Table
        columns={columns}
        dataSource={pricingRequests}
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
                showTotal: (total) => `Total ${total} pricing requests`,
                onChange: onPaginationChange,
              }
            : false
        }
        onRow={(record) => ({
          onClick: () => onSelectPricingRequest(record),
        })}
        rowClassName={(record) =>
          `${styles.tableRow} ${record.id === selectedPricingRequestId ? "ant-table-row-selected" : ""}`
        }
      />
    </Card>
  );
};
