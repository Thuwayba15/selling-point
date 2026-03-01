import { DocumentActions } from "@/components/documents/DocumentActions";
import { DocumentsTable } from "@/components/documents/DocumentsTable";
import { IDocument } from "@/providers/documents/context";
import { useWorkspacePagination } from "@/hooks/useWorkspacePagination";

interface DocumentsTabProps {
  documents: IDocument[];
  isLoading: boolean;
  selectedDocument: IDocument | null;
  onSelectDocument: (document: IDocument | null) => void;
  onUpload: () => void;
  onDownload: () => void;
  onDelete: () => void;
  canDelete: boolean;
}

export const DocumentsTab = ({
  documents,
  isLoading,
  selectedDocument,
  onSelectDocument,
  onUpload,
  onDownload,
  onDelete,
  canDelete,
}: DocumentsTabProps) => {
  const { currentPage, pageSize, total, paginatedItems, setCurrentPage } =
    useWorkspacePagination(documents);

  return (
    <>
      <DocumentActions
        selectedDocument={selectedDocument}
        onUpload={onUpload}
        onDownload={onDownload}
        onDelete={onDelete}
        canDelete={canDelete}
        loading={isLoading}
      />
      <DocumentsTable
        documents={paginatedItems}
        loading={isLoading}
        pagination={{
          current: currentPage,
          pageSize,
          total,
          onChange: setCurrentPage,
        }}
        onSelectDocument={onSelectDocument}
        selectedDocumentId={selectedDocument?.id}
      />
    </>
  );
};
