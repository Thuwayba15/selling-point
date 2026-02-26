export const opportunitiesEndpoints = {
  list: "/api/opportunities",
  myOpportunities: "/api/opportunities/my-opportunities",
  pipeline: "/api/opportunities/pipeline",
  stageHistory: (id: string) => `/api/opportunities/${id}/stage-history`,
  create: "/api/opportunities",
  updateStage: (id: string) => `/api/opportunities/${id}/stage`,
} as const;