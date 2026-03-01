import { useState, useCallback } from "react";
import { App, Form } from "antd";
import { useDocumentsActions } from "@/providers/documents";
import { useRbac } from "@/hooks/useRbac";
import { IDocument, RelatedToType } from "@/providers/documents/context";
import { getAxiosInstance } from "@/lib/axios";

export type RelatedDocsTarget = {
  relatedToType: RelatedToType;
  relatedToId: string;
  title: string;
};

export const useWorkspaceDocuments = (onRefresh: () => Promise<void>) => {
  const { message, modal } = App.useApp();
  const { can } = useRbac();
  const documentsActions = useDocumentsActions();

  const [selectedDocument, setSelectedDocument] = useState<IDocument | null>(null);
  const [isRelatedDocsModalOpen, setIsRelatedDocsModalOpen] = useState(false);
  const [relatedDocsTarget, setRelatedDocsTarget] = useState<RelatedDocsTarget | null>(null);
  const [relatedDocuments, setRelatedDocuments] = useState<IDocument[]>([]);
  const [isRelatedDocsLoading, setIsRelatedDocsLoading] = useState(false);
  const [selectedRelatedDocument, setSelectedRelatedDocument] = useState<IDocument | null>(null);
  const [isRelatedUploadOpen, setIsRelatedUploadOpen] = useState(false);
  const [relatedUploadForm] = Form.useForm();
  const [isWorkspaceUploadOpen, setIsWorkspaceUploadOpen] = useState(false);
  const [workspaceUploadForm] = Form.useForm();

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

  const openRelatedDocuments = useCallback(
    async (target: RelatedDocsTarget) => {
      setSelectedRelatedDocument(null);
      setRelatedDocsTarget(target);
      setIsRelatedDocsModalOpen(true);
      await loadRelatedDocuments(target);
    },
    [loadRelatedDocuments],
  );

  const closeRelatedDocuments = useCallback(() => {
    setIsRelatedDocsModalOpen(false);
    setRelatedDocsTarget(null);
    setRelatedDocuments([]);
    setSelectedRelatedDocument(null);
  }, []);

  const downloadDocument = useCallback(
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

  const deleteDocument = useCallback(
    (document: IDocument | null, afterDelete?: () => Promise<void> | void) => {
      if (!document) return;
      if (!can("delete:document")) {
        message.error("You do not have permission to delete documents");
        return;
      }

      modal.confirm({
        title: "Delete Document",
        content: `Are you sure you want to delete "${document.originalFileName || document.fileName}"?`,
        okText: "Delete",
        okType: "danger",
        onOk: async () => {
          const success = await documentsActions.deleteDocument(document.id);
          if (!success) return;

          message.success("Document deleted successfully");
          await onRefresh();
          await Promise.resolve(afterDelete?.());
        },
      });
    },
    [can, documentsActions, message, modal, onRefresh],
  );

  const openRelatedUpload = useCallback(() => {
    if (!relatedDocsTarget) return;
    relatedUploadForm.setFieldsValue({
      relatedToType: relatedDocsTarget.relatedToType,
      relatedToId: relatedDocsTarget.relatedToId,
    });
    setIsRelatedUploadOpen(true);
  }, [relatedDocsTarget, relatedUploadForm]);

  const handleRelatedUpload = useCallback(
    async (values: { category: number; description?: string }, file: File) => {
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
      await onRefresh();
      await loadRelatedDocuments(relatedDocsTarget);
    },
    [documentsActions, loadRelatedDocuments, message, onRefresh, relatedDocsTarget],
  );

  const openWorkspaceUpload = useCallback(
    (opportunityId: string) => {
      workspaceUploadForm.setFieldsValue({
        relatedToType: RelatedToType.Opportunity,
        relatedToId: opportunityId,
      });
      setIsWorkspaceUploadOpen(true);
    },
    [workspaceUploadForm],
  );

  const handleWorkspaceUpload = useCallback(
    async (values: { category: number; description?: string }, file: File, opportunityId: string) => {
      const success = await documentsActions.uploadDocument(file, {
        category: values.category,
        relatedToType: RelatedToType.Opportunity,
        relatedToId: opportunityId,
        description: values.description,
      });

      if (!success) return;

      message.success("Document uploaded successfully");
      setIsWorkspaceUploadOpen(false);
      await onRefresh();
    },
    [documentsActions, message, onRefresh],
  );

  return {
    selectedDocument,
    setSelectedDocument,
    isRelatedDocsModalOpen,
    relatedDocsTarget,
    relatedDocuments,
    isRelatedDocsLoading,
    selectedRelatedDocument,
    setSelectedRelatedDocument,
    isRelatedUploadOpen,
    setIsRelatedUploadOpen,
    relatedUploadForm,
    isWorkspaceUploadOpen,
    setIsWorkspaceUploadOpen,
    workspaceUploadForm,
    openRelatedDocuments,
    closeRelatedDocuments,
    downloadDocument,
    deleteDocument,
    openRelatedUpload,
    handleRelatedUpload,
    openWorkspaceUpload,
    handleWorkspaceUpload,
  };
};
