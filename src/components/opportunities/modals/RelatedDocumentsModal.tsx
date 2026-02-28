import { Modal, Button, Space } from "antd";
import { DocumentsTable } from "@/components/documents/DocumentsTable";
import { IDocument } from "@/providers/documents/context";
import { RelatedDocsTarget } from "@/hooks/useWorkspaceDocuments";

interface RelatedDocumentsModalProps {
  open: boolean;
  target: RelatedDocsTarget | null;
  documents: IDocument[];
  loading: boolean;
  selectedDocument: IDocument | null;
  onSelectDocument: (document: IDocument | null) => void;
  onUpload: () => void;
  onDownload: (document: IDocument | null) => void;
  onDelete: (document: IDocument | null) => void;
  onClose: () => void;
  canDelete: boolean;
}

export const RelatedDocumentsModal = ({
  open,
  target,
  documents,
  loading,
  selectedDocument,
  onSelectDocument,
  onUpload,
  onDownload,
  onDelete,
  onClose,
  canDelete,
}: RelatedDocumentsModalProps) => {
  return (
    <Modal
      title={`Documents - ${target?.title || ""}`}
      open={open}
      onCancel={onClose}
      width={900}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Space>
          <Button type="primary" onClick={onUpload}>
            Upload Document
          </Button>
          <Button onClick={() => onDownload(selectedDocument)} disabled={!selectedDocument}>
            Download
          </Button>
          {canDelete && (
            <Button danger onClick={() => onDelete(selectedDocument)} disabled={!selectedDocument}>
              Delete
            </Button>
          )}
        </Space>

        <DocumentsTable
          documents={documents}
          loading={loading}
          pagination={{ current: 1, pageSize: 1000, total: documents.length, onChange: () => {} }}
          onSelectDocument={onSelectDocument}
          selectedDocumentId={selectedDocument?.id}
        />
      </Space>
    </Modal>
  );
};
