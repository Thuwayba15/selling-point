"use client";

import { useEffect } from "react";
import { Card, Space, Typography, App } from "antd";
import { withAuthGuard } from "@/hoc/withAuthGuard";
import { useRbac } from "@/hooks/useRbac";
import { useDashboardState, useDashboardActions } from "@/providers/dashboard";
import {
  DashboardKPIs,
  DashboardPipeline,
  DashboardSalesPerformance,
  DashboardActivitySummary,
} from "@/components/dashboard";
import { useStyles } from "@/components/dashboard/style";

const { Title } = Typography;

const DashboardPage = () => {
  const { styles } = useStyles();
  const { message } = App.useApp();
  const { isAdmin, isManager } = useRbac();
  const {
    isPending,
    isError,
    errorMessage,
    overview,
    pipelineMetrics,
    salesPerformance,
    activitySummary,
  } = useDashboardState();

  const {
    getDashboardOverview,
    getPipelineMetrics,
    getSalesPerformance,
    getActivitySummary,
    clearError,
  } = useDashboardActions();

  // Fetch all dashboard data on mount
  useEffect(() => {
    getDashboardOverview();
    getPipelineMetrics();
    getSalesPerformance();
    getActivitySummary();
  }, [getDashboardOverview, getPipelineMetrics, getSalesPerformance, getActivitySummary]);

  // Handle errors
  useEffect(() => {
    if (isError && errorMessage) {
      message.error(errorMessage);
      clearError();
    }
  }, [isError, errorMessage, clearError, message]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <Title level={2} className={styles.title}>
            Key Metrics
          </Title>
        </div>

        {/* KPIs Row - Across top */}
        <div className={styles.kpiRow}>
          <div className={styles.section}>
            <DashboardKPIs overview={overview} isLoading={isPending} />
          </div>
        </div>

        {/* Charts Row - Horizontally Scrollable */}
        <div className={styles.chartsScrollContainer}>
          {/* Pipeline by Stage */}
          {(pipelineMetrics || isPending) && (
            <div className={styles.chartCard}>
              <Card title="Pipeline by Stage">
                <DashboardPipeline pipelineMetrics={pipelineMetrics} isLoading={isPending} />
              </Card>
            </div>
          )}

          {/* Activity Summary */}
          {(activitySummary || isPending) && (
            <div className={styles.chartCard}>
              <DashboardActivitySummary activitySummary={activitySummary} isLoading={isPending} />
            </div>
          )}
        </div>

        {/* Sales Performance Section */}
        {(isAdmin || isManager) && (salesPerformance || isPending) && (
          <div className={styles.salesPerformanceSection}>
            <div className={styles.section}>
              <Card title="Sales Performance">
                <DashboardSalesPerformance
                  salesPerformance={salesPerformance}
                  isLoading={isPending}
                />
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default withAuthGuard(DashboardPage);
