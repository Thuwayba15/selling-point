"use client";

import { useState, useEffect } from "react";
import { Card, Form, Input, Button, Select } from "antd";
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

  const hasActiveFilters = searchTerm || clientId;

  return (
    <Card className={styles.filtersCard} title="Filters">
      <Form form={form} layout="vertical">
        <div className={styles.filtersRow}>
          <Form.Item label="Search" className={styles.filterItem}>
            <Input
              placeholder="Search by name, email, position..."
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
