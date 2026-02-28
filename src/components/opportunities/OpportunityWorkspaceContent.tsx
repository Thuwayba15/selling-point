"use client";

import { EntityWorkspaceTabs, type WorkspaceTabItem, WorkspaceEntityList } from "@/components/common";
import {
  OpportunityDetails,
  OpportunityActions,
  OpportunityStageHistory,
} from "@/components/opportunities";
import { useStyles } from "@/components/opportunities/style";
import { IOpportunity } from "@/providers/opportunities/context";

interface WorkspaceData {
  activities: Array<{ id: string; title: string; subtitle?: string }>;
  pricingRequests: Array<{ id: string; title: string; subtitle?: string }>;
  proposals: Array<{ id: string; title: string; subtitle?: string }>;
  contracts: Array<{ id: string; title: string; subtitle?: string }>;
  documents: Array<{ id: string; title: string; subtitle?: string }>;
  notes: Array<{ id: string; title: string; subtitle?: string }>;
}

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
        <WorkspaceEntityList
          items={workspaceData.activities}
          emptyText={isLoading ? "Loading activities..." : "No activities for this opportunity"}
        />
      ),
    },
    {
      key: "pricing",
      label: "Pricing Requests",
      content: (
        <WorkspaceEntityList
          items={workspaceData.pricingRequests}
          emptyText={isLoading ? "Loading pricing requests..." : "No pricing requests for this opportunity"}
        />
      ),
    },
    {
      key: "proposals",
      label: "Proposals",
      content: (
        <WorkspaceEntityList
          items={workspaceData.proposals}
          emptyText={isLoading ? "Loading proposals..." : "No proposals for this opportunity"}
        />
      ),
    },
    {
      key: "contracts",
      label: "Contracts",
      content: (
        <WorkspaceEntityList
          items={workspaceData.contracts}
          emptyText={isLoading ? "Loading contracts..." : "No contracts linked to this opportunity's client"}
        />
      ),
    },
    {
      key: "documents",
      label: "Documents",
      content: (
        <WorkspaceEntityList
          items={workspaceData.documents}
          emptyText={isLoading ? "Loading documents..." : "No documents for this opportunity"}
        />
      ),
    },
    {
      key: "notes",
      label: "Notes",
      content: (
        <WorkspaceEntityList
          items={workspaceData.notes}
          emptyText={isLoading ? "Loading notes..." : "No notes for this opportunity"}
        />
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
