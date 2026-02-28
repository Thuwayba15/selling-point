"use client";

import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { Button, Form, Input, Select, Space, DatePicker } from "antd";
import type { Dayjs } from "dayjs";
import type { ProposalFormValues } from "@/types/forms";
import type { IProposal, IProposalLineItem } from "@/providers/proposals/context";
import { ProposalLineItemsBuilder, type ICreateProposalLineItem } from "./ProposalLineItemsBuilder";
import { useStyles } from "./style";

interface EditProposalFormProps {
  proposal: IProposal;
  loading?: boolean;
  onSubmit: (payload: UpdateProposalPayload) => Promise<void>;
  onCancel: () => void;
  opportunities?: Array<{ id: string; title: string }>;
  clients?: Array<{ id: string; name: string }>;
}

interface EditProposalFormInputValues extends Omit<ProposalFormValues, "validUntil"> {
  validUntil?: Dayjs;
}

export interface UpdateProposalPayload {
  title: string;
  clientId: string;
  opportunityId: string;
  description?: string;
  currency: string;
  validUntil: string;
  lineItems: Array<{
    id?: string; // Server ID for existing items, undefined for new items
    productServiceName: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    taxRate: number;
  }>;
}

const CURRENCY_OPTIONS = [{ label: "R (ZAR)", value: "R" }];

export const EditProposalForm = ({
  proposal,
  loading,
  onSubmit,
  onCancel,
  opportunities = [],
  clients = [],
}: EditProposalFormProps) => {
  const { styles } = useStyles();
  const [form] = Form.useForm<EditProposalFormInputValues>();
  const [lineItems, setLineItems] = useState<ICreateProposalLineItem[]>([]);

  // Initialize line items from proposal on mount and when proposal changes
  useEffect(() => {
    const initialLineItems: ICreateProposalLineItem[] = (proposal?.lineItems || []).map((item) => ({
      tempId: item.id, // Use server ID as tempId for existing items
      productServiceName: item.productServiceName || "",
      description: item.description,
      quantity: item.quantity || 0,
      unitPrice: item.unitPrice || 0,
      discount: item.discount || 0,
      taxRate: item.taxRate || 0,
    }));

    setLineItems(initialLineItems);

    // Initialize form with proposal data
    form.setFieldsValue({
      title: proposal.title,
      clientId: proposal.clientId,
      opportunityId: proposal.opportunityId,
      description: proposal.description,
      currency: proposal.currency || "R",
      validUntil: proposal.validUntil ? dayjs(proposal.validUntil) : undefined,
    });
  }, [proposal, form]);

  const handleFinish = async (values: EditProposalFormInputValues) => {
    if (!values.validUntil) {
      return;
    }

    const payload: UpdateProposalPayload = {
      title: values.title,
      clientId: values.clientId,
      opportunityId: values.opportunityId || "",
      description: values.description,
      currency: values.currency || "R",
      validUntil: values.validUntil.toISOString(),
      lineItems: lineItems.map((item) => ({
        id: item.tempId, // Include tempId as id to track existing items
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
    <Form<EditProposalFormInputValues>
      form={form}
      layout="vertical"
      autoComplete="off"
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
          options={clients.map((client) => ({ value: client.id, label: client.name }))}
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
          options={opportunities.map((opp) => ({ value: opp.id, label: opp.title }))}
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
            Update Proposal
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
