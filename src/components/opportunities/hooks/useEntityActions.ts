import { App, Modal } from "antd";
import { useCallback } from "react";
import { useRbac } from "@/hooks/useRbac";
import { useAuthState } from "@/providers/auth";
import { useActivitiesActions } from "@/providers/activities";
import { useProposalsActions } from "@/providers/proposals";
import { usePricingRequestsActions } from "@/providers/pricing-requests";
import { useContractsActions } from "@/providers/contracts";
import { useDocumentsActions } from "@/providers/documents";
import { useNotesActions } from "@/providers/notes";
import { ActivityType, Priority, RelatedToType } from "@/providers/activities/context";
import type { EntityType } from "./useEntityModals";
import type { IActivity } from "@/providers/activities/context";
import type { IProposal, IProposalLineItem } from "@/providers/proposals/context";
import type { IPricingRequest } from "@/providers/pricing-requests/context";
import type { IContract } from "@/providers/contracts/context";
import type { IDocument } from "@/providers/documents/context";
import type { INote } from "@/providers/notes/context";
import type { IOpportunity } from "@/providers/opportunities/context";
import type { CreateProposalPayload } from "@/components/proposals/CreateProposalForm";
import type { UpdateProposalPayload } from "@/components/proposals/EditProposalForm";
import type {
  ActivityFormValues,
  PricingRequestFormValues,
  ContractFormValues,
} from "@/types/forms";

type WorkspaceEntity = IActivity | IProposal | IPricingRequest | IContract | IDocument | INote;

interface OptionItem {
  value: string;
  label: string;
}

const EMPTY_GUID = "00000000-0000-0000-0000-000000000000";

const normalizeOwnerId = (...candidates: Array<string | undefined>) => {
  const validOwnerId = candidates.find((candidate) => {
    const trimmedCandidate = candidate?.trim();
    return Boolean(trimmedCandidate && trimmedCandidate !== EMPTY_GUID);
  });

  return validOwnerId?.trim();
};

interface UseEntityActionsProps {
  selectedOpportunity: IOpportunity | null;
  selectedEntity: WorkspaceEntity | null;
  onRefresh: () => Promise<void>;
  usersList: OptionItem[];
  clientsList: OptionItem[];
  opportunitiesList: OptionItem[];
  proposalsList: OptionItem[];
  contractsList: OptionItem[];
}

