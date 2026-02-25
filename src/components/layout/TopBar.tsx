"use client";

import { Layout, Button, Space, Typography } from "antd";
import { useAuthActions, useAuthState } from "@/providers/auth";

const { Header } = Layout;
const { Text } = Typography;

export const TopBar = () => {
  const { user } = useAuthState();
  const { logout } = useAuthActions();

  return (
    <Header>
      <Text style={{ color: "white" }}>
        {user ? `Signed in as ${user.email}` : "Not signed in"}
      </Text>

      <Space>
        <Button onClick={logout}>Logout</Button>
      </Space>
    </Header>
  );
};