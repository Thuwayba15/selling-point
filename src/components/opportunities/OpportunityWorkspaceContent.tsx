"use client";

import { EntityWorkspaceTabs, type WorkspaceTabItem } from "@/components/common";
import {
  OpportunityDetails,
  OpportunityActions,
  OpportunityStageHistory,
} from "@/components/opportunities";
import { WorkspaceEntityList } from "./WorkspaceEntityCard";
import { WorkspaceTabActions } from "./WorkspaceTabActions";
import { useStyles } from "@/components/opportunities/style";
import { IOpportunity } from "@/providers/opportunities/context";
import type { IActivity } from "@/providers/activities/context";
import type { IProposal } from "@/providers/proposals/context";
import type { IPricingRequest } from "@/providers/pricing-requests/context";
import type { IContract } from "@/providers/contracts/context";
import type { IDocument } from "@/providers/documents/context";
import type { INote } from "@/providers/notes/context";

interface WorkspaceData {
  activities: IActivity[];
  pricingRequests: IPricingRequest[];
  proposals: IProposal[];
  contracts: IContract[];
  documents: IDocument[];
  notes: INote[];
}

type EntityType = "activity" | "proposal" | "pricingRequest" | "contract" | "document" | "note";

interface OpportunityWorkspaceContentProps {
  opportunity: IOpportunity | null;
  selectedOpportunity: IOpportunity | null;
  stageHistory: any[];
  isLoadingDetails: boolean;
  isLoading: boolean;
  workspaceData: WorkspaceData;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onEdit: () => void;
  onDelete: () => Promise<void>;
  onUpdateStage: () => void;
  onAssign: () => void;
  onCreateEntity: (type: EntityType) => void;
  onEditEntity: (type: EntityType, entity: any) => void;
  onDeleteEntity: (type: EntityType, entity: any) => void;
}

export const OpportunityWorkspaceContent = ({
  opportunity,
  selectedOpportunity,
  stageHistory,
  isLoadingDetails,
  isLoading,
  workspaceData,
  activeTab,
  onTabChange,
  onEdit,
  onDelete,
  onUpdateStage,
  onAssign,
  onCreateEntity,
  onEditEntity,
  onDeleteEntity,
}: OpportunityWorkspaceContentProps) => {
  const { styles } = useStyles();

  const workspaceItems: WorkspaceTabItem[] = [
    {
      key: "overview",
      label: "Overview",
      content: (
        <>
          <div className={styles.selectedRow}>
            <div className={styles.detailsPanel}>
              <OpportunityDetails opportunity={opportunity || null} loading={isLoadingDetails} />
            </div>
            {selectedOpportunity && (
              <OpportunityActions
                opportunity={selectedOpportunity}
                onEdit={onEdit}
                onDelete={onDelete}
                onUpdateStage={onUpdateStage}
                onAssign={onAssign}
              />
            )}
          </div>
          <div className={styles.sectionSpacing}>
            <OpportunityStageHistory
              stageHistory={stageHistory}
              loading={isLoadingDetails}
              hasSelection={Boolean(selectedOpportunity)}
            />
          </div>
        </>
      ),
    },
    {
      key: "activities",
      label: "Activities",
      content: (
        <>
          <WorkspaceTabActions
            entityType="activity"
            onCreateClick={onCreateEntity}
          />
          <WorkspaceEntityList
            entities={workspaceData.activities}
            type="activity"
            loading={isLoading}
            emptyText="No activities for this opportunity"
            onEntityEdit={(entity) => onEditEntity("activity", entity)}
            onEntityDelete={(entity) => onDeleteEntity("activity", entity)}
          />
        </>
      ),
    },
    {
      key: "pricing",
      label: "Pricing Requests",
      content: (
        <>
          <WorkspaceTabActions
            entityType="pricingRequest"
            onCreateClick={onCreateEntity}
          />
          <WorkspaceEntityList
            entities={workspaceData.pricingRequests}
            type="pricingRequest"
            loading={isLoading}
            emptyText="No pricing requests for this opportunity"
            onEntityEdit={(entity) => onEditEntity("pricingRequest", entity)}
            onEntityDelete={(entity) => onDeleteEntity("pricingRequest", entity)}
          />
        </>
      ),
    },
    {
      key: "proposals",
      label: "Proposals",
      content: (
        <>
          <WorkspaceTabActions
            entityType="proposal"
            onCreateClick={onCreateEntity}
          />
          <WorkspaceEntityList
            entities={workspaceData.proposals}
            type="proposal"
            loading={isLoading}
            emptyText="No proposals for this opportunity"
            onEntityEdit={(entity) => onEditEntity("proposal", entity)}
            onEntityDelete={(entity) => onDeleteEntity("proposal", entity)}
          />
        </>
      ),
    },
    {
      key: "contracts",
      label: "Contracts",
      content: (
        <>
          <WorkspaceTabActions
            entityType="contract"
            onCreateClick={onCreateEntity}
          />
          <WorkspaceEntityList
            entities={workspaceData.contracts}
            type="contract"
            loading={isLoading}
            emptyText="No contracts linked to this opportunity's client"
            onEntityEdit={(entity) => onEditEntity("contract", entity)}
            onEntityDelete={(entity) => onDeleteEntity("contract", entity)}
          />
        </>
      ),
    },
    {
      key: "documents",
      label: "Documents",
      content: (
        <>
          <WorkspaceTabActions
            entityType="document"
            onCreateClick={onCreateEntity}
          />
          <WorkspaceEntityList
            entities={workspaceData.documents}
            type="document"
            loading={isLoading}
            emptyText="No documents for this opportunity"
            onEntityDelete={(entity) => onDeleteEntity("document", entity)}
          />
        </>
      ),
    },
    {
      key: "notes",
      label: "Notes",
      content: (
        <>
          <WorkspaceTabActions
            entityType="note"
            onCreateClick={onCreateEntity}
          />
          <WorkspaceEntityList
            entities={workspaceData.notes}
            type="note"
            loading={isLoading}
            emptyText="No notes for this opportunity"
            onEntityDelete={(entity) => onDeleteEntity("note", entity)}
          />
        </>
      ),
    },
  ];

  if (!selectedOpportunity) {
    return null;
  }

  return (
    <EntityWorkspaceTabs
      title={`${selectedOpportunity.title || "Opportunity"} Workspace`}
      items={workspaceItems}
      activeKey={activeTab}
      onChange={onTabChange}
    />
  );
};
