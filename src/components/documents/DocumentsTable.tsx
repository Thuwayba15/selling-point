"use client";

import React from "react";
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import type { IDocument } from "@/providers/documents/context";
import { Typography } from "antd";

const { Text } = Typography;

const categoryColorMap: Record<number, string> = {
  1: "blue", // Proposal
  2: "green", // Contract
  3: "orange", // Presentation
  4: "purple", // RFP
  5: "default", // Other
};

const categoryLabelMap: Record<number, string> = {
  1: "Proposal",
  2: "Contract",
  3: "Presentation",
  4: "RFP",
  5: "Other",
};

const relatedTypeLabelMap: Record<number, string> = {
  1: "Client",
  2: "Opportunity",
  3: "Proposal",
  4: "Contract",
};

interface DocumentsTableProps {
  documents: IDocument[];
  loading?: boolean;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  onSelectDocument: (document: IDocument) => void;
  selectedDocumentId?: string;
  currentUserId?: string;
}

export const DocumentsTable: React.FC<DocumentsTableProps> = ({
  documents,
  loading = false,
  pagination,
  onSelectDocument,
  selectedDocumentId,
  currentUserId,
}) => {
  const columns: ColumnsType<IDocument> = [
    {
      title: "File Name",
      dataIndex: "fileName",
      key: "fileName",
      render: (value: string, record: IDocument) => (
        <span>
          {record.originalFileName || value}
          {record.uploadedById === currentUserId && (
            <Tag color="blue" style={{ marginLeft: 8 }}>
              Uploaded by you
            </Tag>
          )}
        </span>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (value: number) => (
        <Tag color={categoryColorMap[value]}>{categoryLabelMap[value] || value}</Tag>
      ),
    },
    {
      title: "Size",
      dataIndex: "fileSize",
      key: "fileSize",
      render: (value?: number) => {
        if (!value) return "-";
        const kb = value / 1024;
        if (kb < 1024) return `${kb.toFixed(1)} KB`;
        const mb = kb / 1024;
        return `${mb.toFixed(1)} MB`;
      },
    },
    {
      title: "Related To Type",
      dataIndex: "relatedToType",
      key: "relatedToType",
      render: (value: number) => relatedTypeLabelMap[value] || value,
    },
    {
      title: "Related To",
      dataIndex: "relatedToName",
      key: "relatedToName",
      render: (value: string | undefined, record: IDocument) => value || record.relatedToId,
    },
    {
      title: "Uploaded By",
      dataIndex: "uploadedByName",
      key: "uploadedByName",
      render: (value: string | undefined) => value || "Unknown",
    },
    {
      title: "Uploaded",
      dataIndex: "uploadedAt",
      key: "uploadedAt",
      render: (value?: string) => (value ? dayjs(value).format("MMM DD, YYYY") : "-"),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={documents}
      rowKey="id"
      loading={loading}
      expandable={{
        rowExpandable: (record) => Boolean(record.description?.trim()),
        expandedRowRender: (record) => (
          <Text type="secondary">{record.description?.trim() || "No description"}</Text>
        ),
      }}
      pagination={{
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
        onChange: pagination.onChange,
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} documents`,
      }}
      onRow={(record) => ({
        onClick: () => onSelectDocument(record),
        style: {
          cursor: "pointer",
          backgroundColor: record.id === selectedDocumentId ? "#f0f0f0" : undefined,
        },
      })}
    />
  );
};
