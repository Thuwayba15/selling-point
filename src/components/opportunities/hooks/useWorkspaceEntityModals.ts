"use client";

import { useState } from "react";
import { App, Modal, Form } from "antd";
import { ActivityForm } from "@/components/activities";
import { CreateProposalForm } from "@/components/proposals";
import { PricingRequestForm } from "@/components/pricing-requests";
import { ContractForm } from "@/components/contracts";
import { DocumentUploadForm } from "@/components/documents";
import type { IActivity } from "@/providers/activities/context";
import type { IProposal } from "@/providers/proposals/context";
import type { IPricingRequest } from "@/providers/pricing-requests/context";
import type { IContract } from "@/providers/contracts/context";
import type { IDocument } from "@/providers/documents/context";
import type { INote } from "@/providers/notes/context";
import { useActivitiesActions } from "@/providers/activities";
import { useProposalsActions } from "@/providers/proposals";
import { usePricingRequestsActions } from "@/providers/pricing-requests";
import { useContractsActions } from "@/providers/contracts";
import { useDocumentsActions } from "@/providers/documents";
import { useNotesActions } from "@/providers/notes";

type EntityType = "activity" | "proposal" | "pricingRequest" | "contract" | "document" | "note";

type WorkspaceEntity = IActivity | IProposal | IPricingRequest | IContract | IDocument | INote;

interface WorkspaceEntityModalManagerProps {
  opportunityId: string;
  clientId?: string;
  onRefresh: () => void;
}

export const useWorkspaceEntityModals = (
  opportunityId: string,
  clientId: string | undefined,
  onRefresh: () => void,
) => {
  const { message } = App.useApp();

  const [activeModal, setActiveModal] = useState<{
    type: EntityType;
    mode: "create" | "edit" | "view";
    entity?: WorkspaceEntity;
  } | null>(null);

  const activitiesActions = useActivitiesActions();
  const proposalsActions = useProposalsActions();
  const pricingRequestsActions = usePricingRequestsActions();
  const contractsActions = useContractsActions();
  const documentsActions = useDocumentsActions();
  const notesActions = useNotesActions();

  const [activityForm] = Form.useForm();
  const [pricingRequestForm] = Form.useForm();
  const [contractForm] = Form.useForm();

  const openCreateModal = (type: EntityType) => {
    setActiveModal({ type, mode: "create" });
  };

  const openEditModal = (type: EntityType, entity: WorkspaceEntity) => {
    setActiveModal({ type, mode: "edit", entity });

    // Pre-fill form with entity data
    switch (type) {
      case "activity":
        activityForm.setFieldsValue(entity);
        break;
      case "pricingRequest":
        pricingRequestForm.setFieldsValue(entity);
        break;
      case "contract":
        contractForm.setFieldsValue(entity);
        break;
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    activityForm.resetFields();
    pricingRequestForm.resetFields();
    contractForm.resetFields();
  };

  const handleActivitySubmit = async (values: Partial<IActivity>) => {
    try {
      const payload = {
        ...values,
        relatedToType: 2, // Opportunity
        relatedToId: opportunityId,
      };

      if (activeModal?.mode === "create") {
        await activitiesActions.createActivity(payload);
      } else if (activeModal?.entity) {
        await activitiesActions.updateActivity(activeModal.entity.id, payload);
      }

      message.success(
        `Activity ${activeModal?.mode === "create" ? "created" : "updated"} successfully`,
      );
      closeModal();
      onRefresh();
    } catch (error) {
      message.error("Failed to save activity");
    }
  };

  const handleProposalCreate = async (values: Partial<IProposal>) => {
    try {
      const payload = {
        ...values,
        opportunityId,
        clientId,
      };

      const success = await proposalsActions.createProposal(payload);
      if (success) {
        message.success("Proposal created successfully");
        closeModal();
        onRefresh();
      }
    } catch (error) {
      message.error("Failed to create proposal");
    }
  };

  const handlePricingRequestSubmit = async (values: Partial<IPricingRequest>) => {
    try {
      const payload = {
        ...values,
        opportunityId,
      };

      let success = false;
      if (activeModal?.mode === "create") {
        success = await pricingRequestsActions.createPricingRequest(payload);
      } else if (activeModal?.entity) {
        success = await pricingRequestsActions.updatePricingRequest(
          activeModal.entity.id,
          payload,
        );
      }

      if (success) {
        message.success(
          `Pricing request ${activeModal?.mode === "create" ? "created" : "updated"} successfully`,
        );
        closeModal();
        onRefresh();
      }
    } catch (error) {
      message.error("Failed to save pricing request");
    }
  };

  const handleContractSubmit = async (values: Partial<IContract>) => {
    try {
      const payload = {
        ...values,
        opportunityId,
        clientId,
      };

      let success = false;
      if (activeModal?.mode === "create") {
        success = await contractsActions.createContract(payload);
      } else if (activeModal?.entity) {
        success = await contractsActions.updateContract(activeModal.entity.id, payload);
      }

      if (success) {
        message.success(
          `Contract ${activeModal?.mode === "create" ? "created" : "updated"} successfully`,
        );
        closeModal();
        onRefresh();
      }
    } catch (error) {
      message.error("Failed to save contract");
    }
  };

  const handleNoteSubmit = async (content: string, isPrivate: boolean) => {
    try {
      const payload = {
        content,
        isPrivate,
        relatedToType: 2, // Opportunity
        relatedToId: opportunityId,
      };

      await notesActions.createNote(payload);
      message.success("Note added successfully");
      closeModal();
      onRefresh();
    } catch (error) {
      message.error("Failed to add note");
    }
  };

  const handleDelete = async (type: EntityType, id: string) => {
    Modal.confirm({
      title: `Delete ${type}?`,
      content: "This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          switch (type) {
            case "activity":
              await activitiesActions.deleteActivity(id);
              break;
            case "proposal":
              await proposalsActions.deleteProposal(id);
              break;
            case "pricingRequest":
              // API may not support delete, only update status
              message.warning("Pricing requests cannot be deleted");
              return;
            case "contract":
              await contractsActions.deleteContract(id);
              break;
            case "document":
              await documentsActions.deleteDocument(id);
              break;
            case "note":
              await notesActions.deleteNote(id);
              break;
          }

          message.success(`${type} deleted successfully`);
          onRefresh();
        } catch (error) {
          message.error(`Failed to delete ${type}`);
        }
      },
    });
  };

  return {
    activeModal,
    openCreateModal,
    openEditModal,
    closeModal,
    handleActivitySubmit,
    handleProposalCreate,
    handlePricingRequestSubmit,
    handleContractSubmit,
    handleNoteSubmit,
    handleDelete,
    forms: {
      activityForm,
      pricingRequestForm,
      contractForm,
    },
  };
};
