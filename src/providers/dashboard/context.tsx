"use client";

import { createContext } from "react";

// Dashboard data interfaces
export interface IOpportunitiesOverview {
  totalCount: number;
  wonCount: number;
  winRate: number;
  pipelineValue: number;
}

export interface IPipelineStage {
  stage: number;
  stageName: string;
  count: number;
  value: number;
}

export interface IPipelineOverview {
  stages: IPipelineStage[];
  weightedPipelineValue: number;
}

export interface IActivitiesOverview {
  upcomingCount: number;
  overdueCount: number;
  completedTodayCount: number;
}

export interface IContractsOverview {
  totalActiveCount: number;
  expiringThisMonthCount: number;
  totalContractValue: number;
}

export interface IMonthlyRevenueTrend {
  month: string;
  revenue: number;
}

export interface IRevenueOverview {
  thisMonth: number;
  thisQuarter: number;
  thisYear: number;
  monthlyTrend: IMonthlyRevenueTrend[];
}

export interface IDashboardOverview {
  opportunities?: IOpportunitiesOverview;
  pipeline?: IPipelineOverview;
  activities?: IActivitiesOverview;
  contracts?: IContractsOverview;
  revenue?: IRevenueOverview;
}

export interface IStageMetrics {
  stage: number;
  stageName: string;
  count: number;
  value: number;
  avgDealSize: number;
  totalValue?: number;
  averageProbability?: number;
  conversionToNext?: number;
}

export interface IPipelineMetrics {
  stages: IStageMetrics[];
  totalCount: number;
  totalValue: number;
  weightedValue: number;
}

export interface ISalesPerformance {
  userId: string;
  userName: string;
  opportunitiesCount: number;
  wonCount: number;
  lostCount: number;
  totalRevenue: number;
  winRate: number;
}

export interface IActivitySummary {
  totalCount: number;
  upcomingCount: number;
  overdueCount: number;
  completedTodayCount: number;
  completedThisWeekCount: number;
  byType: Record<number, number>;
}

export interface IExpiringContract {
  id: string;
  clientName: string;
  contractValue: number;
  expiryDate: string;
  daysUntilExpiry: number;
  status: string;
}

export interface IExpiringContractsList {
  contracts: IExpiringContract[];
  totalCount: number;
}

// Dashboard state interface
export interface IDashboardStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage?: string;

  // Data
  overview?: IDashboardOverview;
  pipelineMetrics?: IPipelineMetrics;
  salesPerformance?: ISalesPerformance[];
  activitySummary?: IActivitySummary;
  expiringContracts?: IExpiringContractsList;
}

// Dashboard action methods interface
export interface IDashboardActionContext {
  getDashboardOverview: () => Promise<void>;
  getPipelineMetrics: () => Promise<void>;
  getSalesPerformance: (topCount?: number) => Promise<void>;
  getActivitySummary: () => Promise<void>;
  getExpiringContracts: (days?: number) => Promise<void>;
  clearError: () => void;
}

// Initial state
export const INITIAL_STATE: IDashboardStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
};

// Create contexts
export const DashboardStateContext = createContext<IDashboardStateContext>(INITIAL_STATE);
export const DashboardActionsContext = createContext<IDashboardActionContext | undefined>(
  undefined,
);
