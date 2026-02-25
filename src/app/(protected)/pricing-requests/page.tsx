"use client";

import { Button, Card, Col, Form, Input, Row, Select, Space, Table, Tabs, Typography } from "antd";
import { withAuthGuard } from "@/hoc/withAuthGuard";

const { Title } = Typography;

const PricingRequestsPage = () => {
  const columns = [
    { title: "Request #", dataIndex: "requestNumber", key: "requestNumber" },
    { title: "Opportunity", dataIndex: "opportunityTitle", key: "opportunityTitle" },
    { title: "Assigned To", dataIndex: "assignedToName", key: "assignedToName" },
    { title: "Priority", dataIndex: "priority", key: "priority" },
    { title: "Status", dataIndex: "status", key: "status" },
  ];

  const listView = (
    <Space orientation="vertical" style={{ width: "100%" }} size="middle">
      <Card title="Filters">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Form layout="vertical">
              <Form.Item label="Search">
                <Input placeholder="searchTerm" />
              </Form.Item>
            </Form>
          </Col>
          <Col xs={24} md={8}>
            <Form layout="vertical">
              <Form.Item label="Status">
                <Select placeholder="status" options={[]} />
              </Form.Item>
            </Form>
          </Col>
          <Col xs={24} md={8}>
            <Form layout="vertical">
              <Form.Item label="Priority">
                <Select placeholder="priority" options={[]} />
              </Form.Item>
            </Form>
          </Col>
        </Row>

        <Space>
          <Button type="primary">Create Pricing Request</Button>
          <Button>Assign</Button>
        </Space>
      </Card>

      <Card title="Pricing Requests">
        <Table columns={columns} dataSource={[]} rowKey={() => crypto.randomUUID()} />
      </Card>
    </Space>
  );

  return (
    <Space orientation="vertical" style={{ width: "100%" }} size="middle">
      <Title level={3}>Pricing Requests</Title>

      <Tabs
        items={[
          { key: "all", label: "All", children: listView },
          {
            key: "pending",
            label: "Pending",
            children: (
              <Card title="Pending Pricing Requests">
                <Table columns={columns} dataSource={[]} rowKey={() => crypto.randomUUID()} />
              </Card>
            ),
          },
          {
            key: "mine",
            label: "My Requests",
            children: (
              <Card title="My Pricing Requests">
                <Table columns={columns} dataSource={[]} rowKey={() => crypto.randomUUID()} />
              </Card>
            ),
          },
        ]}
      />
    </Space>
  );
};

export default withAuthGuard(PricingRequestsPage);