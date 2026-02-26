"use client";

import { Button, Card, Col, Form, Input, Row, Select, Space, Table, Typography } from "antd";
import { withAuthGuard } from "@/hoc/withAuthGuard";

const { Title } = Typography;

const ProposalsPage = () => {
  const columns = [
    { title: "Proposal #", dataIndex: "proposalNumber", key: "proposalNumber" },
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Client", dataIndex: "clientName", key: "clientName" },
    { title: "Opportunity", dataIndex: "opportunityTitle", key: "opportunityTitle" },
    { title: "Status", dataIndex: "status", key: "status" },
    { title: "Total", dataIndex: "totalAmount", key: "totalAmount" },
  ];

  return (
    <Space orientation="vertical" style={{ width: "100%" }} size="middle">

      <Card title="Filters">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={6}>
            <Form layout="vertical">
              <Form.Item label="Search">
                <Input placeholder="searchTerm" />
              </Form.Item>
            </Form>
          </Col>
          <Col xs={24} md={6}>
            <Form layout="vertical">
              <Form.Item label="Status">
                <Select placeholder="status" options={[]} />
              </Form.Item>
            </Form>
          </Col>
          <Col xs={24} md={6}>
            <Form layout="vertical">
              <Form.Item label="Client">
                <Select placeholder="clientId" options={[]} />
              </Form.Item>
            </Form>
          </Col>
          <Col xs={24} md={6}>
            <Form layout="vertical">
              <Form.Item label="Opportunity">
                <Select placeholder="opportunityId" options={[]} />
              </Form.Item>
            </Form>
          </Col>
        </Row>

        <Space>
          <Button type="primary">Create Proposal</Button>
          <Button>Submit</Button>
          <Button>Approve</Button>
          <Button danger>Reject</Button>
        </Space>
      </Card>

      <Card title="Proposal List">
        <Table columns={columns} dataSource={[]} rowKey={() => crypto.randomUUID()} />
      </Card>

      <Card title="Proposal Line Items (selected proposal)">
        {/* Placeholder for "ProposalWithLineItems" shape and line-item endpoints */}
        <div style={{ height: 260 }} />
      </Card>
    </Space>
  );
};

export default withAuthGuard(ProposalsPage);