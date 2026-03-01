"use client";

import React from "react";
import { Button, Card, Space } from "antd";
import { DownloadOutlined, DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import type { IDocument } from "@/providers/documents/context";

interface DocumentActionsProps {
  selectedDocument: IDocument | null;
  onUpload: () => void;
  onDownload: () => void;
  onDelete: () => void;
  canUpload?: boolean;
  canDelete: boolean;
  loading?: boolean;
}

export const DocumentActions: React.FC<DocumentActionsProps> = ({
  selectedDocument,
  onUpload,
  onDownload,
  onDelete,
  canUpload = true,
  canDelete,
  loading = false,
}) => {
  return (
    <Card title="Actions" style={{ marginBottom: 16 }}>
      <Space>
        {canUpload && (
          <Button type="primary" icon={<UploadOutlined />} onClick={onUpload} loading={loading}>
            Upload Document
          </Button>
        )}
        <Button
          icon={<DownloadOutlined />}
          onClick={onDownload}
          disabled={!selectedDocument}
          loading={loading}
        >
          Download
        </Button>
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={onDelete}
          disabled={!selectedDocument || !canDelete}
          loading={loading}
        >
          Delete
        </Button>
      </Space>
    </Card>
  );
};
