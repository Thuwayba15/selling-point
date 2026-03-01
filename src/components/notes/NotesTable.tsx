"use client";

import React from "react";
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import type { INote } from "@/providers/notes/context";
import { Typography } from "antd";

const { Text } = Typography;

const relatedTypeLabelMap: Record<number, string> = {
  1: "Client",
  2: "Opportunity",
  3: "Proposal",
  4: "Contract",
  5: "Activity",
};

interface NotesTableProps {
  notes: INote[];
  loading?: boolean;
  onSelectNote?: (note: INote) => void;
  selectedNoteId?: string;
}

export const NotesTable: React.FC<NotesTableProps> = ({
  notes,
  loading = false,
  onSelectNote,
  selectedNoteId,
}) => {
  const columns: ColumnsType<INote> = [
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
      ellipsis: true,
      render: (value: string) => <Text ellipsis={{ tooltip: value }}>{value || "—"}</Text>,
    },
    {
      title: "Related To Type",
      dataIndex: "relatedToType",
      key: "relatedToType",
      render: (value: number) => relatedTypeLabelMap[value] || value,
    },
    {
      title: "Created By",
      dataIndex: "createdByName",
      key: "createdByName",
      render: (value: string | undefined) => value || "Unknown",
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value?: string) => (value ? dayjs(value).format("MMM DD, YYYY HH:mm") : "—"),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={notes}
      rowKey="id"
      loading={loading}
      expandable={{
        rowExpandable: (record) => Boolean(record.content?.trim()),
        expandedRowRender: (record) => (
          <Text type="secondary">{record.content?.trim() || "No content"}</Text>
        ),
      }}
      pagination={{
        current: 1,
        pageSize: Math.max(notes.length, 1),
        total: notes.length,
        onChange: () => undefined,
        showSizeChanger: false,
      }}
      onRow={(record) => ({
        onClick: () => onSelectNote?.(record),
        style: {
          cursor: onSelectNote ? "pointer" : "default",
          backgroundColor: record.id === selectedNoteId ? "#f0f0f0" : undefined,
        },
      })}
    />
  );
};
