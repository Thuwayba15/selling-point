"use client";

import { Button, Card, Space, Table, Tabs, Typography } from "antd";
import { withAuthGuard } from "@/hoc/withAuthGuard";

const { Title } = Typography;

const ActivitiesPage = () => {
  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Type", dataIndex: "typeName", key: "typeName" },
    { title: "Due", dataIndex: "dueDate", key: "dueDate" },
    { title: "Owner", dataIndex: "ownerName", key: "ownerName" },
    { title: "Status", dataIndex: "statusName", key: "statusName" },
  ];

  const tableCard = (title: string) => (
    <Card title={title}>
      <Space>
        <Button type="primary">Create Activity</Button>
        <Button>Mark Complete</Button>
        <Button>View Participants</Button>
      </Space>
      <Table columns={columns} dataSource={[]} rowKey={() => crypto.randomUUID()} />
    </Card>
  );

  return (
    <Space orientation="vertical"size="middle">

      <Tabs
        items={[
          { key: "mine", label: "My Activities", children: tableCard("My Activities") },
          { key: "upcoming", label: "Upcoming", children: tableCard("Upcoming Activities") },
          { key: "overdue", label: "Overdue", children: tableCard("Overdue Activities") },
        ]}
      />
    </Space>
  );
};

export default withAuthGuard(ActivitiesPage);
