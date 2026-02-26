"use client";

import { Card, Table } from "antd";
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

export const OpportunitiesPipeline = ({ pipeline, loading }: OpportunitiesPipelineProps) => {
  const { styles } = useStyles();
  const stages = pipeline?.stages || [];

  const columns: ColumnsType<IOpportunityPipelineStage> = [
    {
      title: "Stage",
      dataIndex: "stage",
      key: "stage",
      render: (stage) => STAGE_LABELS[stage] || "—",
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
        rowKey={(record, index) => `${record.stage ?? "stage"}-${index}`}
        pagination={false}
        size="small"
      />
    </Card>
  );
};
