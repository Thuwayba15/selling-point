"use client";

import React from "react";
import { Card, Table, Statistic, Row, Col, Empty } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { ISalesByPeriodItem } from "@/providers/reports/context";
import { useStyles } from "./style";

interface SalesByPeriodReportProps {
  data: ISalesByPeriodItem[];
  loading?: boolean;
}

export const SalesByPeriodReport: React.FC<SalesByPeriodReportProps> = ({
  data,
  loading = false,
}) => {
  const { styles } = useStyles();

  const columns: ColumnsType<ISalesByPeriodItem> = [
    {
      title: "Period",
      dataIndex: "periodName",
      key: "periodName",
      width: 200,
    },
    {
      title: "Total Value",
      dataIndex: "totalValue",
      key: "totalValue",
      width: 200,
      render: (value: number) => (value ? `R ${value.toLocaleString()}` : "-"),
      align: "right",
    },
    {
      title: "Opportunities",
      dataIndex: "opportunitiesCount",
      key: "opportunitiesCount",
      width: 150,
      align: "center",
    },
    {
      title: "Won",
      dataIndex: "wonCount",
      key: "wonCount",
      width: 100,
      align: "center",
    },
    {
      title: "Lost",
      dataIndex: "lostCount",
      key: "lostCount",
      width: 100,
      align: "center",
    },
    {
      title: "Win Rate",
      dataIndex: "winRate",
      key: "winRate",
      width: 120,
      render: (rate: number) => (rate ? `${rate.toFixed(1)}%` : "-"),
      align: "center",
    },
    {
      title: "Won Value",
      dataIndex: "wonValue",
      key: "wonValue",
      width: 200,
      render: (value: number) => (value ? `R ${value.toLocaleString()}` : "-"),
      align: "right",
    },
  ];

  const totalRevenue = data.reduce((sum, item) => sum + (item.totalValue || 0), 0);
  const totalOpportunities = data.reduce((sum, item) => sum + (item.opportunitiesCount || 0), 0);
  const totalWon = data.reduce((sum, item) => sum + (item.wonCount || 0), 0);
  const totalLost = data.reduce((sum, item) => sum + (item.lostCount || 0), 0);
  const totalWonValue = data.reduce((sum, item) => sum + (item.wonValue || 0), 0);
  const averageWinRate = data.length > 0 ? data.reduce((sum, item) => sum + (item.winRate || 0), 0) / data.length : 0;

  if (!data || data.length === 0) {
    return (
      <Card title="Sales by Period Report" className={styles.reportCard}>
        <div className={styles.emptyState}>
          <Empty description="No sales data found. Adjust filters and generate report." />
        </div>
      </Card>
    );
  }

  return (
    <Card title="Sales by Period Report" className={styles.reportCard}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card className={styles.metricCard}>
            <Statistic
              title="Total Value"
              value={totalRevenue}
              prefix="R"
              precision={0}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className={styles.metricCard}>
            <Statistic
              title="Total Opportunities"
              value={totalOpportunities}
              precision={0}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className={styles.metricCard}>
            <Statistic
              title="Won"
              value={totalWon}
              precision={0}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className={styles.metricCard}>
            <Statistic
              title="Avg Win Rate"
              value={averageWinRate}
              suffix="%"
              precision={1}
            />
          </Card>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey={(record, index) => `${record.periodName}-${index}`}
        pagination={{
          pageSize: 12,
          showTotal: (total) => `Total ${total} periods`,
        }}
        scroll={{ x: "max-content" }}
      />
    </Card>
  );
};
