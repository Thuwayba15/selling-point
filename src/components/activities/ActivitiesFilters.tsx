"use client";

import { useState } from "react";
import { Form, Select, Button, Space } from "antd";
import { ClearOutlined } from "@ant-design/icons";
import {
  ActivityType,
  ActivityStatus,
  Priority,
  RelatedToType,
} from "@/providers/activities/context";
import { useStyles } from "./style";

interface ActivitiesFiltersProps {
  onApply: (filters: {
    type?: ActivityType;
    status?: ActivityStatus;
    priority?: Priority;
    assignedToId?: string;
    relatedToType?: RelatedToType;
    relatedToId?: string;
  }) => void;
  onClear: () => void;
  loading?: boolean;
  users?: Array<{ id: string; firstName: string; lastName: string }>;
  clients?: Array<{ id: string; name: string }>;
  opportunities?: Array<{ id: string; title: string }>;
  proposals?: Array<{ id: string; title: string }>;
  contracts?: Array<{ id: string; title: string }>;
}

const ACTIVITY_TYPE_OPTIONS = [
  { value: ActivityType.Meeting, label: "Meeting" },
  { value: ActivityType.Call, label: "Call" },
  { value: ActivityType.Email, label: "Email" },
  { value: ActivityType.Task, label: "Task" },
  { value: ActivityType.Presentation, label: "Presentation" },
  { value: ActivityType.Other, label: "Other" },
];

const ACTIVITY_STATUS_OPTIONS = [
  { value: ActivityStatus.Scheduled, label: "Scheduled" },
  { value: ActivityStatus.Completed, label: "Completed" },
  { value: ActivityStatus.Cancelled, label: "Cancelled" },
];

const PRIORITY_OPTIONS = [
  { value: Priority.Low, label: "Low" },
  { value: Priority.Medium, label: "Medium" },
  { value: Priority.High, label: "High" },
  { value: Priority.Urgent, label: "Urgent" },
];

const RELATED_TO_TYPE_OPTIONS = [
  { value: RelatedToType.Client, label: "Client" },
  { value: RelatedToType.Opportunity, label: "Opportunity" },
  { value: RelatedToType.Proposal, label: "Proposal" },
  { value: RelatedToType.Contract, label: "Contract" },
  { value: RelatedToType.Activity, label: "Activity" },
];

export const ActivitiesFilters: React.FC<ActivitiesFiltersProps> = ({
  onApply,
  onClear,
  loading,
  users = [],
  clients = [],
  opportunities = [],
  proposals = [],
  contracts = [],
}) => {
  const { styles } = useStyles();
  const [form] = Form.useForm();
  const [type, setType] = useState<ActivityType | undefined>(undefined);
  const [status, setStatus] = useState<ActivityStatus | undefined>(undefined);
  const [priority, setPriority] = useState<Priority | undefined>(undefined);
  const [assignedToId, setAssignedToId] = useState<string | undefined>(undefined);
  const [relatedToType, setRelatedToType] = useState<RelatedToType | undefined>(undefined);
  const [relatedToId, setRelatedToId] = useState<string | undefined>(undefined);

  const handleApply = () => {
    onApply({
      type,
      status,
      priority,
      assignedToId,
      relatedToType,
      relatedToId,
    });
  };

  const handleClear = () => {
    setType(undefined);
    setStatus(undefined);
    setPriority(undefined);
    setAssignedToId(undefined);
    setRelatedToType(undefined);
    setRelatedToId(undefined);
    form.resetFields();
    onClear();
  };

  // When relatedToType changes, clear relatedToId
  const handleRelatedToTypeChange = (value: RelatedToType | undefined) => {
    setRelatedToType(value);
    setRelatedToId(undefined);
  };

  // Get options for relatedToId based on relatedToType
  const getRelatedToOptions = () => {
    switch (relatedToType) {
      case RelatedToType.Client:
        return clients.map((client) => ({ value: client.id, label: client.name }));
      case RelatedToType.Opportunity:
        return opportunities.map((opp) => ({ value: opp.id, label: opp.title }));
      case RelatedToType.Proposal:
        return proposals.map((prop) => ({ value: prop.id, label: prop.title }));
      case RelatedToType.Contract:
        return contracts.map((contract) => ({ value: contract.id, label: contract.title }));
      case RelatedToType.Activity:
        return [];
      default:
        return [];
    }
  };

  const userOptions = users.map((user) => ({
    value: user.id,
    label: `${user.firstName} ${user.lastName}`,
  }));

  const hasActiveFilters =
    type || status || priority || assignedToId || relatedToType || relatedToId;

  return (
    <div className={styles.inlineFiltersBar}>
      <Form form={form} layout="inline" className={styles.inlineFiltersForm}>
        <Form.Item className={styles.inlineFilterItem}>
          <Select
            placeholder="Type"
            value={type}
            onChange={setType}
            options={ACTIVITY_TYPE_OPTIONS}
            allowClear
            style={{ minWidth: 140 }}
          />
        </Form.Item>

        <Form.Item className={styles.inlineFilterItem}>
          <Select
            placeholder="Status"
            value={status}
            onChange={setStatus}
            options={ACTIVITY_STATUS_OPTIONS}
            allowClear
            style={{ minWidth: 140 }}
          />
        </Form.Item>

        <Form.Item className={styles.inlineFilterItem}>
          <Select
            placeholder="Priority"
            value={priority}
            onChange={setPriority}
            options={PRIORITY_OPTIONS}
            allowClear
            style={{ minWidth: 140 }}
          />
        </Form.Item>

        <Form.Item className={styles.inlineFilterItem}>
          <Select
            placeholder="Assigned To"
            value={assignedToId}
            onChange={setAssignedToId}
            options={userOptions}
            allowClear
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            style={{ minWidth: 140 }}
          />
        </Form.Item>

        <Form.Item className={styles.inlineFilterActionsItem}>
          <Space size="small">
            <Button type="primary" onClick={handleApply}>
              Apply
            </Button>
            {hasActiveFilters && <Button icon={<ClearOutlined />} onClick={handleClear} danger />}
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};
