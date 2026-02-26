import React from "react";
import { Card, Statistic, Row, Col, Empty, Skeleton } from "antd";
import { FileTextOutlined, DollarOutlined, ProjectOutlined } from "@ant-design/icons";
import { useStyles } from "./style";

export interface ClientStats {
  opportunityCount: number;
  contractCount: number;
  totalContractValue: number;
  contractCurrency?: string;
}

interface ClientStatsProps {
  stats?: ClientStats;
  loading?: boolean;
}

export const ClientStatsComponent: React.FC<ClientStatsProps> = ({ stats, loading = false }) => {
  const { styles } = useStyles();

  if (!stats && !loading) {
    return <Empty description="No stats available" />;
  }

  return (
    <Card title="Statistics" className={styles.statsCard} loading={loading}>
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Statistic
            title="Opportunities"
            value={stats?.opportunityCount || 0}
            prefix={<ProjectOutlined />}
          />
        </Col>
        <Col xs={24} sm={12}>
          <Statistic
            title="Active Contracts"
            value={stats?.contractCount || 0}
            prefix={<FileTextOutlined />}
          />
        </Col>
        <Col xs={24}>
          <Statistic
            title="Total Contract Value"
            value={stats?.totalContractValue || 0}
            prefix={<DollarOutlined />}
            suffix={stats?.contractCurrency || "ZAR"}
            precision={2}
          />
        </Col>
      </Row>
    </Card>
  );
};
