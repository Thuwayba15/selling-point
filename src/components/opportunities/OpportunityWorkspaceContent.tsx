"use client";

import { useMemo, useState } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Select, Space } from "antd";
import { EntityWorkspaceTabs, type WorkspaceTabItem } from "@/components/common";
import { ProposalsFilters } from "@/components/proposals";
import { PricingRequestsFilters } from "@/components/pricing-requests";
import { ContractsFilters } from "@/components/contracts";
import {
  OpportunityDetails,
  OpportunityActions,
  OpportunityStageHistory,
} from "@/components/opportunities";
import { WorkspaceEntityList } from "./WorkspaceEntityCard";
import { WorkspaceTabActions } from "./WorkspaceTabActions";
import { useStyles } from "@/components/opportunities/style";
import { IOpportunity } from "@/providers/opportunities/context";
import type { IProposal } from "@/providers/proposals/context";
import type { IPricingRequest } from "@/providers/pricing-requests/context";
import type { IContract } from "@/providers/contracts/context";
import type { IDocument } from "@/providers/documents/context";
import type { INote } from "@/providers/notes/context";

interface WorkspaceData {
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
  onAssignEntity: (type: EntityType, entity: any) => void;
  onCompleteEntity: (type: EntityType, entity: any) => void;
  onActivateEntity: (type: EntityType, entity: any) => void;
  onCancelEntity: (type: EntityType, entity: any) => void;
  onSubmitEntity: (type: EntityType, entity: any) => void;
  onApproveEntity: (type: EntityType, entity: any) => void;
  onRejectEntity: (type: EntityType, entity: any) => void;
  onDeleteEntity: (type: EntityType, entity: any) => void;
  onBackToOpportunities: () => void;
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
  onAssignEntity,
  onCompleteEntity,
  onActivateEntity,
  onCancelEntity,
  onSubmitEntity,
  onApproveEntity,
  onRejectEntity,
  onDeleteEntity,
  onBackToOpportunities,
}: OpportunityWorkspaceContentProps) => {
  const { styles } = useStyles();
  const [proposalFilters, setProposalFilters] = useState<{
    status?: number;
    clientId?: string;
    opportunityId?: string;
  }>({});
  const [pricingFilters, setPricingFilters] = useState<{
    status?: number;
    priority?: number;
    assignedToId?: string;
  }>({});
  const [contractDraftFilters, setContractDraftFilters] = useState<{
    status?: number;
    clientId?: string;
  }>({});
  const [contractFilters, setContractFilters] = useState<{
    status?: number;
    clientId?: string;
  }>({});
  const [contractViewMode, setContractViewMode] = useState<"all" | "expiring">("all");

  const proposalClientOptions = useMemo(
    () =>
      Array.from(
        new Map(
          (workspaceData.proposals || [])
            .filter((proposal) => proposal.clientId && proposal.clientName)
            .map((proposal) => [proposal.clientId as string, proposal.clientName as string]),
        ),
      ).map(([id, name]) => ({ id, name })),
    [workspaceData.proposals],
  );

  const proposalOpportunityOptions = useMemo(
    () =>
      Array.from(
        new Map(
          (workspaceData.proposals || [])
            .filter((proposal) => proposal.opportunityId && proposal.opportunityTitle)
            .map(
              (proposal) =>
                [proposal.opportunityId as string, proposal.opportunityTitle as string] as const,
            ),
        ),
      ).map(([id, title]) => ({ id, title })),
    [workspaceData.proposals],
  );

  const filteredProposals = useMemo(
    () =>
      (workspaceData.proposals || []).filter((proposal) => {
        if (proposalFilters.status !== undefined && proposal.status !== proposalFilters.status) {
          return false;
        }
        if (proposalFilters.clientId && proposal.clientId !== proposalFilters.clientId) {
          return false;
        }
        if (
          proposalFilters.opportunityId &&
          proposal.opportunityId !== proposalFilters.opportunityId
        ) {
          return false;
        }
        return true;
      }),
    [workspaceData.proposals, proposalFilters],
  );

  const filteredPricingRequests = useMemo(
    () =>
      (workspaceData.pricingRequests || []).filter((item) => {
        if (pricingFilters.status !== undefined && item.status !== pricingFilters.status) {
          return false;
        }
        if (pricingFilters.priority !== undefined && item.priority !== pricingFilters.priority) {
          return false;
        }
        if (pricingFilters.assignedToId && item.assignedToId !== pricingFilters.assignedToId) {
          return false;
        }
        return true;
      }),
    [workspaceData.pricingRequests, pricingFilters],
  );

  const contractClientOptions = useMemo(
    () =>
      Array.from(
        new Map(
          (workspaceData.contracts || [])
            .filter((contract) => contract.clientId && contract.clientName)
            .map((contract) => [contract.clientId as string, contract.clientName as string]),
        ),
      ).map(([id, name]) => ({ id, name })),
    [workspaceData.contracts],
  );

  const filteredContracts = useMemo(
    () =>
      (workspaceData.contracts || []).filter((contract) => {
        if (contractFilters.status !== undefined && contract.status !== contractFilters.status) {
          return false;
        }
        if (contractFilters.clientId && contract.clientId !== contractFilters.clientId) {
          return false;
        }
        if (contractViewMode === "expiring" && !contract.isExpiringSoon) {
          return false;
        }
        return true;
      }),
    [workspaceData.contracts, contractFilters, contractViewMode],
  );

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
      key: "pricing",
      label: "Pricing Requests",
      content: (
        <>
          <div className={styles.workspaceToolbarRow}>
            <WorkspaceTabActions
              entityType="pricingRequest"
              onCreateClick={onCreateEntity}
              compact
            />
            <PricingRequestsFilters
              onApplyFilters={(filters) => setPricingFilters(filters)}
              onClear={() => setPricingFilters({})}
            />
          </div>
          <WorkspaceEntityList
            entities={filteredPricingRequests}
            type="pricingRequest"
            loading={isLoading}
            emptyText="No pricing requests for this opportunity"
            onEntityEdit={(entity) => onEditEntity("pricingRequest", entity)}
            onEntityAssign={(entity) => onAssignEntity("pricingRequest", entity)}
            onEntityComplete={(entity) => onCompleteEntity("pricingRequest", entity)}
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
          <div className={styles.workspaceToolbarRow}>
            <WorkspaceTabActions
              entityType="proposal"
              onCreateClick={onCreateEntity}
              compact
            />
            <ProposalsFilters
              clients={proposalClientOptions}
              opportunities={proposalOpportunityOptions}
              onApplyFilters={(filters) => setProposalFilters(filters)}
              onClear={() => setProposalFilters({})}
            />
          </div>
          <WorkspaceEntityList
            entities={filteredProposals}
            type="proposal"
            loading={isLoading}
            emptyText="No proposals for this opportunity"
            onEntityEdit={(entity) => onEditEntity("proposal", entity)}
            onEntitySubmit={(entity) => onSubmitEntity("proposal", entity)}
            onEntityApprove={(entity) => onApproveEntity("proposal", entity)}
            onEntityReject={(entity) => onRejectEntity("proposal", entity)}
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
          <div className={styles.workspaceToolbarRow}>
            <WorkspaceTabActions
              entityType="contract"
              onCreateClick={onCreateEntity}
              compact
            />
            <Space size={8}>
              <Select
                value={contractViewMode}
                onChange={(value) => setContractViewMode(value)}
                options={[
                  { label: "All Contracts", value: "all" },
                  { label: "Expiring Soon", value: "expiring" },
                ]}
                className={styles.workspaceViewSelect}
              />
              <ContractsFilters
                compact
                status={contractDraftFilters.status}
                clientId={contractDraftFilters.clientId}
                onStatusChange={(status) =>
                  setContractDraftFilters((prev) => ({ ...prev, status }))
                }
                onClientIdChange={(clientId) =>
                  setContractDraftFilters((prev) => ({ ...prev, clientId }))
                }
                onApplyFilters={() => setContractFilters(contractDraftFilters)}
                onClear={() => {
                  setContractDraftFilters({});
                  setContractFilters({});
                  setContractViewMode("all");
                }}
                clients={contractClientOptions}
              />
            </Space>
          </div>
          <WorkspaceEntityList
            entities={filteredContracts}
            type="contract"
            loading={isLoading}
            emptyText="No contracts linked to this opportunity's client"
            onEntityEdit={(entity) => onEditEntity("contract", entity)}
            onEntityActivate={(entity) => onActivateEntity("contract", entity)}
            onEntityCancel={(entity) => onCancelEntity("contract", entity)}
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
            onEntityEdit={(entity) => onEditEntity("note", entity)}
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
      title={
        <Space size={8}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={onBackToOpportunities}
            aria-label="Back to all opportunities"
          />
          <span>{`${selectedOpportunity.title || "Opportunity"} Workspace`}</span>
        </Space>
      }
      items={workspaceItems}
      activeKey={activeTab}
      onChange={onTabChange}
    />
  );
};
