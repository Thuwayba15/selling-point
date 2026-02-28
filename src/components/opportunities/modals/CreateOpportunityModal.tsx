"use client";

import { Form, Modal } from "antd";
import { OpportunityForm } from "@/components/opportunities";
import { IOpportunity } from "@/providers/opportunities/context";

interface CreateOpportunityModalProps {
  isOpen: boolean;
  form: any;
  loading: boolean;
  clients: Array<{ id: string; name: string }>;
  contacts: Array<{ id: string; firstName: string; lastName: string; email: string }>;
  onClientChange: (clientId: string | undefined) => void;
  onCancel: () => void;
  onSubmit: (values: Partial<IOpportunity>) => Promise<void>;
}

export const CreateOpportunityModal = ({
  isOpen,
  form,
  loading,
  clients,
  contacts,
  onClientChange,
  onCancel,
  onSubmit,
}: CreateOpportunityModalProps) => {
  return (
    <Modal
      title="Create Opportunity"
      open={isOpen}
      onCancel={onCancel}
      footer={null}
      width={640}
    >
      <OpportunityForm
        form={form}
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
