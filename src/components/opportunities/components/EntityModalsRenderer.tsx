import { Form, Modal, Input, Switch, Button, Select } from "antd";
import React from "react";
import { ActivityForm } from "@/components/activities";
import { PricingRequestForm } from "@/components/pricing-requests";
import { ContractForm } from "@/components/contracts";
import { DocumentUploadForm } from "@/components/documents";
import { CreateProposalForm, EditProposalForm } from "@/components/proposals";
import { useEntityModals, type EntityType } from "../hooks/useEntityModals";
import type { FormInstance } from "antd";

interface EntityConfig {
  title: string;
  width?: number;
  footer?: boolean;
}

interface EntityModalsRendererProps {
  modals: ReturnType<typeof useEntityModals>["modals"];
  forms: ReturnType<typeof useEntityModals>["forms"];
  selectedEntity: any;
  isPending: boolean;
  onActivityCreate: (values: any) => Promise<void>;
  onActivityEdit: (values: any) => Promise<void>;
  onProposalCreate: (values: any) => Promise<void>;
  onProposalEdit: (values: any) => Promise<void>;
  onPricingRequestCreate: (values: any) => Promise<void>;
  onPricingRequestEdit: (values: any) => Promise<void>;
  onPricingRequestAssign: (values: any) => Promise<void>;
  onContractCreate: (values: any) => Promise<boolean>;
  onContractEdit: (values: any) => Promise<boolean>;
  onDocumentCreate: (values: any, file: File) => Promise<void>;
  onNoteCreate: () => Promise<void>;
  onNoteEdit: () => Promise<void>;
  closeCreateModal: (type: EntityType) => void;
  closeEditModal: (type: EntityType) => void;
  closeAssignModal: (type: EntityType) => void;
  activityUsers: Array<any>;
  activityClients: Array<any>;
  opportunities: Array<any>;
  proposals: Array<any>;
  contracts: Array<any>;
  clients: Array<any>;
  assignableUsers: Array<any>;
}

