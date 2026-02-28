"use client";

import { Table, Empty, Skeleton } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ISalesPerformance } from "@/providers/dashboard/context";
import { formatCurrency, formatPercentage } from "@/utils/currency";
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
      dataIndex: "userName",
      key: "name",
      render: (value: string) => value || "Unknown",
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: "Revenue",
      dataIndex: "totalRevenue",
      key: "revenue",
      render: (value: number) => formatCurrency(value),
      responsive: ["sm", "md", "lg"],
    },
    {
      title: "Opportunities",
      dataIndex: "opportunitiesCount",
      key: "opportunities",
      render: (value: number) => value || 0,
      responsive: ["md", "lg"],
    },
    {
      title: "Won",
      dataIndex: "wonCount",
      key: "won",
      render: (value: number) => value || 0,
      responsive: ["md", "lg"],
    },
    {
      title: "Win Rate",
      dataIndex: "winRate",
      key: "winRate",
      render: (value: number) => formatPercentage(value),
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
