import { api } from "@/lib/axios";
import { opportunitiesEndpoints } from "./endpoints";
import type { OpportunitiesQuery, Opportunity, PagedResponse, CreateOpportunityPayload,
  UpdateOpportunityStagePayload, } from "./types";

const toApiPageNumber = (uiPage: number) => Math.max(0, uiPage - 1);

export const getOpportunities = async (q: OpportunitiesQuery) => {
  const { data } = await api.get<PagedResponse<Opportunity>>(opportunitiesEndpoints.list, {
    params: {
      clientId: undefined, 
      stage: q.stage ?? undefined,
      searchTerm: q.searchTerm || undefined,
      pageNumber: toApiPageNumber(q.page),
      pageSize: q.pageSize,
    },
  });

  return data;
};

export const getMyOpportunities = async (q: OpportunitiesQuery) => {
  const { data } = await api.get<PagedResponse<Opportunity>>(opportunitiesEndpoints.myOpportunities, {
    params: {
      stage: q.stage ?? undefined,
      pageNumber: toApiPageNumber(q.page),
      pageSize: q.pageSize,
    },
  });

  return data;
};

export const createOpportunity = async (payload: CreateOpportunityPayload) => {
  const { data } = await api.post<Opportunity>(opportunitiesEndpoints.create, payload);
  return data;
};

export const updateOpportunityStage = async (id: string, payload: UpdateOpportunityStagePayload) => {
  const { data } = await api.put<Opportunity>(opportunitiesEndpoints.updateStage(id), payload);
  return data;
};