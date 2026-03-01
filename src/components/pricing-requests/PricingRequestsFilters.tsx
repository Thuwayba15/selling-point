"use client";

import { useState } from "react";
import { Form, Button, Select } from "antd";
import { ClearOutlined } from "@ant-design/icons";
import { useStyles } from "./style";

interface PricingRequestsFiltersProps {
  onApplyFilters: (filters: { status?: number; priority?: number; assignedToId?: string }) => void;
  onClear: () => void;
}

const STATUS_OPTIONS = [
  { label: "Pending", value: 1 },
  { label: "In Progress", value: 2 },
  { label: "Completed", value: 3 },
];

const PRIORITY_OPTIONS = [
  { label: "Low", value: 1 },
  { label: "Medium", value: 2 },
  { label: "High", value: 3 },
  { label: "Urgent", value: 4 },
];

export const PricingRequestsFilters = ({
  onApplyFilters,
  onClear,
}: PricingRequestsFiltersProps) => {
  const [form] = Form.useForm();
  const { styles } = useStyles();
  const [status, setStatus] = useState<number | undefined>(undefined);
  const [priority, setPriority] = useState<number | undefined>(undefined);
  const [assignedToId, setAssignedToId] = useState<string | undefined>(undefined);

  const handleApply = () => {
    onApplyFilters({
      status,
      priority,
      assignedToId: assignedToId || undefined,
    });
  };

  const handleClear = () => {
    setStatus(undefined);
    setPriority(undefined);
    setAssignedToId(undefined);
    form.resetFields();
    onClear();
  };

  const hasActiveFilters = status || priority || assignedToId;

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
            placeholder="Priority"
            value={priority}
            onChange={setPriority}
            allowClear
            options={PRIORITY_OPTIONS}
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
