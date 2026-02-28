"use client";

import { useState } from "react";
import { Card, Form, Button, Select } from "antd";
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

  const opportunityOptions = opportunities.map((opp) => ({
    label: opp.title,
    value: opp.id,
  }));

  const handleApply = () => {
    onApplyFilters({
      status: status || undefined,
      clientId: clientId || undefined,
      opportunityId: opportunityId || undefined,
    });
  };

  const hasActiveFilters = status !== undefined || clientId || opportunityId;

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

          <Form.Item label="Client" className={styles.filterItem}>
            <Select
              placeholder="Filter by client"
              value={clientId}
              onChange={setClientId}
              allowClear
              options={clientOptions}
            />
          </Form.Item>

          <Form.Item label="Opportunity" className={styles.filterItem}>
            <Select
              placeholder="Filter by opportunity"
              value={opportunityId}
              onChange={setOpportunityId}
              allowClear
              options={opportunityOptions}
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
