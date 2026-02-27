"use client";

import { Card, Typography } from "antd";
import { withAuthGuard } from "@/hoc/withAuthGuard";

const { Title } = Typography;

const UsersPage = () => {
  return (
    <Card>
      <Title level={3}>Users</Title>
    </Card>
  );
};

export default withAuthGuard(UsersPage);
