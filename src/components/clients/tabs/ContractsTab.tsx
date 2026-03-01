"use client";

import { useState } from "react";
import { Pagination } from "antd";
import { WorkspaceTabActions } from "@/components/opportunities/WorkspaceTabActions";
import { ContractsFilters } from "@/components/contracts";
import { WorkspaceEntityList } from "@/components/opportunities/WorkspaceEntityCard";
import type { IContract } from "@/providers/contracts/context";
import { useWorkspacePagination } from "@/hooks/useWorkspacePagination";
import { useStyles } from "../style";

interface ContractsTabProps {
  contracts: IContract[];
  isLoading: boolean;
  onCreateEntity: (type: "contract") => void;
  onEditEntity: (entity: IContract) => void;
  onActivateEntity: (entity: IContract) => void;
  onCancelEntity: (entity: IContract) => void;
  onDeleteEntity: (entity: IContract) => void;
  onViewDocuments: (type: "contract", entity: IContract) => void;
  onViewNotes: (type: "contract", entity: IContract) => void;
  toolbarClassName?: string;
  paginationClassName?: string;
}

export const ContractsTab = ({
  contracts,
  isLoading,
  onCreateEntity,
  onEditEntity,
  onActivateEntity,
  onCancelEntity,
  onDeleteEntity,
  onViewDocuments,
  onViewNotes,
  toolbarClassName,
  paginationClassName,
}: ContractsTabProps) => {
  const { styles } = useStyles();
  const [filters, setFilters] = useState<{
    status?: number;
  }>({});

  // Filter contracts by status
  const filteredContracts = contracts.filter((contract) => {
    if (filters.status !== undefined && contract.status !== filters.status) return false;
    return true;
  });

  const { currentPage, pageSize, total, paginatedItems, setCurrentPage } =
    useWorkspacePagination(filteredContracts);

  return (
    <>
      <div className={toolbarClassName}>
        <WorkspaceTabActions
          entityType="contract"
          onCreateClick={() => onCreateEntity("contract")}
          compact
        />
        <ContractsFilters
          clients={[]} // No client filter needed since we're already in client context
          onApplyFilters={(newFilters) => setFilters(newFilters)}
          onClear={() => setFilters({})}
        />
      </div>

      <WorkspaceEntityList
        entities={paginatedItems}
        type="contract"
        loading={isLoading}
        emptyText="No contracts found for this client"
        onEntityEdit={onEditEntity}
        onEntityActivate={onActivateEntity}
        onEntityCancel={onCancelEntity}
        onEntityDelete={onDeleteEntity}
        onEntityViewDocuments={(_, e) => onViewDocuments("contract", e)}
        onEntityViewNotes={(_, e) => onViewNotes("contract", e)}
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
