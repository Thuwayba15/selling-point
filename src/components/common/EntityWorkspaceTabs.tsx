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
  className?: string;
}

export const EntityWorkspaceTabs = ({
  title,
  items,
  activeKey,
  onChange,
  className,
}: EntityWorkspaceTabsProps) => {
  return (
    <Card title={title} className={className}>
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
