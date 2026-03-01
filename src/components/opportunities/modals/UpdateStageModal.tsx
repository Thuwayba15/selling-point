"use client";

import { Button, Form, Input, Modal, Select } from "antd";
import type { FormInstance } from "antd";

interface UpdateStageModalProps {
  isOpen: boolean;
  form: FormInstance;
  loading: boolean;
  onCancel: () => void;
  onSubmit: (values: { stage: number; notes?: string; lossReason?: string }) => Promise<void>;
}

const STAGE_OPTIONS = [
  { label: "Lead", value: 1 },
  { label: "Qualified", value: 2 },
  { label: "Proposal", value: 3 },
  { label: "Negotiation", value: 4 },
  { label: "Closed Won", value: 5 },
  { label: "Closed Lost", value: 6 },
];

export const UpdateStageModal = ({
  isOpen,
  form,
  loading,
  onCancel,
  onSubmit,
}: UpdateStageModalProps) => {
  return (
    <Modal title="Update Stage" open={isOpen} onCancel={onCancel} footer={null} width={480}>
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          name="stage"
          label="Stage"
          rules={[{ required: true, message: "Please select a stage" }]}
        >
          <Select options={STAGE_OPTIONS} />
        </Form.Item>

        <Form.Item name="notes" label="Notes">
          <Input.TextArea rows={3} placeholder="Optional notes for stage change" />
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.stage !== currentValues.stage}
        >
          {({ getFieldValue }) =>
            getFieldValue("stage") === 6 ? (
              <Form.Item
                name="lossReason"
                label="Loss Reason"
                rules={[{ required: true, message: "Loss reason is required for Closed Lost" }]}
              >
                <Input.TextArea rows={3} placeholder="Reason for lost opportunity" />
              </Form.Item>
            ) : null
          }
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Update Stage
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
