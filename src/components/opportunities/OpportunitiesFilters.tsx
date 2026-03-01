"use client";

import { useState } from "react";
import { Form, Input, Button, Select, Switch, Space } from "antd";
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
    <div className={styles.inlineFiltersBar}>
      <Form form={form} layout="inline" className={styles.inlineFiltersForm}>
        <Form.Item className={styles.inlineFilterItem}>
          <Input
            placeholder="Search by title, client, owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<SearchOutlined />}
            allowClear
          />
        </Form.Item>

        <Form.Item className={styles.inlineFilterItem}>
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
            style={{ minWidth: 140 }}
          />
        </Form.Item>

        <Form.Item className={styles.inlineFilterItem}>
          <Select
            placeholder="Stage"
            value={stage}
            onChange={setStage}
            allowClear
            options={STAGE_OPTIONS}
            style={{ minWidth: 140 }}
          />
        </Form.Item>

        {showMyOpportunitiesToggle && (
          <Form.Item className={styles.inlineFilterItem}>
            <Switch
              checked={showMyOpportunities}
              onChange={onShowMyOpportunitiesChange}
              checkedChildren="My"
              unCheckedChildren="All"
            />
          </Form.Item>
        )}

        <Form.Item className={styles.inlineFilterActionsItem}>
          <Space size="small">
            <Button type="primary" onClick={handleApply}>
              Apply
            </Button>
            {hasActiveFilters && (
              <Button icon={<ClearOutlined />} onClick={handleClear} danger />
            )}
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

