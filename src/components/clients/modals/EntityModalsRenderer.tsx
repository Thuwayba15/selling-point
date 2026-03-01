"use client";

import { Form, App, Modal } from "antd";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import type { FormInstance } from "antd";
import { CreateOpportunityModal } from "./CreateOpportunityModal";
import { CreateContactModal } from "./CreateContactModal";
import { EditContactModal } from "./EditContactModal";
import { ContractForm } from "@/components/contracts";
import { useOpportunitiesActions } from "@/providers/opportunities";
import { useContactsActions } from "@/providers/contacts";
import { useContractsActions } from "@/providers/contracts";
import { useAuthState } from "@/providers/auth";
import type { IClient } from "@/providers/clients/context";
import type { IContact } from "@/providers/contacts/context";
import type { IOpportunity } from "@/providers/opportunities/context";
import type { IContract } from "@/providers/contracts/context";
import type { IDocument } from "@/providers/documents/context";
import type { INote } from "@/providers/notes/context";
import type { ContactFormValues } from "@/types/forms";

type WorkspaceEntity = IContact | IOpportunity | IContract | IDocument | INote;

interface WorkspaceData {
  contacts: IContact[];
  opportunities: IOpportunity[];
  contracts: IContract[];
  documents: IDocument[];
  notes: INote[];
}

interface UseClientEntityModalsType {
  modals: {
    contact: { isOpen: boolean; entity: WorkspaceEntity | null; mode: "create" | "edit" };
    opportunity: { isOpen: boolean; entity: WorkspaceEntity | null; mode: "create" | "edit" };
    contract: { isOpen: boolean; entity: WorkspaceEntity | null; mode: "create" | "edit" };
    document: { isOpen: boolean; entity: WorkspaceEntity | null; mode: "create" | "edit" };
    note: { isOpen: boolean; entity: WorkspaceEntity | null; mode: "create" | "edit" };
  };
  forms: {
    contact: FormInstance<any>;
    opportunity: FormInstance<any>;
    contract: FormInstance<any>;
    document: FormInstance<any>;
    note: FormInstance<any>;
  };
  openCreateModal: (type: "contact" | "opportunity" | "contract" | "document" | "note") => void;
  openEditModal: (
    type: "contact" | "opportunity" | "contract" | "document" | "note",
    entity: WorkspaceEntity,
  ) => void;
  closeModal: (type: "contact" | "opportunity" | "contract" | "document" | "note") => void;
  handleDeleteEntity: (
    type: "contact" | "opportunity" | "contract" | "document" | "note",
    entity: WorkspaceEntity,
    clientId: string,
  ) => Promise<void>;
}

interface EntityModalsRendererProps {
  entityModals: UseClientEntityModalsType;
  selectedClient: IClient | null;
  workspaceData: WorkspaceData;
  onRefresh: () => Promise<void>;
}

