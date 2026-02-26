"use client";

import { Card, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { IOpportunityPipeline, IOpportunityPipelineStage } from "@/providers/opportunities/context";
import { useStyles } from "./style";

interface OpportunitiesPipelineProps {
  pipeline?: IOpportunityPipeline;
  loading: boolean;
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

export const OpportunitiesPipeline = ({ pipeline, loading }: OpportunitiesPipelineProps) => {
  const { styles } = useStyles();
  const stages = pipeline?.stages || [];

  const columns: ColumnsType<IOpportunityPipelineStage> = [
    {
      title: "Stage",
      dataIndex: "stage",
      key: "stage",
      render: (stage) => (
        <Tag color={STAGE_COLORS[stage] || "default"}>{STAGE_LABELS[stage] || "—"}</Tag>
      ),
    },
    {
      title: "Count",
      dataIndex: "count",
      key: "count",
      render: (count) => (typeof count === "number" ? count : "—"),
    },
    {
      title: "Total Value",
      dataIndex: "totalValue",
      key: "totalValue",
      render: (value) => (typeof value === "number" ? value.toLocaleString() : "—"),
    },
    {
      title: "Weighted Value",
      dataIndex: "weightedValue",
      key: "weightedValue",
      render: (value) => (typeof value === "number" ? value.toLocaleString() : "—"),
    },
  ];

  return (
    <Card className={styles.insightCard} title="Pipeline Overview" loading={loading}>
      <Table
        columns={columns}
        dataSource={stages}
        rowKey={(record) => String(record.stage ?? "unknown")}
        pagination={false}
        scroll={{ x: "max-content" }}
        size="small"
      />
    </Card>
  );
};
