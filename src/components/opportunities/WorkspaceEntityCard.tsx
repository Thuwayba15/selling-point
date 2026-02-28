"use client";

import { useState } from "react";
import { Card, Tag, Space, Typography, Empty, Button, Popconfirm } from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  FileTextOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  UserAddOutlined,
  DownOutlined,
  UpOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { IActivity } from "@/providers/activities/context";
import type { IProposal } from "@/providers/proposals/context";
import type { IPricingRequest } from "@/providers/pricing-requests/context";
import type { IContract } from "@/providers/contracts/context";
import type { IDocument } from "@/providers/documents/context";
import type { INote } from "@/providers/notes/context";
import { useRbac } from "@/hooks/useRbac";

const { Text } = Typography;

// Status mappings
const ACTIVITY_STATUS_COLORS: Record<number, string> = {
  1: "processing",
  2: "success",
  3: "default",
};

const ACTIVITY_TYPE_COLORS: Record<number, string> = {
  1: "blue",
  2: "green",
  3: "cyan",
  4: "orange",
  5: "purple",
  6: "default",
};

const PRIORITY_COLORS: Record<number, string> = {
  1: "default",
  2: "blue",
  3: "orange",
  4: "red",
};

const PROPOSAL_STATUS_COLORS: Record<number, string> = {
  1: "default",
  2: "processing",
  3: "error",
  4: "success",
};

const PRICING_STATUS_COLORS: Record<number, string> = {
  1: "warning",
  2: "processing",
  3: "success",
};

const CONTRACT_STATUS_COLORS: Record<number, string> = {
  1: "default",
  2: "success",
  3: "warning",
  4: "processing",
  5: "error",
};

const DOCUMENT_CATEGORY_COLORS: Record<number, string> = {
  1: "blue",
  2: "green",
  3: "orange",
  4: "purple",
  5: "default",
};

interface WorkspaceEntityCardProps {
  entity: IActivity | IProposal | IPricingRequest | IContract | IDocument | INote;
  type: "activity" | "proposal" | "pricingRequest" | "contract" | "document" | "note";
  onClick?: (entity: any) => void;
  onEdit?: (entity: any) => void;
  onAssign?: (entity: any) => void;
  onComplete?: (entity: any) => void;
  onDelete?: (entity: any) => void;
}