export const EntityModalsRenderer = ({
  entityModals,
  selectedClient,
  workspaceData,
  onRefresh,
}: EntityModalsRendererProps) => {
  const { message } = App.useApp();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthState();

  const opportunitiesActions = useOpportunitiesActions();
  const contactsActions = useContactsActions();
  const contractsActions = useContractsActions();

  // Use forms from the entityModals hook
  const opportunityForm = entityModals.forms.opportunity;
  const createContactForm = entityModals.forms.contact;
  const editContactForm = entityModals.forms.contact; // Same form for create/edit
  const contractForm = entityModals.forms.contract;

  // Pre-fill contract form with clientId when modal opens in create mode
  useEffect(() => {
    if (
      entityModals.modals.contract.isOpen &&
      entityModals.modals.contract.mode === "create" &&
      selectedClient
    ) {
      contractForm.setFieldsValue({
        clientId: selectedClient.id,
        currency: "R",
        status: 1,
        autoRenew: false,
      });
    } else if (
      entityModals.modals.contract.isOpen &&
      entityModals.modals.contract.mode === "edit" &&
      entityModals.modals.contract.entity
    ) {
      const contract = entityModals.modals.contract.entity as IContract;
      contractForm.setFieldsValue({
        ...contract,
        startDate: contract.startDate ? dayjs(contract.startDate) : undefined,
        endDate: contract.endDate ? dayjs(contract.endDate) : undefined,
      });
    } else if (!entityModals.modals.contract.isOpen) {
      contractForm.resetFields();
    }
  }, [
    entityModals.modals.contract.isOpen,
    entityModals.modals.contract.mode,
    entityModals.modals.contract.entity,
    selectedClient,
    contractForm,
  ]);

  const handleCreateOpportunity = useCallback(
    async (values: any) => {
      if (!selectedClient?.id) {
        message.error("Client not selected");
        return;
      }

      if (!user?.id) {
        message.error("User not authenticated");
        return;
      }

      setIsSubmitting(true);
      try {
        const payload = {
          ...values,
          clientId: selectedClient.id,
          ownerId: user.id, // Add the current user's ID as the owner
          estimatedValue: values.estimatedValue ? parseFloat(values.estimatedValue) : 0,
          probability: values.probability ? parseFloat(values.probability) : 0,
          currency: "R", // Always set to ZAR
        };

        await opportunitiesActions.createOpportunity(payload);
        message.success("Opportunity created successfully");
        opportunityForm.resetFields();
        entityModals.closeModal("opportunity");
        await onRefresh();
      } catch (error) {
        message.error("Failed to create opportunity");
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      selectedClient?.id,
      user?.id,
      opportunitiesActions,
      message,
      entityModals,
      opportunityForm,
      onRefresh,
    ],
  );

  const handleEditOpportunity = useCallback(
    async (values: any) => {
      if (!entityModals.modals.opportunity.entity || !selectedClient?.id) {
        message.error("Unable to update opportunity");
        return;
      }

      const opportunity = entityModals.modals.opportunity.entity as IOpportunity;
      setIsSubmitting(true);
      try {
        const payload = {
          ...values,
          clientId: selectedClient.id,
          estimatedValue: values.estimatedValue ? parseFloat(values.estimatedValue) : 0,
          probability: values.probability ? parseFloat(values.probability) : 0,
        };

        await opportunitiesActions.updateOpportunity(opportunity.id, payload);
        message.success("Opportunity updated successfully");
        opportunityForm.resetFields();
        entityModals.closeModal("opportunity");
        await onRefresh();
      } catch (error) {
        message.error("Failed to update opportunity");
      } finally {
        setIsSubmitting(false);
      }
    },
    [selectedClient?.id, opportunitiesActions, message, entityModals, opportunityForm, onRefresh],
  );

  const handleCreateContact = useCallback(
    async (values: ContactFormValues) => {
      if (!selectedClient?.id) {
        message.error("Client not selected");
        return;
      }

      setIsSubmitting(true);
      try {
        const payload = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phoneNumber: values.phoneNumber,
          position: values.position,
          isPrimaryContact: values.isPrimaryContact ?? false,
          clientId: selectedClient.id,
        };

        await contactsActions.createContact(payload);
        message.success("Contact created successfully");
        createContactForm.resetFields();
        entityModals.closeModal("contact");
        await onRefresh();
      } catch (error) {
        message.error("Failed to create contact");
      } finally {
        setIsSubmitting(false);
      }
    },
    [selectedClient?.id, contactsActions, message, entityModals, createContactForm, onRefresh],
  );

  const handleEditContact = useCallback(
    async (values: ContactFormValues) => {
      if (!entityModals.modals.contact.entity || !selectedClient?.id) {
        message.error("Unable to update contact");
        return;
      }

      const contact = entityModals.modals.contact.entity as IContact;
      setIsSubmitting(true);
      try {
        const payload = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phoneNumber: values.phoneNumber,
          position: values.position,
          isPrimaryContact: values.isPrimaryContact ?? false,
          isActive: contact.isActive ?? true,
        };

        await contactsActions.updateContact(contact.id, payload);
        message.success("Contact updated successfully");
        editContactForm.resetFields();
        entityModals.closeModal("contact");
        await onRefresh();
      } catch (error) {
        message.error("Failed to update contact");
      } finally {
        setIsSubmitting(false);
      }
    },
    [entityModals, selectedClient?.id, contactsActions, message, editContactForm, onRefresh],
  );

  const handleCreateContract = useCallback(
    async (values: any) => {
      if (!selectedClient?.id) {
        message.error("Client not selected");
        return;
      }

      if (!user?.id) {
        message.error("User not authenticated");
        return;
      }

      setIsSubmitting(true);
      try {
        const payload = {
          ...values,
          clientId: selectedClient.id,
          ownerId: user.id, // Add the current user's ID as the owner
          contractValue: values.contractValue ? parseFloat(values.contractValue) : 0,
          currency: "R", // Always set to ZAR
        };

        const result = await contractsActions.createContract(payload);
        message.success("Contract created successfully");
        contractForm.resetFields();
        entityModals.closeModal("contract");
        await onRefresh();
      } catch (error) {
        message.error("Failed to create contract");
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      selectedClient?.id,
      user?.id,
      contractsActions,
      message,
      entityModals,
      contractForm,
      onRefresh,
    ],
  );

  const handleEditContract = useCallback(
    async (values: any) => {
      if (!entityModals.modals.contract.entity || !selectedClient?.id) {
        message.error("Unable to update contract");
        return;
      }

      const contract = entityModals.modals.contract.entity as IContract;
      setIsSubmitting(true);
      try {
        const payload = {
          ...values,
          clientId: selectedClient.id,
          contractValue: values.contractValue ? parseFloat(values.contractValue) : 0,
        };

        await contractsActions.updateContract(contract.id, payload);
        message.success("Contract updated successfully");
        contractForm.resetFields();
        entityModals.closeModal("contract");
        await onRefresh();
      } catch (error) {
        message.error("Failed to update contract");
      } finally {
        setIsSubmitting(false);
      }
    },
    [selectedClient?.id, contractsActions, message, entityModals, contractForm, onRefresh],
  );

  return (
    <>
      <CreateContactModal
        isOpen={entityModals.modals.contact.isOpen && entityModals.modals.contact.mode === "create"}
        form={createContactForm}
        loading={isSubmitting}
        onSubmit={handleCreateContact}
        onCancel={() => {
          entityModals.closeModal("contact");
          createContactForm.resetFields();
        }}
        clients={selectedClient ? [{ id: selectedClient.id, name: selectedClient.name }] : []}
      />

      <EditContactModal
        isOpen={entityModals.modals.contact.isOpen && entityModals.modals.contact.mode === "edit"}
        contact={(entityModals.modals.contact.entity as IContact) || null}
        form={editContactForm}
        loading={isSubmitting}
        onSubmit={handleEditContact}
        onCancel={() => {
          entityModals.closeModal("contact");
          editContactForm.resetFields();
        }}
      />

      <CreateOpportunityModal
        isOpen={entityModals.modals.opportunity.isOpen}
        client={selectedClient}
        form={opportunityForm}
        loading={isSubmitting}
        onSubmit={
          entityModals.modals.opportunity.mode === "create"
            ? handleCreateOpportunity
            : handleEditOpportunity
        }
        initialValues={
          entityModals.modals.opportunity.mode === "edit"
            ? (entityModals.modals.opportunity.entity as IOpportunity)
            : undefined
        }
        onCancel={() => entityModals.closeModal("opportunity")}
      />

      <Modal
        title={entityModals.modals.contract.mode === "create" ? "Create Contract" : "Edit Contract"}
        open={entityModals.modals.contract.isOpen}
        onCancel={() => {
          entityModals.closeModal("contract");
          contractForm.resetFields();
        }}
        footer={null}
        width={700}
      >
        <ContractForm
          form={contractForm}
          initialValues={
            entityModals.modals.contract.mode === "edit"
              ? (entityModals.modals.contract.entity as IContract)
              : undefined
          }
          loading={isSubmitting}
          onSubmit={
            entityModals.modals.contract.mode === "create"
              ? handleCreateContract
              : handleEditContract
          }
          onCancel={() => {
            entityModals.closeModal("contract");
            contractForm.resetFields();
          }}
          clients={selectedClient ? [{ id: selectedClient.id, name: selectedClient.name }] : []}
          opportunities={workspaceData.opportunities.map((opp) => ({
            id: opp.id,
            title: opp.title,
          }))}
          proposals={[]} // Proposals would need to be fetched separately
        />
      </Modal>
    </>
  );
};
