"use client";

import { Button, Card, Col, Form, Input, Row, Select, Space, Table, Typography } from "antd";
import { withAuthGuard } from "@/hoc/withAuthGuard";

const { Title } = Typography;

const NotesPage = () => {
  const columns = [
    { title: "Related To Type", dataIndex: "relatedToType", key: "relatedToType" },
    { title: "Related To ID", dataIndex: "relatedToId", key: "relatedToId" },
    { title: "Note", dataIndex: "content", key: "content" },
    { title: "Updated", dataIndex: "updatedAt", key: "updatedAt" },
  ];

  return (
    <Space orientation="vertical"size="middle">

      <Card title="Filters">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Form layout="vertical">
              <Form.Item label="Related To Type">
                <Select placeholder="relatedToType" options={[]} />
              </Form.Item>
            </Form>
          </Col>
          <Col xs={24} md={8}>
            <Form layout="vertical">
              <Form.Item label="Related To ID">
                <Input placeholder="relatedToId" />
              </Form.Item>
            </Form>
          </Col>
        </Row>

        <Space>
          <Button type="primary">Create Note</Button>
          <Button>Update Note</Button>
          <Button danger>Delete Note</Button>
        </Space>
      </Card>

      <Card title="Notes List">
        <Table columns={columns} dataSource={[]} rowKey={() => crypto.randomUUID()} />
      </Card>
    </Space>
  );
};

export default withAuthGuard(NotesPage);