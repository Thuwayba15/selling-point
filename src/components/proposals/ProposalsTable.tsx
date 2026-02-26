"use client";

import { Card, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { IProposal, IPaginationInfo } from "@/providers/proposals/context";
import { useStyles } from "./style";

interface ProposalsTableProps {
  proposals: IProposal[];
  loading: boolean;
  pagination?: IPaginationInfo;
  selectedProposalId?: string;
  onSelectProposal: (proposal: IProposal) => void;
  onPaginationChange: (page: number, pageSize: number) => void;
}

const STATUS_LABELS: Record<number, string> = {
  1: "Draft",
  2: "Submitted",
  3: "Rejected",
  4: "Approved",
};

const STATUS_COLORS: Record<number, string> = {
  1: "default",
  2: "processing",
  3: "error",
  4: "success",
};

export const ProposalsTable = ({
  proposals,
  loading,
  pagination,
  selectedProposalId,
  onSelectProposal,
  onPaginationChange,
}: ProposalsTableProps) => {
  const { styles } = useStyles();

  const columns: ColumnsType<IProposal> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (title) => title || "—",
    },
    {
      title: "Client",
      dataIndex: "clientName",
      key: "clientName",
      render: (clientName) => clientName || "—",
    },
    {
      title: "Opportunity",
      dataIndex: "opportunityTitle",
      key: "opportunityTitle",
      render: (opportunityTitle) => opportunityTitle || "—",
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
      title: "Total",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (total, record) => {
        const currency = record.currency || "ZAR";
        return total ? `${currency} ${total.toLocaleString()}` : "—";
      },
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "—"),
    },
  ];

  const handleRowClick = (record: IProposal) => {
    onSelectProposal(record);
  };

  return (
    <Card className={styles.tableCard} title="Proposals">
      <Table
        columns={columns}
        dataSource={proposals}
        loading={loading}
        rowKey="id"
        pagination={
          pagination
            ? {
                current: pagination.currentPage,
                pageSize: pagination.pageSize,
                total: pagination.totalCount,
                onChange: onPaginationChange,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} proposals`,
              }
            : false
        }
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          className: selectedProposalId === record.id ? "ant-table-row-selected" : "",
          style: { cursor: "pointer" },
        })}
      />
    </Card>
  );
};
