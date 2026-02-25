"use client";

import { Button, Card, Space, Table, Tabs, Typography } from "antd";
import { withAuthGuard } from "@/hoc/withAuthGuard";

const { Title } = Typography;

const ContractsPage = () => {
  const columns = [
    { title: "Contract", dataIndex: "name", key: "name" },
    { title: "Client", dataIndex: "clientName", key: "clientName" },
    { title: "Start", dataIndex: "startDate", key: "startDate" },
    { title: "End", dataIndex: "endDate", key: "endDate" },
    { title: "Status", dataIndex: "status", key: "status" },
  ];

  return (
    <Space orientation="vertical" style={{ width: "100%" }} size="middle">
      <Title level={3}>Contracts</Title>

      <Tabs
        items={[
          {
            key: "all",
            label: "All",
            children: (
              <Card title="Contracts">
                <Space style={{ marginBottom: 16 }}>
                  <Button type="primary">Create Contract</Button>
                  <Button>Activate</Button>
                  <Button danger>Cancel</Button>
                </Space>
                <Table columns={columns} dataSource={[]} rowKey={() => crypto.randomUUID()} />
              </Card>
            ),
          },
          {
            key: "expiring",
            label: "Expiring",
            children: (
              <Card title="Contracts Expiring Soon">
                <Table columns={columns} dataSource={[]} rowKey={() => crypto.randomUUID()} />
              </Card>
            ),
          },
          {
            key: "renewals",
            label: "Renewals",
            children: (
              <Card title="Renewals (selected contract)">
                {/* Placeholder for /api/Contracts/{contractId}/renewals and /api/Contracts/renewals/{renewalId}/complete */}
                <div style={{ height: 260 }} />
              </Card>
            ),
          },
        ]}
      />
    </Space>
  );
};

export default withAuthGuard(ContractsPage);