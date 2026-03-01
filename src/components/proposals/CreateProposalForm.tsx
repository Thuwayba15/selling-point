"use client";

import { useState } from "react";
import dayjs from "dayjs";
import { Button, Form, Input, Select, Space, DatePicker } from "antd";
import type { Dayjs } from "dayjs";
import type { ProposalFormValues } from "@/types/forms";
import { ProposalLineItemsBuilder, type ICreateProposalLineItem } from "./ProposalLineItemsBuilder";
import { useStyles } from "./style";

interface CreateProposalFormProps {
  loading?: boolean;
  onSubmit: (payload: CreateProposalPayload) => Promise<void>;
  onCancel: () => void;
  opportunities?: Array<{ id: string; title: string } | { value: string; label: string }>;
  clients?: Array<{ id: string; name: string } | { value: string; label: string }>;
}

interface CreateProposalFormInputValues extends Omit<ProposalFormValues, "validUntil"> {
  validUntil?: Dayjs;
}

export interface CreateProposalPayload {
  title: string;
  clientId: string;
  opportunityId: string;
  description?: string;
  currency: string;
  validUntil: string;
  lineItems: Array<{
    productServiceName: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    taxRate: number;
  }>;
}

const CURRENCY_OPTIONS = [{ label: "R (ZAR)", value: "R" }];

export const CreateProposalForm = ({
  loading,
  onSubmit,
  onCancel,
  opportunities = [],
  clients = [],
}: CreateProposalFormProps) => {
  const { styles } = useStyles();
  const [form] = Form.useForm<CreateProposalFormInputValues>();
  const [lineItems, setLineItems] = useState<ICreateProposalLineItem[]>([]);

  const handleFinish = async (values: CreateProposalFormInputValues) => {
    if (!values.validUntil) {
      return;
    }

    const payload: CreateProposalPayload = {
      title: values.title,
      clientId: values.clientId,
      opportunityId: values.opportunityId || "",
      description: values.description,
      currency: values.currency || "R",
      validUntil: values.validUntil.toISOString(),
      lineItems: lineItems.map((item) => ({
        productServiceName: item.productServiceName,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount,
        taxRate: item.taxRate,
      })),
    };

    await onSubmit(payload);
  };

  return (
    <Form<CreateProposalFormInputValues>
      form={form}
      layout="vertical"
      autoComplete="off"
      initialValues={{
        currency: "R",
        validUntil: dayjs().add(30, "day"),
      }}
      onFinish={handleFinish}
    >
      <Form.Item
        label="Title"
        name="title"
        rules={[{ required: true, message: "Title is required" }]}
      >
        <Input placeholder="Proposal title" />
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
          options={
            clients?.map((client) => {
              if ("value" in client) {
                return { value: client.value, label: client.label };
              }
              return { value: client.id, label: client.name };
            }) || []
          }
        />
      </Form.Item>

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
          options={
            opportunities?.map((opp) => {
              if ("value" in opp) {
                return { value: opp.value, label: opp.label };
              }
              return { value: opp.id, label: opp.title };
            }) || []
          }
        />
      </Form.Item>

      <Form.Item
        label="Currency"
        name="currency"
        rules={[{ required: true, message: "Currency is required" }]}
      >
        <Select options={CURRENCY_OPTIONS} />
      </Form.Item>

      <Form.Item
        label="Valid Until"
        name="validUntil"
        rules={[{ required: true, message: "Valid until date is required" }]}
      >
        <DatePicker className={styles.fullWidthControl} />
      </Form.Item>

      <Form.Item label="Description" name="description">
        <Input.TextArea rows={3} placeholder="Proposal description" />
      </Form.Item>

      <ProposalLineItemsBuilder lineItems={lineItems} onChange={setLineItems} currency="R" />

      <Form.Item>
        <Space>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Create Proposal
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
