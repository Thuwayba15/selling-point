"use client";

import { useCallback, useMemo, useState } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { App, Button, Form, Modal, Select, Space } from "antd";
import { EntityWorkspaceTabs, type WorkspaceTabItem } from "@/components/common";
import { ProposalsFilters } from "@/components/proposals";
import { PricingRequestsFilters } from "@/components/pricing-requests";
import { ContractsFilters } from "@/components/contracts";
import { DocumentActions, DocumentsTable, DocumentUploadForm } from "@/components/documents";
import { NotesTable, NotesActions, NoteForm } from "@/components/notes";
import {
  OpportunityDetails,
  OpportunityActions,
  OpportunityStageHistory,
} from "@/components/opportunities";
import { WorkspaceEntityList } from "./WorkspaceEntityCard";
import { WorkspaceTabActions } from "./WorkspaceTabActions";
import { useStyles } from "@/components/opportunities/style";
import { getAxiosInstance } from "@/lib/api";
import { useRbac } from "@/hooks/useRbac";
import { useDocumentsActions } from "@/providers/documents";
import { useNotesActions } from "@/providers/notes";
import { IOpportunity } from "@/providers/opportunities/context";
import type { IProposal } from "@/providers/proposals/context";
import type { IPricingRequest } from "@/providers/pricing-requests/context";
import type { IContract } from "@/providers/contracts/context";
import { DocumentCategory, type IDocument, RelatedToType } from "@/providers/documents/context";
import type { INote } from "@/providers/notes/context";

interface WorkspaceData {
  pricingRequests: IPricingRequest[];
  proposals: IProposal[];
  contracts: IContract[];
  documents: IDocument[];
  notes: INote[];
}

type EntityType = "activity" | "proposal" | "pricingRequest" | "contract" | "document" | "note";

type RelatedDocsTarget = {
  relatedToType: RelatedToType;
  relatedToId: string;
  title: string;
};

interface OpportunityWorkspaceContentProps {
  opportunity: IOpportunity | null;
  selectedOpportunity: IOpportunity | null;
  stageHistory: any[];
  isLoadingDetails: boolean;
  isLoading: boolean;
  workspaceData: WorkspaceData;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onEdit: () => void;
  onDelete: () => Promise<void>;
  onUpdateStage: () => void;
  onAssign: () => void;
  onCreateEntity: (type: EntityType) => void;
  onEditEntity: (type: EntityType, entity: any) => void;
  onAssignEntity: (type: EntityType, entity: any) => void;
  onCompleteEntity: (type: EntityType, entity: any) => void;
  onActivateEntity: (type: EntityType, entity: any) => void;
  onCancelEntity: (type: EntityType, entity: any) => void;
  onSubmitEntity: (type: EntityType, entity: any) => void;
  onApproveEntity: (type: EntityType, entity: any) => void;
  onRejectEntity: (type: EntityType, entity: any) => void;
  onDeleteEntity: (type: EntityType, entity: any) => void;
  onRefreshWorkspace: () => Promise<void>;
  onBackToOpportunities: () => void;
}

