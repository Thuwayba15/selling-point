"use client";

import React from "react";
import { Form, Input, Select, DatePicker, Button, Space, InputNumber } from "antd";
import type { FormInstance } from "antd";
import dayjs from "dayjs";
import {
  IActivity,
  ActivityType,
  Priority,
  RelatedToType,
} from "@/providers/activities/context";
import type { ActivityFormValues } from "@/types/forms";

interface ActivityFormProps {
  form: FormInstance;
  initialValues?: Partial<IActivity>;
  loading?: boolean;
  onSubmit: (values: Partial<IActivity>) => void;
  onCancel: () => void;
  users?: Array<{ id: string; firstName: string; lastName: string } | { value: string; label: string }>;
  clients?: Array<{ id: string; name: string } | { value: string; label: string }>;
  opportunities?: Array<{ id: string; title: string } | { value: string; label: string }>;
  proposals?: Array<{ id: string; title: string } | { value: string; label: string }>;
  contracts?: Array<{ id: string; title: string } | { value: string; label: string }>;
}

const ACTIVITY_TYPE_OPTIONS = [
  { value: ActivityType.Meeting, label: "Meeting" },
  { value: ActivityType.Call, label: "Call" },
  { value: ActivityType.Email, label: "Email" },
  { value: ActivityType.Task, label: "Task" },
  { value: ActivityType.Presentation, label: "Presentation" },
  { value: ActivityType.Other, label: "Other" },
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
];

export const ActivityForm: React.FC<ActivityFormProps> = ({
  form,
  initialValues,
  loading,
  onSubmit,
  onCancel,
  users = [],
  clients = [],
  opportunities = [],
  proposals = [],
  contracts = [],
}) => {
  const watchedRelatedToType = Form.useWatch("relatedToType", form);
  const resolvedRelatedToType =
    typeof watchedRelatedToType === "number" &&
    Object.values(RelatedToType).includes(watchedRelatedToType)
      ? watchedRelatedToType
      : undefined;

  const normalizedInitialValues = {
    type: ActivityType.Task,
    priority: Priority.Medium,
    ...initialValues,
    dueDate: initialValues?.dueDate ? dayjs(initialValues.dueDate) : undefined,
    relatedToType:
      typeof initialValues?.relatedToType === "number" &&
      Object.values(RelatedToType).includes(initialValues.relatedToType)
        ? initialValues.relatedToType
        : undefined,
    relatedToId:
      typeof initialValues?.relatedToType === "number" &&
      Object.values(RelatedToType).includes(initialValues.relatedToType)
        ? initialValues?.relatedToId
        : undefined,
  };

  const handleFinish = (values: ActivityFormValues) => {
    // Convert Dayjs to ISO string if needed
    const dueDate = values.dueDate
      ? typeof values.dueDate === "string"
        ? values.dueDate
        : dayjs(values.dueDate).toISOString()
      : undefined;

    const baseData: Partial<IActivity> = {
      type: typeof values.type === "string" ? parseInt(values.type, 10) : values.type,
      subject: values.subject,
      priority: typeof values.priority === "string" ? parseInt(values.priority, 10) : values.priority,
      dueDate,
    };

    // Add optional fields only if they have values
    const optionalData: Partial<IActivity> = {};
    
    if (values.description) {
      optionalData.description = values.description;
    }
    if (values.assignedToId) {
      optionalData.assignedToId = values.assignedToId;
    }
    if (values.duration !== null && values.duration !== undefined) {
      optionalData.duration = parseInt(String(values.duration), 10);
    }
    if (values.location) {
      optionalData.location = values.location;
    }
    if (values.relatedToType) {
      optionalData.relatedToType = typeof values.relatedToType === "string" 
        ? parseInt(values.relatedToType, 10) 
        : values.relatedToType;
      if (values.relatedToId) {
        optionalData.relatedToId = values.relatedToId;
      }
    }

    // For create operations, include participants
    if (!initialValues?.id) {
      optionalData.participants = [];
    }

    const activityData: Partial<IActivity> = {
      ...baseData,
      ...optionalData,
    };

    onSubmit(activityData);
  };

  const handleRelatedToTypeChange = () => {
    form.setFieldValue("relatedToId", undefined);
  };

  const userOptions = (users || []).map((user) => {
    if ('value' in user) {
      return { value: user.value, label: user.label };
    }
    return { value: user.id, label: `${user.firstName} ${user.lastName}` };
  });

  const getRelatedToOptions = () => {
    switch (resolvedRelatedToType) {
      case RelatedToType.Client:
        return (clients || []).map((c) => {
          if ('value' in c) {
            return { value: c.value, label: c.label };
          }
          return { value: c.id, label: c.name };
        });
      case RelatedToType.Opportunity:
        return (opportunities || []).map((o) => {
          if ('value' in o) {
            return { value: o.value, label: o.label };
          }
          return { value: o.id, label: o.title };
        });
      case RelatedToType.Proposal:
        return (proposals || []).map((p) => {
          if ('value' in p) {
            return { value: p.value, label: p.label };
          }
          return { value: p.id, label: p.title };
        });
      case RelatedToType.Contract:
        return (contracts || []).map((c) => {
          if ('value' in c) {
            return { value: c.value, label: c.label };
          }
          return { value: c.id, label: c.title };
        });
      default:
        return [];
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={normalizedInitialValues}
      onFinish={handleFinish}
      autoComplete="off"
    >
      <Form.Item
        label="Subject"
        name="subject"
        rules={[{ required: true, message: "Subject is required" }]}
      >
        <Input placeholder="Enter activity subject" />
      </Form.Item>

      <Form.Item
        label="Type"
        name="type"
        rules={[{ required: true, message: "Type is required" }]}
      >
        <Select options={ACTIVITY_TYPE_OPTIONS} placeholder="Select activity type" />
      </Form.Item>

      <Form.Item
        label="Priority"
        name="priority"
        rules={[{ required: true, message: "Priority is required" }]}
      >
        <Select options={PRIORITY_OPTIONS} placeholder="Select priority" />
      </Form.Item>

      <Form.Item
        label="Due Date"
        name="dueDate"
        rules={[{ required: true, message: "Due date is required" }]}
      >
        <DatePicker
          showTime
          format="YYYY-MM-DD HH:mm"
          style={{ width: "100%" }}
          placeholder="Select due date"
        />
      </Form.Item>

      <Form.Item
        label="Assigned To"
        name="assignedToId"
        rules={[
          {
            required: !initialValues?.id,
            message: "Assigned to is required",
          },
        ]}
      >
        <Select
          placeholder="Select user"
          options={userOptions}
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
        />
      </Form.Item>

      <Form.Item label="Related To Type" name="relatedToType">
        <Select
          placeholder="Select related to type"
          options={RELATED_TO_TYPE_OPTIONS}
          allowClear
          onChange={handleRelatedToTypeChange}
        />
      </Form.Item>

      {resolvedRelatedToType && (
        <Form.Item label="Related To" name="relatedToId">
          <Select
            placeholder="Select related item"
            options={getRelatedToOptions()}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            allowClear
          />
        </Form.Item>
      )}

      <Form.Item label="Duration (minutes)" name="duration">
        <InputNumber min={0} placeholder="Enter duration in minutes" style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item label="Location" name="location">
        <Input placeholder="Enter location (e.g., Microsoft Teams, Conference Room)" />
      </Form.Item>

      <Form.Item label="Description" name="description">
        <Input.TextArea rows={4} placeholder="Enter activity description" />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            {initialValues?.id ? "Update Activity" : "Create Activity"}
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
