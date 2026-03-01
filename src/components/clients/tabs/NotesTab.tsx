"use client";

import { Table, Button, Space, Card, Empty, Tag } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useRbac } from "@/hooks/useRbac";
import type { INote } from "@/providers/notes/context";

interface NotesTabProps {
  notes: INote[];
  loading?: boolean;
  onEdit: (note: INote) => void;
  onDelete: (note: INote) => Promise<void>;
}

const PRIORITY_COLORS: Record<string, string> = {
  Low: "blue",
  Medium: "orange",
  High: "red",
};

export const NotesTab = ({ notes, loading = false, onEdit, onDelete }: NotesTabProps) => {
  const { can } = useRbac();

  const columns: ColumnsType<INote> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (title) => title || "—",
    },
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
      render: (content) => {
        if (!content) return "—";
        const text = content.substring(0, 100);
        return text.length < content.length ? `${text}...` : text;
      },
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (priority) => {
        const color = PRIORITY_COLORS[priority] || "default";
        return <Tag color={color}>{priority || "—"}</Tag>;
      },
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "—"),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space size="small">
          {can("update:note") && (
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              title="Edit"
            />
          )}
          {can("delete:note") && (
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(record)}
              title="Delete"
            />
          )}
        </Space>
      ),
    },
  ];

  if (notes.length === 0) {
    return <Empty description="No notes found" />;
  }

  return (
    <Card
      style={{
        border: "none",
        boxShadow: "none",
      }}
    >
      <Table<INote>
        columns={columns}
        dataSource={notes}
        loading={loading}
        rowKey="id"
        pagination={false}
      />
    </Card>
  );
};