export const OpportunityWorkspaceContent = ({
  opportunity,
  selectedOpportunity,
  stageHistory,
  isLoadingDetails,
  isLoading,
  workspaceData,
  activeTab,
  onTabChange,
  onEdit,
  onDelete,
  onUpdateStage,
  onAssign,
  onCreateEntity,
  onEditEntity,
  onAssignEntity,
  onCompleteEntity,
  onActivateEntity,
  onCancelEntity,
  onSubmitEntity,
  onApproveEntity,
  onRejectEntity,
  onDeleteEntity,
  onRefreshWorkspace,
  onBackToOpportunities,
}: OpportunityWorkspaceContentProps) => {
  const { styles } = useStyles();
  const { message, modal } = App.useApp();
  const { can } = useRbac();
  const documentsActions = useDocumentsActions();
  const notesActions = useNotesActions();
  const [proposalFilters, setProposalFilters] = useState<{
    status?: number;
    clientId?: string;
    opportunityId?: string;
  }>({});
  const [pricingFilters, setPricingFilters] = useState<{
    status?: number;
    priority?: number;
    assignedToId?: string;
  }>({});
  const [contractDraftFilters, setContractDraftFilters] = useState<{
    status?: number;
    clientId?: string;
  }>({});
  const [contractFilters, setContractFilters] = useState<{
    status?: number;
    clientId?: string;
  }>({});
  const [contractViewMode, setContractViewMode] = useState<"all" | "expiring">("all");
  const [selectedWorkspaceDocument, setSelectedWorkspaceDocument] = useState<IDocument | null>(null);
  const [isRelatedDocsModalOpen, setIsRelatedDocsModalOpen] = useState(false);
  const [relatedDocsTarget, setRelatedDocsTarget] = useState<RelatedDocsTarget | null>(null);
  const [relatedDocuments, setRelatedDocuments] = useState<IDocument[]>([]);
  const [isRelatedDocsLoading, setIsRelatedDocsLoading] = useState(false);
  const [selectedRelatedDocument, setSelectedRelatedDocument] = useState<IDocument | null>(null);
  const [isRelatedUploadOpen, setIsRelatedUploadOpen] = useState(false);
  const [relatedUploadForm] = Form.useForm();
  const relatedUploadWatchedType = Form.useWatch("relatedToType", relatedUploadForm);
  const [isWorkspaceUploadOpen, setIsWorkspaceUploadOpen] = useState(false);
  const [workspaceUploadForm] = Form.useForm();
  const workspaceUploadWatchedType = Form.useWatch("relatedToType", workspaceUploadForm);
  const [selectedWorkspaceNote, setSelectedWorkspaceNote] = useState<INote | null>(null);
  const [isRelatedNotesModalOpen, setIsRelatedNotesModalOpen] = useState(false);
  const [relatedNotesTarget, setRelatedNotesTarget] = useState<RelatedDocsTarget | null>(null);
  const [relatedNotes, setRelatedNotes] = useState<INote[]>([]);
  const [isRelatedNotesLoading, setIsRelatedNotesLoading] = useState(false);
  const [selectedRelatedNote, setSelectedRelatedNote] = useState<INote | null>(null);
  const [isWorkspaceNoteFormOpen, setIsWorkspaceNoteFormOpen] = useState(false);
  const [workspaceNoteForm] = Form.useForm();
  const [editingWorkspaceNote, setEditingWorkspaceNote] = useState<INote | null>(null);
  const [isRelatedNoteFormOpen, setIsRelatedNoteFormOpen] = useState(false);
  const [relatedNoteForm] = Form.useForm();
  const [editingRelatedNote, setEditingRelatedNote] = useState<INote | null>(null);

  const proposalDocOptions = useMemo(
    () =>
      (workspaceData.proposals || [])
        .filter((proposal) => proposal.id)
        .map((proposal) => ({
          value: proposal.id as string,
          label: proposal.title || "Proposal",
        })),
    [workspaceData.proposals],
  );

  const contractDocOptions = useMemo(
    () =>
      (workspaceData.contracts || [])
        .filter((contract) => contract.id)
        .map((contract) => ({
          value: contract.id as string,
          label: contract.contractNumber || contract.title || "Contract",
        })),
    [workspaceData.contracts],
  );

  const loadRelatedDocuments = useCallback(async (target: RelatedDocsTarget) => {
    setIsRelatedDocsLoading(true);
    try {
      const api = getAxiosInstance();
      const { data } = await api.get("/api/documents", {
        params: {
          relatedToType: target.relatedToType,
          relatedToId: target.relatedToId,
          pageNumber: 1,
          pageSize: 1000,
        },
      });

      setRelatedDocuments((data?.items || data || []) as IDocument[]);
    } catch {
      setRelatedDocuments([]);
      message.error("Failed to load related documents");
    } finally {
      setIsRelatedDocsLoading(false);
    }
  }, [message]);

  const handleOpenEntityDocuments = useCallback(
    async (type: "proposal" | "contract", entity: IProposal | IContract) => {
      if (!entity?.id) return;

      const target: RelatedDocsTarget = {
        relatedToType: type === "proposal" ? RelatedToType.Proposal : RelatedToType.Contract,
        relatedToId: entity.id,
        title:
          type === "proposal"
            ? (entity as IProposal).title || "Proposal"
            : (entity as IContract).contractNumber || (entity as IContract).title || "Contract",
      };

      setSelectedRelatedDocument(null);
      setRelatedDocsTarget(target);
      setIsRelatedDocsModalOpen(true);
      await loadRelatedDocuments(target);
    },
    [loadRelatedDocuments],
  );

  const handleDownloadDocument = useCallback(
    async (document: IDocument | null) => {
      if (!document) return;
      try {
        await documentsActions.downloadDocument(
          document.id,
          document.originalFileName || document.fileName,
        );
        message.success("Document download started");
      } catch {
        message.error("Failed to download document");
      }
    },
    [documentsActions, message],
  );

  const handleDeleteDocument = useCallback(
    (document: IDocument | null, afterDelete?: () => Promise<void> | void) => {
      if (!document) return;
      if (!can("delete:document")) {
        message.error("You do not have permission to delete documents");
        return;
      }

      modal.confirm({
        title: "Delete Document",
        content: `Are you sure you want to delete \"${document.originalFileName || document.fileName}\"?`,
        okText: "Delete",
        okType: "danger",
        onOk: async () => {
          const success = await documentsActions.deleteDocument(document.id);
          if (!success) return;

          message.success("Document deleted successfully");
          await onRefreshWorkspace();
          await Promise.resolve(afterDelete?.());
        },
      });
    },
    [can, documentsActions, message, modal, onRefreshWorkspace],
  );

  const handleOpenRelatedUpload = useCallback(() => {
    if (!relatedDocsTarget) return;

    relatedUploadForm.setFieldsValue({
      relatedToType: relatedDocsTarget.relatedToType,
      relatedToId: relatedDocsTarget.relatedToId,
      category:
        relatedDocsTarget.relatedToType === RelatedToType.Proposal
          ? DocumentCategory.Proposal
          : DocumentCategory.Contract,
    });
    setIsRelatedUploadOpen(true);
  }, [relatedDocsTarget, relatedUploadForm]);

  const handleRelatedUpload = useCallback(
    async (values: any, file: File) => {
      if (!relatedDocsTarget) return;

      const success = await documentsActions.uploadDocument(file, {
        category: values.category,
        relatedToType: relatedDocsTarget.relatedToType,
        relatedToId: relatedDocsTarget.relatedToId,
        description: values.description,
      });

      if (!success) return;

      message.success("Document uploaded successfully");
      setIsRelatedUploadOpen(false);
      await onRefreshWorkspace();
      await loadRelatedDocuments(relatedDocsTarget);
    },
    [documentsActions, loadRelatedDocuments, message, onRefreshWorkspace, relatedDocsTarget],
  );

  const handleOpenWorkspaceUpload = useCallback(() => {
    workspaceUploadForm.setFieldsValue({
      relatedToType: RelatedToType.Opportunity,
      relatedToId: selectedOpportunity?.id,
    });
    setIsWorkspaceUploadOpen(true);
  }, [selectedOpportunity?.id, workspaceUploadForm]);

  const handleWorkspaceUpload = useCallback(
    async (values: any, file: File) => {
      if (!selectedOpportunity?.id) return;

      const success = await documentsActions.uploadDocument(file, {
        category: values.category,
        relatedToType: RelatedToType.Opportunity,
        relatedToId: selectedOpportunity.id,
        description: values.description,
      });

      if (!success) return;

      message.success("Document uploaded successfully");
      setIsWorkspaceUploadOpen(false);
      await onRefreshWorkspace();
    },
    [documentsActions, message, onRefreshWorkspace, selectedOpportunity?.id],
  );

  const loadRelatedNotes = useCallback(async (target: RelatedDocsTarget) => {
    setIsRelatedNotesLoading(true);
    try {
      const api = getAxiosInstance();
      const { data } = await api.get("/api/notes", {
        params: {
          relatedToType: target.relatedToType,
          relatedToId: target.relatedToId,
          pageNumber: 1,
          pageSize: 1000,
        },
      });

      setRelatedNotes((data?.items || data || []) as INote[]);
    } catch {
      setRelatedNotes([]);
      message.error("Failed to load related notes");
    } finally {
      setIsRelatedNotesLoading(false);
    }
  }, [message]);

  const handleOpenEntityNotes = useCallback(
    async (type: "proposal" | "contract", entity: IProposal | IContract) => {
      if (!entity?.id) return;

      const target: RelatedDocsTarget = {
        relatedToType: type === "proposal" ? RelatedToType.Proposal : RelatedToType.Contract,
        relatedToId: entity.id,
        title:
          type === "proposal"
            ? (entity as IProposal).title || "Proposal"
            : (entity as IContract).contractNumber || (entity as IContract).title || "Contract",
      };

      setSelectedRelatedNote(null);
      setRelatedNotesTarget(target);
      setIsRelatedNotesModalOpen(true);
      await loadRelatedNotes(target);
    },
    [loadRelatedNotes],
  );

  const handleDeleteNote = useCallback(
    (note: INote | null, afterDelete?: () => Promise<void> | void) => {
      if (!note) return;
      if (!can("delete:note")) {
        message.error("You do not have permission to delete notes");
        return;
      }

      modal.confirm({
        title: "Delete Note",
        content: `Are you sure you want to delete this note?`,
        okText: "Delete",
        okType: "danger",
        onOk: async () => {
          const success = await notesActions.deleteNote(note.id);
          if (!success) return;

          message.success("Note deleted successfully");
          await onRefreshWorkspace();
          await Promise.resolve(afterDelete?.());
        },
      });
    },
    [can, notesActions, message, modal, onRefreshWorkspace],
  );

  const handleCreateWorkspaceNote = useCallback(
    async (values: any) => {
      if (!selectedOpportunity?.id) return;

      if (editingWorkspaceNote) {
        // Update existing note
        const success = await notesActions.updateNote(editingWorkspaceNote.id, {
          content: values.content,
        });

        if (!success) return;

        message.success("Note updated successfully");
        setEditingWorkspaceNote(null);
        setIsWorkspaceNoteFormOpen(false);
        workspaceNoteForm.resetFields();
        await onRefreshWorkspace();
      } else {
        // Create new note
        const success = await notesActions.createNote({
          content: values.content,
          relatedToType: RelatedToType.Opportunity,
          relatedToId: selectedOpportunity.id,
        });

        if (!success) return;

        message.success("Note created successfully");
        setIsWorkspaceNoteFormOpen(false);
        workspaceNoteForm.resetFields();
        await onRefreshWorkspace();
      }
    },
    [notesActions, message, onRefreshWorkspace, selectedOpportunity?.id, workspaceNoteForm, editingWorkspaceNote],
  );

  const handleCreateRelatedNote = useCallback(
    async (values: any) => {
      if (!relatedNotesTarget) return;

      if (editingRelatedNote) {
        // Update existing note
        const success = await notesActions.updateNote(editingRelatedNote.id, {
          content: values.content,
        });

        if (!success) return;

        message.success("Note updated successfully");
        setEditingRelatedNote(null);
        setIsRelatedNoteFormOpen(false);
        relatedNoteForm.resetFields();
        await onRefreshWorkspace();
        await loadRelatedNotes(relatedNotesTarget);
      } else {
        // Create new note
        const success = await notesActions.createNote({
          content: values.content,
          relatedToType: relatedNotesTarget.relatedToType,
          relatedToId: relatedNotesTarget.relatedToId,
        });

        if (!success) return;

        message.success("Note created successfully");
        setIsRelatedNoteFormOpen(false);
        relatedNoteForm.resetFields();
        await onRefreshWorkspace();
        await loadRelatedNotes(relatedNotesTarget);
      }
    },
    [notesActions, message, onRefreshWorkspace, relatedNotesTarget, relatedNoteForm, loadRelatedNotes, editingRelatedNote],
  );

  const proposalClientOptions = useMemo(
    () =>
      Array.from(
        new Map(
          (workspaceData.proposals || [])
            .filter((proposal) => proposal.clientId && proposal.clientName)
            .map((proposal) => [proposal.clientId as string, proposal.clientName as string]),
        ),
      ).map(([id, name]) => ({ id, name })),
    [workspaceData.proposals],
  );

  const proposalOpportunityOptions = useMemo(
    () =>
      Array.from(
        new Map(
          (workspaceData.proposals || [])
            .filter((proposal) => proposal.opportunityId && proposal.opportunityTitle)
            .map(
              (proposal) =>
                [proposal.opportunityId as string, proposal.opportunityTitle as string] as const,
            ),
        ),
      ).map(([id, title]) => ({ id, title })),
    [workspaceData.proposals],
  );

  const filteredProposals = useMemo(
    () =>
      (workspaceData.proposals || []).filter((proposal) => {
        if (proposalFilters.status !== undefined && proposal.status !== proposalFilters.status) {
          return false;
        }
        if (proposalFilters.clientId && proposal.clientId !== proposalFilters.clientId) {
          return false;
        }
        if (
          proposalFilters.opportunityId &&
          proposal.opportunityId !== proposalFilters.opportunityId
        ) {
          return false;
        }
        return true;
      }),
    [workspaceData.proposals, proposalFilters],
  );

  const filteredPricingRequests = useMemo(
    () =>
      (workspaceData.pricingRequests || []).filter((item) => {
        if (pricingFilters.status !== undefined && item.status !== pricingFilters.status) {
          return false;
        }
        if (pricingFilters.priority !== undefined && item.priority !== pricingFilters.priority) {
          return false;
        }
        if (pricingFilters.assignedToId && item.assignedToId !== pricingFilters.assignedToId) {
          return false;
        }
        return true;
      }),
    [workspaceData.pricingRequests, pricingFilters],
  );

  const contractClientOptions = useMemo(
    () =>
      Array.from(
        new Map(
          (workspaceData.contracts || [])
            .filter((contract) => contract.clientId && contract.clientName)
            .map((contract) => [contract.clientId as string, contract.clientName as string]),
        ),
      ).map(([id, name]) => ({ id, name })),
    [workspaceData.contracts],
  );

  const filteredContracts = useMemo(
    () =>
      (workspaceData.contracts || []).filter((contract) => {
        if (contractFilters.status !== undefined && contract.status !== contractFilters.status) {
          return false;
        }
        if (contractFilters.clientId && contract.clientId !== contractFilters.clientId) {
          return false;
        }
        if (contractViewMode === "expiring" && !contract.isExpiringSoon) {
          return false;
        }
        return true;
      }),
    [workspaceData.contracts, contractFilters, contractViewMode],
  );

  const workspaceItems: WorkspaceTabItem[] = [
    {
      key: "overview",
      label: "Overview",
      content: (
        <>
          <div className={styles.selectedRow}>
            <div className={styles.detailsPanel}>
              <OpportunityDetails opportunity={opportunity || null} loading={isLoadingDetails} />
            </div>
            {selectedOpportunity && (
              <OpportunityActions
                opportunity={selectedOpportunity}
                onEdit={onEdit}
                onDelete={onDelete}
                onUpdateStage={onUpdateStage}
                onAssign={onAssign}
              />
            )}
          </div>
          <div className={styles.sectionSpacing}>
            <OpportunityStageHistory
              stageHistory={stageHistory}
              loading={isLoadingDetails}
              hasSelection={Boolean(selectedOpportunity)}
            />
          </div>
        </>
      ),
    },
    {
      key: "pricing",
      label: "Pricing Requests",
      content: (
        <>
          <div className={styles.workspaceToolbarRow}>
            <WorkspaceTabActions
              entityType="pricingRequest"
              onCreateClick={onCreateEntity}
              compact
            />
            <PricingRequestsFilters
              onApplyFilters={(filters) => setPricingFilters(filters)}
              onClear={() => setPricingFilters({})}
            />
          </div>
          <WorkspaceEntityList
            entities={filteredPricingRequests}
            type="pricingRequest"
            loading={isLoading}
            emptyText="No pricing requests for this opportunity"
            onEntityEdit={(entity) => onEditEntity("pricingRequest", entity)}
            onEntityAssign={(entity) => onAssignEntity("pricingRequest", entity)}
            onEntityComplete={(entity) => onCompleteEntity("pricingRequest", entity)}
            onEntityDelete={(entity) => onDeleteEntity("pricingRequest", entity)}
          />
        </>
      ),
    },
    {
      key: "proposals",
      label: "Proposals",
      content: (
        <>
          <div className={styles.workspaceToolbarRow}>
            <WorkspaceTabActions
              entityType="proposal"
              onCreateClick={onCreateEntity}
              compact
            />
            <ProposalsFilters
              clients={proposalClientOptions}
              opportunities={proposalOpportunityOptions}
              onApplyFilters={(filters) => setProposalFilters(filters)}
              onClear={() => setProposalFilters({})}
            />
          </div>
          <WorkspaceEntityList
            entities={filteredProposals}
            type="proposal"
            loading={isLoading}
            emptyText="No proposals for this opportunity"
            onEntityEdit={(entity) => onEditEntity("proposal", entity)}
            onEntitySubmit={(entity) => onSubmitEntity("proposal", entity)}
            onEntityApprove={(entity) => onApproveEntity("proposal", entity)}
            onEntityReject={(entity) => onRejectEntity("proposal", entity)}
            onEntityDelete={(entity) => onDeleteEntity("proposal", entity)}
            onEntityViewDocuments={(type, entity) => handleOpenEntityDocuments(type, entity)}
            onEntityViewNotes={(type, entity) => handleOpenEntityNotes(type, entity)}
          />
        </>
      ),
    },
    {
      key: "contracts",
      label: "Contracts",
      content: (
        <>
          <div className={styles.workspaceToolbarRow}>
            <WorkspaceTabActions
              entityType="contract"
              onCreateClick={onCreateEntity}
              compact
            />
            <Space size={8}>
              <Select
                value={contractViewMode}
                onChange={(value) => setContractViewMode(value)}
                options={[
                  { label: "All Contracts", value: "all" },
                  { label: "Expiring Soon", value: "expiring" },
                ]}
                className={styles.workspaceViewSelect}
              />
              <ContractsFilters
                compact
                status={contractDraftFilters.status}
                clientId={contractDraftFilters.clientId}
                onStatusChange={(status) =>
                  setContractDraftFilters((prev) => ({ ...prev, status }))
                }
                onClientIdChange={(clientId) =>
                  setContractDraftFilters((prev) => ({ ...prev, clientId }))
                }
                onApplyFilters={() => setContractFilters(contractDraftFilters)}
                onClear={() => {
                  setContractDraftFilters({});
                  setContractFilters({});
                  setContractViewMode("all");
                }}
                clients={contractClientOptions}
              />
            </Space>
          </div>
          <WorkspaceEntityList
            entities={filteredContracts}
            type="contract"
            loading={isLoading}
            emptyText="No contracts linked to this opportunity's client"
            onEntityEdit={(entity) => onEditEntity("contract", entity)}
            onEntityActivate={(entity) => onActivateEntity("contract", entity)}
            onEntityCancel={(entity) => onCancelEntity("contract", entity)}
            onEntityDelete={(entity) => onDeleteEntity("contract", entity)}
            onEntityViewDocuments={(type, entity) => handleOpenEntityDocuments(type, entity)}
            onEntityViewNotes={(type, entity) => handleOpenEntityNotes(type, entity)}
          />
        </>
      ),
    },
    {
      key: "documents",
      label: "Documents",
      content: (
        <>
          <DocumentActions
            selectedDocument={selectedWorkspaceDocument}
            onUpload={handleOpenWorkspaceUpload}
            onDownload={() => handleDownloadDocument(selectedWorkspaceDocument)}
            onDelete={() => handleDeleteDocument(selectedWorkspaceDocument, async () => {
              setSelectedWorkspaceDocument(null);
            })}
            canDelete={can("delete:document")}
            loading={isLoading}
          />
          <DocumentsTable
            documents={workspaceData.documents || []}
            loading={isLoading}
            pagination={{
              current: 1,
              pageSize: Math.max((workspaceData.documents || []).length, 1),
              total: (workspaceData.documents || []).length,
              onChange: () => undefined,
            }}
            onSelectDocument={setSelectedWorkspaceDocument}
            selectedDocumentId={selectedWorkspaceDocument?.id}
          />
        </>
      ),
    },
    {
      key: "notes",
      label: "Notes",
      content: (
        <>
          <NotesActions
            note={selectedWorkspaceNote}
            onAdd={() => setIsWorkspaceNoteFormOpen(true)}
            onEdit={() => {
              if (selectedWorkspaceNote) {
                setEditingWorkspaceNote(selectedWorkspaceNote);
                setIsWorkspaceNoteFormOpen(true);
              }
            }}
            onDelete={() => handleDeleteNote(selectedWorkspaceNote, async () => {
              setSelectedWorkspaceNote(null);
            })}
            loading={isLoading}
          />
          <NotesTable
            notes={workspaceData.notes || []}
            loading={isLoading}
            onSelectNote={setSelectedWorkspaceNote}
            selectedNoteId={selectedWorkspaceNote?.id}
          />
        </>
      ),
    },
  ];

  if (!selectedOpportunity) {
    return null;
  }

  return (
    <>
      <EntityWorkspaceTabs
        title={
          <Space size={8}>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={onBackToOpportunities}
              aria-label="Back to all opportunities"
            />
            <span>{`${selectedOpportunity.title || "Opportunity"} Workspace`}</span>
          </Space>
        }
        items={workspaceItems}
        activeKey={activeTab}
        onChange={onTabChange}
      />

      <Modal
        title={relatedDocsTarget ? `${relatedDocsTarget.title} Documents` : "Related Documents"}
        open={isRelatedDocsModalOpen}
        onCancel={() => {
          setIsRelatedDocsModalOpen(false);
          setRelatedDocsTarget(null);
          setRelatedDocuments([]);
          setSelectedRelatedDocument(null);
        }}
        footer={null}
        width={1000}
      >
        <DocumentActions
          selectedDocument={selectedRelatedDocument}
          onUpload={handleOpenRelatedUpload}
          onDownload={() => handleDownloadDocument(selectedRelatedDocument)}
          onDelete={() =>
            handleDeleteDocument(selectedRelatedDocument, async () => {
              setSelectedRelatedDocument(null);
              if (relatedDocsTarget) {
                await loadRelatedDocuments(relatedDocsTarget);
              }
            })
          }
          canDelete={can("delete:document")}
          loading={isRelatedDocsLoading}
        />

        <DocumentsTable
          documents={relatedDocuments}
          loading={isRelatedDocsLoading}
          pagination={{
            current: 1,
            pageSize: Math.max(relatedDocuments.length, 1),
            total: relatedDocuments.length,
            onChange: () => undefined,
          }}
          onSelectDocument={setSelectedRelatedDocument}
          selectedDocumentId={selectedRelatedDocument?.id}
        />
      </Modal>

      <DocumentUploadForm
        open={isRelatedUploadOpen}
        onCancel={() => setIsRelatedUploadOpen(false)}
        onSubmit={handleRelatedUpload}
        form={relatedUploadForm}
        loading={isRelatedDocsLoading}
        relatedToType={relatedUploadWatchedType}
        proposalOptions={proposalDocOptions}
        contractOptions={contractDocOptions}
      />

      <DocumentUploadForm
        open={isWorkspaceUploadOpen}
        onCancel={() => setIsWorkspaceUploadOpen(false)}
        onSubmit={handleWorkspaceUpload}
        form={workspaceUploadForm}
        loading={isLoading}
        relatedToType={workspaceUploadWatchedType}
      />

      <Modal
        title={relatedNotesTarget ? `${relatedNotesTarget.title} Notes` : "Related Notes"}
        open={isRelatedNotesModalOpen}
        onCancel={() => {
          setIsRelatedNotesModalOpen(false);
          setRelatedNotesTarget(null);
          setRelatedNotes([]);
          setSelectedRelatedNote(null);
        }}
        footer={null}
        width={800}
      >
        <NotesActions
          note={selectedRelatedNote}
          onAdd={() => setIsRelatedNoteFormOpen(true)}
          onEdit={() => {
            if (selectedRelatedNote) {
              setEditingRelatedNote(selectedRelatedNote);
              setIsRelatedNoteFormOpen(true);
            }
          }}
          onDelete={() =>
            handleDeleteNote(selectedRelatedNote, async () => {
              setSelectedRelatedNote(null);
              if (relatedNotesTarget) {
                await loadRelatedNotes(relatedNotesTarget);
              }
            })
          }
          loading={isRelatedNotesLoading}
        />

        <NotesTable
          notes={relatedNotes}
          loading={isRelatedNotesLoading}
          onSelectNote={setSelectedRelatedNote}
          selectedNoteId={selectedRelatedNote?.id}
        />
      </Modal>

      <NoteForm
        open={isWorkspaceNoteFormOpen}
        onCancel={() => {
          setIsWorkspaceNoteFormOpen(false);
          setEditingWorkspaceNote(null);
        }}
        onSubmit={handleCreateWorkspaceNote}
        form={workspaceNoteForm}
        loading={isLoading}
        relatedToType={RelatedToType.Opportunity}
        note={editingWorkspaceNote}
      />

      <NoteForm
        open={isRelatedNoteFormOpen}
        onCancel={() => {
          setIsRelatedNoteFormOpen(false);
          setEditingRelatedNote(null);
        }}
        onSubmit={handleCreateRelatedNote}
        form={relatedNoteForm}
        loading={isRelatedNotesLoading}
        relatedToType={relatedNotesTarget?.relatedToType}
        note={editingRelatedNote}
      />
    </>
  );
};
