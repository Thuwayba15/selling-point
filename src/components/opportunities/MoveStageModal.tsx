"use client";

import { Form, Input, Modal, Select } from "antd";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: { stage: number; reason?: string }) => Promise<void>;
  isSubmitting?: boolean;
  defaultStage?: number;
  maxStage?: number;
};

export const MoveStageModal = ({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  defaultStage,
  maxStage = 5,
}: Props) => {
  const [form] = Form.useForm<{ stage: number; reason?: string }>();

  const handleOk = async () => {
    const values = await form.validateFields();
    await onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      title="Move to stage"
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      okText="Update"
      confirmLoading={isSubmitting}
      destroyOnClose
    >
      <Form
        layout="vertical"
        form={form}
        initialValues={{ stage: defaultStage }}
      >
        <Form.Item name="stage" label="Stage" rules={[{ required: true, message: "Stage is required" }]}>
          <Select
            options={Array.from({ length: maxStage }, (_, i) => {
              const stage = i + 1;
              return { label: `Stage ${stage}`, value: stage };
            })}
          />
        </Form.Item>

        <Form.Item name="reason" label="Reason (optional)">
          <Input placeholder='e.g. "Proposal sent"' />
        </Form.Item>
      </Form>
    </Modal>
  );
};