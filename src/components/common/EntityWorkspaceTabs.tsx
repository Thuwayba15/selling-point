"use client";

import { Card, Tabs } from "antd";

export interface WorkspaceTabItem {
  key: string;
  label: string;
  content: React.ReactNode;
}

interface EntityWorkspaceTabsProps {
  title: React.ReactNode;
  items: WorkspaceTabItem[];
  activeKey: string;
  onChange: (key: string) => void;
}

export const EntityWorkspaceTabs = ({
  title,
  items,
  activeKey,
  onChange,
}: EntityWorkspaceTabsProps) => {
  return (
    <Card title={title}>
      <Tabs
        activeKey={activeKey}
        onChange={onChange}
        items={items.map((item) => ({
          key: item.key,
          label: item.label,
          children: item.content,
        }))}
      />
    </Card>
  );
};
