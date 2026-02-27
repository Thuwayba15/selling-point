"use client";

import React from "react";
import { Typography } from "antd";

const { Title } = Typography;

interface DocumentsHeaderProps {
  totalCount?: number;
}

export const DocumentsHeader: React.FC<DocumentsHeaderProps> = ({ totalCount = 0 }) => {
  return (
    <div style={{ marginBottom: 16 }}>
      <Title level={2}>Documents</Title>
      <Typography.Text type="secondary">
        Manage and organize all your documents. Total: {totalCount}
      </Typography.Text>
    </div>
  );
};
