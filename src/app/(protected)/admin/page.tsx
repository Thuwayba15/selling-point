"use client";

import { Card, Typography } from "antd";
import { withAuthGuard } from "@/hoc/withAuthGuard";
import { withRoleGuard } from "@/hoc/withRoleGuard";

const { Title } = Typography;

const AdminHomePage = () => {
  return (
    <Card>
      <Title level={3}>Admin</Title>
    </Card>
  );
}

export default withAuthGuard(withRoleGuard(AdminHomePage, ["admin"]));