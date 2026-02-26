"use client";

import { useEffect } from "react";
import { Card, Space, Typography, App } from "antd";
import { withAuthGuard } from "@/hoc/withAuthGuard";
import { useDashboardState, useDashboardActions } from "@/providers/dashboard";
import {
  DashboardKPIs,
  DashboardPipeline,
  DashboardSalesPerformance,
  DashboardActivitySummary,
  DashboardExpiringContracts,
} from "@/components/dashboard";
import { useStyles } from "@/components/dashboard/style";

const { Title } = Typography;

const DashboardPage = () => {
  const { styles } = useStyles();
  const { message } = App.useApp();
  const {
    isPending,
    isError,
    errorMessage,
    overview,
    pipelineMetrics,
    salesPerformance,
    activitySummary,
    expiringContracts,
  } = useDashboardState();

  const {
    getDashboardOverview,
    getPipelineMetrics,
    getSalesPerformance,
    getActivitySummary,
    getExpiringContracts,
    clearError,
  } = useDashboardActions();

  // Fetch all dashboard data on mount
  useEffect(() => {
    getDashboardOverview();
    getPipelineMetrics();
    getSalesPerformance();
    getActivitySummary();
    getExpiringContracts();
  }, []);

  // Handle errors
  useEffect(() => {
    if (isError && errorMessage) {
      message.error(errorMessage);
      clearError();
    }
  }, [isError, errorMessage]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <Title level={2} className={styles.title}>
            Key Metrics
          </Title>
        </div>

        <Space orientation="vertical" size="large" className={styles.fullWidth}>
          {/* KPI Section */}
          <div className={styles.section}>
            <DashboardKPIs overview={overview} isLoading={isPending} />
          </div>

          {/* Pipeline Section */}
          {(pipelineMetrics || isPending) && (
            <div className={styles.section}>
              <Card title="Pipeline by Stage">
                <DashboardPipeline pipelineMetrics={pipelineMetrics} isLoading={isPending} />
              </Card>
            </div>
          )}

          {/* Expiring Contracts Section */}
          {(expiringContracts || isPending) && (
            <div className={styles.section}>
              <Card title="Contracts Expiring Soon">
                <DashboardExpiringContracts
                  expiringContracts={expiringContracts}
                  isLoading={isPending}
                />
              </Card>
            </div>
          )}
        </Space>
      </div>
    </div>
  );
};

export default withAuthGuard(DashboardPage);
