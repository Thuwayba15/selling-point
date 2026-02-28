"use client";

import { Table, Empty, Skeleton, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { IExpiringContractsList, IExpiringContract } from "@/providers/dashboard/context";
import { formatCurrency } from "@/utils/currency";
import { useStyles } from "./style";

interface DashboardExpiringContractsProps {
  expiringContracts?: IExpiringContractsList;
  isLoading: boolean;
}

export const DashboardExpiringContracts = ({
  expiringContracts,
  isLoading,
}: DashboardExpiringContractsProps) => {
  const { styles } = useStyles();

  if (isLoading) {
    return (
      <div>
        <Skeleton active paragraph={{ rows: 5 }} />
      </div>
    );
  }

  if (
    !expiringContracts ||
    !expiringContracts.contracts ||
    !Array.isArray(expiringContracts.contracts) ||
    expiringContracts.contracts.length === 0
  ) {
    return <Empty description="No expiring contracts" />;
  }

  const getStatusColor = (days: number) => {
    if (days <= 7) return "red";
    if (days <= 14) return "orange";
    return "blue";
  };

  const columns: ColumnsType<IExpiringContract> = [
    {
      title: "Client",
      dataIndex: "clientName",
      key: "clientName",
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: "Value",
      dataIndex: "contractValue",
      key: "value",
      render: (value: number) => formatCurrency(value),
      responsive: ["sm", "md", "lg"],
    },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (date: string) => (date ? new Date(date).toLocaleDateString() : "N/A"),
      responsive: ["sm", "md", "lg"],
    },
    {
      title: "Days Until Expiry",
      dataIndex: "daysUntilExpiry",
      key: "daysUntilExpiry",
      render: (days: number) => <Tag color={getStatusColor(days)}>{days || 0} days</Tag>,
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => <Tag color="processing">{status || "Active"}</Tag>,
      responsive: ["md", "lg"],
    },
  ];

  return (
    <div className={styles.table}>
      <Table
        columns={columns}
        dataSource={expiringContracts.contracts}
        rowKey="id"
        pagination={false}
        size="small"
      />
    </div>
  );
};
