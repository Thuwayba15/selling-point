"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { App, Form, Space } from "antd";
import { withAuthGuard } from "@/hoc/withAuthGuard";
import { useAuthState } from "@/providers/auth";
import { useRbac } from "@/hooks/useRbac";
import { useDocumentsState, useDocumentsActions } from "@/providers/documents";
import { useClientsState, useClientsActions } from "@/providers/clients";
import { useOpportunitiesState, useOpportunitiesActions } from "@/providers/opportunities";
import { useProposalsState, useProposalsActions } from "@/providers/proposals";
import { useContractsState, useContractsActions } from "@/providers/contracts";
import type { IDocument, DocumentCategory, RelatedToType } from "@/providers/documents/context";
import {
  DocumentsHeader,
  DocumentsFilters,
  DocumentsTable,
  DocumentDetails,
  DocumentActions,
  DocumentUploadForm,
} from "@/components/documents";

const DocumentsPage = () => {
  const { message, modal } = App.useApp();
  const { user } = useAuthState();
  const { can } = useRbac();

  // Documents provider
  const documentsState = useDocumentsState();
  const documentsActions = useDocumentsActions();

  // Related entity providers
  const clientsState = useClientsState();
  const clientsActions = useClientsActions();
  const opportunitiesState = useOpportunitiesState();
  const opportunitiesActions = useOpportunitiesActions();
  const proposalsState = useProposalsState();
  const proposalsActions = useProposalsActions();
  const contractsState = useContractsState();
  const contractsActions = useContractsActions();

  // Forms
  const [filterForm] = Form.useForm();
  const [uploadForm] = Form.useForm();

  // State
  const [selectedDocument, setSelectedDocument] = useState<IDocument | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [filterCategory, setFilterCategory] = useState<DocumentCategory | undefined>(undefined);
  const [filterRelatedToType, setFilterRelatedToType] = useState<RelatedToType | undefined>(
    undefined,
  );
  const [filterRelatedToId, setFilterRelatedToId] = useState<string | undefined>(undefined);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const initializedRef = useRef(false);

  // Watch form values
  const filterWatchedType = Form.useWatch("relatedToType", filterForm);
  const uploadWatchedType = Form.useWatch("relatedToType", uploadForm);

  // Map entity data to dropdown options
  const clientOptions = (clientsState.clients || []).map((client) => ({
    value: client.id,
    label: client.name,
  }));

  const opportunityOptions = (opportunitiesState.opportunities || []).map((opp) => ({
    value: opp.id,
    label: opp.title,
  }));

  const proposalOptions = (proposalsState.proposals || []).map((proposal) => ({
    value: proposal.id,
    label: `Proposal ${proposal.id}`,
  }));

  const contractOptions = (contractsState.contracts || []).map((contract) => ({
    value: contract.id,
    label: contract.contractNumber || contract.id,
  }));

  // Fetch documents
  const fetchDocuments = useCallback(
    async (page = 1, size = pageSize) => {
      await documentsActions.getDocuments({
        category: filterCategory,
        relatedToType: filterRelatedToType,
        relatedToId: filterRelatedToId,
        pageNumber: page,
        pageSize: size,
      });
    },
    [filterCategory, filterRelatedToType, filterRelatedToId, pageSize, documentsActions],
  );

  // Initialize data on mount
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      // Fetch all entity data for dropdowns
      clientsActions.getClients({ pageNumber: 1, pageSize: 1000 });
      opportunitiesActions.getOpportunities({ pageNumber: 1, pageSize: 1000 });
      proposalsActions.getProposals({ pageNumber: 1, pageSize: 1000 });
      contractsActions.getContracts({ pageNumber: 1, pageSize: 1000 });
      // Fetch documents
      fetchDocuments(1, pageSize);
    }
  }, [fetchDocuments, pageSize]);

  // Show error messages
  useEffect(() => {
    if (documentsState.isError && documentsState.errorMessage) {
      message.error(documentsState.errorMessage);
      documentsActions.clearError();
    }
  }, [documentsState.isError, documentsState.errorMessage]);

  // Handlers
  const handleApplyFilters = async () => {
    const values = filterForm.getFieldsValue();
    setFilterCategory(values.category);
    setFilterRelatedToType(values.relatedToType);
    setFilterRelatedToId(values.relatedToId);
    setCurrentPage(1);
    await documentsActions.getDocuments({
      category: values.category,
      relatedToType: values.relatedToType,
      relatedToId: values.relatedToId,
      pageNumber: 1,
      pageSize,
    });
  };

  const handleClearFilters = async () => {
    filterForm.resetFields();
    setFilterCategory(undefined);
    setFilterRelatedToType(undefined);
    setFilterRelatedToId(undefined);
    setCurrentPage(1);
    await documentsActions.getDocuments({ pageNumber: 1, pageSize });
  };

  const handlePaginationChange = async (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
    await documentsActions.getDocuments({
      category: filterCategory,
      relatedToType: filterRelatedToType,
      relatedToId: filterRelatedToId,
      pageNumber: page,
      pageSize: size,
    });
  };

  const handleUploadOpen = () => {
    uploadForm.resetFields();
    setIsUploadModalOpen(true);
  };

  const handleUploadSubmit = async (
    values: { category: number; relatedToType: number; relatedToId: string; description?: string },
    file: File,
  ) => {
    try {
      const success = await documentsActions.uploadDocument(file, {
        category: values.category,
        relatedToType: values.relatedToType,
        relatedToId: values.relatedToId,
        description: values.description,
      });

      if (success) {
        message.success("Document uploaded successfully");
        setIsUploadModalOpen(false);
        await fetchDocuments(currentPage, pageSize);
      }
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to upload document");
    }
  };

  const handleDownload = async () => {
    if (!selectedDocument) return;
    try {
      await documentsActions.downloadDocument(
        selectedDocument.id,
        selectedDocument.originalFileName || selectedDocument.fileName,
      );
      message.success("Document download started");
    } catch (error) {
      message.error("Failed to download document");
    }
  };

  const handleDelete = () => {
    if (!selectedDocument) return;

    // Check RBAC - only Admin and SalesManager can delete
    if (!can("delete:document")) {
      message.error("You do not have permission to delete documents");
      return;
    }

    modal.confirm({
      title: "Delete Document",
      content: `Are you sure you want to delete "${
        selectedDocument.originalFileName || selectedDocument.fileName
      }"? This action cannot be undone.`,
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          const success = await documentsActions.deleteDocument(selectedDocument.id);
          if (success) {
            message.success("Document deleted successfully");
            setSelectedDocument(null);
            await fetchDocuments(currentPage, pageSize);
          }
        } catch (error) {
          message.error("Failed to delete document");
        }
      },
    });
  };

  return (
    <Space orientation="vertical" size="large" style={{ display: "flex" }}>
      <DocumentsHeader totalCount={documentsState.pagination?.totalCount || 0} />

      <DocumentsFilters
        form={filterForm}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        loading={documentsState.isPending}
        relatedToType={filterWatchedType}
        clientOptions={clientOptions}
        opportunityOptions={opportunityOptions}
        proposalOptions={proposalOptions}
        contractOptions={contractOptions}
      />

      <DocumentActions
        selectedDocument={selectedDocument}
        onUpload={handleUploadOpen}
        onDownload={handleDownload}
        onDelete={handleDelete}
        canDelete={can("delete:document")}
        loading={documentsState.isPending}
      />

      <DocumentsTable
        documents={documentsState.documents || []}
        loading={documentsState.isPending}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: documentsState.pagination?.totalCount || 0,
          onChange: handlePaginationChange,
        }}
        onSelectDocument={setSelectedDocument}
        selectedDocumentId={selectedDocument?.id}
        currentUserId={user?.id}
      />

      <DocumentDetails document={selectedDocument} currentUserId={user?.id} />

      <DocumentUploadForm
        open={isUploadModalOpen}
        onCancel={() => setIsUploadModalOpen(false)}
        onSubmit={handleUploadSubmit}
        form={uploadForm}
        loading={documentsState.isPending}
        relatedToType={uploadWatchedType}
        clientOptions={clientOptions}
        opportunityOptions={opportunityOptions}
        proposalOptions={proposalOptions}
        contractOptions={contractOptions}
      />
    </Space>
  );
};

export default withAuthGuard(DocumentsPage);
