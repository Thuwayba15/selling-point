"use client";

import { Card, Typography } from "antd";
import { withAuthGuard } from "@/hoc/withAuthGuard";

const { Title } = Typography;

const AdminHomePage = () => {
  return (
    <Card>
      <Title level={3}>Admin Dashboard</Title>
    </Card>
  );
};

export default withAuthGuard(AdminHomePage, { allowedRoles: ["Admin"] });