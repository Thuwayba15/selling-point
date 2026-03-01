"use client";

import { Modal, Form } from "antd";
import { ContactForm } from "@/components/contacts";
import type { FormInstance } from "antd";
import type { IContact } from "@/providers/contacts/context";
import type { ContactFormValues } from "@/types/forms";

interface EditContactModalProps {
  isOpen: boolean;
  contact: IContact | null;
  form: FormInstance;
  loading?: boolean;
  onSubmit: (values: ContactFormValues) => Promise<void>;
  onCancel: () => void;
}

export const EditContactModal = ({
  isOpen,
  contact,
  form,
  loading = false,
  onSubmit,
  onCancel,
}: EditContactModalProps) => {
  return (
    <Modal
      title="Edit Contact"
      open={isOpen}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <ContactForm
        form={form}
        initialValues={contact || undefined}
        loading={loading}
        onSubmit={onSubmit}
      />
    </Modal>
  );
};
