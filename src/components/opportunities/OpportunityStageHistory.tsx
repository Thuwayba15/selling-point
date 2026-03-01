"use client";

import { Card, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { IOpportunityStageHistory } from "@/providers/opportunities/context";
import { useStyles } from "./style";

interface OpportunityStageHistoryProps {
  stageHistory?: IOpportunityStageHistory[];
  loading: boolean;
  hasSelection: boolean;
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

export const OpportunityStageHistory = ({
  stageHistory = [],
  loading,
  hasSelection,
}: OpportunityStageHistoryProps) => {
  const { styles } = useStyles();

  const columns: ColumnsType<IOpportunityStageHistory> = [
    {
      title: "From Stage",
      dataIndex: "fromStage",
      key: "fromStage",
      render: (stage) => (
        <Tag color={STAGE_COLORS[stage] || "default"}>{STAGE_LABELS[stage] || "—"}</Tag>
      ),
    },
    {
      title: "To Stage",
      dataIndex: "toStage",
      key: "toStage",
      render: (stage) => (
        <Tag color={STAGE_COLORS[stage] || "default"}>{STAGE_LABELS[stage] || "—"}</Tag>
      ),
    },
    {
      title: "Reason",
      dataIndex: "notes",
      key: "notes",
      render: (notes, record) => {
        const parts = [];
        if (record.toStage === 6 && record.lossReason) {
          parts.push(`Loss Reason: ${record.lossReason}`);
        }
        if (notes) {
          parts.push(notes);
        }
        return parts.length > 0 ? parts.join(" | ") : "—";
      },
    },
    {
      title: "Changed At",
      dataIndex: "changedAt",
      key: "changedAt",
      render: (value) => (value ? new Date(value).toLocaleString() : "—"),
    },
    {
      title: "Changed By",
      dataIndex: "changedByName",
      key: "changedByName",
      render: (value) => value || "—",
    },
  ];

  return (
    <Card className={styles.insightCard} title="Stage History" loading={loading}>
      {hasSelection ? (
        <Table
          columns={columns}
          dataSource={stageHistory}
          rowKey={(record, index) => record.id || `${record.toStage ?? "stage"}-${index}`}
          pagination={false}
          scroll={{ x: "max-content" }}
          size="small"
        />
      ) : (
        <div className={styles.emptyState}>Select an opportunity to view stage history</div>
      )}
    </Card>
  );
};
