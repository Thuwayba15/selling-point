"use client";

import { Card, Select, Button } from "antd";
import { ClearOutlined } from "@ant-design/icons";
import { useStyles } from "./style";

interface ContractsFiltersProps {
  status?: number;
  clientId?: string;
  onStatusChange: (status: number | undefined) => void;
  onClientIdChange: (clientId: string | undefined) => void;
  onApplyFilters: () => void;
  onClear: () => void;
  clients?: Array<{ id: string; name: string }>;
  compact?: boolean;
}

const STATUS_OPTIONS = [
  { label: "All Statuses", value: undefined },
  { label: "Draft", value: 1 },
  { label: "Active", value: 2 },
  { label: "Expired", value: 3 },
  { label: "Renewed", value: 4 },
  { label: "Cancelled", value: 5 },
];

export const ContractsFilters = ({
  status,
  clientId,
  onStatusChange,
  onClientIdChange,
  onApplyFilters,
  onClear,
  clients = [],
  compact = false,
}: ContractsFiltersProps) => {
  const { styles } = useStyles();

  const clientOptions = [
    { label: "All Clients", value: undefined },
    ...clients.map((client) => ({ label: client.name, value: client.id })),
  ];

  const hasActiveFilters = status !== undefined || clientId !== undefined;

  if (compact) {
    return (
      <div className={styles.workspaceFiltersBar}>
        <div className={styles.workspaceFiltersForm}>
          <div className={styles.workspaceFilterItem}>
            <Select
              options={STATUS_OPTIONS.filter((opt) => opt.value !== undefined)}
              value={status}
              onChange={onStatusChange}
              placeholder="Status"
              allowClear
              className={styles.workspaceFilterSelect}
            />
          </div>
          <div className={styles.workspaceFilterItem}>
            <Select
              options={clients.map((client) => ({ label: client.name, value: client.id }))}
              value={clientId}
              onChange={onClientIdChange}
              placeholder="Client"
              allowClear
              className={styles.workspaceFilterSelect}
            />
          </div>
          <div className={styles.workspaceFiltersActions}>
            <Button type="primary" onClick={onApplyFilters}>
              Apply
            </Button>
            {hasActiveFilters && <Button icon={<ClearOutlined />} onClick={onClear} danger />}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className={styles.filtersCard} title="Filters">
      <div className={styles.filtersRow}>
        <div className={styles.filterItem}>
          <label>Status</label>
          <Select
            options={STATUS_OPTIONS}
            value={status}
            onChange={onStatusChange}
            className={styles.fullWidthControl}
          />
        </div>
        <div className={styles.filterItem}>
          <label>Client</label>
          <Select
            options={clientOptions}
            value={clientId}
            onChange={onClientIdChange}
            placeholder="Select a client"
            allowClear
            className={styles.fullWidthControl}
          />
        </div>
        <div className={styles.filtersActions}>
          <Button type="primary" onClick={onApplyFilters}>
            Apply Filters
          </Button>
          {hasActiveFilters && (
            <Button icon={<ClearOutlined />} onClick={onClear} danger>
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
