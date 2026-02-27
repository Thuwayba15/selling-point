"use client";

import { Empty, Skeleton, Space } from "antd";
import { IActivitySummary } from "@/providers/dashboard/context";
import { useStyles } from "./style";

interface DashboardActivitySummaryProps {
  activitySummary?: IActivitySummary;
  isLoading: boolean;
}

export const DashboardActivitySummary = ({
  activitySummary,
  isLoading,
}: DashboardActivitySummaryProps) => {
  const { styles } = useStyles();

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

  if (!activitySummary) {
    return <Empty description="No activity data available" />;
  }

  const activityTypes = [
    { key: "meeting", label: "Meetings", value: activitySummary.meeting },
    { key: "call", label: "Calls", value: activitySummary.call },
    { key: "email", label: "Emails", value: activitySummary.email },
    { key: "task", label: "Tasks", value: activitySummary.task },
    { key: "presentation", label: "Presentations", value: activitySummary.presentation },
    { key: "other", label: "Other", value: activitySummary.other },
  ];

  const activityStatus = [
    { key: "pending", label: "Scheduled", value: activitySummary.pending },
    { key: "completed", label: "Completed", value: activitySummary.completed },
    { key: "cancelled", label: "Cancelled", value: activitySummary.cancelled },
  ];

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Activity Breakdown by Type</h3>
      <div className={styles.kpiGrid}>
        {activityTypes.map((activity) => (
          <div key={activity.key} className={styles.card}>
            <Space orientation="vertical" className={styles.fullWidth}>
              <div className={styles.cardTitle}>{activity.label}</div>
              <div className={styles.cardValue}>{activity.value}</div>
            </Space>
          </div>
        ))}
      </div>

      <h3 className={`${styles.sectionTitle} ${styles.spaceBetweenSections}`}>Activity Status</h3>
      <div className={styles.kpiGrid}>
        {activityStatus.map((status) => (
          <div key={status.key} className={styles.card}>
            <Space orientation="vertical" className={styles.fullWidth}>
              <div className={styles.cardTitle}>{status.label}</div>
              <div className={styles.cardValue}>{status.value}</div>
            </Space>
          </div>
        ))}
      </div>
    </div>
  );
};
