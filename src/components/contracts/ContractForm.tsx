"use client";

import React from "react";
import dayjs from "dayjs";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Space,
  DatePicker,
  Switch,
} from "antd";
import type { FormInstance } from "antd";
import type { Dayjs } from "dayjs";
import { IContract } from "@/providers/contracts/context";
import { useStyles } from "./style";

interface ContractFormProps {
  form: FormInstance;
  initialValues?: Partial<IContract>;
  loading?: boolean;
  onSubmit: (values: Partial<IContract>) => void;
  onCancel: () => void;
  clients?: Array<{ id: string; name: string }>;
  opportunities?: Array<{ id: string; title: string }>;
  proposals?: Array<{ id: string; title: string }>;
}

const STATUS_OPTIONS = [
  { label: "Draft", value: 1 },
  { label: "Active", value: 2 },
  { label: "Expired", value: 3 },
  { label: "Renewed", value: 4 },
  { label: "Cancelled", value: 5 },
];

const CURRENCY_OPTIONS = [
  { label: "ZAR", value: "ZAR" },
  { label: "USD", value: "USD" },
  { label: "EUR", value: "EUR" },
];

export const ContractForm: React.FC<ContractFormProps> = ({
  form,
  initialValues,
  loading = false,
  onSubmit,
  onCancel,
  clients = [],
  opportunities = [],
  proposals = [],
}) => {
  const { styles } = useStyles();
  const clientOptions = clients.map((client) => ({
    label: client.name,
    value: client.id,
  }));

  const opportunityOptions = opportunities.map((opp) => ({
    label: opp.title,
    value: opp.id,
  }));

  const proposalOptions = proposals.map((proposal) => ({
    label: proposal.title,
    value: proposal.id,
  }));

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Convert dates to ISO strings if they are dayjs objects
      const submittedValues: Partial<IContract> = {
        ...values,
        startDate: values.startDate
          ? (values.startDate as Dayjs).toISOString()
          : undefined,
        endDate: values.endDate
          ? (values.endDate as Dayjs).toISOString()
          : undefined,
      };

      onSubmit(submittedValues);
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        status: 1,
        currency: "ZAR",
        autoRenew: false,
        ...initialValues,
        startDate: initialValues?.startDate
          ? dayjs(initialValues.startDate)
          : undefined,
        endDate: initialValues?.endDate ? dayjs(initialValues.endDate) : undefined,
      }}
      autoComplete="off"
    >
      <Form.Item
        label="Title"
        name="title"
        rules={[{ required: true, message: "Please enter contract title" }]}
      >
        <Input placeholder="e.g., Service Agreement with Acme Corp" />
      </Form.Item>

      <Form.Item
        label="Contract Number"
        name="contractNumber"
        rules={[{ required: false }]}
      >
        <Input placeholder="e.g., C-2026-001" />
      </Form.Item>

      <Form.Item
        label="Client"
        name="clientId"
        rules={[{ required: true, message: "Please select a client" }]}
      >
        <Select 
          options={clientOptions} 
          placeholder="Select a client" 
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
        />
      </Form.Item>

      <Form.Item
        label="Opportunity (Optional)"
        name="opportunityId"
        rules={[{ required: false }]}
      >
        <Select 
          options={opportunityOptions} 
          placeholder="Link to an opportunity" 
          allowClear
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
        />
      </Form.Item>

      <Form.Item
        label="Proposal (Optional)"
        name="proposalId"
        rules={[{ required: false }]}
      >
        <Select 
          options={proposalOptions} 
          placeholder="Link to a proposal" 
          allowClear
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
        />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: false }]}
      >
        <Input.TextArea
          rows={3}
          placeholder="Brief description of the contract"
        />
      </Form.Item>

      <Form.Item
        label="Start Date"
        name="startDate"
        rules={[{ required: true, message: "Please select start date" }]}
      >
        <DatePicker className={styles.fullWidthControl} />
      </Form.Item>

      <Form.Item
        label="End Date"
        name="endDate"
        rules={[{ required: true, message: "Please select end date" }]}
      >
        <DatePicker className={styles.fullWidthControl} />
      </Form.Item>

      <Form.Item
        label="Contract Value"
        name="contractValue"
        rules={[{ required: true, message: "Please enter contract value" }]}
      >
        <InputNumber
          precision={2}
          min={0}
          placeholder="0.00"
          className={styles.fullWidthControl}
        />
      </Form.Item>

      <Form.Item
        label="Currency"
        name="currency"
        rules={[{ required: true }]}
      >
        <Select options={CURRENCY_OPTIONS} />
      </Form.Item>

      <Form.Item
        label="Renewal Notice Period (days)"
        name="renewalNoticePeriod"
        rules={[{ required: false }]}
        tooltip="Number of days before end date to trigger renewal reminder"
      >
        <InputNumber min={0} placeholder="e.g., 90" className={styles.fullWidthControl} />
      </Form.Item>

      <Form.Item
        label="Auto Renew"
        name="autoRenew"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Form.Item
        label="Status"
        name="status"
        rules={[{ required: true }]}
      >
        <Select options={STATUS_OPTIONS} />
      </Form.Item>

      <Form.Item
        label="Terms & Conditions"
        name="terms"
        rules={[{ required: false }]}
      >
        <Input.TextArea
          rows={4}
          placeholder="Paste terms and conditions here"
        />
      </Form.Item>

      <Space className={styles.formActions}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" loading={loading} onClick={handleSubmit}>
          {initialValues?.id ? "Update Contract" : "Create Contract"}
        </Button>
      </Space>
    </Form>
  );
};
