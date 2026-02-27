import React from "react";
import { Card, Tag, Spin, Empty } from "antd";
import dayjs from "dayjs";
import { ActivityType, ActivityStatus, Priority, IActivity } from "@/providers/activities/context";
import { useStyles } from "./style";

interface ActivityDetailsProps {
  activity?: IActivity;
  loading?: boolean;
}

const ACTIVITY_TYPE_MAP: Record<ActivityType, { label: string; color: string }> = {
  [ActivityType.Meeting]: { label: "Meeting", color: "blue" },
  [ActivityType.Call]: { label: "Call", color: "green" },
  [ActivityType.Email]: { label: "Email", color: "cyan" },
  [ActivityType.Task]: { label: "Task", color: "orange" },
  [ActivityType.Presentation]: { label: "Presentation", color: "purple" },
  [ActivityType.Other]: { label: "Other", color: "default" },
};

const ACTIVITY_STATUS_MAP: Record<ActivityStatus, { label: string; color: string }> = {
  [ActivityStatus.Scheduled]: { label: "Scheduled", color: "processing" },
  [ActivityStatus.Completed]: { label: "Completed", color: "success" },
  [ActivityStatus.Cancelled]: { label: "Cancelled", color: "default" },
};

const PRIORITY_MAP: Record<Priority, { label: string; color: string }> = {
  [Priority.Low]: { label: "Low", color: "default" },
  [Priority.Medium]: { label: "Medium", color: "blue" },
  [Priority.High]: { label: "High", color: "orange" },
  [Priority.Urgent]: { label: "Urgent", color: "red" },
};

export const ActivityDetails: React.FC<ActivityDetailsProps> = ({ activity, loading }) => {
  const { styles } = useStyles();

  if (loading) {
    return (
      <Card title="Activity Details" className={styles.detailsCard}>
        <Spin />
      </Card>
    );
  }

  if (!activity) {
    return (
      <Card title="Activity Details" className={styles.detailsCard}>
        <Empty description="Select an activity to view details" />
      </Card>
    );
  }

  const typeInfo = ACTIVITY_TYPE_MAP[activity.type] || { label: "Unknown", color: "default" };
  const statusInfo = ACTIVITY_STATUS_MAP[activity.status] || {
    label: "Unknown",
    color: "default",
  };
  const priorityInfo = PRIORITY_MAP[activity.priority] || {
    label: "Unknown",
    color: "default",
  };

  return (
    <Card title="Activity Details" className={styles.detailsCard}>
      <div className={styles.detailsSection}>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Subject:</span>
          <span className={styles.detailValue}>{activity.subject}</span>
        </div>

        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Type:</span>
          <span className={styles.detailValue}>
            <Tag color={typeInfo.color}>{typeInfo.label}</Tag>
          </span>
        </div>

        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Status:</span>
          <span className={styles.detailValue}>
            <Tag color={statusInfo.color}>{statusInfo.label}</Tag>
          </span>
        </div>

        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Priority:</span>
          <span className={styles.detailValue}>
            <Tag color={priorityInfo.color}>{priorityInfo.label}</Tag>
          </span>
        </div>

        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Due Date:</span>
          <span className={styles.detailValue}>
            {activity.dueDate ? dayjs(activity.dueDate).format("MMMM DD, YYYY HH:mm") : "-"}
          </span>
        </div>

        {activity.completedDate && (
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Completed Date:</span>
            <span className={styles.detailValue}>
              {dayjs(activity.completedDate).format("MMMM DD, YYYY HH:mm")}
            </span>
          </div>
        )}

        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Assigned To:</span>
          <span className={styles.detailValue}>{activity.assignedToName || "-"}</span>
        </div>

        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Created By:</span>
          <span className={styles.detailValue}>{activity.createdByName || "-"}</span>
        </div>

        {activity.relatedToTypeName && activity.relatedToName && (
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Related To:</span>
            <span className={styles.detailValue}>
              {activity.relatedToTypeName}: {activity.relatedToName}
            </span>
          </div>
        )}

        {activity.duration && (
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Duration:</span>
            <span className={styles.detailValue}>{activity.duration} minutes</span>
          </div>
        )}

        {activity.location && (
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Location:</span>
            <span className={styles.detailValue}>{activity.location}</span>
          </div>
        )}

        {activity.description && (
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Description:</span>
            <span className={styles.detailValue}>{activity.description}</span>
          </div>
        )}

        {activity.outcome && (
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Outcome:</span>
            <span className={styles.detailValue}>{activity.outcome}</span>
          </div>
        )}

        {activity.createdAt && (
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Created:</span>
            <span className={styles.detailValue}>
              {dayjs(activity.createdAt).format("MMMM DD, YYYY HH:mm")}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};
