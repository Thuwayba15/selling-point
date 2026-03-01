import { useState } from "react";
import { Pagination } from "antd";
import { WorkspaceTabActions } from "../WorkspaceTabActions";
import { PricingRequestsFilters } from "@/components/pricing-requests";
import { WorkspaceEntityList } from "../WorkspaceEntityCard";
import { IPricingRequest } from "@/providers/pricing-requests/context";
import { useWorkspacePagination } from "@/hooks/useWorkspacePagination";

interface PricingRequestsTabProps {
  pricingRequests: IPricingRequest[];
  isLoading: boolean;
  onCreateEntity: (type: "pricingRequest") => void;
  onEditEntity: (entity: IPricingRequest) => void;
  onAssignEntity: (entity: IPricingRequest) => void;
  onCompleteEntity: (entity: IPricingRequest) => void;
  onDeleteEntity: (entity: IPricingRequest) => void;
  toolbarClassName?: string;
  paginationClassName?: string;
}

export const PricingRequestsTab = ({
  pricingRequests,
  isLoading,
  onCreateEntity,
  onEditEntity,
  onAssignEntity,
  onCompleteEntity,
  onDeleteEntity,
  toolbarClassName,
  paginationClassName,
}: PricingRequestsTabProps) => {
  const [filters, setFilters] = useState<{
    status?: number;
    priority?: number;
    assignedToId?: string;
  }>({});

  const filteredRequests = pricingRequests.filter((item) => {
    if (filters.status !== undefined && item.status !== filters.status) return false;
    if (filters.priority !== undefined && item.priority !== filters.priority) return false;
    if (filters.assignedToId && item.assignedToId !== filters.assignedToId) return false;
    return true;
  });

  const { currentPage, pageSize, total, paginatedItems, setCurrentPage } =
    useWorkspacePagination(filteredRequests);

  return (
    <>
      <div className={toolbarClassName}>
        <WorkspaceTabActions
          entityType="pricingRequest"
          onCreateClick={() => onCreateEntity("pricingRequest")}
          compact
        />
        <PricingRequestsFilters onApplyFilters={setFilters} onClear={() => setFilters({})} />
      </div>

      <WorkspaceEntityList
        entities={paginatedItems}
        type="pricingRequest"
        loading={isLoading}
        emptyText="No pricing requests for this opportunity"
        onEntityEdit={onEditEntity}
        onEntityAssign={onAssignEntity}
        onEntityComplete={onCompleteEntity}
        onEntityDelete={onDeleteEntity}
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
