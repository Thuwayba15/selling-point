"use client";

import { Table, Empty, Skeleton } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ISalesPerformance } from "@/providers/dashboard/context";
import { useStyles } from "./style";

interface DashboardSalesPerformanceProps {
  salesPerformance?: ISalesPerformance[];
  isLoading: boolean;
}

export const DashboardSalesPerformance = ({
  salesPerformance,
  isLoading,
}: DashboardSalesPerformanceProps) => {
  const { styles } = useStyles();

  if (isLoading) {
    return (
      <div>
        <Skeleton active paragraph={{ rows: 5 }} />
      </div>
    );
  }

  if (!salesPerformance || !Array.isArray(salesPerformance) || salesPerformance.length === 0) {
    return <Empty description="No sales performance data available" />;
  }

  const columns: ColumnsType<ISalesPerformance> = [
    {
      title: "Sales Rep",
      dataIndex: "firstName",
      key: "name",
      render: (_, record) => `${record.firstName} ${record.lastName}`,
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: "Revenue",
      dataIndex: "revenue",
      key: "revenue",
      render: (value: number) => {
        if (!value || isNaN(value)) return "$0.00M";
        return `$${(value / 1000000).toFixed(2)}M`;
      },
      responsive: ["sm", "md", "lg"],
    },
    {
      title: "Won",
      dataIndex: "opportunitiesWon",
      key: "won",
      render: (value: number) => value || 0,
      responsive: ["md", "lg"],
    },
    {
      title: "Win Rate",
      dataIndex: "winRate",
      key: "winRate",
      render: (value: number) => {
        if (!value || isNaN(value)) return "0.0%";
        return `${value.toFixed(1)}%`;
      },
      responsive: ["md", "lg"],
    },
  ];

  return (
    <div className={styles.table}>
      <Table
        columns={columns}
        dataSource={salesPerformance}
        rowKey="userId"
        pagination={false}
        size="small"
      />
    </div>
  );
};
