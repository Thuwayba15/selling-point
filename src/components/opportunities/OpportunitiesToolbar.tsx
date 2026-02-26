"use client";

import { Button, Input, Segmented, Select, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { OpportunitiesQuery, OpportunitiesTab } from "../../domains/opportunities/types";

type Props = {
  query: OpportunitiesQuery;
  onTabChange: (tab: OpportunitiesTab) => void;
  onSearchChange: (value: string) => void;
  onStageChange: (value?: number) => void;
  onCreateClick: () => void;
};

export const OpportunitiesToolbar = ({
  query,
  onTabChange,
  onSearchChange,
  onStageChange,
  onCreateClick,
}: Props) => {
  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <Segmented
          value={query.tab}
          onChange={(v) => onTabChange(v as OpportunitiesTab)}
          options={[
            { label: "All", value: "all" },
            { label: "My Opportunities", value: "mine" },
          ]}
        />

        <Button type="primary" icon={<PlusOutlined />} onClick={onCreateClick}>
          New Opportunity
        </Button>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Input
          value={query.searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search opportunities..."
          style={{ minWidth: 320, flex: 1 }}
          allowClear
        />

        <Select
          value={query.stage}
          onChange={(v) => onStageChange(v)}
          placeholder="All Stages"
          style={{ minWidth: 220 }}
          allowClear
          options={[
            { label: "Qualification", value: 1 },
            { label: "Discovery", value: 2 },
            { label: "Proposal", value: 3 },
            { label: "Negotiation", value: 4 },
            { label: "Won", value: 5 },
          ]}
        />
      </div>
    </Space>
  );
};