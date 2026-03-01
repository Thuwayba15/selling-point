"use client";

import { Card, Row, Col, Typography, Button } from "antd";
import { UserOutlined, FileTextOutlined, UnlockOutlined, SettingOutlined } from "@ant-design/icons";
import Link from "next/link";
import { withAuthGuard } from "@/hoc/withAuthGuard";

const { Title, Paragraph } = Typography;

const AdminHomePage = () => {
  const adminSections = [
    {
      title: "Invitations",
      description: "Generate and manage organization invitations",
      icon: <UnlockOutlined style={{ fontSize: "32px", color: "#1890ff" }} />,
      href: "/admin/invitations",
    },
    {
      title: "Users",
      description: "Manage organization users and roles",
      icon: <UserOutlined style={{ fontSize: "32px", color: "#52c41a" }} />,
      href: "/admin/users",
    },
    {
      title: "Contracts",
      description: "Manage organization contracts",
      icon: <FileTextOutlined style={{ fontSize: "32px", color: "#faad14" }} />,
      href: "/admin/contracts",
    },
    {
      title: "Configuration",
      description: "Configure organization settings",
      icon: <SettingOutlined style={{ fontSize: "32px", color: "#722ed1" }} />,
      href: "/admin/config",
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Card style={{ marginBottom: "24px" }}>
        <Title level={2}>Admin Dashboard</Title>
        <Paragraph>Manage your organization settings, users, and configurations.</Paragraph>
      </Card>

      <Row gutter={[16, 16]}>
        {adminSections.map((section) => (
          <Col xs={24} sm={12} lg={6} key={section.href}>
            <Card
              hoverable
              style={{ textAlign: "center", height: "100%" }}
              bodyStyle={{ padding: "24px" }}
            >
              <div style={{ marginBottom: "16px" }}>{section.icon}</div>
              <Title level={4} style={{ marginBottom: "8px" }}>
                {section.title}
              </Title>
              <Paragraph style={{ fontSize: "12px", color: "#666", marginBottom: "16px" }}>
                {section.description}
              </Paragraph>
              <Link href={section.href}>
                <Button type="primary" block>
                  Go to {section.title}
                </Button>
              </Link>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default withAuthGuard(AdminHomePage, { allowedRoles: ["Admin"] });
