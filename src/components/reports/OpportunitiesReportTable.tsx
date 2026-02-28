"use client";

import React from "react";
import { Card, Table, Tag, Empty } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { IOpportunityReportItem, OpportunityStage } from "@/providers/reports/context";
import { reportCardStyle, emptyStateStyle } from "./style";
import dayjs from "dayjs";

const getStageColor = (stage: OpportunityStage): string => {
  const colors: Record<OpportunityStage, string> = {
    1: "default",
    2: "blue",
    3: "cyan",
    4: "gold",
    5: "green",
    6: "red",
  };
  return colors[stage] || "default";
};

const getStageLabel = (stage: OpportunityStage): string => {
  const labels: Record<OpportunityStage, string> = {
    1: "Lead",
    2: "Qualified",
    3: "Proposal",
    4: "Negotiation",
    5: "Closed Won",
    6: "Closed Lost",
  };
  return labels[stage] || "Unknown";
};

interface OpportunitiesReportTableProps {
  data: IOpportunityReportItem[];
  loading?: boolean;
}

export const OpportunitiesReportTable: React.FC<OpportunitiesReportTableProps> = ({
  data,
  loading = false,
}) => {
  const columns: ColumnsType<IOpportunityReportItem> = [
    {
      title: "Opportunity",
      dataIndex: "name",
      key: "name",
      width: 250,
    },
    {
      title: "Client",
      dataIndex: "clientName",
      key: "clientName",
      width: 200,
    },
    {
      title: "Stage",
      dataIndex: "stage",
      key: "stage",
      width: 130,
      render: (stage: OpportunityStage) => (
        <Tag color={getStageColor(stage)}>{getStageLabel(stage)}</Tag>
      ),
    },
    {
      title: "Value",
      dataIndex: "estimatedValue",
      key: "estimatedValue",
      width: 150,
      render: (value: number) => (value ? `R ${value.toLocaleString()}` : "-"),
      align: "right",
    },
    {
      title: "Probability",
      dataIndex: "probability",
      key: "probability",
      width: 120,
      render: (probability: number) => (probability ? `${probability}%` : "-"),
      align: "center",
    },
    {
      title: "Expected Close",
      dataIndex: "expectedCloseDate",
      key: "expectedCloseDate",
      width: 150,
      render: (date: string) => (date ? dayjs(date).format("DD MMM YYYY") : "-"),
    },
    {
      title: "Owner",
      dataIndex: "ownerName",
      key: "ownerName",
      width: 150,
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (date: string) => dayjs(date).format("DD MMM YYYY"),
    },
  ];

  if (!data || data.length === 0) {
    return (
      <Card title="Opportunities Report" style={reportCardStyle}>
        <div style={emptyStateStyle}>
          <Empty description="No opportunities found. Adjust filters and generate report." />
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="Opportunities Report"
      style={reportCardStyle}
      extra={<span>Total: {data.length}</span>}
    >
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 20,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} opportunities`,
        }}
        scroll={{ x: 1300 }}
      />
    </Card>
  );
};
