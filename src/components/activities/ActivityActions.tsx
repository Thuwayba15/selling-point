import React from "react";
import { Card, Button, Space } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useRbac } from "@/hooks/useRbac";
import { ActivityStatus, IActivity } from "@/providers/activities/context";
import { useStyles } from "./style";

interface ActivityActionsProps {
  activity?: IActivity;
  onEdit: () => void;
  onDelete: () => void;
  onComplete: () => void;
  onCancel: () => void;
  onViewParticipants: () => void;
  loading?: boolean;
}

export const ActivityActions: React.FC<ActivityActionsProps> = ({
  activity,
  onEdit,
  onDelete,
  onComplete,
  onCancel,
  onViewParticipants,
  loading,
}) => {
  const { styles } = useStyles();
  const { can } = useRbac();

  const canUpdate = can("update:activity");
  const canDelete = can("delete:activity");

  if (!activity) {
    return null;
  }

  const isScheduled = activity.status === ActivityStatus.Scheduled;
  const isCompleted = activity.status === ActivityStatus.Completed;
  const isCancelled = activity.status === ActivityStatus.Cancelled;

  return (
    <Card title="Actions" className={styles.actionsCard}>
      <Space orientation="vertical" style={{ width: "100%" }}>
        {canUpdate && isScheduled && (
          <Button
            icon={<EditOutlined />}
            onClick={onEdit}
            loading={loading}
            className={styles.actionButton}
          >
            Edit Activity
          </Button>
        )}

        {canUpdate && isScheduled && (
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={onComplete}
            loading={loading}
            className={styles.actionButton}
          >
            Mark Complete
          </Button>
        )}

        {canUpdate && isScheduled && (
          <Button
            danger
            icon={<CloseOutlined />}
            onClick={onCancel}
            loading={loading}
            className={styles.actionButton}
          >
            Cancel Activity
          </Button>
        )}

        {canDelete && !isCompleted && (
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={onDelete}
            loading={loading}
            className={styles.actionButton}
          >
            Delete Activity
          </Button>
        )}
      </Space>
    </Card>
  );
};
