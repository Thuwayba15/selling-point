import { useState, useCallback } from "react";
import { Form } from "antd";
import type { FormInstance } from "antd";
import type { IActivity } from "@/providers/activities/context";
import type { IProposal } from "@/providers/proposals/context";
import type { IPricingRequest } from "@/providers/pricing-requests/context";
import type { IContract } from "@/providers/contracts/context";
import type { IDocument } from "@/providers/documents/context";
import type { INote } from "@/providers/notes/context";

export type EntityType =
  | "activity"
  | "proposal"
  | "pricingRequest"
  | "contract"
  | "document"
  | "note";

type WorkspaceEntity = IActivity | IProposal | IPricingRequest | IContract | IDocument | INote;

interface EntityModalState {
  isCreateOpen: boolean;
  isEditOpen: boolean;
  isAssignOpen: boolean;
  selectedEntity: WorkspaceEntity | null;
}

interface EntityModalsState {
  activity: EntityModalState;
  proposal: EntityModalState;
  pricingRequest: EntityModalState;
  contract: EntityModalState;
  document: EntityModalState;
  note: EntityModalState;
}

interface UseEntityModalsReturn {
  // States
  modals: EntityModalsState;
  selectedEntity: WorkspaceEntity | null;

  // Forms
  forms: Record<EntityType, Record<"create" | "edit" | "assign", FormInstance>>;

  // Modal open/close handlers
  openCreateModal: (type: EntityType) => void;
  openEditModal: (type: EntityType, entity: WorkspaceEntity) => void;
  openAssignModal: (type: EntityType, entity: WorkspaceEntity) => void;
  closeCreateModal: (type: EntityType) => void;
  closeEditModal: (type: EntityType) => void;
  closeAssignModal: (type: EntityType) => void;

  // Utilities
  resetForm: (type: EntityType, mode: "create" | "edit" | "assign") => void;
  isTyping: (type: EntityType, mode: "create" | "edit" | "assign") => boolean;
}

export const useEntityModals = (): UseEntityModalsReturn => {
  const [modals, setModals] = useState<EntityModalsState>({
    activity: { isCreateOpen: false, isEditOpen: false, isAssignOpen: false, selectedEntity: null },
    proposal: { isCreateOpen: false, isEditOpen: false, isAssignOpen: false, selectedEntity: null },
    pricingRequest: {
      isCreateOpen: false,
      isEditOpen: false,
      isAssignOpen: false,
      selectedEntity: null,
    },
    contract: { isCreateOpen: false, isEditOpen: false, isAssignOpen: false, selectedEntity: null },
    document: { isCreateOpen: false, isEditOpen: false, isAssignOpen: false, selectedEntity: null },
    note: { isCreateOpen: false, isEditOpen: false, isAssignOpen: false, selectedEntity: null },
  });

  const [selectedEntity, setSelectedEntity] = useState<WorkspaceEntity | null>(null);

  // Create all forms
  const [activityCreateForm] = Form.useForm();
  const [activityEditForm] = Form.useForm();
  const [activityAssignForm] = Form.useForm();

  const [proposalCreateForm] = Form.useForm();
  const [proposalEditForm] = Form.useForm();
  const [proposalAssignForm] = Form.useForm();

  const [pricingRequestCreateForm] = Form.useForm();
  const [pricingRequestEditForm] = Form.useForm();
  const [pricingRequestAssignForm] = Form.useForm();

  const [contractCreateForm] = Form.useForm();
  const [contractEditForm] = Form.useForm();
  const [contractAssignForm] = Form.useForm();

  const [documentCreateForm] = Form.useForm();
  const [documentEditForm] = Form.useForm();
  const [documentAssignForm] = Form.useForm();

  const [noteCreateForm] = Form.useForm();
  const [noteEditForm] = Form.useForm();
  const [noteAssignForm] = Form.useForm();

  const forms: Record<EntityType, Record<"create" | "edit" | "assign", FormInstance>> = {
    activity: { create: activityCreateForm, edit: activityEditForm, assign: activityAssignForm },
    proposal: { create: proposalCreateForm, edit: proposalEditForm, assign: proposalAssignForm },
    pricingRequest: {
      create: pricingRequestCreateForm,
      edit: pricingRequestEditForm,
      assign: pricingRequestAssignForm,
    },
    contract: { create: contractCreateForm, edit: contractEditForm, assign: contractAssignForm },
    document: { create: documentCreateForm, edit: documentEditForm, assign: documentAssignForm },
    note: { create: noteCreateForm, edit: noteEditForm, assign: noteAssignForm },
  };

  const openCreateModal = useCallback((type: EntityType) => {
    setModals((prev) => ({
      ...prev,
      [type]: { ...prev[type], isCreateOpen: true, selectedEntity: null },
    }));
    setSelectedEntity(null);
  }, []);

  const openEditModal = useCallback((type: EntityType, entity: WorkspaceEntity) => {
    setModals((prev) => ({
      ...prev,
      [type]: { ...prev[type], isEditOpen: true, selectedEntity: entity },
    }));
    setSelectedEntity(entity);
  }, []);

  const openAssignModal = useCallback((type: EntityType, entity: WorkspaceEntity) => {
    setModals((prev) => ({
      ...prev,
      [type]: { ...prev[type], isAssignOpen: true, selectedEntity: entity },
    }));
    setSelectedEntity(entity);
  }, []);

  const closeCreateModal = useCallback((type: EntityType) => {
    setModals((prev) => ({
      ...prev,
      [type]: { ...prev[type], isCreateOpen: false },
    }));
    resetForm(type, "create");
  }, []);

  const closeEditModal = useCallback((type: EntityType) => {
    setModals((prev) => ({
      ...prev,
      [type]: { ...prev[type], isEditOpen: false, selectedEntity: null },
    }));
    setSelectedEntity(null);
    resetForm(type, "edit");
  }, []);

  const closeAssignModal = useCallback((type: EntityType) => {
    setModals((prev) => ({
      ...prev,
      [type]: { ...prev[type], isAssignOpen: false, selectedEntity: null },
    }));
    setSelectedEntity(null);
    resetForm(type, "assign");
  }, []);

  const resetForm = useCallback(
    (type: EntityType, mode: "create" | "edit" | "assign") => {
      forms[type][mode].resetFields();
    },
    [forms],
  );

  const isTyping = useCallback(
    (type: EntityType, mode: "create" | "edit" | "assign") => {
      return mode === "create"
        ? modals[type].isCreateOpen
        : mode === "edit"
          ? modals[type].isEditOpen
          : modals[type].isAssignOpen;
    },
    [modals],
  );

  return {
    modals,
    selectedEntity,
    forms,
    openCreateModal,
    openEditModal,
    openAssignModal,
    closeCreateModal,
    closeEditModal,
    closeAssignModal,
    resetForm,
    isTyping,
  };
};
