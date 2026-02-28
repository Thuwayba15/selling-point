"use client";

import { createContext } from "react";

export interface IOpportunity {
  id: string;
  title: string;
  clientId: string;
  clientName?: string;
  contactId?: string;
  contactName?: string;
  estimatedValue?: number;
  currency?: string;
  stage?: number;
  source?: number;
  probability?: number;
  expectedCloseDate?: string;
  description?: string;
  ownerId?: string;
  ownerName?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IOpportunityStageHistory {
  id?: string;
  fromStage?: number;
  fromStageName?: string;
  toStage?: number;
  toStageName?: string;
  notes?: string;
  changedAt?: string;
  changedByName?: string;
}

export interface IOpportunityPipelineStage {
  stage?: number;
  count?: number;
  totalValue?: number;
  weightedValue?: number;
}

export interface IOpportunityPipeline {
  stages?: IOpportunityPipelineStage[];
  totalValue?: number;
  weightedValue?: number;
  conversionRate?: number;
}

export interface IPaginationInfo {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface IOpportunitiesStateContext {
  isPending: boolean;
  isLoadingDetails: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage?: string;

  opportunity?: IOpportunity;
  opportunities?: IOpportunity[];
  pagination?: IPaginationInfo;
  pipeline?: IOpportunityPipeline;
  stageHistory?: IOpportunityStageHistory[];
}

export interface IOpportunitiesActionContext {
  getOpportunities: (params?: {
    clientId?: string;
    stage?: number;
    ownerId?: string;
    searchTerm?: string;
    isActive?: boolean;
    pageNumber?: number;
    pageSize?: number;
  }) => Promise<void>;
  getMyOpportunities: (params?: {
    stage?: number;
    pageNumber?: number;
    pageSize?: number;
  }) => Promise<void>;
  getOpportunity: (id: string) => Promise<void>;
  getOpportunityStageHistory: (id: string) => Promise<void>;
  getOpportunityPipeline: (params?: { ownerId?: string }) => Promise<void>;
  createOpportunity: (opportunity: Partial<IOpportunity>) => Promise<boolean>;
  updateOpportunity: (id: string, opportunity: Partial<IOpportunity>) => Promise<boolean>;
  updateOpportunityStage: (
    id: string,
    stage: number,
    notes?: string,
    lossReason?: string,
  ) => Promise<boolean>;
  assignOpportunity: (id: string, userId: string) => Promise<boolean>;
  deleteOpportunity: (id: string) => Promise<boolean>;
  clearError: () => void;
  clearOpportunity: () => void;
}

export const INITIAL_STATE: IOpportunitiesStateContext = {
  isPending: false,
  isLoadingDetails: false,
  isSuccess: false,
  isError: false,
};

export const OpportunitiesStateContext = createContext<IOpportunitiesStateContext>(INITIAL_STATE);
export const OpportunitiesActionsContext = createContext<IOpportunitiesActionContext | undefined>(
  undefined,
);
