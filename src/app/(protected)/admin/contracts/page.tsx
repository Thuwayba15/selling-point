"use client";

import { Card, Typography } from "antd";
import { withAuthGuard } from "@/hoc/withAuthGuard";
import { withRoleGuard } from "@/hoc/withRoleGuard";

const { Title } = Typography;

const AdminContractsPage = () => {
  return (
    <Card>
      <Title level={3}>Admin • Contracts</Title>
    </Card>
  );
}

export default withAuthGuard(withRoleGuard(AdminContractsPage, ["admin"]));