export type Opportunity = {
  id: string;
  title: string;

  clientId: string;
  clientName: string;

  contactId?: string;
  contactName?: string;

  ownerId: string;
  ownerName: string;

  estimatedValue: number;
  currency: string;

  probability: number;

  stage: number;
  stageName: string;

  source?: number;

  expectedCloseDate?: string;
  actualCloseDate?: string;

  description?: string;
  lossReason?: string;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;

  closedAt?: string;
};

export type PagedResponse<T> = {
  items: T[];
  pageNumber: number; // API seems 0-based
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type OpportunitiesTab = "all" | "mine";

export type OpportunitiesQuery = {
  tab: OpportunitiesTab;
  searchTerm: string;
  stage?: number;
  page: number; // UI page (1-based)
  pageSize: number;
};

export type CreateOpportunityPayload = {
  title: string;
  clientId: string;
  contactId?: string;
  ownerId?: string;

  estimatedValue?: number;
  currency?: string;
  probability?: number;
  stage?: number;

  expectedCloseDate?: string;
  description?: string;
};

export type UpdateOpportunityStagePayload = {
  stage: number;
  reason?: string;
};