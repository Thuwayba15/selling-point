"use client";

import { Card, Col, List, Row, Space, Statistic, Table, Typography } from "antd";
import { withAuthGuard } from "@/hoc/withAuthGuard";

const { Title } = Typography;

const DashboardPage = () => {

  const leaderboardColumns = [
    { title: "Sales Rep", dataIndex: "rep", key: "rep" },
    { title: "Won Value", dataIndex: "wonValue", key: "wonValue" },
    { title: "Win Rate", dataIndex: "winRate", key: "winRate" },
  ];

  const activitiesColumns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Due", dataIndex: "dueDate", key: "dueDate" },
    { title: "Status", dataIndex: "status", key: "status" },
  ];

  const contractsColumns = [
    { title: "Contract", dataIndex: "name", key: "name" },
    { title: "Client", dataIndex: "client", key: "client" },
    { title: "Expiry", dataIndex: "endDate", key: "endDate" },
    { title: "Status", dataIndex: "status", key: "status" },
  ];

  return (
    <Space orientation="vertical" style={{ width: "100%" }} size="middle">
      <Title level={3}>Dashboard</Title>

      {/* Top KPI cards: driven by dashboard endpoints */}
      <Row>
        <Col xs={24} md={12} lg={6}>
          <Card>
            <Statistic title="Pipeline Value" value="—" />
          </Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card>
            <Statistic title="Activities" value="—" />
          </Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card>
            <Statistic title="Active Contracts" value="—" />
          </Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card>
            <Statistic title="Revenue This Period" value="—" />
          </Card>
        </Col>
      </Row>

      {/* Pipeline overview + Quick links */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Pipeline Overview">
            {/* Placeholder chart for pipeline metrics endpoint */}
            <div style={{ height: 320 }} />
          </Card>
        </Col>
      </Row>

      {/* Leaderboard + Upcoming + Expiring */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card title="Sales Leaderboard">
            {/* Placeholder table for /api/Dashboard/sales-performance */}
            <Table columns={leaderboardColumns} dataSource={[]} rowKey={() => crypto.randomUUID()} pagination={false} />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Upcoming Activities">
            {/* Placeholder table for /api/Activities/upcoming and /api/Dashboard/activities-summary */}
            <Table columns={activitiesColumns} dataSource={[]} rowKey={() => crypto.randomUUID()} pagination={false} />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Contracts Expiring Soon">
            {/* Placeholder table for /api/Dashboard/contracts-expiring and /api/Contracts/expiring */}
            <Table columns={contractsColumns} dataSource={[]} rowKey={() => crypto.randomUUID()} pagination={false} />
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default withAuthGuard(DashboardPage);