"use client";

import { Card, Typography } from "antd";
import { withAuthGuard } from "@/hoc/withAuthGuard";

const { Title } = Typography;

const AdminConfigPage = () => {
  return (
    <Card>
      <Title level={3}>Admin • Configuration</Title>
      <p>System configuration and settings for administrators.</p>
    </Card>
  );
};

export default withAuthGuard(AdminConfigPage, { allowedRoles: ["Admin"] });