export const WorkspaceEntityCard = ({
  entity,
  type,
  onClick,
  onEdit,
  onAssign,
  onComplete,
  onDelete,
}: WorkspaceEntityCardProps) => {
  const { can } = useRbac();
  const [expanded, setExpanded] = useState(false);

  const renderActions = () => {
    const editPermissionMap: Record<WorkspaceEntityCardProps["type"], string | null> = {
      activity: "update:activity",
      proposal: "update:proposal",
      pricingRequest: "update:pricing-request",
      contract: "update:contract",
      document: null,
      note: "update:note",
    };

    const deletePermissionMap: Record<WorkspaceEntityCardProps["type"], string | null> = {
      activity: "delete:activity",
      proposal: "delete:proposal",
      pricingRequest: null,
      contract: "delete:contract",
      document: "delete:document",
      note: "delete:note",
    };

    const canEdit = Boolean(onEdit && editPermissionMap[type] && can(editPermissionMap[type]!));
    const canDelete = Boolean(onDelete && deletePermissionMap[type] && can(deletePermissionMap[type]!));

    if (!canEdit && !canDelete) return null;

    return (
      <Space size="small">
        {canEdit && (
          <Button
            size="small"
            type="text"
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(entity);
            }}
          />
        )}
        {canDelete && (
          <Popconfirm
            title="Are you sure you want to delete this item?"
            onConfirm={(e) => {
              e?.stopPropagation();
              onDelete?.(entity);
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button
              size="small"
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={(e) => e.stopPropagation()}
            />
          </Popconfirm>
        )}
      </Space>
    );
  };
  const renderActivityCard = (activity: IActivity) => (
    <Card
      size="small"
      hoverable={!!onClick}
      onClick={() => onClick?.(activity)}
      style={{ marginBottom: 8, cursor: onClick ? "pointer" : "default" }}
    >
      <Space direction="vertical" style={{ width: "100%" }} size="small">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <Text strong>{activity.subject}</Text>
              {renderActions()}
            </div>
            <Space size="small" wrap>
              {activity.typeName && (
                <Tag color={ACTIVITY_TYPE_COLORS[activity.type]}>{activity.typeName}</Tag>
              )}
              {activity.statusName && (
                <Tag color={ACTIVITY_STATUS_COLORS[activity.status]}>{activity.statusName}</Tag>
              )}
            </Space>
          </div>
        </div>

        {activity.description && (
          <Text type="secondary" ellipsis>
            {activity.description}
          </Text>
        )}

        <Space split="|" size="small" wrap>
          {activity.priorityName && (
            <Space size={4}>
              <Tag color={PRIORITY_COLORS[activity.priority]} style={{ margin: 0 }}>
                {activity.priorityName}
              </Tag>
            </Space>
          )}
          {activity.assignedToName && (
            <Space size={4}>
              <UserOutlined />
              <Text type="secondary">{activity.assignedToName}</Text>
            </Space>
          )}
          {activity.dueDate && (
            <Space size={4}>
              <CalendarOutlined />
              <Text type="secondary">{new Date(activity.dueDate).toLocaleDateString()}</Text>
            </Space>
          )}
          {activity.duration && (
            <Space size={4}>
              <ClockCircleOutlined />
              <Text type="secondary">{activity.duration} mins</Text>
            </Space>
          )}
        </Space>
      </Space>
    </Card>
  );

  const renderProposalCard = (proposal: IProposal) => {
    const statusNames: Record<number, string> = {
      1: "Draft",
      2: "Submitted",
      3: "Rejected",
      4: "Approved",
    };

    return (
      <Card
        size="small"
        hoverable
        onClick={() => onClick?.(proposal)}
        style={{ marginBottom: 8, cursor: onClick ? "pointer" : "default" }}
      >
        <Space direction="vertical" style={{ width: "100%" }} size="small">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Text strong>{proposal.title || "Proposal"}</Text>
            {proposal.status && (
              <Tag color={PROPOSAL_STATUS_COLORS[proposal.status]}>{statusNames[proposal.status]}</Tag>
            )}
          </div>

          {proposal.description && (
            <Text type="secondary" ellipsis>
              {proposal.description}
            </Text>
          )}

          <Space split="|" size="small" wrap>
            {proposal.clientName && (
              <Space size={4}>
                <UserOutlined />
                <Text type="secondary">{proposal.clientName}</Text>
              </Space>
            )}
            {proposal.totalAmount !== undefined && (
              <Space size={4}>
                <DollarOutlined />
                <Text type="secondary">
                  {proposal.currency || "R"} {proposal.totalAmount.toLocaleString()}
                </Text>
              </Space>
            )}
            {proposal.validUntil && (
              <Space size={4}>
                <CalendarOutlined />
                <Text type="secondary">Valid until: {new Date(proposal.validUntil).toLocaleDateString()}</Text>
              </Space>
            )}
          </Space>
        </Space>
      </Card>
    );
  };

  const renderPricingRequestCard = (pricingRequest: IPricingRequest) => {
    const statusNames: Record<number, string> = { 1: "Pending", 2: "In Progress", 3: "Completed" };
    const priorityNames: Record<number, string> = { 1: "Low", 2: "Medium", 3: "High", 4: "Urgent" };
    const isCompleted = pricingRequest.status === 3;
    const canEditPricing = Boolean(onEdit && can("update:pricing-request") && !isCompleted);
    const canAssignPricing = Boolean(onAssign && can("assign:pricing-request") && !isCompleted);
    const canCompletePricing = Boolean(onComplete && can("complete:pricing-request") && !isCompleted);
    const canDeletePricing = false;

    return (
      <Card
        size="small"
        hoverable
        onClick={() => onClick?.(pricingRequest)}
        style={{ marginBottom: 8, cursor: onClick ? "pointer" : "default" }}
      >
        <Space direction="vertical" style={{ width: "100%" }} size="small">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Text strong>{pricingRequest.opportunityTitle || "—"}</Text>
            <Space size="small">
              {pricingRequest.status && (
                <Tag color={PRICING_STATUS_COLORS[pricingRequest.status]}>
                  {statusNames[pricingRequest.status]}
                </Tag>
              )}
              {pricingRequest.priority && (
                <Tag color={PRIORITY_COLORS[pricingRequest.priority]} style={{ margin: 0 }}>
                  {priorityNames[pricingRequest.priority]}
                </Tag>
              )}
            </Space>
          </div>

          <Space split="|" size="small" wrap>
            <Space size={4}>
              <UserOutlined />
              <Text type="secondary">{pricingRequest.assignedToName || "Unassigned"}</Text>
            </Space>
            <Space size={4}>
              <CalendarOutlined />
              <Text type="secondary">
                {pricingRequest.requiredByDate
                  ? new Date(pricingRequest.requiredByDate).toLocaleDateString()
                  : "—"}
              </Text>
            </Space>
          </Space>

          {(canEditPricing || canAssignPricing || canCompletePricing || canDeletePricing || pricingRequest.description) && (
            <Space size="small" wrap>
              {canEditPricing && (
                <Button
                  size="small"
                  type="text"
                  icon={<EditOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(pricingRequest);
                  }}
                >
                  Edit
                </Button>
              )}
              {canAssignPricing && (
                <Button
                  size="small"
                  type="text"
                  icon={<UserAddOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAssign?.(pricingRequest);
                  }}
                >
                  Assign
                </Button>
              )}
              {canCompletePricing && (
                <Button
                  size="small"
                  type="text"
                  icon={<CheckOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onComplete?.(pricingRequest);
                  }}
                >
                  Complete
                </Button>
              )}
              {pricingRequest.description && (
                <Button
                  size="small"
                  type="text"
                  icon={expanded ? <UpOutlined /> : <DownOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpanded((prev) => !prev);
                  }}
                >
                  {expanded ? "Collapse" : "Expand"}
                </Button>
              )}
            </Space>
          )}

          {expanded && pricingRequest.description && (
            <Text type="secondary">{pricingRequest.description}</Text>
          )}
        </Space>
      </Card>
    );
  };

  const renderContractCard = (contract: IContract) => {
    const statusNames: Record<number, string> = {
      1: "Draft",
      2: "Active",
      3: "Expired",
      4: "Renewed",
      5: "Cancelled",
    };

    return (
      <Card
        size="small"
        hoverable
        onClick={() => onClick?.(contract)}
        style={{ marginBottom: 8, cursor: onClick ? "pointer" : "default" }}
      >
        <Space direction="vertical" style={{ width: "100%" }} size="small">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Text strong>{contract.title || contract.contractNumber || "Contract"}</Text>
            {contract.status && (
              <Tag color={CONTRACT_STATUS_COLORS[contract.status]}>{statusNames[contract.status]}</Tag>
            )}
          </div>

          {contract.clientName && (
            <Text type="secondary">
              <UserOutlined /> {contract.clientName}
            </Text>
          )}

          <Space split="|" size="small" wrap>
            {contract.contractValue !== undefined && (
              <Space size={4}>
                <DollarOutlined />
                <Text type="secondary">
                  {contract.currency || "R"} {contract.contractValue.toLocaleString()}
                </Text>
              </Space>
            )}
            {contract.startDate && contract.endDate && (
              <Space size={4}>
                <CalendarOutlined />
                <Text type="secondary">
                  {new Date(contract.startDate).toLocaleDateString()} -{" "}
                  {new Date(contract.endDate).toLocaleDateString()}
                </Text>
              </Space>
            )}
            {contract.isExpiringSoon && (
              <Tag color="warning" icon={<ClockCircleOutlined />}>
                Expiring Soon
              </Tag>
            )}
          </Space>
        </Space>
      </Card>
    );
  };

  const renderDocumentCard = (document: IDocument) => {
    const categoryNames: Record<number, string> = {
      1: "Proposal",
      2: "Contract",
      3: "Presentation",
      4: "RFP",
      5: "Other",
    };

    return (
      <Card
        size="small"
        hoverable
        onClick={() => onClick?.(document)}
        style={{ marginBottom: 8, cursor: onClick ? "pointer" : "default" }}
      >
        <Space direction="vertical" style={{ width: "100%" }} size="small">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Text strong>
              <FileTextOutlined /> {document.originalFileName || document.fileName}
            </Text>
            {document.category && (
              <Tag color={DOCUMENT_CATEGORY_COLORS[document.category]}>
                {categoryNames[document.category]}
              </Tag>
            )}
          </div>

          {document.description && (
            <Text type="secondary" ellipsis>
              {document.description}
            </Text>
          )}

          <Space split="|" size="small" wrap>
            {document.uploadedByName && (
              <Space size={4}>
                <UserOutlined />
                <Text type="secondary">{document.uploadedByName}</Text>
              </Space>
            )}
            {document.fileSize && (
              <Text type="secondary">{(document.fileSize / 1024).toFixed(2)} KB</Text>
            )}
            {document.uploadedAt && (
              <Text type="secondary">{new Date(document.uploadedAt).toLocaleDateString()}</Text>
            )}
          </Space>
        </Space>
      </Card>
    );
  };

  const renderNoteCard = (note: INote) => (
    <Card
      size="small"
      hoverable
      onClick={() => onClick?.(note)}
      style={{ marginBottom: 8, cursor: onClick ? "pointer" : "default" }}
    >
      <Space direction="vertical" style={{ width: "100%" }} size="small">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Text type="secondary">
            <UserOutlined /> {note.createdByName || "Unknown"}
          </Text>
          {note.isPrivate && <Tag color="red">Private</Tag>}
        </div>

        <Text>{note.content}</Text>

        {note.createdAt && (
          <Text type="secondary" style={{ fontSize: "12px" }}>
            <ClockCircleOutlined /> {new Date(note.createdAt).toLocaleString()}
          </Text>
        )}
      </Space>
    </Card>
  );

  switch (type) {
    case "activity":
      return renderActivityCard(entity as IActivity);
    case "proposal":
      return renderProposalCard(entity as IProposal);
    case "pricingRequest":
      return renderPricingRequestCard(entity as IPricingRequest);
    case "contract":
      return renderContractCard(entity as IContract);
    case "document":
      return renderDocumentCard(entity as IDocument);
    case "note":
      return renderNoteCard(entity as INote);
    default:
      return null;
  }
};

