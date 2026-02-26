import type { OpportunitiesQuery, Opportunity, PagedResponse } from "../domains/opportunities/types";
import { opportunitiesEndpoints } from "../domains/opportunities/endpoints";

import { getAxiosInstance } from "../lib/axios";

const api = getAxiosInstance();

const toApiPageNumber = (uiPage: number) => Math.max(0, uiPage - 1);

export const getOpportunities = async (q: OpportunitiesQuery) => {
  const { data } = await api.get<PagedResponse<Opportunity>>(opportunitiesEndpoints.list, {
    params: {
      searchTerm: q.searchTerm || undefined,
      stage: q.stage ?? undefined,
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