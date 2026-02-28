"use client";

import React from "react";
import { Typography } from "antd";
import { reportsHeaderStyle } from "./style";

const { Title } = Typography;

interface ReportsHeaderProps {
  title: string;
  subtitle?: string;
}

export const ReportsHeader: React.FC<ReportsHeaderProps> = ({ title, subtitle }) => {
  return (
    <div style={reportsHeaderStyle}>
      <Title level={2}>{title}</Title>
      {subtitle && <Typography.Text type="secondary">{subtitle}</Typography.Text>}
    </div>
  );
};
