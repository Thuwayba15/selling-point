"use client";

import { Button, Card, Col, Form, Input, Row, Select, Space, Table, Typography } from "antd";
import { withAuthGuard } from "@/hoc/withAuthGuard";

const { Title } = Typography;

const OpportunitiesPage = () => {
  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Client", dataIndex: "clientName", key: "clientName" },
    { title: "Owner", dataIndex: "ownerName", key: "ownerName" },
    { title: "Stage", dataIndex: "stage", key: "stage" },
    { title: "Value", dataIndex: "value", key: "value" },
    { title: "Status", dataIndex: "isActive", key: "isActive" },
  ];

  return (
    <Space orientation="vertical" style={{ width: "100%" }} size="middle">
      <Title level={3}>Opportunities</Title>

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
              <Form.Item label="Stage">
                <Select placeholder="stage" options={[]} />
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
              <Form.Item label="Owner">
                <Select placeholder="ownerId" options={[]} />
              </Form.Item>
            </Form>
          </Col>
        </Row>

        <Button type="primary">Create Opportunity</Button>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Opportunity List">
            <Table columns={columns} dataSource={[]} rowKey={() => crypto.randomUUID()} />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Pipeline Metrics">
            {/* Placeholder for /api/Opportunities/pipeline and /api/Dashboard/pipeline-metrics */}
            <div style={{ height: 260 }} />
          </Card>
          <Card title="Stage History (selected opportunity)" style={{ marginTop: 16 }}>
            {/* Placeholder for /api/Opportunities/{id}/stage-history */}
            <div style={{ height: 220 }} />
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default withAuthGuard(OpportunitiesPage);