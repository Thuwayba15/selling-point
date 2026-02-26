"use client";

import { Card, Select, Space, Button } from "antd";
import { ClearOutlined } from "@ant-design/icons";
import { useStyles } from "./style";

interface ContractsFiltersProps {
  status?: number;
  clientId?: string;
  onStatusChange: (status: number | undefined) => void;
  onClientIdChange: (clientId: string | undefined) => void;
  onClear: () => void;
  clients?: Array<{ id: string; name: string }>;
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
  onClear,
  clients = [],
}: ContractsFiltersProps) => {
  const { styles } = useStyles();

  const clientOptions = [
    { label: "All Clients", value: undefined },
    ...clients.map((client) => ({ label: client.name, value: client.id })),
  ];

  const hasActiveFilters = status !== undefined || clientId !== undefined;

  return (
    <Card className={styles.filtersCard} title="Filters">
      <div className={styles.filtersRow}>
        <div className={styles.filterItem}>
          <label>Status</label>
          <Select
            options={STATUS_OPTIONS}
            value={status}
            onChange={onStatusChange}
            style={{ width: "100%" }}
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
            style={{ width: "100%" }}
          />
        </div>
        {hasActiveFilters && (
          <Button
            icon={<ClearOutlined />}
            onClick={onClear}
            danger
          >
            Clear Filters
          </Button>
        )}
      </div>
    </Card>
  );
};
