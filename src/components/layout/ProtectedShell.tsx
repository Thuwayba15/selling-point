"use client";

import type { ReactNode } from "react";
import { Layout } from "antd";

import { SideNav } from "./SideNav";
import { TopBar } from "./TopBar";
import { AIAssistant } from "@/components/ai";
import { useStyles } from "./style";

const { Sider, Header, Content } = Layout;

export const ProtectedShell = ({ children }: { children: ReactNode }) => {
  const { styles } = useStyles();
  return (
    <Layout className={styles.shell}>
      <Sider width={260} breakpoint="lg" collapsedWidth="80" className={styles.sider} theme="dark">
        <SideNav />
      </Sider>

      <Layout className={styles.contentArea}>
        <Header className={styles.header}>
          <TopBar />
        </Header>

        <Content className={styles.main}>
          <div className={styles.page}>{children}</div>
        </Content>
      </Layout>
      
      {/* AI Assistant */}
      <AIAssistant />
    </Layout>
  );
};
