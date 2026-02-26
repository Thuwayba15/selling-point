"use client";

import type { ReactNode } from "react";
import { Layout } from "antd";

const { Content } = Layout;

const AppShell = ({ children }: { children: ReactNode }) => {
  return (
    <Layout>
      <Content>{children}</Content>
    </Layout>
  );
};

export default AppShell;