"use client";

import { useState } from "react";
import { Form, Input, Button, Select } from "antd";
import { SearchOutlined, ClearOutlined } from "@ant-design/icons";
import { useStyles } from "./style";

interface ContactsFiltersProps {
  onApplyFilters: (filters: { searchTerm?: string; clientId?: string }) => void;
  onClear: () => void;
  clients?: Array<{ id: string; name: string }>;
}

export const ContactsFilters = ({
  onApplyFilters,
  onClear,
  clients = [],
}: ContactsFiltersProps) => {
  const [form] = Form.useForm();
  const { styles } = useStyles();
  const [searchTerm, setSearchTerm] = useState("");
  const [clientId, setClientId] = useState<string | undefined>(undefined);

  const handleApply = () => {
    onApplyFilters({
      searchTerm: searchTerm || undefined,
      clientId,
    });
  };

  const handleClear = () => {
    setSearchTerm("");
    setClientId(undefined);
    form.resetFields();
    onClear();
  };

  const hasActiveFilters = searchTerm || clientId;

  return (
    <div className={styles.workspaceFiltersBar}>
      <Form form={form} layout="inline" className={styles.workspaceFiltersForm}>
        <Form.Item className={styles.workspaceFilterItem}>
          <Input
            placeholder="Search by name, email, position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<SearchOutlined />}
            allowClear
            className={styles.workspaceFilterSelect}
          />
        </Form.Item>

        <Form.Item className={styles.workspaceFilterItem}>
          <Select
            placeholder="Client"
            value={clientId}
            onChange={setClientId}
            allowClear
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={clients.map((client) => ({
              value: client.id,
              label: client.name,
            }))}
            className={styles.workspaceFilterSelect}
          />
        </Form.Item>

        <Form.Item className={styles.workspaceFilterActionsItem}>
          <div className={styles.workspaceFiltersActions}>
            <Button type="primary" onClick={handleApply}>
              Apply
            </Button>
            {hasActiveFilters && <Button icon={<ClearOutlined />} onClick={handleClear} danger />}
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};
