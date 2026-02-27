"use client";

import React from "react";
import { Button, Card, Space } from "antd";
import { DownloadOutlined, DeleteOutlined, UploadOutlined } from "@ant-design/icons";

interface DocumentActionsProps {
  selectedDocument: any | null;
  onUpload: () => void;
  onDownload: () => void;
  onDelete: () => void;
  canDelete: boolean;
  loading?: boolean;
}

export const DocumentActions: React.FC<DocumentActionsProps> = ({
  selectedDocument,
  onUpload,
  onDownload,
  onDelete,
  canDelete,
  loading = false,
}) => {
  return (
    <Card title="Actions" style={{ marginBottom: 16 }}>
      <Space>
        <Button type="primary" icon={<UploadOutlined />} onClick={onUpload} loading={loading}>
          Upload Document
        </Button>
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
