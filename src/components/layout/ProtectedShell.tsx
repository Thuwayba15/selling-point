"use client";

import type { ReactNode } from "react";
import { Layout } from "antd";

import { SideNav } from "./SideNav";
import { TopBar } from "./TopBar";

const { Sider, Content } = Layout;

export const ProtectedShell = ({ children }: { children: ReactNode }) => {
  return (
    <Layout>
      <Sider width={240}>
        <SideNav />
      </Sider>

      <Layout>
        <TopBar />
        <Content>{children}</Content>
      </Layout>
    </Layout>
  );
};
