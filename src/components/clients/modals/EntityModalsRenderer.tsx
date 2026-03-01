"use client";

import { Form, App } from "antd";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { FormInstance } from "antd";
import { CreateOpportunityModal } from "./CreateOpportunityModal";
import { CreateContactModal } from "./CreateContactModal";
import { EditContactModal } from "./EditContactModal";
import { useOpportunitiesActions } from "@/providers/opportunities";
import { useContactsActions } from "@/providers/contacts";
import { useContractsActions } from "@/providers/contracts";
import { useDocumentsActions } from "@/providers/documents";
import { useNotesActions } from "@/providers/notes";
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
  openEditModal: (type: "contact" | "opportunity" | "contract" | "document" | "note", entity: WorkspaceEntity) => void;
  closeModal: (type: "contact" | "opportunity" | "contract" | "document" | "note") => void;
  handleDeleteEntity: (type: "contact" | "opportunity" | "contract" | "document" | "note", entity: WorkspaceEntity, clientId: string) => Promise<void>;
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
  const [opportunityForm] = Form.useForm();
  const [createContactForm] = Form.useForm();
  const [editContactForm] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const opportunitiesActions = useOpportunitiesActions();
  const contactsActions = useContactsActions();

  const handleCreateOpportunity = useCallback(
    async (values: any) => {
      if (!selectedClient?.id) {
        message.error("Client not selected");
        return;
      }

      setIsSubmitting(true);
      try {
        const payload = {
          ...values,
          clientId: selectedClient.id,
          estimatedValue: values.estimatedValue ? parseFloat(values.estimatedValue) : 0,
          probability: values.probability ? parseFloat(values.probability) : 0,
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

  return (
    <>
      <CreateContactModal
        isOpen={
          entityModals.modals.contact.isOpen && entityModals.modals.contact.mode === "create"
        }
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
        isOpen={
          entityModals.modals.contact.isOpen && entityModals.modals.contact.mode === "edit"
        }
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
        onSubmit={handleCreateOpportunity}
        onCancel={() => entityModals.closeModal("opportunity")}
      />
    </>
  );
};
