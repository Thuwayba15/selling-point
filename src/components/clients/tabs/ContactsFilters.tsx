"use client";

import { Input, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useStyles } from "../style";

interface ContactsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const ContactsFilters = ({ searchTerm, onSearchChange }: ContactsFiltersProps) => {
  const { styles } = useStyles();

  return (
    <Space style={{ marginBottom: "16px" }}>
      <Input
        placeholder="Search contacts..."
        prefix={<SearchOutlined />}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        allowClear
        style={{ width: "300px" }}
      />
    </Space>
  );
};
