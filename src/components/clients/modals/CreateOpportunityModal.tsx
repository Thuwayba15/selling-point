"use client";

import { Modal, Form, Input, Select, Button } from "antd";
import type { FormInstance } from "antd";
import type { IOpportunity } from "@/providers/opportunities/context";
import type { IClient } from "@/providers/clients/context";

interface CreateOpportunityModalProps {
  isOpen: boolean;
  client: IClient | null;
  form: FormInstance;
  loading?: boolean;
  onSubmit: (values: any) => Promise<void>;
  onCancel: () => void;
}

export const CreateOpportunityModal = ({
  isOpen,
  client,
  form,
  loading = false,
  onSubmit,
  onCancel,
}: CreateOpportunityModalProps) => {
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
    } catch (error) {
      // Validation failed
    }
  };

  return (
    <Modal
      title="Create Opportunity"
      open={isOpen}
      onCancel={onCancel}
      onOk={handleSubmit}
      loading={loading}
      maskClosable={false}
    >
      <Form form={form} layout="vertical">
        {client && (
          <Form.Item label="Client" required>
            <Input disabled value={client.name} />
          </Form.Item>
        )}

        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please enter opportunity title" }]}
        >
          <Input placeholder="Opportunity title" />
        </Form.Item>

        <Form.Item
          label="Stage"
          name="stage"
          rules={[{ required: true, message: "Please select stage" }]}
        >
          <Select
            placeholder="Select stage"
            options={[
              { value: "Lead", label: "Lead" },
              { value: "Proposal", label: "Proposal" },
              { value: "In Progress", label: "In Progress" },
            ]}
          />
        </Form.Item>

        <Form.Item label="Estimated Value" name="estimatedValue">
          <Input type="number" placeholder="0" />
        </Form.Item>

        <Form.Item label="Probability (%)" name="probability">
          <Input type="number" placeholder="0" min="0" max="100" />
        </Form.Item>

        <Form.Item label="Expected Close Date" name="expectedCloseDate">
          <Input type="date" />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea rows={4} placeholder="Add description..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};
