"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

export const useOpportunityFilters = (opportunityId: string | undefined) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialSearchTerm = searchParams.get("searchTerm") || undefined;
  const initialClientId = searchParams.get("clientId") || undefined;
  const initialStage = searchParams.get("stage") ? Number(searchParams.get("stage")) : undefined;
  const initialOwnerId = searchParams.get("ownerId") || undefined;
  const initialShowMine = searchParams.get("my") === "1";
  const initialPage = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const initialPageSize = searchParams.get("pageSize") ? Number(searchParams.get("pageSize")) : 10;

  const [searchTerm, setSearchTerm] = useState<string | undefined>(initialSearchTerm);
  const [clientId, setClientId] = useState<string | undefined>(initialClientId);
  const [stage, setStage] = useState<number | undefined>(initialStage);
  const [ownerId, setOwnerId] = useState<string | undefined>(initialOwnerId);
  const [showMyOpportunities, setShowMyOpportunities] = useState(initialShowMine);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const buildQueryString = useCallback(
    (overrides?: {
      searchTerm?: string;
      clientId?: string;
      stage?: number;
      ownerId?: string;
      my?: boolean;
      page?: number;
      pageSize?: number;
    }) => {
      const query = new URLSearchParams();

      const merged = {
        searchTerm,
        clientId,
        stage,
        ownerId,
        my: showMyOpportunities,
        page: currentPage,
        pageSize,
        ...overrides,
      };

      if (merged.searchTerm) query.set("searchTerm", merged.searchTerm);
      if (merged.clientId) query.set("clientId", merged.clientId);
      if (merged.stage) query.set("stage", String(merged.stage));
      if (merged.ownerId) query.set("ownerId", merged.ownerId);
      if (merged.my) query.set("my", "1");
      query.set("page", String(merged.page));
      query.set("pageSize", String(merged.pageSize));

      return query.toString();
    },
    [searchTerm, clientId, stage, ownerId, showMyOpportunities, currentPage, pageSize],
  );

  const navigateWithFilters = useCallback(
    (query?: string) => {
      if (!opportunityId) return;
      router.replace(
        `/opportunities/${opportunityId}${query ? `?${query}` : ""}`,
      );
    },
    [opportunityId, router],
  );

  const navigateToList = useCallback(
    (query?: string) => {
      router.push(`/opportunities${query ? `?${query}` : ""}`);
    },
    [router],
  );

  const applyFilters = useCallback(
    (filters: {
      searchTerm?: string;
      clientId?: string;
      stage?: number;
      ownerId?: string;
    }) => {
      setSearchTerm(filters.searchTerm);
      setClientId(filters.clientId);
      setStage(filters.stage);
      setOwnerId(filters.ownerId);
      setCurrentPage(1);

      const query = new URLSearchParams();
      if (filters.searchTerm) query.set("searchTerm", filters.searchTerm);
      if (filters.clientId) query.set("clientId", filters.clientId);
      if (filters.stage) query.set("stage", String(filters.stage));
      if (filters.ownerId) query.set("ownerId", filters.ownerId);
      if (showMyOpportunities) query.set("my", "1");
      query.set("page", "1");
      query.set("pageSize", String(pageSize));

      navigateWithFilters(query.toString());
    },
    [showMyOpportunities, pageSize, navigateWithFilters],
  );

  const clearFilters = useCallback(() => {
    setSearchTerm(undefined);
    setClientId(undefined);
    setStage(undefined);
    setOwnerId(undefined);
    setCurrentPage(1);

    const query = new URLSearchParams();
    if (showMyOpportunities) query.set("my", "1");
    query.set("page", "1");
    query.set("pageSize", String(pageSize));

    navigateWithFilters(query.toString());
  }, [showMyOpportunities, pageSize, navigateWithFilters]);

  const toggleShowMyOpportunities = useCallback(
    (value: boolean) => {
      setShowMyOpportunities(value);
      if (value) {
        setOwnerId(undefined);
      }
      setCurrentPage(1);

      const query = new URLSearchParams();
      if (searchTerm) query.set("searchTerm", searchTerm);
      if (clientId) query.set("clientId", clientId);
      if (stage) query.set("stage", String(stage));
      if (!value && ownerId) query.set("ownerId", ownerId);
      if (value) query.set("my", "1");
      query.set("page", "1");
      query.set("pageSize", String(pageSize));

      navigateWithFilters(query.toString());
    },
    [searchTerm, clientId, stage, ownerId, pageSize, navigateWithFilters],
  );

  return {
    searchTerm,
    clientId,
    stage,
    ownerId,
    showMyOpportunities,
    currentPage,
    pageSize,
    initialSearchTerm,
    initialClientId,
    initialStage,
    initialOwnerId,
    initialShowMine,
    buildQueryString,
    applyFilters,
    clearFilters,
    toggleShowMyOpportunities,
    navigateWithFilters,
    navigateToList,
    setCurrentPage,
  };
};
