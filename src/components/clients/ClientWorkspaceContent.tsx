"use client";

import { Button, Space, Row, Col, Card, Descriptions, Tag, Spin, Empty } from "antd";
import { ArrowLeftOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { EntityWorkspaceTabs, WorkspaceTabItem } from "@/components/common";
import {
  ContactsTab,
  OpportunitiesTab,
  ContractsTab,
  DocumentsTab,
  NotesTab,
} from "./tabs";
import { useRbac } from "@/hooks/useRbac";
import { useStyles } from "./style";
import type { IClient } from "@/providers/clients/context";
import type { IContact } from "@/providers/contacts/context";
import type { IOpportunity } from "@/providers/opportunities/context";
import type { IContract } from "@/providers/contracts/context";
import type { IDocument } from "@/providers/documents/context";
import type { INote } from "@/providers/notes/context";
import type { EntityType } from "./hooks";

type WorkspaceEntity = IContact | IOpportunity | IContract | IDocument | INote;

interface WorkspaceData {
  contacts: IContact[];
  opportunities: IOpportunity[];
  contracts: IContract[];
  documents: IDocument[];
  notes: INote[];
}

interface ClientWorkspaceContentProps {
  client: IClient | null;
  isLoadingDetails: boolean;
  isLoading: boolean;
  workspaceData: WorkspaceData;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onEdit: () => void;
  onDelete: () => Promise<void>;
  onCreateEntity: (type: EntityType) => void;
  onEditEntity: (type: EntityType, entity: WorkspaceEntity) => void;
  onDeleteEntity: (type: EntityType, entity: WorkspaceEntity) => Promise<void>;
  onSetPrimaryContact?: (contact: IContact) => Promise<void>;
  onRefreshWorkspace: () => Promise<void>;
  onBackToClients: () => void;
}

const CLIENT_TYPE_MAP: Record<number, { label: string; color: string }> = {
  1: { label: "Government", color: "blue" },
  2: { label: "Private", color: "cyan" },
  3: { label: "Partner", color: "purple" },
};

export const ClientWorkspaceContent = ({
  client,
  isLoadingDetails,
  isLoading,
  workspaceData,
  activeTab,
  onTabChange,
  onEdit,
  onDelete,
  onCreateEntity,
  onEditEntity,
  onDeleteEntity,
  onSetPrimaryContact,
  onRefreshWorkspace,
  onBackToClients,
}: ClientWorkspaceContentProps) => {
  const { can } = useRbac();
  const { styles } = useStyles();

  if (!client) {
    if (isLoadingDetails) {
      return <Spin />;
    }
    return <Empty description="Client not found" />;
  }

  const tabs: WorkspaceTabItem[] = [
    {
      key: "contacts",
      label: `Contacts (${workspaceData.contacts.length})`,
      content: (
        <ContactsTab
          contacts={workspaceData.contacts}
          loading={isLoading}
          onCreateEntity={() => onCreateEntity("contact")}
          onEdit={(contact) => onEditEntity("contact", contact)}
          onDelete={(contact) => onDeleteEntity("contact", contact)}
          onSetPrimary={onSetPrimaryContact}
        />
      ),
    },
    {
      key: "opportunities",
      label: `Opportunities (${workspaceData.opportunities.length})`,
      content: (
        <OpportunitiesTab
          opportunities={workspaceData.opportunities}
          loading={isLoading}
          onCreateEntity={() => onCreateEntity("opportunity")}
          onEdit={(opp) => onEditEntity("opportunity", opp)}
          onDelete={(opp) => onDeleteEntity("opportunity", opp)}
          toolbarClassName={styles.toolbarContainer}
        />
      ),
    },
    {
      key: "contracts",
      label: `Contracts (${workspaceData.contracts.length})`,
      content: (
        <ContractsTab
          contracts={workspaceData.contracts}
          loading={isLoading}
          onEdit={(contract) => onEditEntity("contract", contract)}
          onDelete={(contract) => onDeleteEntity("contract", contract)}
        />
      ),
    },
    {
      key: "documents",
      label: `Documents (${workspaceData.documents.length})`,
      content: (
        <DocumentsTab
          documents={workspaceData.documents}
          loading={isLoading}
          onEdit={(doc) => onEditEntity("document", doc)}
          onDelete={(doc) => onDeleteEntity("document", doc)}
        />
      ),
    },
    {
      key: "notes",
      label: `Notes (${workspaceData.notes.length})`,
      content: (
        <NotesTab
          notes={workspaceData.notes}
          loading={isLoading}
          onEdit={(note) => onEditEntity("note", note)}
          onDelete={(note) => onDeleteEntity("note", note)}
        />
      ),
    },
  ];

  const clientTypeInfo = CLIENT_TYPE_MAP[client.clientType] || { label: "Unknown", color: "default" };

  return (
    <div style={{ padding: "24px" }}>
      {/* Header */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col span={24}>
          <Space>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={onBackToClients}
              style={{ fontSize: "16px" }}
            >
              Back to Clients
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Client Details Card */}
      <Card
        loading={isLoadingDetails}
        style={{ marginBottom: "24px" }}
        title={<h2 style={{ margin: 0 }}>{client.name}</h2>}
        extra={
          <Space>
            {can("update:client") && (
              <Button icon={<EditOutlined />} onClick={onEdit}>
                Edit
              </Button>
            )}
            {can("delete:client") && (
              <Button danger icon={<DeleteOutlined />} onClick={onDelete}>
                Delete
              </Button>
            )}
          </Space>
        }
      >
        <Descriptions
          column={{ xxl: 4, xl: 3, lg: 2, md: 1 }}
          bordered={false}
          size="small"
        >
          <Descriptions.Item label="Type">
            <Tag color={clientTypeInfo.color}>{clientTypeInfo.label}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={client.isActive ? "green" : "default"}>
              {client.isActive ? "Active" : "Inactive"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Industry">{client.industry || "—"}</Descriptions.Item>
          <Descriptions.Item label="Company Size">{client.companySize || "—"}</Descriptions.Item>
          <Descriptions.Item label="Website">
            {client.website ? (
              <a href={client.website} target="_blank" rel="noopener noreferrer">
                {client.website}
              </a>
            ) : (
              "—"
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Tax Number">{client.taxNumber || "—"}</Descriptions.Item>
          <Descriptions.Item label="Billing Address">{client.billingAddress || "—"}</Descriptions.Item>
          <Descriptions.Item label="Created Date">
            {client.createdAt ? new Date(client.createdAt).toLocaleDateString() : "—"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Tabs */}
      <EntityWorkspaceTabs
        title={`${client.name} - Workspace`}
        items={tabs}
        activeKey={activeTab}
        onChange={onTabChange}
      />
    </div>
  );
};
