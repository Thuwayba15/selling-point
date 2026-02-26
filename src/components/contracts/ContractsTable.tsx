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
      width: 150,
      render: (number) => number || "—",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: 180,
      render: (title) => title || "—",
    },
    {
      title: "Client",
      dataIndex: "clientName",
      key: "clientName",
      width: 150,
      render: (clientName) => clientName || "—",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (status) => (
        <Tag color={STATUS_COLORS[status] || "default"}>
          {STATUS_LABELS[status] || "—"}
        </Tag>
      ),
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      width: 120,
      render: (date) => (date ? new Date(date).toLocaleDateString() : "—"),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      width: 120,
      render: (date, record) => {
        const dateStr = date ? new Date(date).toLocaleDateString() : "—";
        if (record.isExpiringSoon) {
          return <Tag color="orange">{dateStr}</Tag>;
        }
        return dateStr;
      },
    },
    {
      title: "Value",
      dataIndex: "contractValue",
      key: "contractValue",
      width: 140,
      render: (value, record) => {
        const currency = record.currency || "ZAR";
        return value ? `${currency} ${value.toLocaleString()}` : "—";
      },
    },
  ];

  const handleRowClick = (record: IContract) => {
    onSelectContract(record);
  };

  return (
    <Card className={styles.tableCard} title="Contracts">
      <Table
        columns={columns}
        dataSource={contracts}
        loading={loading}
        rowKey="id"
        scroll={{ x: 1200 }}
        pagination={
          pagination
            ? {
                current: pagination.currentPage,
                pageSize: pagination.pageSize,
                total: pagination.totalCount,
                onChange: onPaginationChange,
              }
            : false
        }
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          className: selectedContractId === record.id ? styles.selectedRow : styles.tableRow,
          style: {
            backgroundColor:
              selectedContractId === record.id ? "rgba(13, 110, 253, 0.08)" : undefined,
          },
        })}
      />
    </Card>
  );
};
