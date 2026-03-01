import React from "react";
import type { ReactNode } from "react";
import { Table, Card, Tag, Button, Space, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { ActivityType, ActivityStatus, Priority } from "@/providers/activities/context";
import { useRbac } from "@/hooks/useRbac";
import { useStyles } from "./style";

export interface Activity {
  id: string;
  type: ActivityType;
  typeName?: string;
  subject: string;
  description?: string;
  priority: Priority;
  priorityName?: string;
  status: ActivityStatus;
  statusName?: string;
  dueDate: string;
  completedDate?: string;
  assignedToName?: string;
  relatedToTypeName?: string;
  relatedToName?: string;
  location?: string;
}

interface ActivitiesTableProps {
  activities: Activity[];
  loading: boolean;
  selectedId?: string;
  onSelect: (activity: Activity) => void;
  onEdit: (activity: Activity) => void;
  onDelete: (activity: Activity) => void;
  onComplete: (activity: Activity) => void;
  onCancel: (activity: Activity) => void;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  headerExtra?: ReactNode;
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

export const ActivitiesTable: React.FC<ActivitiesTableProps> = ({
  activities,
  loading,
  selectedId,
  onSelect,
  onEdit,
  onDelete,
  onComplete,
  onCancel,
  pagination,
  headerExtra,
}) => {
  const { styles } = useStyles();
  const { can } = useRbac();

  const canUpdate = can("update:activity");
  const canDelete = can("delete:activity");

  const columns: ColumnsType<Activity> = [
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      width: "25%",
      ellipsis: true,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: "12%",
      render: (type: ActivityType) => {
        const typeInfo = ACTIVITY_TYPE_MAP[type] || { label: "Unknown", color: "default" };
        return <Tag color={typeInfo.color}>{typeInfo.label}</Tag>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "12%",
      render: (status: ActivityStatus) => {
        const statusInfo = ACTIVITY_STATUS_MAP[status] || { label: "Unknown", color: "default" };
        return <Tag color={statusInfo.color}>{statusInfo.label}</Tag>;
      },
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      width: "10%",
      render: (priority: Priority) => {
        const priorityInfo = PRIORITY_MAP[priority] || { label: "Unknown", color: "default" };
        return <Tag color={priorityInfo.color}>{priorityInfo.label}</Tag>;
      },
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      width: "15%",
      render: (date: string) => (date ? dayjs(date).format("MMM DD, YYYY HH:mm") : "-"),
    },
    {
      title: "Assigned To",
      dataIndex: "assignedToName",
      key: "assignedToName",
      width: "15%",
      ellipsis: true,
    },
    {
      title: "Actions",
      key: "actions",
      width: "11%",
      render: (_, record) => {
        const isScheduled = record.status === ActivityStatus.Scheduled;
        const isCompleted = record.status === ActivityStatus.Completed;

        return (
          <Space size="small">
            {canUpdate && isScheduled && (
              <Tooltip title="Edit">
                <Button
                  type="text"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(record);
                  }}
                />
              </Tooltip>
            )}
            {canUpdate && isScheduled && (
              <Tooltip title="Mark Complete">
                <Button
                  type="text"
                  size="small"
                  icon={<CheckOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onComplete(record);
                  }}
                  style={{ color: "#52c41a" }}
                />
              </Tooltip>
            )}
            {canUpdate && isScheduled && (
              <Tooltip title="Cancel">
                <Button
                  type="text"
                  size="small"
                  icon={<CloseOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onCancel(record);
                  }}
                  danger
                />
              </Tooltip>
            )}
            {canDelete && !isCompleted && (
              <Tooltip title="Delete">
                <Button
                  type="text"
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(record);
                  }}
                  danger
                />
              </Tooltip>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <Card
      className={styles.tableCard}
      title="Select an item for more details"
      loading={loading}
      extra={headerExtra}
    >
      <Table<Activity>
        columns={columns}
        dataSource={activities}
        rowKey="id"
        loading={loading}
        scroll={{ x: "max-content" }}
        pagination={pagination}
        onRow={(record) => ({
          onClick: () => onSelect(record),
          className: selectedId === record.id ? styles.highlightedRow : styles.tableRow,
        })}
      />
    </Card>
  );
};
