"use client";

import { useEffect } from "react";
import { Form, Input, Modal, Select } from "antd";
import type { FormInstance } from "antd";
import type { INote, RelatedToType } from "@/providers/notes/context";

const RELATED_TO_OPTIONS = [
  { value: 1, label: "Client" },
  { value: 2, label: "Opportunity" },
  { value: 3, label: "Proposal" },
  { value: 4, label: "Contract" },
  { value: 5, label: "Activity" },
];

interface NoteFormValues {
  content: string;
  relatedToType: RelatedToType;
  relatedToId: string;
  isPrivate?: boolean;
}

interface NoteFormProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: NoteFormValues) => Promise<void>;
  form: FormInstance<NoteFormValues>;
  loading?: boolean;
  zIndex?: number;
  relatedToType?: RelatedToType;
  note?: INote | null;
}

export const NoteForm = ({
  open,
  onCancel,
  onSubmit,
  form,
  loading = false,
  zIndex,
  relatedToType,
  note,
}: NoteFormProps) => {
  const isEdit = Boolean(note?.id);

  // Pre-populate form when modal opens with a note to edit
  useEffect(() => {
    if (open && isEdit && note) {
      form.setFieldsValue({
        content: note.content,
        relatedToType: note.relatedToType,
        relatedToId: note.relatedToId,
      });
    }
  }, [open, isEdit, note, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
      form.resetFields();
      onCancel();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={isEdit ? "Edit Note" : "Add Note"}
      open={open}
      onCancel={handleCancel}
      onOk={handleSubmit}
      okText={isEdit ? "Update" : "Create"}
      confirmLoading={loading}
      zIndex={zIndex}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Content"
          name="content"
          rules={[{ required: true, message: "Please enter note content" }]}
        >
          <Input.TextArea rows={4} placeholder="Enter your note" />
        </Form.Item>

        {!relatedToType && (
          <Form.Item
            label="Related To Type"
            name="relatedToType"
            rules={[{ required: true, message: "Please select related to type" }]}
          >
            <Select placeholder="Select type" options={RELATED_TO_OPTIONS} />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};