interface WorkspaceEntityListProps {
  entities: any[];
  type: "activity" | "proposal" | "pricingRequest" | "contract" | "document" | "note";
  loading?: boolean;
  emptyText?: string;
  onEntityClick?: (entity: any) => void;
  onEntityEdit?: (entity: any) => void;
  onEntityAssign?: (entity: any) => void;
  onEntityComplete?: (entity: any) => void;
  onEntityDelete?: (entity: any) => void;
}

export const WorkspaceEntityList = ({
  entities,
  type,
  loading = false,
  emptyText = "No items found",
  onEntityClick,
  onEntityEdit,
  onEntityAssign,
  onEntityComplete,
  onEntityDelete,
}: WorkspaceEntityListProps) => {
  if (loading) {
    return <Card loading style={{ marginTop: 16 }} />;
  }

  if (!entities || entities.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <Empty description={emptyText} />
      </div>
    );
  }

  return (
    <div style={{ marginTop: 16 }}>
      {entities.map((entity) => (
        <WorkspaceEntityCard
          key={entity.id}
          entity={entity}
          type={type}
          onClick={onEntityClick}
          onEdit={onEntityEdit}
          onAssign={onEntityAssign}
          onComplete={onEntityComplete}
          onDelete={onEntityDelete}
        />
      ))}
    </div>
  );
};
