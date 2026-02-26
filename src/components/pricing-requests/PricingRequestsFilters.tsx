"use client";

import { useState } from "react";
import { Card, Form, Input, Button, Select } from "antd";
import { SearchOutlined, ClearOutlined } from "@ant-design/icons";
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

  const hasActiveFilters = status || priority || assignedToId;

  return (
    <Card className={styles.filtersCard} title="Filters">
      <Form form={form} layout="vertical">
        <div className={styles.filtersRow}>
          <Form.Item label="Status" className={styles.filterItem}>
            <Select
              placeholder="Filter by status"
              value={status}
              onChange={setStatus}
              allowClear
              options={STATUS_OPTIONS}
            />
          </Form.Item>

          <Form.Item label="Priority" className={styles.filterItem}>
            <Select
              placeholder="Filter by priority"
              value={priority}
              onChange={setPriority}
              allowClear
              options={PRIORITY_OPTIONS}
            />
          </Form.Item>

          <Form.Item label="Assigned To ID" className={styles.filterItem}>
            <Input
              placeholder="Assigned user id"
              value={assignedToId}
              onChange={(e) => setAssignedToId(e.target.value)}
              allowClear
            />
          </Form.Item>

          <Form.Item label=" " className={styles.filterItem}>
            <div className={styles.filtersActions}>
              <Button type="primary" onClick={handleApply}>
                Apply Filters
              </Button>
              {hasActiveFilters && (
                <Button icon={<ClearOutlined />} onClick={onClear} danger>
                  Clear Filters
                </Button>
              )}
            </div>
          </Form.Item>
        </div>
      </Form>
    </Card>
  );
};
