"use client";

import { Button, Card, Col, Form, Input, Row, Select, Space, Table, Typography } from "antd";
import { withAuthGuard } from "@/hoc/withAuthGuard";

const { Title } = Typography;

const ClientsPage = () => {
  const columns = [
    { title: "Client", dataIndex: "name", key: "name" },
    { title: "Industry", dataIndex: "industry", key: "industry" },
    { title: "Status", dataIndex: "isActive", key: "isActive" },
    { title: "Primary Contact", dataIndex: "primaryContact", key: "primaryContact" },
  ];

  return (
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
              <Form.Item label="Industry">
                <Select placeholder="industry" options={[]} />
              </Form.Item>
            </Form>
          </Col>
          <Col xs={24} md={8}>
            <Form layout="vertical">
              <Form.Item label="Active">
                <Select
                  placeholder="isActive"
                  options={[
                    { label: "All", value: "all" },
                    { label: "Active", value: "true" },
                    { label: "Inactive", value: "false" },
                  ]}
                />
              </Form.Item>
            </Form>
          </Col>
        </Row>

        <Button type="primary">Create Client</Button>
      </Card>

      <Card title="Client List">
        <Table columns={columns} dataSource={[]} rowKey={() => crypto.randomUUID()} />
      </Card>
    </Space>
  );
};

export default withAuthGuard(ClientsPage);