"use client";

import { Button, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";

type EntityType = "activity" | "proposal" | "pricingRequest" | "contract" | "document" | "note";

interface WorkspaceTabActionsProps {
  entityType: EntityType;
  onCreateClick: (type: EntityType) => void;
}

const ENTITY_LABELS: Record<EntityType, string> = {
  activity: "Activity",
  proposal: "Proposal",
  pricingRequest: "Pricing Request",
  contract: "Contract",
  document: "Document",
  note: "Note",
};

export const WorkspaceTabActions = ({ entityType, onCreateClick }: WorkspaceTabActionsProps) => {
  return (
    <Space style={{ marginBottom: 16 }}>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => onCreateClick(entityType)}
      >
        Add {ENTITY_LABELS[entityType]}
      </Button>
    </Space>
  );
};
