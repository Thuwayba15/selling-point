"use client";

import { useState } from "react";
import { Card, Form, Input, Button, Select, Switch } from "antd";
import { SearchOutlined, ClearOutlined } from "@ant-design/icons";
import { useStyles } from "./style";

interface OpportunitiesFiltersProps {
  onApplyFilters: (filters: {
    searchTerm?: string;
    clientId?: string;
    stage?: number;
    ownerId?: string;
  }) => void;
  onClear: () => void;
  clients?: Array<{ id: string; name: string }>;
  showMyOpportunities?: boolean;
  onShowMyOpportunitiesChange?: (value: boolean) => void;
  showMyOpportunitiesToggle?: boolean;
  initialSearchTerm?: string;
  initialClientId?: string;
  initialStage?: number;
  initialOwnerId?: string;
}

const STAGE_OPTIONS = [
  { label: "Lead", value: 1 },
  { label: "Qualified", value: 2 },
  { label: "Proposal", value: 3 },
  { label: "Negotiation", value: 4 },
  { label: "Closed Won", value: 5 },
  { label: "Closed Lost", value: 6 },
];

export const OpportunitiesFilters = ({
  onApplyFilters,
  onClear,
  clients = [],
  showMyOpportunities = false,
  onShowMyOpportunitiesChange,
  showMyOpportunitiesToggle = false,
  initialSearchTerm = "",
  initialClientId,
  initialStage,
  initialOwnerId,
}: OpportunitiesFiltersProps) => {
  const [form] = Form.useForm();
  const { styles } = useStyles();
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [clientId, setClientId] = useState<string | undefined>(initialClientId);
  const [stage, setStage] = useState<number | undefined>(initialStage);
  const [ownerId, setOwnerId] = useState<string | undefined>(initialOwnerId);

  const handleClear = () => {
    setSearchTerm("");
    setClientId(undefined);
    setStage(undefined);
    setOwnerId(undefined);
    onClear();
  };

  const handleApply = () => {
    onApplyFilters({
      searchTerm: searchTerm || undefined,
      clientId,
      stage,
      ownerId: ownerId || undefined,
    });
  };

  const hasActiveFilters = searchTerm || clientId || stage || ownerId;

  return (
    <Card className={styles.filtersCard} title="Filters">
      <Form form={form} layout="vertical">
        <div className={styles.filtersRow}>
          <Form.Item label="Search" className={styles.filterItem}>
            <Input
              placeholder="Search by title, client, owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Form.Item>

          <Form.Item label="Client" className={styles.filterItem}>
            <Select
              placeholder="Filter by client"
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
            />
          </Form.Item>

          <Form.Item label="Stage" className={styles.filterItem}>
            <Select
              placeholder="Filter by stage"
              value={stage}
              onChange={setStage}
              allowClear
              options={STAGE_OPTIONS}
            />
          </Form.Item>

          {showMyOpportunitiesToggle && (
            <Form.Item label="My Opportunities" className={styles.filterItem}>
              <Switch checked={showMyOpportunities} onChange={onShowMyOpportunitiesChange} />
            </Form.Item>
          )}

          <Form.Item label=" " className={styles.filterItem}>
            <div className={styles.filtersActions}>
              <Button type="primary" onClick={handleApply}>
                Apply Filters
              </Button>
              {hasActiveFilters && (
                <Button icon={<ClearOutlined />} onClick={handleClear} danger>
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
