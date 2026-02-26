"use client";

import { Button, Card, Col, Form, Input, Row, Select, Space, Table, Typography } from "antd";
import { withAuthGuard } from "@/hoc/withAuthGuard";

const { Title } = Typography;

const ContactsPage = () => {
  const columns = [
    { title: "Name", dataIndex: "fullName", key: "fullName" },
    { title: "Client", dataIndex: "clientName", key: "clientName" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Primary", dataIndex: "isPrimary", key: "isPrimary" },
    { title: "Active", dataIndex: "isActive", key: "isActive" },
  ];

  return (
    <Space orientation="vertical" style={{ width: "100%" }} size="middle">

      <Card title="Filters">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Form layout="vertical">
              <Form.Item label="Client">
                <Select placeholder="clientId" options={[]} />
              </Form.Item>
            </Form>
          </Col>
          <Col xs={24} md={8}>
            <Form layout="vertical">
              <Form.Item label="Search">
                <Input placeholder="searchTerm" />
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

        <Space>
          <Button type="primary">Create Contact</Button>
          <Button>Set Primary</Button>
        </Space>
      </Card>

      <Card title="Contacts List">
        <Table columns={columns} dataSource={[]} rowKey={() => crypto.randomUUID()} />
      </Card>
    </Space>
  );
};

export default withAuthGuard(ContactsPage);