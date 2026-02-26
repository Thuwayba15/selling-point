"use client";

import { useState } from "react";
import { Card, Form, Input, Button, Select, Switch } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useStyles } from "./style";

interface OpportunitiesFiltersProps {
  onApplyFilters: (filters: {
    searchTerm?: string;
    clientId?: string;
    stage?: number;
    ownerId?: string;
  }) => void;
  clients?: Array<{ id: string; name: string }>;
  showMyOpportunities?: boolean;
  onShowMyOpportunitiesChange?: (value: boolean) => void;
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
  clients = [],
  showMyOpportunities = false,
  onShowMyOpportunitiesChange,
}: OpportunitiesFiltersProps) => {
  const [form] = Form.useForm();
  const { styles } = useStyles();
  const [searchTerm, setSearchTerm] = useState("");
  const [clientId, setClientId] = useState<string | undefined>(undefined);
  const [stage, setStage] = useState<number | undefined>(undefined);
  const [ownerId, setOwnerId] = useState<string | undefined>(undefined);

  const handleApply = () => {
    onApplyFilters({
      searchTerm: searchTerm || undefined,
      clientId,
      stage,
      ownerId: ownerId || undefined,
    });
  };

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

          <Form.Item label="Owner ID" className={styles.filterItem}>
            <Input
              placeholder="Owner user id"
              value={ownerId}
              onChange={(e) => setOwnerId(e.target.value)}
              allowClear
            />
          </Form.Item>

          <Form.Item label="My Opportunities" className={styles.filterItem}>
            <Switch
              checked={showMyOpportunities}
              onChange={onShowMyOpportunitiesChange}
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
