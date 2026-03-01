"use client";

import { useState, useCallback } from "react";
import { App, Modal, Form } from "antd";
import { useRouter } from "next/navigation";
import { useContactsActions } from "@/providers/contacts";
import { useOpportunitiesActions } from "@/providers/opportunities";
import { useContractsActions } from "@/providers/contracts";
import { useDocumentsActions } from "@/providers/documents";
import { useNotesActions } from "@/providers/notes";
import { useRbac } from "@/hooks/useRbac";
import type { FormInstance } from "antd";
import type { IContact } from "@/providers/contacts/context";
import type { IOpportunity } from "@/providers/opportunities/context";
import type { IContract } from "@/providers/contracts/context";
import type { IDocument } from "@/providers/documents/context";
import type { INote } from "@/providers/notes/context";

export type EntityType = "contact" | "opportunity" | "contract" | "document" | "note";

type WorkspaceEntity = IContact | IOpportunity | IContract | IDocument | INote;

interface ModalState {
  isOpen: boolean;
  entity: WorkspaceEntity | null;
  mode: "create" | "edit";
}

export const useClientEntityModals = (onRefresh?: () => Promise<void>) => {
  const { message } = App.useApp();
  const router = useRouter();
  const { can } = useRbac();

  const contactsActions = useContactsActions();
  const opportunitiesActions = useOpportunitiesActions();
  const contractsActions = useContractsActions();
  const documentsActions = useDocumentsActions();
  const notesActions = useNotesActions();

  const [modals, setModals] = useState<Record<EntityType, ModalState>>({
    contact: { isOpen: false, entity: null, mode: "create" },
    opportunity: { isOpen: false, entity: null, mode: "create" },
    contract: { isOpen: false, entity: null, mode: "create" },
    document: { isOpen: false, entity: null, mode: "create" },
    note: { isOpen: false, entity: null, mode: "create" },
  });

  const [contactForm] = Form.useForm();
  const [opportunityForm] = Form.useForm();
  const [contractForm] = Form.useForm();
  const [documentForm] = Form.useForm();
  const [noteForm] = Form.useForm();

  const forms: Record<EntityType, FormInstance> = {
    contact: contactForm,
    opportunity: opportunityForm,
    contract: contractForm,
    document: documentForm,
    note: noteForm,
  };

  const openCreateModal = useCallback((type: EntityType) => {
    setModals((prev) => ({
      ...prev,
      [type]: { isOpen: true, entity: null, mode: "create" },
    }));
  }, []);

  const openEditModal = useCallback((type: EntityType, entity: WorkspaceEntity) => {
    setModals((prev) => ({
      ...prev,
      [type]: { isOpen: true, entity, mode: "edit" },
    }));
  }, []);

  const closeModal = useCallback((type: EntityType) => {
    setModals((prev) => ({
      ...prev,
      [type]: { isOpen: false, entity: null, mode: "create" },
    }));
  }, []);

  const handleDeleteEntity = useCallback(
    async (type: EntityType, entity: WorkspaceEntity, clientId: string) => {
      if (!entity?.id) return;

      return new Promise<void>((resolve) => {
        Modal.confirm({
          title: "Delete Item",
          content: `Are you sure you want to delete this ${type}? This action cannot be undone.`,
          okText: "Delete",
          okType: "danger",
          onOk: async () => {
            try {
              switch (type) {
                case "contact":
                  if (can("delete:contact")) {
                    await contactsActions.deleteContact((entity as IContact).id);
                    message.success("Contact deleted successfully");
                  }
                  break;
                case "opportunity":
                  if (can("delete:opportunity")) {
                    await opportunitiesActions.deleteOpportunity((entity as IOpportunity).id);
                    message.success("Opportunity deleted successfully");
                  }
                  break;
                case "contract":
                  if (can("delete:contract")) {
                    await contractsActions.deleteContract((entity as IContract).id);
                    message.success("Contract deleted successfully");
                  }
                  break;
                case "document":
                  if (can("delete:document")) {
                    await documentsActions.deleteDocument((entity as IDocument).id);
                    message.success("Document deleted successfully");
                  }
                  break;
                case "note":
                  if (can("delete:note")) {
                    await notesActions.deleteNote((entity as INote).id);
                    message.success("Note deleted successfully");
                  }
                  break;
              }
              // Refresh workspace data after deletion
              if (onRefresh) {
                await onRefresh();
              }
              resolve();
            } catch (error) {
              message.error(`Failed to delete ${type}`);
              resolve();
            }
          },
        });
      });
    },
    [can, message, contactsActions, opportunitiesActions, contractsActions, documentsActions, notesActions, onRefresh],
  );

  return {
    modals,
    forms,
    openCreateModal,
    openEditModal,
    closeModal,
    handleDeleteEntity,
  };
};
