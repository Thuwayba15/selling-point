"use client";

import { Card, Button, Space, App } from "antd";
import { EditOutlined, DeleteOutlined, StarOutlined } from "@ant-design/icons";
import { useRbac } from "@/hooks/useRbac";
import { IContact } from "@/providers/contacts/context";
import { useStyles } from "./style";

interface ContactActionsProps {
  contact: IContact | null;
  onEdit: () => void;
  onDelete: () => void;
  onSetPrimary: () => void;
}

export const ContactActions = ({
  contact,
  onEdit,
  onDelete,
  onSetPrimary,
}: ContactActionsProps) => {
  const { can } = useRbac();
  const { styles } = useStyles();
  const { modal, message } = App.useApp();

  const handleDelete = () => {
    if (!contact) return;

    modal.confirm({
      title: "Delete Contact",
      content: `Are you sure you want to delete ${contact.firstName} ${contact.lastName}?`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        await onDelete();
      },
    });
  };

  const handleSetPrimary = () => {
    if (!contact) return;

    if (contact.isPrimaryContact) {
      message.info("This contact is already the primary contact");
      return;
    }

    modal.confirm({
      title: "Set Primary Contact",
      content: `Set ${contact.firstName} ${contact.lastName} as the primary contact for this client?`,
      okText: "Confirm",
      cancelText: "Cancel",
      onOk: async () => {
        await onSetPrimary();
      },
    });
  };

  if (!contact) {
    return (
      <Card className={styles.actionsCard} title="Actions">
        <p>Select a contact to perform actions</p>
      </Card>
    );
  }

  return (
    <Card className={styles.actionsCard} title="Actions">
      <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
        {can("update:contact") && (
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={onEdit}
            block
          >
            Edit Contact
          </Button>
        )}

        {can("update:contact") && (
          <Button
            type="default"
            icon={<StarOutlined />}
            onClick={handleSetPrimary}
            disabled={contact.isPrimaryContact}
            block
          >
            {contact.isPrimaryContact ? "Primary Contact" : "Set as Primary"}
          </Button>
        )}

        {can("delete:contact") && (
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={handleDelete}
            block
          >
            Delete Contact
          </Button>
        )}
      </Space>
    </Card>
  );
};
