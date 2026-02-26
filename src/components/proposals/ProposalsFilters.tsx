"use client";

import { useState } from "react";
import { Card, Form, Input, Button, Select } from "antd";
import { useStyles } from "./style";

interface ProposalsFiltersProps {
  onApplyFilters: (filters: {
    status?: number;
    clientId?: string;
    opportunityId?: string;
  }) => void;
}

const STATUS_OPTIONS = [
  { label: "Draft", value: 1 },
  { label: "Submitted", value: 2 },
  { label: "Rejected", value: 3 },
  { label: "Approved", value: 4 },
];

export const ProposalsFilters = ({ onApplyFilters }: ProposalsFiltersProps) => {
  const [form] = Form.useForm();
  const { styles } = useStyles();
  const [status, setStatus] = useState<number | undefined>(undefined);
  const [clientId, setClientId] = useState<string | undefined>(undefined);
  const [opportunityId, setOpportunityId] = useState<string | undefined>(undefined);

  const handleApply = () => {
    onApplyFilters({
      status: status || undefined,
      clientId: clientId || undefined,
      opportunityId: opportunityId || undefined,
    });
  };

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

          <Form.Item label="Client ID" className={styles.filterItem}>
            <Input
              placeholder="Filter by client ID"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              allowClear
            />
          </Form.Item>

          <Form.Item label="Opportunity ID" className={styles.filterItem}>
            <Input
              placeholder="Filter by opportunity ID"
              value={opportunityId}
              onChange={(e) => setOpportunityId(e.target.value)}
              allowClear
            />
          </Form.Item>

          <Form.Item label=" " className={styles.filterItem}>
            <Button type="primary" onClick={handleApply} block>
              Apply Filters
            </Button>
          </Form.Item>
        </div>
      </Form>
    </Card>
  );
};
