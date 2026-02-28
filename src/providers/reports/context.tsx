"use client";

import { createContext } from "react";

// Enums
export enum OpportunityStage {
  Lead = 1,
  Qualified = 2,
  Proposal = 3,
  Negotiation = 4,
  ClosedWon = 5,
  ClosedLost = 6,
}

export type GroupBy = "month" | "week";

// Interfaces
export interface IOpportunityReportItem {
  id: string;
  name: string;
  clientName: string;
  stage: OpportunityStage;
  estimatedValue: number;
  probability: number;
  expectedCloseDate: string;
  ownerName: string;
  createdAt: string;
}

export interface ISalesByPeriodItem {
  periodName: string;
  totalValue: number;
  opportunitiesCount: number;
  wonCount: number;
  lostCount: number;
  wonValue: number;
  winRate: number;
  year: number;
  month: number;
  week: number | null;
}

// State
export interface IReportsState {
  opportunitiesReport: IOpportunityReportItem[];
  salesByPeriod: ISalesByPeriodItem[];
  isPending: boolean;
  errorMessage: string | null;
}

export const INITIAL_STATE: IReportsState = {
  opportunitiesReport: [],
  salesByPeriod: [],
  isPending: false,
  errorMessage: null,
};

// Actions Context
export interface IReportsActionContext {
  getOpportunitiesReport: (params?: {
    startDate?: string;
    endDate?: string;
    stage?: OpportunityStage;
    ownerId?: string;
  }) => Promise<void>;
  getSalesByPeriodReport: (params?: {
    startDate?: string;
    endDate?: string;
    groupBy?: GroupBy;
  }) => Promise<void>;
  clearError: () => void;
}

// Contexts
export const ReportsStateContext = createContext<IReportsState | undefined>(undefined);
export const ReportsActionsContext = createContext<IReportsActionContext | undefined>(undefined);
