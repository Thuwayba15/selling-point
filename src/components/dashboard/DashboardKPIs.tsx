"use client";

import { Row, Col, Card, Statistic, Space, Skeleton } from "antd";
import {
  DollarOutlined,
  CheckCircleOutlined,
  PercentageOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { IDashboardOverview } from "@/providers/dashboard/context";
import { useStyles } from "./style";

interface DashboardKPIsProps {
  overview?: IDashboardOverview;
  isLoading: boolean;
}

export const DashboardKPIs = ({ overview, isLoading }: DashboardKPIsProps) => {
  const { styles } = useStyles();

  // Debug: Log the overview data
  console.log("DashboardKPIs - overview:", overview);

  if (isLoading) {
    return (
      <div className={styles.kpiGrid}>
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className={styles.card}>
            <Skeleton active paragraph={{ rows: 2 }} />
          </div>
        ))}
      </div>
    );
  }

  const formatCurrency = (value: number | undefined | null) => {
    if (value === undefined || value === null || isNaN(value)) return "$0.00M";
    return `$${(value / 1000000).toFixed(2)}M`;
  };

  const formatPercentage = (value: number | undefined | null) => {
    if (value === undefined || value === null || isNaN(value)) return "0.0%";
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className={styles.kpiGrid}>
      {/* Pipeline Value */}
      {overview?.opportunities && (
        <div className={styles.card}>
          <Space orientation="vertical" className={styles.fullWidth}>
            <div className={styles.cardTitle}>Pipeline Value</div>
            <div className={styles.cardValue}>
              {formatCurrency(overview.opportunities.pipelineValue)}
            </div>
          </Space>
        </div>
      )}

      {/* Win Rate */}
      {overview?.opportunities && (
        <div className={styles.card}>
          <Space orientation="vertical" className={styles.fullWidth}>
            <div className={styles.cardTitle}>Win Rate</div>
            <div className={styles.cardValue}>
              {formatPercentage(overview.opportunities.winRate)}
            </div>
          </Space>
        </div>
      )}

      {/* Opportunities Won */}
      {overview?.opportunities && (
        <div className={styles.card}>
          <Space orientation="vertical" className={styles.fullWidth}>
            <div className={styles.cardTitle}>Opportunities Won</div>
            <div className={styles.cardValue}>{overview.opportunities.wonCount || 0}</div>
          </Space>
        </div>
      )}

      {/* Active Contracts */}
      {overview?.contracts && (
        <div className={styles.card}>
          <Space orientation="vertical" className={styles.fullWidth}>
            <div className={styles.cardTitle}>Active Contracts</div>
            <div className={styles.cardValue}>{overview.contracts.totalActiveCount || 0}</div>
          </Space>
        </div>
      )}

      {/* Contract Value */}
      {overview?.contracts && (
        <div className={styles.card}>
          <Space orientation="vertical" className={styles.fullWidth}>
            <div className={styles.cardTitle}>Contract Value</div>
            <div className={styles.cardValue}>
              {formatCurrency(overview.contracts.totalContractValue)}
            </div>
          </Space>
        </div>
      )}
    </div>
  );
};
