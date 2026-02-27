"use client";

import { Card, Col, DatePicker, Form, Row, Select, Space, Typography } from "antd";
import { withAuthGuard } from "@/hoc/withAuthGuard";

const { Title } = Typography;

const ReportsPage = () => {
  return (
    <Space orientation="vertical" size="middle">
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Opportunities Report">
            {/* Placeholder for /api/Reports/opportunities */}
            <Form layout="vertical">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item label="Start Date">
                    <DatePicker showTime />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="End Date">
                    <DatePicker showTime />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Stage">
                    <Select placeholder="stage" options={[]} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Owner">
                    <Select placeholder="ownerId" options={[]} />
                  </Form.Item>
                </Col>
              </Row>
            </Form>

            <div />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Sales by Period">
            {/* Placeholder for /api/Reports/sales-by-period */}
            <Form layout="vertical">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item label="Start Date">
                    <DatePicker showTime />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="End Date">
                    <DatePicker showTime />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Group By">
                    <Select
                      defaultValue="month"
                      options={[
                        { label: "Day", value: "day" },
                        { label: "Week", value: "week" },
                        { label: "Month", value: "month" },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>

            <div />
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default withAuthGuard(ReportsPage, { allowedRoles: ["Admin", "SalesManager"] });
