"use client";

import React from "react";
import { Form, Input, Select, Button, Space } from "antd";
import type { FormInstance } from "antd";
import type { IPricingRequest } from "@/providers/pricing-requests/context";
import type { PricingRequestFormValues } from "@/types/forms";

interface PricingRequestFormProps {
  form: FormInstance;
  initialValues?: Partial<IPricingRequest>;
  loading?: boolean;
  onSubmit: (values: Partial<IPricingRequest>) => void;
  onCancel: () => void;
  opportunities?: Array<{ id: string; title: string }>;
}

const STATUS_OPTIONS = [
  { label: "Pending", value: 1 },
  { label: "In Progress", value: 2 },
  { label: "Completed", value: 3 },
];

const PRIORITY_OPTIONS = [
  { label: "Low", value: 1 },
  { label: "Medium", value: 2 },
  { label: "High", value: 3 },
  { label: "Urgent", value: 4 },
];

const CURRENCY_OPTIONS = [
  { label: "R", value: "R" },
];

export const PricingRequestForm: React.FC<PricingRequestFormProps> = ({
  form,
  initialValues,
  loading,
  onSubmit,
  onCancel,
  opportunities = [],
}) => {
  const handleFinish = (values: PricingRequestFormValues) => {
    const pricingRequestData: Partial<IPricingRequest> = {
      opportunityId: values.opportunityId,
      status: typeof values.status === "string" ? parseInt(values.status, 10) : values.status,
      priority:
        typeof values.priority === "string" ? parseInt(values.priority, 10) : values.priority,
      description: values.description,
      requiredByDate: values.requiredByDate,
      estimatedValue:
        typeof values.estimatedValue === "string"
          ? parseFloat(values.estimatedValue)
          : values.estimatedValue,
      currency: values.currency,
      ...(values.notes ? { notes: values.notes } : {}),
    };
    onSubmit(pricingRequestData);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        status: 1,
        priority: 2,
        currency: "R",
        ...initialValues,
      }}
      onFinish={handleFinish}
      autoComplete="off"
    >
      <Form.Item
        label="Opportunity"
        name="opportunityId"
        rules={[{ required: true, message: "Opportunity is required" }]}
      >
        <Select
          placeholder="Select an opportunity"
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={opportunities.map((opp) => ({
            value: opp.id,
            label: opp.title,
          }))}
        />
      </Form.Item>

      <Form.Item
        label="Priority"
        name="priority"
        rules={[{ required: true, message: "Priority is required" }]}
      >
        <Select placeholder="Select priority" options={PRIORITY_OPTIONS} />
      </Form.Item>

      <Form.Item
        label="Status"
        name="status"
        rules={[{ required: true, message: "Status is required" }]}
      >
        <Select placeholder="Select status" options={STATUS_OPTIONS} />
      </Form.Item>

      <Form.Item label="Currency" name="currency">
        <Select placeholder="Select currency" options={CURRENCY_OPTIONS} />
      </Form.Item>

      <Form.Item
        label="Required By Date"
        name="requiredByDate"
        rules={[{ required: true, message: "Required by date is required" }]}
      >
        <Input type="date" />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: "Description is required" }]}
      >
        <Input.TextArea placeholder="Enter request description" rows={4} />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            {initialValues?.id ? "Update Request" : "Create Request"}
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
