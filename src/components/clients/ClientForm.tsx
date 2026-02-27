"use client";

import React from "react";
import { Form, Input, Select, Switch, Button, Space } from "antd";
import type { FormInstance } from "antd";
import type { IClient } from "@/providers/clients/context";
import type { ClientFormValues } from "@/types/forms";

interface ClientFormProps {
  form: FormInstance;
  initialValues?: Partial<IClient>;
  loading?: boolean;
  onSubmit: (values: Partial<IClient>) => void;
  onCancel: () => void;
}

const CLIENT_TYPE_OPTIONS = [
  { value: 1, label: "Government" },
  { value: 2, label: "Private" },
  { value: 3, label: "Partner" },
];

// Common industries for autocomplete
const INDUSTRY_OPTIONS = [
  "Technology",
  "Healthcare",
  "Finance",
  "Manufacturing",
  "Retail",
  "Education",
  "Energy",
  "Telecommunications",
  "Transportation",
  "Construction",
  "Real Estate",
  "Agriculture",
  "Media",
  "Hospitality",
  "Other",
];

const COMPANY_SIZE_OPTIONS = [
  "1-10",
  "11-50",
  "51-100",
  "101-500",
  "501-1000",
  "1001-5000",
  "5000+",
];

export const ClientForm: React.FC<ClientFormProps> = ({
  form,
  initialValues,
  loading,
  onSubmit,
  onCancel,
}) => {
  const handleFinish = (values: ClientFormValues) => {
    // Convert clientType to number if it's a string
    const clientData: Partial<IClient> = {
      ...values,
      clientType:
        typeof values.clientType === "string" ? parseInt(values.clientType, 10) : values.clientType,
    };
    onSubmit(clientData);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        isActive: true,
        ...initialValues,
      }}
      onFinish={handleFinish}
      autoComplete="off"
    >
      <Form.Item
        label="Client Name"
        name="name"
        rules={[{ required: true, message: "Client name is required" }]}
      >
        <Input placeholder="Enter client name" />
      </Form.Item>

      <Form.Item
        label="Client Type"
        name="clientType"
        rules={[{ required: true, message: "Client type is required" }]}
      >
        <Select options={CLIENT_TYPE_OPTIONS} placeholder="Select client type" />
      </Form.Item>

      <Form.Item
        label="Industry"
        name="industry"
        rules={[{ required: true, message: "Industry is required" }]}
      >
        <Select
          showSearch
          options={INDUSTRY_OPTIONS.map((ind) => ({ label: ind, value: ind }))}
          placeholder="Select or enter industry"
          filterOption={(inputValue, option) =>
            (option?.label as string)?.toLowerCase().includes(inputValue.toLowerCase())
          }
        />
      </Form.Item>

      <Form.Item
        label="Company Size"
        name="companySize"
        rules={[{ message: "Select a company size" }]}
      >
        <Select
          options={COMPANY_SIZE_OPTIONS.map((size) => ({ label: size, value: size }))}
          placeholder="Select company size"
        />
      </Form.Item>

      <Form.Item
        label="Website"
        name="website"
        rules={[{ type: "url", message: "Please enter a valid URL", whitespace: false }]}
      >
        <Input type="url" placeholder="https://example.com" />
      </Form.Item>

      <Form.Item label="Billing Address" name="billingAddress">
        <Input placeholder="Enter billing address" />
      </Form.Item>

      <Form.Item label="Tax Number" name="taxNumber">
        <Input placeholder="Enter tax number" />
      </Form.Item>

      <Form.Item label="Active" name="isActive" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            {initialValues?.id ? "Update Client" : "Create Client"}
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
