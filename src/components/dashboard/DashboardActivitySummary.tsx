"use client";

import { Empty, Skeleton } from "antd";
import { IActivitySummary } from "@/providers/dashboard/context";
import { useStyles } from "./style";

interface DashboardActivitySummaryProps {
  activitySummary?: IActivitySummary;
  isLoading: boolean;
}

// Map activity type enum to labels
const ACTIVITY_TYPE_LABELS: Record<number, string> = {
  1: "Meetings",
  2: "Calls",
  3: "Emails",
  4: "Tasks",
  5: "Presentations",
  6: "Other",
};

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

  // Build activity types from byType object
  const activityTypes = Object.entries(activitySummary.byType || {}).map(([typeId, count]) => ({
    key: typeId,
    label: ACTIVITY_TYPE_LABELS[parseInt(typeId, 10)] || `Type ${typeId}`,
    value: count,
    color: getColorForType(parseInt(typeId, 10)),
  }));

  // Build activity status breakdown
  const activityStatus = [
    { key: "upcoming", label: "Upcoming", value: activitySummary.upcomingCount, color: "#1890ff" },
    { key: "overdue", label: "Overdue", value: activitySummary.overdueCount, color: "#ff4d4f" },
    { key: "completed-today", label: "Completed Today", value: activitySummary.completedTodayCount, color: "#52c41a" },
    {
      key: "completed-week",
      label: "Completed This Week",
      value: activitySummary.completedThisWeekCount,
      color: "#13c2c2",
    },
  ];

  // Helper to get color for activity type
  function getColorForType(typeId: number): string {
    const colors: Record<number, string> = {
      1: "#1890ff", // Meetings - blue
      2: "#52c41a", // Calls - green
      3: "#faad14", // Emails - orange
      4: "#f5222d", // Tasks - red
      5: "#722ed1", // Presentations - purple
      6: "#13c2c2", // Other - cyan
    };
    return colors[typeId] || "#d9d9d9";
  }

  // Calculate pie chart segments
  function calculatePieChart(data: Array<{ value: number; color: string }>) {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return "conic-gradient(#d9d9d9 0% 100%)";

    let accumulated = 0;
    const segments = data
      .filter(item => item.value > 0)
      .map((item) => {
        const percentage = (item.value / total) * 100;
        const start = accumulated;
        accumulated += percentage;
        return `${item.color} ${start}% ${accumulated}%`;
      });

    return `conic-gradient(${segments.join(", ")})`;
  }

  const typesChartGradient = calculatePieChart(activityTypes);
  const statusChartGradient = calculatePieChart(activityStatus);

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Activity Breakdown</h3>
      
      <div className={styles.chartGrid}>
        {/* Activity Types Pie Chart */}
        <div className={styles.chartCard}>
          <h4 className={styles.chartTitle}>By Type</h4>
          {activityTypes.length > 0 ? (
            <>
              <div 
                className={styles.pieChart}
                style={{ background: typesChartGradient }}
              />
              <div className={styles.legendContainer}>
                {activityTypes.map((activity) => (
                  <div key={activity.key} className={styles.legendItem}>
                    <div 
                      className={styles.legendColor}
                      style={{ backgroundColor: activity.color }}
                    />
                    <span className={styles.legendLabel}>{activity.label}</span>
                    <span className={styles.legendValue}>{activity.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <Empty description="No activities recorded" />
          )}
        </div>

        {/* Activity Status Pie Chart */}
        <div className={styles.chartCard}>
          <h4 className={styles.chartTitle}>By Status</h4>
          <div 
            className={styles.pieChart}
            style={{ background: statusChartGradient }}
          />
          <div className={styles.legendContainer}>
            {activityStatus.map((status) => (
              <div key={status.key} className={styles.legendItem}>
                <div 
                  className={styles.legendColor}
                  style={{ backgroundColor: status.color }}
                />
                <span className={styles.legendLabel}>{status.label}</span>
                <span className={styles.legendValue}>{status.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Total Activities Card */}
      <div className={styles.totalActivityCard}>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Total Activities</div>
          <div className={styles.cardValue}>{activitySummary.totalCount}</div>
        </div>
      </div>
    </div>
  );
};
