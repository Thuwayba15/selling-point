"use client";

import { Empty, List, Typography } from "antd";

interface WorkspaceEntityListItem {
  id: string;
  title: string;
  subtitle?: string;
}

interface WorkspaceEntityListProps {
  items: WorkspaceEntityListItem[];
  emptyText: string;
}

export const WorkspaceEntityList = ({ items, emptyText }: WorkspaceEntityListProps) => {
  if (!items.length) {
    return <Empty description={emptyText} />;
  }

  return (
    <List
      dataSource={items}
      renderItem={(item) => (
        <List.Item key={item.id}>
          <List.Item.Meta
            title={item.title}
            description={
              item.subtitle ? (
                <Typography.Text type="secondary">{item.subtitle}</Typography.Text>
              ) : undefined
            }
          />
        </List.Item>
      )}
    />
  );
};
