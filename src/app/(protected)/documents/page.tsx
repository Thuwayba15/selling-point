"use client";

import { Button, Card, Col, Form, Input, Row, Select, Space, Table, Typography, Upload } from "antd";
import { withAuthGuard } from "@/hoc/withAuthGuard";

const { Title } = Typography;

const DocumentsPage = () => {
  const columns = [
    { title: "File", dataIndex: "fileName", key: "fileName" },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Related To Type", dataIndex: "relatedToType", key: "relatedToType" },
    { title: "Related To ID", dataIndex: "relatedToId", key: "relatedToId" },
    { title: "Uploaded", dataIndex: "createdAt", key: "createdAt" },
  ];

  return (
    <Space orientation="vertical" style={{ width: "100%" }} size="middle">

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
          <Col xs={24} md={8}>
            <Form layout="vertical">
              <Form.Item label="Category">
                <Select placeholder="category" options={[]} />
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Card>

      <Card title="Upload Document">
        {/* Placeholder for /api/Documents/upload multipart/form-data */}
        <Space>
          <Upload>
            <Button>Select file</Button>
          </Upload>
          <Button type="primary">Upload</Button>
        </Space>
      </Card>

      <Card title="Document List">
        <Space style={{ marginBottom: 16 }}>
          <Button>Download</Button>
          <Button danger>Delete</Button>
        </Space>
        <Table columns={columns} dataSource={[]} rowKey={() => crypto.randomUUID()} />
      </Card>
    </Space>
  );
};

export default withAuthGuard(DocumentsPage);