"use client";

import { useState } from "react";
import { Form, Button, Select } from "antd";
import { ClearOutlined } from "@ant-design/icons";
import { useStyles } from "./style";

interface ContractsFiltersProps {
  clients: Array<{ id: string; name: string }>;
  onApplyFilters: (filters: { status?: number; clientId?: string }) => void;
  onClear: () => void;
}

const STATUS_OPTIONS = [
  { label: "Draft", value: 1 },
  { label: "Active", value: 2 },
  { label: "Expired", value: 3 },
  { label: "Renewed", value: 4 },
  { label: "Cancelled", value: 5 },
];

export const ContractsFilters = ({
  clients,
  onApplyFilters,
  onClear,
}: ContractsFiltersProps) => {
  const [form] = Form.useForm();
  const { styles } = useStyles();
  const [status, setStatus] = useState<number | undefined>(undefined);
  const [clientId, setClientId] = useState<string | undefined>(undefined);

  const clientOptions = clients.map((client) => ({
    label: client.name,
    value: client.id,
  }));

  const handleApply = () => {
    onApplyFilters({
      status: status || undefined,
      clientId: clientId || undefined,
    });
  };

  const handleClear = () => {
    setStatus(undefined);
    setClientId(undefined);
    form.resetFields();
    onClear();
  };

  const hasActiveFilters = status !== undefined || clientId;

  return (
    <div className={styles.workspaceFiltersBar}>
      <Form form={form} layout="inline" className={styles.workspaceFiltersForm}>
        <Form.Item className={styles.workspaceFilterItem}>
          <Select
            placeholder="Status"
            value={status}
            onChange={setStatus}
            allowClear
            options={STATUS_OPTIONS}
            className={styles.workspaceFilterSelect}
          />
        </Form.Item>

        <Form.Item className={styles.workspaceFilterItem}>
          <Select
            placeholder="Client"
            value={clientId}
            onChange={setClientId}
            allowClear
            options={clientOptions}
            className={styles.workspaceFilterSelect}
          />
        </Form.Item>

        <Form.Item className={styles.workspaceFilterActionsItem}>
          <div className={styles.workspaceFiltersActions}>
            <Button type="primary" onClick={handleApply}>
              Apply
            </Button>
            {hasActiveFilters && (
              <Button icon={<ClearOutlined />} onClick={handleClear} danger />
            )}
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};