export const EntityModalsRenderer: React.FC<EntityModalsRendererProps> = ({
  modals,
  forms,
  selectedEntity,
  isPending,
  onActivityCreate,
  onActivityEdit,
  onProposalCreate,
  onProposalEdit,
  onPricingRequestCreate,
  onPricingRequestEdit,
  onPricingRequestAssign,
  onContractCreate,
  onContractEdit,
  onDocumentCreate,
  onNoteCreate,
  onNoteEdit,
  closeCreateModal,
  closeEditModal,
  closeAssignModal,
  activityUsers,
  activityClients,
  opportunities,
  proposals,
  contracts,
  clients,
  assignableUsers,
}) => {
  return (
    <>
      {/* Activity Modals */}
      <Modal
        title="Create Activity"
        open={modals.activity.isCreateOpen}
        onCancel={() => closeCreateModal("activity")}
        footer={null}
        width={700}
      >
        <ActivityForm
          form={forms.activity.create}
          loading={isPending}
          onSubmit={onActivityCreate}
          onCancel={() => closeCreateModal("activity")}
          users={activityUsers}
          clients={activityClients}
          opportunities={opportunities}
          proposals={proposals}
          contracts={contracts}
        />
      </Modal>

      <Modal
        title="Edit Activity"
        open={modals.activity.isEditOpen}
        onCancel={() => closeEditModal("activity")}
        footer={null}
        width={700}
      >
        <ActivityForm
          form={forms.activity.edit}
          initialValues={selectedEntity || undefined}
          loading={isPending}
          onSubmit={onActivityEdit}
          onCancel={() => closeEditModal("activity")}
          users={activityUsers}
          clients={activityClients}
          opportunities={opportunities}
          proposals={proposals}
          contracts={contracts}
        />
      </Modal>

      {/* Proposal Modals */}
      <Modal
        title="Create Proposal"
        open={modals.proposal.isCreateOpen}
        onCancel={() => closeCreateModal("proposal")}
        footer={null}
        width={900}
      >
        <CreateProposalForm
          loading={isPending}
          onSubmit={async (payload) => {
            await onProposalCreate(payload);
            closeCreateModal("proposal");
          }}
          onCancel={() => closeCreateModal("proposal")}
          opportunities={opportunities}
          clients={clients}
        />
      </Modal>

      <Modal
        title="Edit Proposal"
        open={modals.proposal.isEditOpen}
        onCancel={() => closeEditModal("proposal")}
        footer={null}
        width={900}
      >
        {selectedEntity ? (
          <EditProposalForm
            proposal={selectedEntity}
            loading={isPending}
            onSubmit={async (payload) => {
              await onProposalEdit(payload);
              closeEditModal("proposal");
            }}
            onCancel={() => closeEditModal("proposal")}
            opportunities={opportunities}
            clients={clients}
          />
        ) : null}
      </Modal>

      {/* Pricing Request Modals */}
      <Modal
        title="Create Pricing Request"
        open={modals.pricingRequest.isCreateOpen}
        onCancel={() => closeCreateModal("pricingRequest")}
        footer={null}
        width={640}
      >
        <PricingRequestForm
          form={forms.pricingRequest.create}
          loading={isPending}
          onSubmit={onPricingRequestCreate}
          onCancel={() => closeCreateModal("pricingRequest")}
          opportunities={opportunities}
        />
      </Modal>

      <Modal
        title="Edit Pricing Request"
        open={modals.pricingRequest.isEditOpen}
        onCancel={() => closeEditModal("pricingRequest")}
        footer={null}
        width={640}
      >
        <PricingRequestForm
          form={forms.pricingRequest.edit}
          initialValues={selectedEntity || undefined}
          loading={isPending}
          onSubmit={onPricingRequestEdit}
          onCancel={() => closeEditModal("pricingRequest")}
          opportunities={opportunities}
        />
      </Modal>

      <Modal
        title="Assign Pricing Request"
        open={modals.pricingRequest.isAssignOpen}
        onCancel={() => closeAssignModal("pricingRequest")}
        footer={null}
        width={480}
      >
        <Form
          form={forms.pricingRequest.assign}
          layout="vertical"
          onFinish={onPricingRequestAssign}
        >
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
              options={assignableUsers.map((item) => ({ value: item.id, label: item.label }))}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isPending} block>
              Assign Request
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Contract Modals */}
      <Modal
        title="Create Contract"
        open={modals.contract.isCreateOpen}
        onCancel={() => closeCreateModal("contract")}
        footer={null}
        width={800}
      >
        <ContractForm
          form={forms.contract.create}
          loading={isPending}
          onSubmit={async (values) => {
            const success = await onContractCreate(values);
            if (success) {
              closeCreateModal("contract");
            }
          }}
          onCancel={() => closeCreateModal("contract")}
          clients={clients}
          opportunities={opportunities}
          proposals={proposals}
        />
      </Modal>

      <Modal
        title="Edit Contract"
        open={modals.contract.isEditOpen}
        onCancel={() => closeEditModal("contract")}
        footer={null}
        width={800}
      >
        <ContractForm
          form={forms.contract.edit}
          initialValues={selectedEntity || undefined}
          loading={isPending}
          onSubmit={async (values) => {
            const success = await onContractEdit(values);
            if (success) {
              closeEditModal("contract");
            }
          }}
          onCancel={() => closeEditModal("contract")}
          clients={clients}
          opportunities={opportunities}
          proposals={proposals}
        />
      </Modal>

      {/* Document Modal */}
      <DocumentUploadForm
        open={modals.document.isCreateOpen}
        form={forms.document.create}
        loading={isPending}
        relatedToType={2}
        opportunityOptions={opportunities.map((item) => ({ value: item.id, label: item.title }))}
        onCancel={() => closeCreateModal("document")}
        onSubmit={onDocumentCreate}
      />

      {/* Note Modals */}
      <Modal
        title="Create Note"
        open={modals.note.isCreateOpen}
        onCancel={() => closeCreateModal("note")}
        onOk={onNoteCreate}
        okText="Create Note"
        confirmLoading={isPending}
      >
        <Form form={forms.note.create} layout="vertical">
          <Form.Item
            label="Content"
            name="content"
            rules={[{ required: true, message: "Please enter note content" }]}
          >
            <Input.TextArea rows={4} placeholder="Write your note" />
          </Form.Item>
          <Form.Item label="Private" name="isPrivate" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Edit Note"
        open={modals.note.isEditOpen}
        onCancel={() => closeEditModal("note")}
        onOk={onNoteEdit}
        okText="Update Note"
        confirmLoading={isPending}
      >
        <Form form={forms.note.edit} layout="vertical">
          <Form.Item
            label="Content"
            name="content"
            rules={[{ required: true, message: "Please enter note content" }]}
          >
            <Input.TextArea rows={4} placeholder="Write your note" />
          </Form.Item>
          <Form.Item label="Private" name="isPrivate" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
