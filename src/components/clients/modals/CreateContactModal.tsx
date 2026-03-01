"use client";

import { Modal, Form } from "antd";
import { ContactForm } from "@/components/contacts";
import type { FormInstance } from "antd";
import type { ContactFormValues } from "@/types/forms";

interface CreateContactModalProps {
  isOpen: boolean;
  form: FormInstance;
  loading?: boolean;
  onSubmit: (values: ContactFormValues) => Promise<void>;
  onCancel: () => void;
  clients?: Array<{ id: string; name: string }>;
}

export const CreateContactModal = ({
  isOpen,
  form,
  loading = false,
  onSubmit,
  onCancel,
  clients = [],
}: CreateContactModalProps) => {
  return (
    <Modal title="Create Contact" open={isOpen} onCancel={onCancel} footer={null} width={600}>
      <ContactForm form={form} loading={loading} onSubmit={onSubmit} clients={clients} />
    </Modal>
  );
};
