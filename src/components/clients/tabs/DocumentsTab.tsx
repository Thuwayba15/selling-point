"use client";

import { Table, Button, Space, Card, Empty } from "antd";
import { EditOutlined, DeleteOutlined, DownloadOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useRbac } from "@/hooks/useRbac";
import type { IDocument } from "@/providers/documents/context";

interface DocumentsTabProps {
  documents: IDocument[];
  loading?: boolean;
  onEdit: (document: IDocument) => void;
  onDelete: (document: IDocument) => Promise<void>;
}

export const DocumentsTab = ({ documents, loading = false, onEdit, onDelete }: DocumentsTabProps) => {
  const { can } = useRbac();

  const handleDownload = (document: IDocument) => {
    if (document.filePath) {
      window.open(document.filePath, "_blank");
    }
  };

  const columns: ColumnsType<IDocument> = [
    {
      title: "Document Name",
      dataIndex: "fileName",
      key: "fileName",
      render: (name) => name || "—",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (desc) => desc || "—",
    },
    {
      title: "Uploaded Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "—"),
    },
    {
      title: "Actions",
      key: "actions",
      width: 140,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(record)}
            title="Download"
          />
          {can("update:document") && (
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              title="Edit"
            />
          )}
          {can("delete:document") && (
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(record)}
              title="Delete"
            />
          )}
        </Space>
      ),
    },
  ];

  if (documents.length === 0) {
    return <Empty description="No documents found" />;
  }

  return (
    <Card
      style={{
        border: "none",
        boxShadow: "none",
      }}
    >
      <Table<IDocument>
        columns={columns}
        dataSource={documents}
        loading={loading}
        rowKey="id"
        pagination={false}
      />
    </Card>
  );
};
