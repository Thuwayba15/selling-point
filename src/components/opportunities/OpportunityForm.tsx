"use client";

import React from "react";
import { Form, Input, InputNumber, Select, Button, Space } from "antd";
import type { FormInstance } from "antd";
import type { IOpportunity } from "@/providers/opportunities/context";
import type { OpportunityFormValues } from "@/types/forms";
import { useStyles } from "./style";

interface OpportunityFormProps {
  form: FormInstance;
  initialValues?: Partial<IOpportunity>;
  loading?: boolean;
  onSubmit: (values: Partial<IOpportunity>) => void;
  onCancel: () => void;
  clients?: Array<{ id: string; name: string } | { value: string; label: string }>;
  contacts?: Array<{ id: string; firstName: string; lastName: string; email: string } | { value: string; label: string }>;
  onClientChange?: (clientId: string | undefined) => void;
}

const STAGE_OPTIONS = [
  { label: "Lead", value: 1 },
  { label: "Qualified", value: 2 },
  { label: "Proposal", value: 3 },
  { label: "Negotiation", value: 4 },
  { label: "Closed Won", value: 5 },
  { label: "Closed Lost", value: 6 },
];

const SOURCE_OPTIONS = [
  { label: "Inbound", value: 1 },
  { label: "Outbound", value: 2 },
  { label: "Referral", value: 3 },
  { label: "Partner", value: 4 },
  { label: "RFP", value: 5 },
];

const CURRENCY_OPTIONS = [
  { label: "ZAR (R)", value: "R" },
];

export const OpportunityForm: React.FC<OpportunityFormProps> = ({
  form,
  initialValues,
  loading,
  onSubmit,
  onCancel,
  clients = [],
  contacts = [],
  onClientChange,
}) => {
  const { styles } = useStyles();
  const handleFinish = (values: OpportunityFormValues) => {
    // Ensure all numeric fields are properly typed
    const opportunityData: Partial<IOpportunity> = {
      title: values.title,
      clientId: values.clientId,
      ...(values.contactId ? { contactId: values.contactId } : {}),
      estimatedValue:
        typeof values.estimatedValue === "string"
          ? parseFloat(values.estimatedValue)
          : values.estimatedValue,
      currency: values.currency,
      stage: typeof values.stage === "string" ? parseInt(values.stage, 10) : values.stage,
      source: typeof values.source === "string" ? parseInt(values.source, 10) : values.source,
      probability:
        typeof values.probability === "string"
          ? parseInt(values.probability, 10)
          : values.probability,
      expectedCloseDate: values.expectedCloseDate,
      ...(values.description ? { description: values.description } : {}),
    };
    onSubmit(opportunityData);
  };

  const handleFormValuesChange = (changedValues: Record<string, unknown>) => {
    if ("clientId" in changedValues) {
      onClientChange?.(changedValues.clientId as string | undefined);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onValuesChange={handleFormValuesChange}
      initialValues={{
        stage: 1,
        source: 1,
        probability: 50,
        currency: "R",
        ...initialValues,
      }}
      onFinish={handleFinish}
      autoComplete="off"
    >
      <Form.Item
        label="Title"
        name="title"
        rules={[{ required: true, message: "Opportunity title is required" }]}
      >
        <Input placeholder="Enter opportunity title" />
      </Form.Item>

      <Form.Item
        label="Client"
        name="clientId"
        rules={[{ required: true, message: "Client is required" }]}
      >
        <Select
          placeholder="Select a client"
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={clients?.map((client) => {
            if ('value' in client) {
              return { value: client.value, label: client.label };
            }
            return { value: client.id, label: client.name };
          }) || []}
        />
      </Form.Item>

      <Form.Item label="Contact" name="contactId">
        <Select
          placeholder="Select a contact (optional)"
          showSearch
          allowClear
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={contacts?.map((contact) => {
            if ('value' in contact) {
              return { value: contact.value, label: contact.label };
            }
            return { value: contact.id, label: `${contact.firstName} ${contact.lastName}${contact.email ? ` (${contact.email})` : ""}` };
          }) || []}
        />
      </Form.Item>

      <Form.Item
        label="Estimated Value"
        name="estimatedValue"
        rules={[{ required: true, message: "Estimated value is required" }]}
      >
        <InputNumber
          placeholder="Enter value"
          min={0}
          step={100}
          className={styles.fullWidthControl}
        />
      </Form.Item>

      <Form.Item
        label="Currency"
        name="currency"
        rules={[{ required: true, message: "Currency is required" }]}
      >
        <Select placeholder="Select currency" options={CURRENCY_OPTIONS} />
      </Form.Item>

      <Form.Item
        label="Stage"
        name="stage"
        rules={[{ required: true, message: "Stage is required" }]}
      >
        <Select placeholder="Select stage" options={STAGE_OPTIONS} />
      </Form.Item>

      <Form.Item
        label="Source"
        name="source"
        rules={[{ required: true, message: "Source is required" }]}
      >
        <Select placeholder="Select source" options={SOURCE_OPTIONS} />
      </Form.Item>

      <Form.Item
        label="Probability (%)"
        name="probability"
        rules={[
          { required: true, message: "Probability is required" },
          { type: "number", min: 0, max: 100, message: "Probability must be between 0 and 100" },
        ]}
      >
        <InputNumber placeholder="0 - 100" min={0} max={100} className={styles.fullWidthControl} />
      </Form.Item>

      <Form.Item
        label="Expected Close Date"
        name="expectedCloseDate"
        rules={[{ required: true, message: "Expected close date is required" }]}
      >
        <Input type="date" />
      </Form.Item>

      <Form.Item label="Description" name="description">
        <Input.TextArea placeholder="Enter opportunity description" rows={4} />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            {initialValues?.id ? "Update Opportunity" : "Create Opportunity"}
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
