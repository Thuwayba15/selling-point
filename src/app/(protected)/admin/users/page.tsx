"use client";

import { Card, Typography } from "antd";
import { withAuthGuard } from "@/hoc/withAuthGuard";

const { Title } = Typography;

const AdminUsersPage = () => {
  return (
    <Card>
      <Title level={3}>Admin • Users</Title>
    </Card>
  );
};

export default withAuthGuard(AdminUsersPage, { allowedRoles: ["Admin"] });