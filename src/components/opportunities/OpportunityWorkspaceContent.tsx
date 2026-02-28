"use client";

import { useMemo } from "react";
import { Button, Space, Form } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { EntityWorkspaceTabs, WorkspaceTabItem } from "@/components/common";
import { DocumentUploadForm } from "@/components/documents/DocumentUploadForm";
import { NoteForm } from "@/components/notes/NoteForm";
import {
  OverviewTab,
  PricingRequestsTab,
  ProposalsTab,
  ContractsTab,
  DocumentsTab,
  NotesTab,
} from "./tabs";
import { RelatedDocumentsModal, RelatedNotesModal } from "./modals";
import { useStyles } from "./style";
import { useRbac } from "@/hooks/useRbac";
import { useWorkspaceDocuments, RelatedDocsTarget } from "@/hooks/useWorkspaceDocuments";
import { useWorkspaceNotes, RelatedNotesTarget } from "@/hooks/useWorkspaceNotes";
import { IOpportunity, IOpportunityStageHistory } from "@/providers/opportunities/context";
import { IPricingRequest } from "@/providers/pricing-requests/context";
import { IProposal } from "@/providers/proposals/context";
import { IContract } from "@/providers/contracts/context";
import { IDocument, RelatedToType as DocRelatedToType } from "@/providers/documents/context";
import { INote, RelatedToType } from "@/providers/notes/context";

interface WorkspaceData {
  pricingRequests: IPricingRequest[];
  proposals: IProposal[];
  contracts: IContract[];
  documents: IDocument[];
  notes: INote[];
}

type EntityType = "activity" | "proposal" | "pricingRequest" | "contract" | "document" | "note";

interface OpportunityWorkspaceContentProps {
  opportunity: IOpportunity | null;
  selectedOpportunity: IOpportunity | null;
  stageHistory: IOpportunityStageHistory[];
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
  const { can } = useRbac();

  // Document management hook
  const documents = useWorkspaceDocuments(onRefreshWorkspace);
  const relatedUploadWatchedType = Form.useWatch("relatedToType", documents.relatedUploadForm);
  const workspaceUploadWatchedType = Form.useWatch("relatedToType", documents.workspaceUploadForm);

  // Note management hook
  const notes = useWorkspaceNotes(onRefreshWorkspace);

  // Document options for upload dropdowns
  const proposalDocOptions = useMemo(
    () =>
      (workspaceData.proposals || [])
        .filter((p) => p.id)
        .map((p) => ({ value: p.id as string, label: p.title || "Proposal" })),
    [workspaceData.proposals],
  );

  const contractDocOptions = useMemo(
    () =>
      (workspaceData.contracts || [])
        .filter((c) => c.id)
        .map((c) => ({
          value: c.id as string,
          label: c.contractNumber || c.title || "Contract",
        })),
    [workspaceData.contracts],
  );

  // Handle opening entity documents
  const handleEntityDocuments = (type: "proposal" | "contract", entity: IProposal | IContract) => {
    if (!entity?.id) return;
    const target: RelatedDocsTarget = {
      relatedToType: (type === "proposal" ? DocRelatedToType.Proposal : DocRelatedToType.Contract) as any,
      relatedToId: entity.id,
      title:
        type === "proposal"
          ? (entity as IProposal).title || "Proposal"
          : (entity as IContract).contractNumber || (entity as IContract).title || "Contract",
    };
    documents.openRelatedDocuments(target);
  };

  // Handle opening entity notes
  const handleEntityNotes = (type: "proposal" | "contract", entity: IProposal | IContract) => {
    if (!entity?.id) return;
    const target: RelatedNotesTarget = {
      relatedToType: (type === "proposal" ? RelatedToType.Proposal : RelatedToType.Contract) as any,
      relatedToId: entity.id,
      title:
        type === "proposal"
          ? (entity as IProposal).title || "Proposal"
          : (entity as IContract).contractNumber || (entity as IContract).title || "Contract",
    };
    notes.openRelatedNotes(target);
  };

  if (!selectedOpportunity) return null;

