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
  loading?: boolean;
  onCreateEntity?: () => void;
  onEdit: (contract: IContract) => void;
  onDelete: (contract: IContract) => Promise<void>;
  toolbarClassName?: string;
  paginationClassName?: string;
}

export const ContractsTab = ({
  contracts,
  loading = false,
  onCreateEntity,
  onEdit,
  onDelete,
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
      <div className={styles.toolbarContainer}>
        <WorkspaceTabActions
          entityType="contract"
          onCreateClick={() => onCreateEntity?.()}
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
        loading={loading}
        emptyText="No contracts found for this client"
        onEntityEdit={onEdit}
        onEntityDelete={(entity: IContract) => onDelete(entity)}
        onEntityViewDocuments={(_, contract: IContract) => {
          // TODO: Navigate to contract documents
          console.log("View documents for contract:", contract.id);
        }}
        onEntityViewNotes={(_, contract: IContract) => {
          // TODO: Navigate to contract notes
          console.log("View notes for contract:", contract.id);
        }}
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
