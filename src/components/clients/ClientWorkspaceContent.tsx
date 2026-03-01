"use client";

import { useState, useCallback } from "react";
import { Tabs, Spin, Empty, Card, Row, Col, Space, Button, Descriptions, Tag, App } from "antd";
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { ContactsTab } from "./tabs/ContactsTab";
import { OpportunitiesTab } from "./tabs/OpportunitiesTab";
import { ContractsTab } from "./tabs/ContractsTab";
import { DocumentsTab } from "./tabs/DocumentsTab";
import { NotesTab } from "./tabs/NotesTab";
import { EntityModalsRenderer } from "./modals/EntityModalsRenderer";
import { DocumentUploadForm } from "@/components/documents/DocumentUploadForm";
import { NoteForm } from "@/components/notes/NoteForm";
import { RelatedDocumentsModal, RelatedNotesModal } from "@/components/opportunities/modals";
import { EntityWorkspaceTabs, type WorkspaceTabItem } from "@/components/common";
import { useRbac } from "@/hooks/useRbac";
import { useWorkspaceDocuments } from "@/hooks/useWorkspaceDocuments";
import { useWorkspaceNotes } from "@/hooks/useWorkspaceNotes";
import type { RelatedDocsTarget } from "@/hooks/useWorkspaceDocuments";
import type { RelatedNotesTarget } from "@/hooks/useWorkspaceNotes";
import { useDocumentsActions } from "@/providers/documents";
import { useNotesActions } from "@/providers/notes";
import { RelatedToType as DocumentRelatedToType } from "@/providers/documents/context";
import { RelatedToType as NoteRelatedToType } from "@/providers/notes/context";
import type { IClient } from "@/providers/clients/context";
import type { IContact } from "@/providers/contacts/context";
import type { IOpportunity } from "@/providers/opportunities/context";
import type { IContract } from "@/providers/contracts/context";
import type { IDocument } from "@/providers/documents/context";
import type { INote } from "@/providers/notes/context";
import { useStyles } from "./style";
import type { EntityType } from "./hooks/useClientEntityModals";

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
  entityModals: any; // TODO: Add proper type
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
  entityModals,
}: ClientWorkspaceContentProps) => {
  const { can } = useRbac();
  const { styles } = useStyles();
  const { message } = App.useApp();
  
  // Document management hook - same as opportunities workspace
  const documents = useWorkspaceDocuments(onRefreshWorkspace);
  const documentsActions = useDocumentsActions();

  // Note management hook - same as opportunities workspace
  const notes = useWorkspaceNotes(onRefreshWorkspace);
  const notesActions = useNotesActions();

  // Client-specific note creation handler
  const handleClientNoteSubmit = useCallback(async (values: any) => {
    if (!client?.id) return;
    
    try {
      if (notes.editingWorkspaceNote) {
        const success = await notesActions.updateNote(notes.editingWorkspaceNote.id, {
          content: values.content,
        });
        if (!success) return;

        message.success("Note updated successfully");
        notes.closeWorkspaceNoteForm();
        await onRefreshWorkspace();
      } else {
        const success = await notesActions.createNote({
          content: values.content,
          relatedToType: NoteRelatedToType.Client,
          relatedToId: client.id,
        });
        if (!success) return;

        message.success("Note created successfully");
        notes.closeWorkspaceNoteForm();
        await onRefreshWorkspace();
      }
    } catch (error) {
      message.error("Failed to save note");
    }
  }, [client?.id, notes, notesActions, message, onRefreshWorkspace]);

  // Handle opening contract documents
  const handleEntityDocuments = useCallback((type: "contract", entity: IContract) => {
    if (!entity?.id) return;
    const target: RelatedDocsTarget = {
      relatedToType: DocumentRelatedToType.Contract,
      relatedToId: entity.id,
      title: entity.contractNumber || entity.title || "Contract",
    };
    documents.openRelatedDocuments(target);
  }, [documents]);

  // Handle opening contract notes
  const handleEntityNotes = useCallback((type: "contract", entity: IContract) => {
    if (!entity?.id) return;
    const target: RelatedNotesTarget = {
      relatedToType: NoteRelatedToType.Contract,
      relatedToId: entity.id,
      title: entity.contractNumber || entity.title || "Contract",
    };
    notes.openRelatedNotes(target);
  }, [notes]);

  // Client-specific document upload handler
  const handleClientUpload = useCallback(() => {
    if (!client?.id) return;
    // Set the form values for client upload
    documents.workspaceUploadForm.setFieldsValue({
      relatedToType: DocumentRelatedToType.Client,
      relatedToId: client.id,
    });
    documents.setIsWorkspaceUploadOpen(true);
  }, [client?.id, documents]);

  // Client-specific document upload submit handler
  const handleClientUploadSubmit = useCallback(async (values: any, file: File) => {
    if (!client?.id) return;
    
    try {
      const success = await documentsActions.uploadDocument(file, {
        category: values.category,
        relatedToType: DocumentRelatedToType.Client,
        relatedToId: client.id,
        description: values.description,
      });

      if (!success) return;

      message.success("Document uploaded successfully");
      documents.setIsWorkspaceUploadOpen(false);
      await onRefreshWorkspace();
    } catch (error) {
      message.error("Failed to upload document");
    }
  }, [client?.id, documentsActions, documents, message, onRefreshWorkspace]);

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
          isLoading={isLoading}
          onCreateEntity={() => onCreateEntity("contract")}
          onEditEntity={(contract) => onEditEntity("contract", contract)}
          onActivateEntity={(contract) => onEditEntity("contract", contract)}
          onCancelEntity={(contract) => onEditEntity("contract", contract)}
          onDeleteEntity={(contract) => onDeleteEntity("contract", contract)}
          onViewDocuments={handleEntityDocuments}
          onViewNotes={handleEntityNotes}
          toolbarClassName={styles.toolbarContainer}
        />
      ),
    },
    {
      key: "documents",
      label: `Documents (${workspaceData.documents.length})`,
      content: (
        <DocumentsTab
          documents={workspaceData.documents}
          isLoading={isLoading}
          selectedDocument={documents.selectedDocument}
          onSelectDocument={documents.setSelectedDocument}
          onUpload={handleClientUpload}
          onDownload={() => documents.downloadDocument(documents.selectedDocument)}
          onDelete={() => documents.deleteDocument(documents.selectedDocument)}
          canDelete={can("delete:document")}
        />
      ),
    },
    {
      key: "notes",
      label: `Notes (${workspaceData.notes.length})`,
      content: (
        <NotesTab
          notes={workspaceData.notes}
          isLoading={isLoading}
          selectedNote={notes.selectedNote}
          onSelectNote={notes.setSelectedNote}
          onAdd={notes.openWorkspaceNoteForm}
          onEdit={() => notes.selectedNote && notes.editWorkspaceNote(notes.selectedNote)}
          onDelete={() =>
            notes.deleteNote(notes.selectedNote, () => notes.setSelectedNote(null))
          }
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

      {/* Document Upload Modal */}
      <DocumentUploadForm
        open={documents.isWorkspaceUploadOpen}
        onCancel={() => documents.setIsWorkspaceUploadOpen(false)}
        onSubmit={handleClientUploadSubmit}
        form={documents.workspaceUploadForm}
        relatedToType={DocumentRelatedToType.Client}
        clientOptions={client ? [{ value: client.id, label: client.name }] : []}
      />

      {/* Related Document Upload */}
      <DocumentUploadForm
        open={documents.isRelatedUploadOpen}
        onCancel={() => documents.setIsRelatedUploadOpen(false)}
        onSubmit={documents.handleRelatedUpload}
        form={documents.relatedUploadForm}
        loading={documents.isRelatedDocsLoading}
        zIndex={1300}
        relatedToType={documents.relatedDocsTarget?.relatedToType}
        contractOptions={workspaceData.contracts.map((contract) => ({
          value: contract.id,
          label: contract.contractNumber || contract.title || "Contract",
        }))}
      />

      {/* Workspace Note Form */}
      <NoteForm
        open={notes.isWorkspaceNoteFormOpen}
        onCancel={notes.closeWorkspaceNoteForm}
        onSubmit={handleClientNoteSubmit}
        form={notes.workspaceNoteForm}
        loading={isLoading}
        relatedToType={NoteRelatedToType.Client}
        note={notes.editingWorkspaceNote}
      />

      {/* Related Note Form */}
      <NoteForm
        open={notes.isRelatedNoteFormOpen}
        onCancel={notes.closeRelatedNoteForm}
        onSubmit={notes.handleCreateRelatedNote}
        form={notes.relatedNoteForm}
        loading={notes.isRelatedNotesLoading}
        zIndex={1300}
        relatedToType={notes.relatedNotesTarget?.relatedToType}
        note={notes.editingRelatedNote}
      />

      {/* Related Documents Modal */}
      <RelatedDocumentsModal
        open={documents.isRelatedDocsModalOpen}
        target={documents.relatedDocsTarget}
        documents={documents.relatedDocuments}
        loading={documents.isRelatedDocsLoading}
        selectedDocument={documents.selectedRelatedDocument}
        onSelectDocument={documents.setSelectedRelatedDocument}
        onUpload={documents.openRelatedUpload}
        onDownload={documents.downloadDocument}
        onDelete={(doc) =>
          documents.deleteDocument(doc, async () => {
            documents.setSelectedRelatedDocument(null);
            if (documents.relatedDocsTarget) {
              await documents.openRelatedDocuments(documents.relatedDocsTarget);
            }
          })
        }
        onClose={documents.closeRelatedDocuments}
        canDelete={can("delete:document")}
      />

      {/* Related Notes Modal */}
      <RelatedNotesModal
        open={notes.isRelatedNotesModalOpen}
        target={notes.relatedNotesTarget}
        notes={notes.relatedNotes}
        loading={notes.isRelatedNotesLoading}
        selectedNote={notes.selectedRelatedNote}
        onSelectNote={notes.setSelectedRelatedNote}
        onAdd={notes.openRelatedNoteForm}
        onEdit={(note) => {
          notes.relatedNoteForm.setFieldsValue({ content: note.content });
          notes.openRelatedNoteForm();
        }}
        onDelete={(note) =>
          notes.deleteNote(note, async () => {
            notes.setSelectedRelatedNote(null);
            if (notes.relatedNotesTarget) {
              await notes.openRelatedNotes(notes.relatedNotesTarget);
            }
          })
        }
        onClose={notes.closeRelatedNotes}
        canDelete={can("delete:note")}
      />

      {/* Entity Modals */}
      <EntityModalsRenderer
        entityModals={entityModals}
        selectedClient={client}
        workspaceData={workspaceData}
        onRefresh={onRefreshWorkspace}
      />
    </div>
  );
};
