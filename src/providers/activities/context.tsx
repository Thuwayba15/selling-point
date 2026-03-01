"use client";

import { createContext } from "react";

// Enums from API documentation
export enum ActivityType {
  Meeting = 1,
  Call = 2,
  Email = 3,
  Task = 4,
  Presentation = 5,
  Other = 6,
}

export enum ActivityStatus {
  Scheduled = 1,
  Completed = 2,
  Cancelled = 3,
}

export enum Priority {
  Low = 1,
  Medium = 2,
  High = 3,
  Urgent = 4,
}

export enum RelatedToType {
  Client = 1,
  Opportunity = 2,
  Proposal = 3,
  Contract = 4,
  Activity = 5,
}

// Interface for activity participant (for POST body)
export interface IActivityParticipantInput {
  userId?: string;
  contactId?: string;
  isRequired: boolean;
}

// Interface for a single activity
export interface IActivity {
  id: string;
  type: ActivityType;
  typeName?: string;
  subject: string;
  description?: string;
  priority: Priority;
  priorityName?: string;
  status: ActivityStatus;
  statusName?: string;
  dueDate: string;
  completedDate?: string;
  outcome?: string;
  assignedToId: string;
  assignedToName?: string;
  createdById?: string;
  createdByName?: string;
  relatedToType?: RelatedToType;
  relatedToTypeName?: string;
  relatedToId?: string;
  relatedToName?: string;
  duration?: number;
  location?: string;
  participants?: IActivityParticipantInput[];
  createdAt?: string;
  updatedAt?: string;
}

// Interface for activity participant
export interface IActivityParticipant {
  id: string;
  activityId: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  responseStatus: number;
  responseStatusName?: string;
}

// Interface for pagination info
export interface IPaginationInfo {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

// Interface defining the state shape for our context
export interface IActivitiesStateContext {
  isPending: boolean;
  isLoadingDetails: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage?: string;

  // Data
  activity?: IActivity;
  activities?: IActivity[];
  participants?: IActivityParticipant[];
  pagination?: IPaginationInfo;
}

// Interface defining all the actions that can be performed
export interface IActivitiesActionContext {
  // List operations
  getActivities: (params?: {
    assignedToId?: string;
    type?: ActivityType;
    status?: ActivityStatus;
    relatedToType?: RelatedToType;
    relatedToId?: string;
    pageNumber?: number;
    pageSize?: number;
  }) => Promise<void>;

  getMyActivities: (params?: {
    status?: ActivityStatus;
    pageNumber?: number;
    pageSize?: number;
  }) => Promise<void>;

  getUpcomingActivities: (params?: {
    daysAhead?: number;
    pageNumber?: number;
    pageSize?: number;
  }) => Promise<void>;

  getOverdueActivities: (params?: { pageNumber?: number; pageSize?: number }) => Promise<void>;

  // Single activity operations
  getActivity: (id: string) => Promise<void>;
  getActivityParticipants: (activityId: string) => Promise<void>;

  // CRUD operations
  createActivity: (activity: Partial<IActivity>) => Promise<void>;
  updateActivity: (id: string, activity: Partial<IActivity>) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;

  // Status operations
  completeActivity: (id: string, outcome?: string) => Promise<void>;
  cancelActivity: (id: string) => Promise<void>;

  // State management
  clearError: () => void;
  clearActivity: () => void;
}

// Initial state
export const INITIAL_STATE: IActivitiesStateContext = {
  isPending: false,
  isLoadingDetails: false,
  isSuccess: false,
  isError: false,
};

// Create contexts
export const ActivitiesStateContext = createContext<IActivitiesStateContext>(INITIAL_STATE);

export const ActivitiesActionContext = createContext<IActivitiesActionContext | undefined>(
  undefined,
);
