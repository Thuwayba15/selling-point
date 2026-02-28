"use client";

import { Card, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { IContract, IPaginationInfo } from "@/providers/contracts/context";
import { useStyles } from "./style";

interface ContractsTableProps {
  contracts: IContract[];
  loading: boolean;
  pagination?: IPaginationInfo;
  selectedContractId?: string;
  onSelectContract: (contract: IContract) => void;
  onPaginationChange: (page: number, pageSize: number) => void;
}

const STATUS_LABELS: Record<number, string> = {
  1: "Draft",
  2: "Active",
  3: "Expired",
  4: "Renewed",
  5: "Cancelled",
};

const STATUS_COLORS: Record<number, string> = {
  1: "default",
  2: "success",
  3: "warning",
  4: "processing",
  5: "error",
};

export const ContractsTable = ({
  contracts,
  loading,
  pagination,
  selectedContractId,
  onSelectContract,
  onPaginationChange,
}: ContractsTableProps) => {
  const { styles } = useStyles();

  const columns: ColumnsType<IContract> = [
    {
      title: "Contract Number",
      dataIndex: "contractNumber",
      key: "contractNumber",
      ellipsis: true,
      render: (number) => number || "—",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      render: (title) => title || "—",
    },
    {
      title: "Client",
      dataIndex: "clientName",
      key: "clientName",
      ellipsis: true,
      render: (clientName) => clientName || "—",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={STATUS_COLORS[status] || "default"}>{STATUS_LABELS[status] || "—"}</Tag>
      ),
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
      render: (date, record) => {
        const dateStr = date ? new Date(date).toLocaleDateString() : "—";
        return record.isExpiringSoon ? <Tag color="orange">{dateStr}</Tag> : dateStr;
      },
    },
    {
      title: "Value",
      dataIndex: "contractValue",
      key: "contractValue",
      render: (value, record) =>
        value != null ? `${record.currency || "R"} ${value.toLocaleString()}` : "—",
    },
  ];

  return (
    <Card className={styles.tableCard} title="Contracts">
      <Table<IContract>
        columns={columns}
        dataSource={contracts}
        loading={loading}
        rowKey="id"
        scroll={{ x: "max-content" }}
        pagination={
          pagination
            ? {
                current: pagination.currentPage,
                pageSize: pagination.pageSize,
                total: pagination.totalCount,
                onChange: onPaginationChange,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} contracts`,
              }
            : false
        }
        onRow={(record) => ({
          onClick: () => onSelectContract(record),
          className: record.id === selectedContractId ? "ant-table-row-selected" : "",
          style: { cursor: "pointer" },
        })}
      />
    </Card>
  );
};
