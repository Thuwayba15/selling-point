"use client";

import { Modal } from "antd";
import type { FormInstance } from "antd";
import { OpportunityForm } from "@/components/opportunities";
import { IOpportunity } from "@/providers/opportunities/context";

interface EditOpportunityModalProps {
  isOpen: boolean;
  form: FormInstance;
  loading: boolean;
  clients: Array<{ id: string; name: string } | { value: string; label: string }>;
  contacts: Array<{ id: string; firstName: string; lastName: string; email: string } | { value: string; label: string }>;
  initialValues?: IOpportunity;
  onClientChange: (clientId: string | undefined) => void;
  onCancel: () => void;
  onSubmit: (values: Partial<IOpportunity>) => Promise<void>;
}

export const EditOpportunityModal = ({
  isOpen,
  form,
  loading,
  clients,
  contacts,
  initialValues,
  onClientChange,
  onCancel,
  onSubmit,
}: EditOpportunityModalProps) => {
  return (
    <Modal
      title="Edit Opportunity"
      open={isOpen}
      onCancel={onCancel}
      footer={null}
      width={640}
    >
      <OpportunityForm
        form={form}
        initialValues={initialValues}
        onSubmit={onSubmit}
        onCancel={onCancel}
        loading={loading}
        clients={clients}
        contacts={contacts}
        onClientChange={onClientChange}
      />
    </Modal>
  );
};
