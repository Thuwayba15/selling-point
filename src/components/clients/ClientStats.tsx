import React from "react";
import { Card, Row, Col, Statistic } from "antd";
import { DollarOutlined } from "@ant-design/icons";
import { useStyles } from "./style";
import type { IClientStats } from "@/providers/clients/context";

interface ClientStatsProps {
  stats: IClientStats | undefined;
  loading?: boolean;
}

export const ClientStatsComponent: React.FC<ClientStatsProps> = ({ stats, loading = false }) => {
  const { styles } = useStyles();

  if (!stats && !loading) {
    return null;
  }

  return (
    <Card title="Statistics" loading={loading}>
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Statistic
            title="Total Contacts"
            value={stats?.totalContacts || 0}
            styles={{ content: { color: "#1890ff" } }}
          />
        </Col>
        <Col xs={24}>
          <Statistic
            title="Total Opportunities"
            value={stats?.totalOpportunities || 0}
            styles={{ content: { color: "#52c41a" } }}
          />
        </Col>
        <Col xs={24}>
          <Statistic
            title="Total Contracts"
            value={stats?.totalContracts || 0}
            styles={{ content: { color: "#faad14" } }}
          />
        </Col>
        <Col xs={24}>
          <Statistic
            title="Total Contract Value"
            value={stats?.totalContractValue || 0}
            prefix={<DollarOutlined />}
            precision={2}
            styles={{ content: { color: "#fa8c16" } }}
          />
        </Col>
        <Col xs={24}>
          <Statistic
            title="Active Opportunities"
            value={stats?.activeOpportunities || 0}
            styles={{ content: { color: "#eb2f96" } }}
          />
        </Col>
      </Row>
    </Card>
  );
};
