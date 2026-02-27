import React from "react";
import { Card, Form, Input, Select, Button } from "antd";
import { SearchOutlined, ClearOutlined } from "@ant-design/icons";
import { useStyles } from "./style";

interface ClientsFiltersProps {
  searchTerm: string;
  industry: string | undefined;
  clientType: number | undefined;
  isActive: boolean | undefined;
  onSearchChange: (value: string) => void;
  onIndustryChange: (value: string | undefined) => void;
  onClientTypeChange: (value: number | undefined) => void;
  onActiveChange: (value: boolean | undefined) => void;
  onApplyFilters: () => void;
  onClear: () => void;
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

export const ClientsFilters: React.FC<ClientsFiltersProps> = ({
  searchTerm,
  industry,
  clientType,
  isActive,
  onSearchChange,
  onIndustryChange,
  onClientTypeChange,
  onActiveChange,
  onApplyFilters,
  onClear,
}) => {
  const { styles } = useStyles();

  return (
    <Card className={styles.filtersCard}>
      <div className={styles.filtersRow}>
        <div className={styles.filterItem}>
          <Form.Item label="Search" className={styles.formItemNoBorder}>
            <Input
              placeholder="Search by name..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              allowClear
            />
          </Form.Item>
        </div>

        <div className={styles.filterItem}>
          <Form.Item label="Industry" className={styles.formItemNoBorder}>
            <Select
              placeholder="All industries"
              value={industry}
              onChange={onIndustryChange}
              options={INDUSTRY_OPTIONS}
              allowClear
              showSearch
            />
          </Form.Item>
        </div>

        <div className={styles.filterItem}>
          <Form.Item label="Type" className={styles.formItemNoBorder}>
            <Select
              placeholder="All types"
              value={clientType}
              onChange={onClientTypeChange}
              options={CLIENT_TYPES}
              allowClear
            />
          </Form.Item>
        </div>

        <div className={styles.filterItem}>
          <Form.Item label="Status" className={styles.formItemNoBorder}>
            <Select
              placeholder="All statuses"
              value={isActive}
              onChange={onActiveChange}
              options={ACTIVE_OPTIONS}
              allowClear
            />
          </Form.Item>
        </div>

        <div className={styles.filtersActions}>
          <Button type="primary" onClick={onApplyFilters}>
            Apply Filters
          </Button>
          {(searchTerm || industry || clientType !== undefined || isActive !== undefined) && (
            <Button icon={<ClearOutlined />} onClick={onClear} danger>
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
