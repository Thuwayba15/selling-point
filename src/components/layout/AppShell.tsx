"use client";

import type { ReactNode } from "react";
import { Layout } from "antd";

const { Content } = Layout;

const AppShell = ({ children }: { children: ReactNode }) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: 24 }}>{children}</Content>
    </Layout>
  );
};

export default AppShell;