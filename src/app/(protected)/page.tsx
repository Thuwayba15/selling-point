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
import { SmartAutomationDashboard as SmartAutomationDashboardNew } from "@/components/ai/SmartAutomationDashboardNew";
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

        {/* Smart Automation Section */}
        <div className={styles.salesPerformanceSection}>
          <div className={styles.section}>
            <SmartAutomationDashboardNew />
          </div>
        </div>   
      </div>
    </div>
  );
};

export default withAuthGuard(DashboardPage);
