import { useState, useMemo } from "react";
import { Pagination } from "antd";
import { WorkspaceTabActions } from "../WorkspaceTabActions";
import { ProposalsFilters } from "@/components/proposals";
import { WorkspaceEntityList } from "../WorkspaceEntityCard";
import { IProposal } from "@/providers/proposals/context";
import { IContract } from "@/providers/contracts/context";
import { useWorkspacePagination } from "@/hooks/useWorkspacePagination";

interface ProposalsTabProps {
  proposals: IProposal[];
  isLoading: boolean;
  onCreateEntity: (type: "proposal") => void;
  onEditEntity: (entity: IProposal) => void;
  onSubmitEntity: (entity: IProposal) => void;
  onApproveEntity: (entity: IProposal) => void;
  onRejectEntity: (entity: IProposal) => void;
  onDeleteEntity: (entity: IProposal) => void;
  onViewDocuments: (type: "proposal", entity: IProposal) => void;
  onViewNotes: (type: "proposal", entity: IProposal) => void;
  toolbarClassName?: string;
  paginationClassName?: string;
}

export const ProposalsTab = ({
  proposals,
  isLoading,
  onCreateEntity,
  onEditEntity,
  onSubmitEntity,
  onApproveEntity,
  onRejectEntity,
  onDeleteEntity,
  onViewDocuments,
  onViewNotes,
  toolbarClassName,
  paginationClassName,
}: ProposalsTabProps) => {
  const [filters, setFilters] = useState<{
    status?: number;
    clientId?: string;
    opportunityId?: string;
  }>({});

  const clientOptions = useMemo(
    () =>
      Array.from(
        new Map(
          proposals
            .filter((p) => p.clientId && p.clientName)
            .map((p) => [p.clientId as string, p.clientName as string]),
        ),
      ).map(([id, name]) => ({ id, name })),
    [proposals],
  );

  const opportunityOptions = useMemo(
    () =>
      Array.from(
        new Map(
          proposals
            .filter((p) => p.opportunityId && p.opportunityTitle)
            .map((p) => [p.opportunityId as string, p.opportunityTitle as string]),
        ),
      ).map(([id, title]) => ({ id, title })),
    [proposals],
  );

  const filteredProposals = proposals.filter((proposal) => {
    if (filters.status !== undefined && proposal.status !== filters.status) return false;
    if (filters.clientId && proposal.clientId !== filters.clientId) return false;
    if (filters.opportunityId && proposal.opportunityId !== filters.opportunityId) return false;
    return true;
  });

  const { currentPage, pageSize, total, paginatedItems, setCurrentPage } =
    useWorkspacePagination(filteredProposals);

  return (
    <>
      <div className={toolbarClassName}>
        <WorkspaceTabActions
          entityType="proposal"
          onCreateClick={() => onCreateEntity("proposal")}
          compact
        />
        <ProposalsFilters
          clients={clientOptions}
          opportunities={opportunityOptions}
          onApplyFilters={setFilters}
          onClear={() => setFilters({})}
        />
      </div>

      <WorkspaceEntityList
        entities={paginatedItems}
        type="proposal"
        loading={isLoading}
        emptyText="No proposals for this opportunity"
        onEntityEdit={onEditEntity}
        onEntitySubmit={onSubmitEntity}
        onEntityApprove={onApproveEntity}
        onEntityReject={onRejectEntity}
        onEntityDelete={onDeleteEntity}
        onEntityViewDocuments={(t: any, e: any) => onViewDocuments(t, e)}
        onEntityViewNotes={(t: any, e: any) => onViewNotes(t, e)}
      />

      {total > 0 && (
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={total}
          onChange={setCurrentPage}
          className={paginationClassName}
        />
      )}
    </>
  );
};
