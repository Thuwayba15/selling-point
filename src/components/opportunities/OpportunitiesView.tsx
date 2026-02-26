"use client";

import { Card } from "antd";
import { useEffect } from "react";

import { OpportunitiesToolbar } from "./OpportunitiesToolbar";
import { OpportunitiesTable } from "./OpportunitiesTable";
import { useOpportunitiesActions, useOpportunitiesState } from "../../providers/opportunities";

export const OpportunitiesView = () => {
  const { query, list, myList, isPending } = useOpportunitiesState();
  const { setQuery, fetchCurrentTab } = useOpportunitiesActions();

  useEffect(() => {
    void fetchCurrentTab();
  }, [query.tab, query.searchTerm, query.stage, query.page, query.pageSize, fetchCurrentTab]);

  const data = query.tab === "mine" ? myList : list;

  const rows = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ fontSize: 22, fontWeight: 700 }}>Opportunities</div>

      <Card>
        <OpportunitiesToolbar
          query={query}
          onTabChange={(tab) => setQuery({ tab, page: 1 })}
          onSearchChange={(searchTerm) => setQuery({ searchTerm, page: 1 })}
          onStageChange={(stage) => setQuery({ stage, page: 1 })}
          onCreateClick={() => {
            // next: modal + POST /api/opportunities
          }}
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
        />
      </Card>
    </div>
  );
};