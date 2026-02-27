"use client";

import React from "react";
import { Card, Descriptions, Tag } from "antd";
import dayjs from "dayjs";
import type { IDocument } from "@/providers/documents/context";

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

interface DocumentDetailsProps {
  document: IDocument | null;
  currentUserId?: string;
}

export const DocumentDetails: React.FC<DocumentDetailsProps> = ({ document, currentUserId }) => {
  if (!document) {
    return (
      <Card title="Document Details" style={{ marginBottom: 16 }}>
        <p>Select a document to view details</p>
      </Card>
    );
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <Card title="Document Details" style={{ marginBottom: 16 }}>
      <Descriptions column={1} bordered>
        <Descriptions.Item label="ID">{document.id}</Descriptions.Item>
        <Descriptions.Item label="File Name">
          {document.originalFileName || document.fileName}
        </Descriptions.Item>
        <Descriptions.Item label="File Size">{formatFileSize(document.fileSize)}</Descriptions.Item>
        <Descriptions.Item label="Content Type">
          {document.contentType || "Unknown"}
        </Descriptions.Item>
        <Descriptions.Item label="Category">
          {categoryLabelMap[document.category] || document.category}
        </Descriptions.Item>
        <Descriptions.Item label="Related To Type">
          {relatedTypeLabelMap[document.relatedToType] || document.relatedToType}
        </Descriptions.Item>
        <Descriptions.Item label="Related To">
          {document.relatedToName || document.relatedToId}
        </Descriptions.Item>
        <Descriptions.Item label="Description">
          {document.description || "No description"}
        </Descriptions.Item>
        <Descriptions.Item label="Uploaded By">
          {document.uploadedByName || "Unknown"}
          {document.uploadedById === currentUserId && (
            <Tag color="blue" style={{ marginLeft: 8 }}>
              You
            </Tag>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Uploaded At">
          {document.uploadedAt ? dayjs(document.uploadedAt).format("MMMM DD, YYYY HH:mm") : "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Updated At">
          {document.updatedAt ? dayjs(document.updatedAt).format("MMMM DD, YYYY HH:mm") : "-"}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};
