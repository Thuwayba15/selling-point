"use client";

import { Button, Form, Modal, Select } from "antd";
import type { IUser } from "@/providers/users/context";

interface AssignOpportunityModalProps {
  isOpen: boolean;
  form: any;
  loading: boolean;
  users: Array<{ id: string; label: string }>;
  onCancel: () => void;
  onSubmit: (values: { userId: string }) => Promise<void>;
}

export const AssignOpportunityModal = ({
  isOpen,
  form,
  loading,
  users,
  onCancel,
  onSubmit,
}: AssignOpportunityModalProps) => {
  return (
    <Modal
      title="Assign Opportunity"
      open={isOpen}
      onCancel={onCancel}
      footer={null}
      width={480}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          name="userId"
          label="Assign To"
          rules={[{ required: true, message: "Please select a user" }]}
        >
          <Select
            placeholder="Select a user"
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={users.map((item) => ({
              value: item.id,
              label: item.label,
            }))}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Assign Opportunity
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
