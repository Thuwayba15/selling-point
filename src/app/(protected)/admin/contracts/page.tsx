"use client";

import { Card, Typography } from "antd";
import { withAuthGuard } from "@/hoc/withAuthGuard";

const { Title } = Typography;

const AdminContractsPage = () => {
  return (
    <Card>
      <Title level={3}>Admin • Contracts</Title>
    </Card>
  );
};

export default withAuthGuard(AdminContractsPage, { allowedRoles: ["Admin"] });