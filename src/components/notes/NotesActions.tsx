"use client";

import { Card, Button, Space } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useRbac } from "@/hooks/useRbac";
import { INote } from "@/providers/notes/context";

interface NotesActionsProps {
  note: INote | null;
  onAdd?: () => void;
  onEdit: () => void;
  onDelete: () => void;
  loading?: boolean;
}

export const NotesActions = ({
  note,
  onAdd,
  onEdit,
  onDelete,
  loading = false,
}: NotesActionsProps) => {
  const { can } = useRbac();

  return (
    <Card title="Actions" style={{ marginBottom: 16 }}>
      <Space>
        {can("create:note") && onAdd && (
          <Button type="primary" icon={<PlusOutlined />} onClick={onAdd} loading={loading}>
            Add Note
          </Button>
        )}
        {note && can("update:note") && (
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={onEdit}
            loading={loading}
          >
            Edit
          </Button>
        )}
        {note && can("delete:note") && (
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={onDelete}
            loading={loading}
          >
            Delete
          </Button>
        )}
      </Space>
    </Card>
  );
};
