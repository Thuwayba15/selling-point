"use client";

import { DatePicker, Form, Input, InputNumber, Modal, Select } from "antd";
import type { Dayjs } from "dayjs";

import type { CreateOpportunityPayload } from "../../domains/opportunities/types";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateOpportunityPayload) => Promise<void>;
  isSubmitting?: boolean;
};

type FormValues = {
  title: string;
  clientId: string;
  stage?: number;
  estimatedValue?: number;
  currency?: string;
  probability?: number;
  expectedCloseDate?: Dayjs;
  description?: string;
};

export const NewOpportunityModal = ({ open, onClose, onSubmit, isSubmitting }: Props) => {
  const [form] = Form.useForm<FormValues>();

  const handleOk = async () => {
    const values = await form.validateFields();

    const payload: CreateOpportunityPayload = {
      title: values.title,
      clientId: values.clientId,
      stage: values.stage,
      estimatedValue: values.estimatedValue,
      currency: values.currency,
      probability: values.probability,
      expectedCloseDate: values.expectedCloseDate?.toISOString(),
      description: values.description,
    };

    await onSubmit(payload);
    form.resetFields();
  };

  return (
    <Modal
      title="New Opportunity"
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      okText="Create"
      confirmLoading={isSubmitting}
      destroyOnClose
    >
      <Form layout="vertical" form={form}>
        <Form.Item name="title" label="Title" rules={[{ required: true, message: "Title is required" }]}>
          <Input placeholder="e.g. Enterprise License Deal" />
        </Form.Item>

        <Form.Item name="clientId" label="Client ID" rules={[{ required: true, message: "Client ID is required" }]}>
          <Input placeholder="Client GUID" />
        </Form.Item>

        <Form.Item name="stage" label="Stage">
          <Select
            placeholder="Select stage"
            allowClear
            options={[
              { label: "Qualification", value: 1 },
              { label: "Discovery", value: 2 },
              { label: "Proposal", value: 3 },
              { label: "Negotiation", value: 4 },
              { label: "Won", value: 5 },
            ]}
          />
        </Form.Item>

        <Form.Item name="estimatedValue" label="Estimated Value">
          <InputNumber style={{ width: "100%" }} placeholder="0" min={0} />
        </Form.Item>

        <Form.Item name="currency" label="Currency">
          <Input placeholder="e.g. USD" />
        </Form.Item>

        <Form.Item name="probability" label="Probability (%)">
          <InputNumber style={{ width: "100%" }} placeholder="0" min={0} max={100} />
        </Form.Item>

        <Form.Item name="expectedCloseDate" label="Expected Close Date">
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea placeholder="Optional notes..." rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};