  const workspaceItems: WorkspaceTabItem[] = [
    {
      key: "overview",
      label: "Overview",
      content: (
        <OverviewTab
          opportunity={opportunity}
          stageHistory={stageHistory}
          isLoadingDetails={isLoadingDetails}
          onEdit={onEdit}
          onDelete={onDelete}
          onUpdateStage={onUpdateStage}
          onAssign={onAssign}
          className={styles.selectedRow}
          historyClassName={styles.sectionSpacing}
        />
      ),
    },
    {
      key: "pricing",
      label: "Pricing Requests",
      content: (
        <PricingRequestsTab
          pricingRequests={workspaceData.pricingRequests}
          isLoading={isLoading}
          onCreateEntity={onCreateEntity}
          onEditEntity={(e) => onEditEntity("pricingRequest", e)}
          onAssignEntity={(e) => onAssignEntity("pricingRequest", e)}
          onCompleteEntity={(e) => onCompleteEntity("pricingRequest", e)}
          onDeleteEntity={(e) => onDeleteEntity("pricingRequest", e)}
          toolbarClassName={styles.workspaceToolbarRow}
          paginationClassName={styles.workspacePagination}
        />
      ),
    },
    {
      key: "proposals",
      label: "Proposals",
      content: (
        <ProposalsTab
          proposals={workspaceData.proposals}
          isLoading={isLoading}
          onCreateEntity={onCreateEntity}
          onEditEntity={(e) => onEditEntity("proposal", e)}
          onSubmitEntity={(e) => onSubmitEntity("proposal", e)}
          onApproveEntity={(e) => onApproveEntity("proposal", e)}
          onRejectEntity={(e) => onRejectEntity("proposal", e)}
          onDeleteEntity={(e) => onDeleteEntity("proposal", e)}
          onViewDocuments={handleEntityDocuments}
          onViewNotes={handleEntityNotes}
          toolbarClassName={styles.workspaceToolbarRow}
          paginationClassName={styles.workspacePagination}
        />
      ),
    },
    {
      key: "contracts",
      label: "Contracts",
      content: (
        <ContractsTab
          contracts={workspaceData.contracts}
          isLoading={isLoading}
          onCreateEntity={onCreateEntity}
          onEditEntity={(e) => onEditEntity("contract", e)}
          onActivateEntity={(e) => onActivateEntity("contract", e)}
          onCancelEntity={(e) => onCancelEntity("contract", e)}
          onDeleteEntity={(e) => onDeleteEntity("contract", e)}
          onViewDocuments={handleEntityDocuments}
          onViewNotes={handleEntityNotes}
          toolbarClassName={styles.workspaceToolbarRow}
          paginationClassName={styles.workspacePagination}
        />
      ),
    },
    {
      key: "documents",
      label: "Documents",
      content: (
        <DocumentsTab
          documents={workspaceData.documents}
          isLoading={isLoading}
          selectedDocument={documents.selectedDocument}
          onSelectDocument={documents.setSelectedDocument}
          onUpload={() => documents.openWorkspaceUpload(selectedOpportunity.id)}
          onDownload={() => documents.downloadDocument(documents.selectedDocument)}
          onDelete={() =>
            documents.deleteDocument(documents.selectedDocument, () =>
              documents.setSelectedDocument(null),
            )
          }
          canDelete={can("delete:document")}
        />
      ),
    },
    {
      key: "notes",
      label: "Notes",
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
            {selectedOpportunity.title}
          </Space>
        }
        items={workspaceItems}
        activeKey={activeTab}
        onChange={onTabChange}
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

      {/* Related Document Upload */}
      <DocumentUploadForm
        open={documents.isRelatedUploadOpen}
        onCancel={() => documents.setIsRelatedUploadOpen(false)}
        onSubmit={documents.handleRelatedUpload}
        form={documents.relatedUploadForm}
        loading={documents.isRelatedDocsLoading}
        relatedToType={relatedUploadWatchedType}
        proposalOptions={proposalDocOptions}
        contractOptions={contractDocOptions}
      />

      {/* Workspace Document Upload */}
      <DocumentUploadForm
        open={documents.isWorkspaceUploadOpen}
        onCancel={() => documents.setIsWorkspaceUploadOpen(false)}
        onSubmit={(values, file) =>
          documents.handleWorkspaceUpload(values, file, selectedOpportunity.id)
        }
        form={documents.workspaceUploadForm}
        loading={isLoading}
        relatedToType={workspaceUploadWatchedType}
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

      {/* Workspace Note Form */}
      <NoteForm
        open={notes.isWorkspaceNoteFormOpen}
        onCancel={notes.closeWorkspaceNoteForm}
        onSubmit={(values) => notes.handleCreateWorkspaceNote(values, selectedOpportunity.id)}
        form={notes.workspaceNoteForm}
        loading={isLoading}
        relatedToType={RelatedToType.Opportunity}
        note={notes.editingWorkspaceNote}
      />

      {/* Related Note Form */}
      <NoteForm
        open={notes.isRelatedNoteFormOpen}
        onCancel={notes.closeRelatedNoteForm}
        onSubmit={notes.handleCreateRelatedNote}
        form={notes.relatedNoteForm}
        loading={notes.isRelatedNotesLoading}
        relatedToType={notes.relatedNotesTarget?.relatedToType}
        note={notes.editingRelatedNote}
      />
    </>
  );
};
