import React, { useState } from "react";
import { Card, Button, Space, App } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRbac } from "@/hooks/useRbac";
import { useStyles } from "./style";

interface ClientActionsProps {
  clientId: string;
  clientName: string;
  onEdit: () => void;
  onDelete: () => Promise<void>;
}

export const ClientActions: React.FC<ClientActionsProps> = ({
  clientId,
  clientName,
  onEdit,
  onDelete,
}) => {
  const { styles } = useStyles();
  const { can } = useRbac();
  const { modal, message } = App.useApp();
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Only Admin and SalesManager can delete
  const canDelete = can("delete:client");
  const canEdit = can("update:client");

  const handleDeleteClick = () => {
    modal.confirm({
      title: "Delete Client",
      content: `Are you sure you want to delete "${clientName}"? This action cannot be undone.`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          setDeleteLoading(true);
          await onDelete();
          message.success("Client deleted successfully");
        } catch (error) {
          message.error("Failed to delete client");
        } finally {
          setDeleteLoading(false);
        }
      },
    });
  };

  return (
    <Card title="Actions" className={styles.actionsCard}>
      <Space orientation="vertical" className={styles.actionsStack}>
        {canEdit && (
          <Button type="primary" icon={<EditOutlined />} block onClick={onEdit}>
            Edit Client
          </Button>
        )}
        {canDelete && (
          <Button
            danger
            icon={<DeleteOutlined />}
            block
            loading={deleteLoading}
            onClick={handleDeleteClick}
          >
            Delete Client
          </Button>
        )}
        {!canEdit && !canDelete && (
          <div style={{ color: '#999', fontStyle: 'italic', fontSize: '12px' }}>
            No actions available for your role
          </div>
        )}
      </Space>
    </Card>
  );
};
