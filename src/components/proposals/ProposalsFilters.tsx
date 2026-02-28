"use client";

import { useState } from "react";
import { Form, Button, Select } from "antd";
import { ClearOutlined } from "@ant-design/icons";
import { useStyles } from "./style";

interface ProposalsFiltersProps {
  clients: Array<{ id: string; name: string }>;
  opportunities: Array<{ id: string; title: string }>;
  onApplyFilters: (filters: { status?: number; clientId?: string; opportunityId?: string }) => void;
  onClear: () => void;
}

const STATUS_OPTIONS = [
  { label: "Draft", value: 1 },
  { label: "Submitted", value: 2 },
  { label: "Rejected", value: 3 },
  { label: "Approved", value: 4 },
];

export const ProposalsFilters = ({ 
  clients, 
  opportunities, 
  onApplyFilters, 
  onClear 
}: ProposalsFiltersProps) => {
  const [form] = Form.useForm();
  const { styles } = useStyles();
  const [status, setStatus] = useState<number | undefined>(undefined);
  const [clientId, setClientId] = useState<string | undefined>(undefined);
  const [opportunityId, setOpportunityId] = useState<string | undefined>(undefined);

  const clientOptions = clients.map((client) => ({
    label: client.name,
    value: client.id,
  }));

  const handleApply = () => {
    onApplyFilters({
      status: status || undefined,
      clientId: clientId || undefined,
      opportunityId: opportunityId || undefined,
    });
  };

  const handleClear = () => {
    setStatus(undefined);
    setClientId(undefined);
    setOpportunityId(undefined);
    form.resetFields();
    onClear();
  };

  const hasActiveFilters = status !== undefined || clientId || opportunityId;

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
