"use client";

import { Card, message } from "antd";
import { useEffect, useMemo, useState } from "react";

import { useOpportunitiesActions, useOpportunitiesState } from "../../providers/opportunities";
import type { Opportunity } from "../../domains/opportunities/types";

import { OpportunitiesToolbar } from "./OpportunitiesToolbar";
import { OpportunitiesTable } from "./OpportunitiesTable";
import { NewOpportunityModal } from "./NewOpportunityModal";
import { MoveStageModal } from "./MoveStageModal";

export const OpportunitiesView = () => {
  const { query, list, myList, isPending, isError, errorMessage } = useOpportunitiesState();
  const { setQuery, fetchCurrentTab, createOpportunity, updateStage } = useOpportunitiesActions();

  const [createOpen, setCreateOpen] = useState(false);
  const [moveStageOpen, setMoveStageOpen] = useState(false);
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);

  useEffect(() => {
    void fetchCurrentTab();
  }, [query.tab, query.searchTerm, query.stage, query.page, query.pageSize]);

  useEffect(() => {
    if (isError && errorMessage) message.error(errorMessage);
  }, [isError, errorMessage]);

  const data = useMemo(() => (query.tab === "mine" ? myList : list), [query.tab, myList, list]);
  const rows = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;

  const openMoveStage = (opp: Opportunity) => {
    setSelectedOpp(opp);
    setMoveStageOpen(true);
  };

  const defaultNextStage = useMemo(() => {
    const current = selectedOpp?.stage;
    if (typeof current !== "number") return undefined;
    return Math.min(current + 1, 5);
  }, [selectedOpp]);

  return (
    <div className="page">
      <div className="titleRow">
        <div className="title">Opportunities</div>
      </div>

      <Card>
        <OpportunitiesToolbar
          query={query}
          onTabChange={(tab) => setQuery({ tab, page: 1 })}
          onSearchChange={(searchTerm) => setQuery({ searchTerm, page: 1 })}
          onStageChange={(stage) => setQuery({ stage, page: 1 })}
          onCreateClick={() => setCreateOpen(true)}
        />
      </Card>

      <Card>
        <OpportunitiesTable
          rows={rows}
          loading={isPending}
          page={query.page}
          pageSize={query.pageSize}
          totalCount={totalCount}
          onPaginationChange={(page, pageSize) => setQuery({ page, pageSize })}
          onMoveStageClick={openMoveStage}
        />
      </Card>

      <NewOpportunityModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        isSubmitting={isPending}
        onSubmit={async (payload) => {
          const res = await createOpportunity(payload);
          if (res.ok) {
            message.success("Opportunity created");
            setCreateOpen(false);
          }
        }}
      />

      <MoveStageModal
        open={moveStageOpen}
        onClose={() => {
          setMoveStageOpen(false);
          setSelectedOpp(null);
        }}
        isSubmitting={isPending}
        defaultStage={defaultNextStage}
        onSubmit={async (payload) => {
          if (!selectedOpp) return;

          const res = await updateStage(selectedOpp.id, payload);
          if (res.ok) {
            message.success("Stage updated");
            setMoveStageOpen(false);
            setSelectedOpp(null);
          }
        }}
      />
    </div>
  );
};