"use client";

import { useState } from "react";
import { Form, Input, Button, Select, Space } from "antd";
import { SearchOutlined, ClearOutlined } from "@ant-design/icons";
import { useStyles } from "./style";

interface ClientsFiltersProps {
  onApplyFilters: (filters: {
    searchTerm?: string;
    industry?: string;
    clientType?: number;
    isActive?: boolean;
  }) => void;
  onClear: () => void;
  initialSearchTerm?: string;
  initialIndustry?: string;
  initialClientType?: number;
  initialIsActive?: boolean;
}

const CLIENT_TYPES = [
  { label: "Government", value: 1 },
  { label: "Private", value: 2 },
  { label: "Partner", value: 3 },
];

const ACTIVE_OPTIONS = [
  { label: "Active", value: true },
  { label: "Inactive", value: false },
];

// Common industries - can be extended
const INDUSTRY_OPTIONS = [
  { label: "Technology", value: "Technology" },
  { label: "Finance", value: "Finance" },
  { label: "Healthcare", value: "Healthcare" },
  { label: "Manufacturing", value: "Manufacturing" },
  { label: "Retail", value: "Retail" },
  { label: "Education", value: "Education" },
  { label: "Other", value: "Other" },
];

export const ClientsFilters = ({
  onApplyFilters,
  onClear,
  initialSearchTerm = "",
  initialIndustry,
  initialClientType,
  initialIsActive,
}: ClientsFiltersProps) => {
  const [form] = Form.useForm();
  const { styles } = useStyles();
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [industry, setIndustry] = useState<string | undefined>(initialIndustry);
  const [clientType, setClientType] = useState<number | undefined>(initialClientType);
  const [isActive, setIsActive] = useState<boolean | undefined>(initialIsActive);

  const handleClear = () => {
    setSearchTerm("");
    setIndustry(undefined);
    setClientType(undefined);
    setIsActive(undefined);
    onClear();
  };

  const handleApply = () => {
    onApplyFilters({
      searchTerm: searchTerm || undefined,
      industry,
      clientType,
      isActive,
    });
  };

  const hasActiveFilters = searchTerm || industry || clientType !== undefined || isActive !== undefined;

  return (
    <div className={styles.inlineFiltersBar}>
      <Form form={form} layout="inline" className={styles.inlineFiltersForm}>
        <Form.Item className={styles.inlineFilterItem}>
          <Input
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<SearchOutlined />}
            allowClear
          />
        </Form.Item>

        <Form.Item className={styles.inlineFilterItem}>
          <Select
            placeholder="Industry"
            value={industry}
            onChange={setIndustry}
            allowClear
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={INDUSTRY_OPTIONS}
            style={{ minWidth: 140 }}
          />
        </Form.Item>

        <Form.Item className={styles.inlineFilterItem}>
          <Select
            placeholder="Type"
            value={clientType}
            onChange={setClientType}
            allowClear
            options={CLIENT_TYPES}
            style={{ minWidth: 140 }}
          />
        </Form.Item>

        <Form.Item className={styles.inlineFilterItem}>
          <Select
            placeholder="Status"
            value={isActive}
            onChange={setIsActive}
            allowClear
            options={ACTIVE_OPTIONS}
            style={{ minWidth: 140 }}
          />
        </Form.Item>

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