export const useEntityActions = ({
  selectedOpportunity,
  selectedEntity,
  onRefresh,
  usersList,
  clientsList,
  opportunitiesList,
  proposalsList,
  contractsList,
}: UseEntityActionsProps) => {
  const { message } = App.useApp();
  const { can } = useRbac();
  const { user } = useAuthState();

  const activitiesActions = useActivitiesActions();
  const proposalsActions = useProposalsActions();
  const pricingRequestsActions = usePricingRequestsActions();
  const contractsActions = useContractsActions();
  const documentsActions = useDocumentsActions();
  const notesActions = useNotesActions();

  const handleCreateEntity = useCallback(
    (type: EntityType) => {
      switch (type) {
        case "activity":
          return {
            canCreate: can("create:activity"),
            defaultValues: {
              type: ActivityType.Task,
              priority: Priority.Medium,
              relatedToType: RelatedToType.Opportunity,
              relatedToId: selectedOpportunity?.id,
            },
          };
        case "proposal":
          return {
            canCreate: can("create:proposal"),
            defaultValues: {},
          };
        case "pricingRequest":
          return {
            canCreate: can("create:pricing-request"),
            defaultValues: {
              opportunityId: selectedOpportunity?.id,
              status: 1,
              priority: 2,
              currency: "R",
            },
          };
        case "contract":
          return {
            canCreate: can("create:contract"),
            defaultValues: {
              clientId: selectedOpportunity?.clientId,
              opportunityId: selectedOpportunity?.id,
              status: 1,
              currency: "R",
            },
          };
        case "document":
          return {
            canCreate: can("create:document"),
            defaultValues: {
              relatedToType: 2,
              relatedToId: selectedOpportunity?.id,
            },
          };
        case "note":
          return {
            canCreate: can("create:note"),
            defaultValues: { isPrivate: false },
          };
      }
    },
    [can, selectedOpportunity],
  );

  const handleActivityCreate = useCallback(
    async (values: Partial<IActivity>) => {
      try {
        if (!selectedOpportunity) return;
        await activitiesActions.createActivity({
          ...values,
          relatedToType: RelatedToType.Opportunity,
          relatedToId: selectedOpportunity.id,
        });
        message.success("Activity created successfully");
        await onRefresh();
      } catch {
        message.error("Failed to create activity");
      }
    },
    [selectedOpportunity, activitiesActions, message, onRefresh],
  );

  const handleActivityEdit = useCallback(
    async (values: Partial<IActivity>) => {
      try {
        if (!selectedEntity?.id || !selectedOpportunity) return;
        await activitiesActions.updateActivity(selectedEntity.id, {
          ...values,
          relatedToType: RelatedToType.Opportunity,
          relatedToId: selectedOpportunity.id,
        });
        message.success("Activity updated successfully");
        await onRefresh();
      } catch {
        message.error("Failed to update activity");
      }
    },
    [selectedEntity, selectedOpportunity, activitiesActions, message, onRefresh],
  );

  const handleProposalCreate = useCallback(
    async (payload: CreateProposalPayload) => {
      try {
        if (!selectedOpportunity) return;
        const success = await proposalsActions.createProposal({
          ...payload,
          opportunityId: selectedOpportunity.id,
          clientId: selectedOpportunity.clientId,
        });
        if (!success) return;
        message.success("Proposal created successfully");
        await onRefresh();
      } catch {
        message.error("Failed to create proposal");
      }
    },
    [selectedOpportunity, proposalsActions, message, onRefresh],
  );

  const handleProposalEdit = useCallback(
    async (payload: UpdateProposalPayload) => {
      try {
        if (!selectedEntity?.id) return;
        const { lineItems, ...proposalData } = payload;

        const success = await proposalsActions.updateProposal(selectedEntity.id, {
          ...proposalData,
          currency: "R",
        });
        if (!success) return;

        if (lineItems) {
          const existingLineItems = ('lineItems' in selectedEntity && selectedEntity.lineItems) ? selectedEntity.lineItems : [];
          const existingIds = new Set(existingLineItems.map((item: IProposalLineItem) => item.id).filter(Boolean));

          const newItems = lineItems.filter((item) => !item.id || !existingIds.has(item.id));
          for (const item of newItems) {
            await proposalsActions.addLineItem(selectedEntity.id, {
              productServiceName: item.productServiceName,
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              discount: item.discount,
              taxRate: item.taxRate,
            });
          }

          const newItemIds = new Set(lineItems.map((item) => item.id).filter(Boolean));
          const deletedItems = existingLineItems.filter(
            (item: IProposalLineItem) => item.id && !newItemIds.has(item.id),
          );
          for (const item of deletedItems) {
            await proposalsActions.deleteLineItem(selectedEntity.id, item.id);
          }
        }

        message.success("Proposal updated successfully");
        await onRefresh();
      } catch {
        message.error("Failed to update proposal");
      }
    },
    [selectedEntity, proposalsActions, message, onRefresh],
  );

  const handleProposalSubmit = useCallback(
    async (entity: IProposal) => {
      try {
        if (!entity?.id) return;
        const success = await proposalsActions.submitProposal(entity.id);
        if (!success) return;
        message.success("Proposal submitted for approval");
        await onRefresh();
      } catch {
        message.error("Failed to submit proposal");
      }
    },
    [proposalsActions, message, onRefresh],
  );

  const handleProposalApprove = useCallback(
    async (entity: IProposal) => {
      try {
        if (!entity?.id) return;
        const success = await proposalsActions.approveProposal(entity.id);
        if (!success) return;
        message.success("Proposal approved successfully");
        await onRefresh();
      } catch {
        message.error("Failed to approve proposal");
      }
    },
    [proposalsActions, message, onRefresh],
  );

  const handleProposalReject = useCallback(
    async (entity: IProposal) => {
      if (!entity?.id) return;

      const reason = window.prompt("Please provide a rejection reason:", "")?.trim();
      if (!reason) {
        message.error("Rejection reason is required");
        return;
      }

      try {
        const success = await proposalsActions.rejectProposal(entity.id, reason);
        if (!success) return;
        message.success("Proposal rejected successfully");
        await onRefresh();
      } catch {
        message.error("Failed to reject proposal");
      }
    },
    [proposalsActions, message, onRefresh],
  );

  const handlePricingRequestCreate = useCallback(
    async (values: PricingRequestFormValues) => {
      try {
        if (!selectedOpportunity) return;
        const success = await pricingRequestsActions.createPricingRequest({
          ...values,
          opportunityId: selectedOpportunity.id,
          status: typeof values.status === 'string' ? parseInt(values.status, 10) : values.status,
          priority: typeof values.priority === 'string' ? parseInt(values.priority, 10) : values.priority,
          estimatedValue: typeof values.estimatedValue === 'string' ? parseFloat(values.estimatedValue) : values.estimatedValue,
        } as Partial<IPricingRequest>);
        if (!success) return;
        message.success("Pricing request created successfully");
        await onRefresh();
      } catch {
        message.error("Failed to create pricing request");
      }
    },
    [selectedOpportunity, pricingRequestsActions, message, onRefresh],
  );

  const handlePricingRequestEdit = useCallback(
    async (values: PricingRequestFormValues) => {
      try {
        if (!selectedEntity?.id) return;
        const success = await pricingRequestsActions.updatePricingRequest(
          selectedEntity.id,
          {
            ...values,
            status: typeof values.status === 'string' ? parseInt(values.status, 10) : values.status,
            priority: typeof values.priority === 'string' ? parseInt(values.priority, 10) : values.priority,
            estimatedValue: typeof values.estimatedValue === 'string' ? parseFloat(values.estimatedValue) : values.estimatedValue,
          } as Partial<IPricingRequest>,
        );
        if (!success) return;
        message.success("Pricing request updated successfully");
        await onRefresh();
      } catch {
        message.error("Failed to update pricing request");
      }
    },
    [selectedEntity, pricingRequestsActions, message, onRefresh],
  );

  const handlePricingRequestAssign = useCallback(
    async (values: { userId: string }) => {
      try {
        if (!selectedEntity?.id) return;
        const success = await pricingRequestsActions.assignPricingRequest(
          selectedEntity.id,
          values.userId,
        );
        if (!success) return;
        message.success("Pricing request assigned successfully");
        await onRefresh();
      } catch {
        message.error("Failed to assign pricing request");
      }
    },
    [selectedEntity, pricingRequestsActions, message, onRefresh],
  );

  const handlePricingRequestComplete = useCallback(
    async (entity: IPricingRequest) => {
      if (!can("complete:pricing-request")) return;

      Modal.confirm({
        title: "Complete pricing request?",
        content: "Mark this pricing request as completed.",
        okText: "Complete",
        onOk: async () => {
          try {
            const success = await pricingRequestsActions.completePricingRequest(entity.id);
            if (!success) return;
            message.success("Pricing request marked as completed");
            await onRefresh();
          } catch {
            message.error("Failed to complete pricing request");
          }
        },
      });
    },
    [can, pricingRequestsActions, message, onRefresh],
  );

  const handleContractCreate = useCallback(
    async (values: ContractFormValues) => {
      try {
        if (!selectedOpportunity) return false;
        const ownerId = normalizeOwnerId(values.ownerId, user?.id);
        const startDate = typeof values.startDate === "string" ? values.startDate : values.startDate.toISOString();
        const endDate = typeof values.endDate === "string" ? values.endDate : values.endDate.toISOString();
        const contractData = {
          ...values,
          opportunityId: selectedOpportunity.id,
          clientId: selectedOpportunity.clientId,
          ownerId,
          startDate,
          endDate,
          value: typeof values.value === 'string' ? parseFloat(values.value) : values.value,
          status: typeof values.status === 'string' ? parseInt(values.status, 10) : values.status,
          renewalNoticeDays: values.renewalNoticeDays ? (typeof values.renewalNoticeDays === 'string' ? parseInt(values.renewalNoticeDays, 10) : values.renewalNoticeDays) : undefined,
        } as Partial<IContract>;
        const success = await contractsActions.createContract(contractData);
        if (!success) {
          message.error("Failed to create contract");
          return false;
        }
        message.success("Contract created successfully");
        await onRefresh();
        return true;
      } catch {
        message.error("Failed to create contract");
        return false;
      }
    },
    [selectedOpportunity, contractsActions, message, onRefresh, user?.id],
  );

  const handleContractEdit = useCallback(
    async (values: ContractFormValues) => {
      try {
        if (!selectedEntity?.id) return false;
        const ownerId = normalizeOwnerId(values.ownerId, user?.id);
        const startDate = typeof values.startDate === "string" ? values.startDate : values.startDate.toISOString();
        const endDate = typeof values.endDate === "string" ? values.endDate : values.endDate.toISOString();
        const contractData = {
          ...values,
          ownerId,
          startDate,
          endDate,
          value: typeof values.value === 'string' ? parseFloat(values.value) : values.value,
          status: typeof values.status === 'string' ? parseInt(values.status, 10) : values.status,
          renewalNoticeDays: values.renewalNoticeDays ? (typeof values.renewalNoticeDays === 'string' ? parseInt(values.renewalNoticeDays, 10) : values.renewalNoticeDays) : undefined,
        };
        const requestedStatus =
          typeof contractData.status === "number" ? contractData.status : undefined;
        const currentStatus =
          'status' in selectedEntity && typeof selectedEntity.status === "number" ? selectedEntity.status : undefined;

        if (requestedStatus === 3 || requestedStatus === 4) {
          message.info("Expired and Renewed are system-managed statuses and cannot be set manually");
          return false;
        }

        const shouldActivate = requestedStatus === 2 && currentStatus !== 2;
        const shouldCancel = requestedStatus === 5 && currentStatus !== 5;

        const { status: _status, ...updatePayload } = contractData;
        const updateSuccess = await contractsActions.updateContract(selectedEntity.id, updatePayload as Partial<IContract>);

        if (!updateSuccess) {
          message.error("Failed to update contract");
          return false;
        }

        if (shouldActivate) {
          const activateSuccess = await contractsActions.activateContract(selectedEntity.id);
          if (!activateSuccess) {
            message.error("Failed to activate contract");
            return false;
          }
        }

        if (shouldCancel) {
          const cancelSuccess = await contractsActions.cancelContract(selectedEntity.id);
          if (!cancelSuccess) {
            message.error("Failed to cancel contract");
            return false;
          }
        }

        if (shouldActivate) {
          message.success("Contract updated and activated successfully");
        } else if (shouldCancel) {
          message.success("Contract updated and cancelled successfully");
        } else {
          message.success("Contract updated successfully");
        }

        await onRefresh();
        return true;
      } catch {
        message.error("Failed to update contract");
        return false;
      }
    },
    [selectedEntity, contractsActions, message, onRefresh, user?.id],
  );

  const handleContractActivate = useCallback(
    async (entity: IContract) => {
      if (!entity?.id || !can("activate:contract")) return;

      Modal.confirm({
        title: "Activate contract?",
        content: "This will move the contract to Active status.",
        okText: "Activate",
        onOk: async () => {
          try {
            const success = await contractsActions.activateContract(entity.id);
            if (!success) return;
            message.success("Contract activated successfully");
            await onRefresh();
          } catch {
            message.error("Failed to activate contract");
          }
        },
      });
    },
    [can, contractsActions, message, onRefresh],
  );

  const handleContractCancel = useCallback(
    async (entity: IContract) => {
      if (!entity?.id || !can("update:contract")) return;

      Modal.confirm({
        title: "Cancel contract?",
        content: "This action cannot be undone.",
        okText: "Cancel Contract",
        okType: "danger",
        onOk: async () => {
          try {
            const success = await contractsActions.cancelContract(entity.id);
            if (!success) return;
            message.success("Contract cancelled successfully");
            await onRefresh();
          } catch {
            message.error("Failed to cancel contract");
          }
        },
      });
    },
    [can, contractsActions, message, onRefresh],
  );

  const handleDocumentCreate = useCallback(
    async (values: { category: number; description?: string }, file: File) => {
      try {
        if (!selectedOpportunity) return;
        const success = await documentsActions.uploadDocument(file, {
          category: values.category,
          relatedToType: 2,
          relatedToId: selectedOpportunity.id,
          description: values.description,
        });
        if (!success) return;
        message.success("Document uploaded successfully");
        await onRefresh();
      } catch {
        message.error("Failed to upload document");
      }
    },
    [selectedOpportunity, documentsActions, message, onRefresh],
  );

  const handleNoteCreate = useCallback(
    async (form: { validateFields: () => Promise<{ content: string; isPrivate?: boolean }> }) => {
      try {
        if (!selectedOpportunity) return;
        const values = await form.validateFields();
        await notesActions.createNote({
          content: values.content,
          isPrivate: values.isPrivate ?? false,
          relatedToType: 2,
          relatedToId: selectedOpportunity.id,
        });
        message.success("Note created successfully");
        await onRefresh();
      } catch {
        message.error("Failed to create note");
      }
    },
    [selectedOpportunity, notesActions, message, onRefresh],
  );

  const handleNoteEdit = useCallback(
    async (form: { validateFields: () => Promise<{ content: string; isPrivate?: boolean }> }) => {
      try {
        if (!selectedEntity?.id) return;
        const values = await form.validateFields();
        await notesActions.updateNote(selectedEntity.id, {
          content: values.content,
          isPrivate: values.isPrivate ?? false,
        });
        message.success("Note updated successfully");
        await onRefresh();
      } catch {
        message.error("Failed to update note");
      }
    },
    [selectedEntity, notesActions, message, onRefresh],
  );

  const handleDeleteEntity = useCallback(
    async (type: EntityType, entity: WorkspaceEntity) => {
      const deleteHandlers: Record<EntityType, () => Promise<any>> = {
        activity: () => activitiesActions.deleteActivity(entity.id),
        proposal: () => proposalsActions.deleteProposal(entity.id),
        pricingRequest: () => Promise.reject(new Error("Not supported")),
        contract: () => contractsActions.deleteContract(entity.id),
        document: () => documentsActions.deleteDocument(entity.id),
        note: () => notesActions.deleteNote(entity.id),
      };

      Modal.confirm({
        title: `Delete ${type}?`,
        content: "This action cannot be undone.",
        okText: "Delete",
        okType: "danger",
        onOk: async () => {
          try {
            await deleteHandlers[type]?.();
            message.success(`${type} deleted successfully`);
            await onRefresh();
          } catch {
            message.error(`Failed to delete ${type}`);
          }
        },
      });
    },
    [
      activitiesActions,
      proposalsActions,
      contractsActions,
      documentsActions,
      notesActions,
      message,
      onRefresh,
    ],
  );

  return {
    handleCreateEntity,
    handleActivityCreate,
    handleActivityEdit,
    handleProposalCreate,
    handleProposalEdit,
    handleProposalSubmit,
    handleProposalApprove,
    handleProposalReject,
    handlePricingRequestCreate,
    handlePricingRequestEdit,
    handlePricingRequestAssign,
    handlePricingRequestComplete,
    handleContractCreate,
    handleContractEdit,
    handleContractActivate,
    handleContractCancel,
    handleDocumentCreate,
    handleNoteCreate,
    handleNoteEdit,
    handleDeleteEntity,
  };
};
