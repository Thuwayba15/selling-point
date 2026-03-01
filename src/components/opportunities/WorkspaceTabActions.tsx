"use client";

import { Button, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRbac } from "@/hooks/useRbac";

interface WorkspaceTabActionsProps {
  entityType: EntityType;
  onCreateClick: (type: EntityType) => void;
  compact?: boolean;
}

type EntityType = "activity" | "proposal" | "pricingRequest" | "contract" | "document" | "note" | "contact";

const ENTITY_LABELS: Record<EntityType, string> = {
  activity: "Activity",
  proposal: "Proposal",
  pricingRequest: "Pricing Request",
  contract: "Contract",
  document: "Document",
  note: "Note",
  contact: "Contact",
};

export const WorkspaceTabActions = ({
  entityType,
  onCreateClick,
  compact = false,
}: WorkspaceTabActionsProps) => {
  const { can } = useRbac();

  const permissionMap: Record<EntityType, string> = {
    activity: "create:activity",
    proposal: "create:proposal",
    pricingRequest: "create:pricing-request",
    contract: "create:contract",
    document: "create:document",
    note: "create:note",
    contact: "create:contact",
  };

  if (!can(permissionMap[entityType])) {
    return null;
  }

  return (
    <Space style={compact ? undefined : { marginBottom: 16 }}>
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
