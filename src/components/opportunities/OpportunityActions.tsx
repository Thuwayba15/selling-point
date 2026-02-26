"use client";

import { Card, Button, Space, App } from "antd";
import { EditOutlined, DeleteOutlined, SwapOutlined, UserAddOutlined } from "@ant-design/icons";
import { useRbac } from "@/hooks/useRbac";
import { IOpportunity } from "@/providers/opportunities/context";
import { useStyles } from "./style";

interface OpportunityActionsProps {
  opportunity: IOpportunity | null;
  onEdit: () => void;
  onDelete: () => void;
  onUpdateStage: () => void;
  onAssign: () => void;
}

export const OpportunityActions = ({
  opportunity,
  onEdit,
  onDelete,
  onUpdateStage,
  onAssign,
}: OpportunityActionsProps) => {
  const { can } = useRbac();
  const { styles } = useStyles();
  const { modal } = App.useApp();

  const handleDelete = () => {
    if (!opportunity) return;

    modal.confirm({
      title: "Delete Opportunity",
      content: `Are you sure you want to delete ${opportunity.title}?`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        await onDelete();
      },
    });
  };

  if (!opportunity) {
    return (
      <Card className={styles.actionsCard} title="Actions">
        <p>Select an opportunity to perform actions</p>
      </Card>
    );
  }

  return (
    <Card className={styles.actionsCard} title="Actions">
      <Space orientation="vertical" size="middle" className={styles.actionsStack}>
        {can("update:opportunity") && (
          <Button type="default" icon={<EditOutlined />} onClick={onEdit} block>
            Edit Opportunity
          </Button>
        )}

        {can("update:opportunity") && (
          <Button type="default" icon={<SwapOutlined />} onClick={onUpdateStage} block>
            Update Stage
          </Button>
        )}

        {can("assign:opportunity") && (
          <Button type="default" icon={<UserAddOutlined />} onClick={onAssign} block>
            Assign Opportunity
          </Button>
        )}

        {can("delete:opportunity") && (
          <Button type="primary" danger icon={<DeleteOutlined />} onClick={handleDelete} block>
            Delete Opportunity
          </Button>
        )}
      </Space>
    </Card>
  );
};
