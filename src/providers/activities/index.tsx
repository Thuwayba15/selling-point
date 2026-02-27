"use client";

import { useContext, useReducer } from "react";
import { getAxiosInstance } from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";
import {
  INITIAL_STATE,
  IActivity,
  ActivityType,
  ActivityStatus,
  RelatedToType,
  ActivitiesActionContext,
  ActivitiesStateContext,
} from "./context";
import { ActivitiesReducer } from "./reducer";
import {
  getActivitiesPending,
  getActivitiesSuccess,
  getActivitiesError,
  getMyActivitiesPending,
  getMyActivitiesSuccess,
  getMyActivitiesError,
  getUpcomingActivitiesPending,
  getUpcomingActivitiesSuccess,
  getUpcomingActivitiesError,
  getOverdueActivitiesPending,
  getOverdueActivitiesSuccess,
  getOverdueActivitiesError,
  getActivityPending,
  getActivitySuccess,
  getActivityError,
  getActivityParticipantsPending,
  getActivityParticipantsSuccess,
  getActivityParticipantsError,
  createActivityPending,
  createActivitySuccess,
  createActivityError,
  updateActivityPending,
  updateActivitySuccess,
  updateActivityError,
  deleteActivityPending,
  deleteActivitySuccess,
  deleteActivityError,
  completeActivityPending,
  completeActivitySuccess,
  completeActivityError,
  cancelActivityPending,
  cancelActivitySuccess,
  cancelActivityError,
  clearError as clearErrorAction,
  clearActivity as clearActivityAction,
} from "./actions";

export const ActivitiesProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(ActivitiesReducer, INITIAL_STATE);
  const api = getAxiosInstance();

  // ============================================================================
  // Get Activities (with filters)
  // GET /api/activities
  // ============================================================================
  const getActivities = async (params?: {
    assignedToId?: string;
    type?: ActivityType;
    status?: ActivityStatus;
    relatedToType?: RelatedToType;
    relatedToId?: string;
    pageNumber?: number;
    pageSize?: number;
  }) => {
    dispatch(getActivitiesPending());
    try {
      const response = await api.get("/api/activities", { params });
      const data = response.data;
      dispatch(
        getActivitiesSuccess({
          activities: data.items || data,
          pagination: {
            currentPage: data.currentPage ?? data.pageNumber ?? params?.pageNumber ?? 1,
            pageSize: data.pageSize ?? params?.pageSize ?? 10,
            totalCount: data.totalCount ?? 0,
            totalPages: data.totalPages ?? 0,
          },
        }),
      );
    } catch (error: unknown) {
      console.error("Error fetching activities:", error);
      dispatch(getActivitiesError(getErrorMessage(error, "Failed to fetch activities")));
    }
  };

  // ============================================================================
  // Get My Activities
  // GET /api/activities/my-activities
  // ============================================================================
  const getMyActivities = async (params?: {
    status?: ActivityStatus;
    pageNumber?: number;
    pageSize?: number;
  }) => {
    dispatch(getMyActivitiesPending());
    try {
      const response = await api.get("/api/activities/my-activities", { params });
      const data = response.data;
      dispatch(
        getMyActivitiesSuccess({
          activities: data.items || data,
          pagination: {
            currentPage: data.currentPage ?? data.pageNumber ?? params?.pageNumber ?? 1,
            pageSize: data.pageSize ?? params?.pageSize ?? 10,
            totalCount: data.totalCount ?? 0,
            totalPages: data.totalPages ?? 0,
          },
        }),
      );
    } catch (error: unknown) {
      console.error("Error fetching my activities:", error);
      dispatch(getMyActivitiesError(getErrorMessage(error, "Failed to fetch my activities")));
    }
  };

  // ============================================================================
  // Get Upcoming Activities
  // GET /api/activities/upcoming
  // ============================================================================
  const getUpcomingActivities = async (params?: {
    daysAhead?: number;
    pageNumber?: number;
    pageSize?: number;
  }) => {
    dispatch(getUpcomingActivitiesPending());
    try {
      const response = await api.get("/api/activities/upcoming", { params });
      const data = response.data;
      dispatch(
        getUpcomingActivitiesSuccess({
          activities: data.items || data,
          pagination: {
            currentPage: data.currentPage ?? data.pageNumber ?? params?.pageNumber ?? 1,
            pageSize: data.pageSize ?? params?.pageSize ?? 10,
            totalCount: data.totalCount ?? 0,
            totalPages: data.totalPages ?? 0,
          },
        }),
      );
    } catch (error: unknown) {
      console.error("Error fetching upcoming activities:", error);
      dispatch(
        getUpcomingActivitiesError(getErrorMessage(error, "Failed to fetch upcoming activities")),
      );
    }
  };

  // ============================================================================
  // Get Overdue Activities
  // GET /api/activities/overdue
  // ============================================================================
  const getOverdueActivities = async (params?: {
    pageNumber?: number;
    pageSize?: number;
  }) => {
    dispatch(getOverdueActivitiesPending());
    try {
      const response = await api.get("/api/activities/overdue", { params });
      const data = response.data;
      dispatch(
        getOverdueActivitiesSuccess({
          activities: data.items || data,
          pagination: {
            currentPage: data.currentPage ?? data.pageNumber ?? params?.pageNumber ?? 1,
            pageSize: data.pageSize ?? params?.pageSize ?? 10,
            totalCount: data.totalCount ?? 0,
            totalPages: data.totalPages ?? 0,
          },
        }),
      );
    } catch (error: unknown) {
      console.error("Error fetching overdue activities:", error);
      dispatch(
        getOverdueActivitiesError(getErrorMessage(error, "Failed to fetch overdue activities")),
      );
    }
  };

  // ============================================================================
  // Get Single Activity
  // GET /api/activities/{id}
  // ============================================================================
  const getActivity = async (id: string) => {
    dispatch(getActivityPending());
    try {
      const response = await api.get(`/api/activities/${id}`);
      dispatch(getActivitySuccess(response.data));
    } catch (error: unknown) {
      console.error("Error fetching activity:", error);
      dispatch(getActivityError(getErrorMessage(error, "Failed to fetch activity")));
    }
  };

  // ============================================================================
  // Get Activity Participants
  // GET /api/activities/{activityId}/participants
  // ============================================================================
  const getActivityParticipants = async (activityId: string) => {
    dispatch(getActivityParticipantsPending());
    try {
      const response = await api.get(`/api/activities/${activityId}/participants`);
      dispatch(getActivityParticipantsSuccess(response.data));
    } catch (error: unknown) {
      console.error("Error fetching activity participants:", error);
      dispatch(
        getActivityParticipantsError(
          getErrorMessage(error, "Failed to fetch activity participants"),
        ),
      );
    }
  };

  // ============================================================================
  // Create Activity
  // POST /api/activities
  // ============================================================================
  const createActivity = async (activity: Partial<IActivity>) => {
    dispatch(createActivityPending());
    try {
      const response = await api.post("/api/activities", activity);
      dispatch(createActivitySuccess(response.data));
    } catch (error: unknown) {
      console.error("Error creating activity:", error);
      dispatch(createActivityError(getErrorMessage(error, "Failed to create activity")));
    }
  };

  // ============================================================================
  // Update Activity
  // PUT /api/activities/{id}
  // ============================================================================
  const updateActivity = async (id: string, activity: Partial<IActivity>) => {
    dispatch(updateActivityPending());
    try {
      const response = await api.put(`/api/activities/${id}`, activity);
      dispatch(updateActivitySuccess(response.data));
    } catch (error: unknown) {
      console.error("Error updating activity:", error);
      dispatch(updateActivityError(getErrorMessage(error, "Failed to update activity")));
    }
  };

  // ============================================================================
  // Delete Activity
  // DELETE /api/activities/{id}
  // ============================================================================
  const deleteActivity = async (id: string) => {
    dispatch(deleteActivityPending());
    try {
      await api.delete(`/api/activities/${id}`);
      dispatch(deleteActivitySuccess());
    } catch (error: unknown) {
      console.error("Error deleting activity:", error);
      dispatch(deleteActivityError(getErrorMessage(error, "Failed to delete activity")));
    }
  };

  // ============================================================================
  // Complete Activity
  // PUT /api/activities/{id}/complete
  // ============================================================================
  const completeActivity = async (id: string, outcome?: string) => {
    dispatch(completeActivityPending());
    try {
      const response = await api.put(`/api/activities/${id}/complete`, { outcome });
      dispatch(completeActivitySuccess(response.data));
    } catch (error: unknown) {
      console.error("Error completing activity:", error);
      dispatch(completeActivityError(getErrorMessage(error, "Failed to complete activity")));
    }
  };

  // ============================================================================
  // Cancel Activity
  // PUT /api/activities/{id}/cancel
  // ============================================================================
  const cancelActivity = async (id: string) => {
    dispatch(cancelActivityPending());
    try {
      const response = await api.put(`/api/activities/${id}/cancel`);
      dispatch(cancelActivitySuccess(response.data));
    } catch (error: unknown) {
      console.error("Error cancelling activity:", error);
      dispatch(cancelActivityError(getErrorMessage(error, "Failed to cancel activity")));
    }
  };

  // ============================================================================
  // Utility Actions
  // ============================================================================
  const clearError = () => {
    dispatch(clearErrorAction());
  };

  const clearActivity = () => {
    dispatch(clearActivityAction());
  };

  return (
    <ActivitiesStateContext.Provider value={state}>
      <ActivitiesActionContext.Provider
        value={{
          getActivities,
          getMyActivities,
          getUpcomingActivities,
          getOverdueActivities,
          getActivity,
          getActivityParticipants,
          createActivity,
          updateActivity,
          deleteActivity,
          completeActivity,
          cancelActivity,
          clearError,
          clearActivity,
        }}
      >
        {children}
      </ActivitiesActionContext.Provider>
    </ActivitiesStateContext.Provider>
  );
};

// ============================================================================
// Custom Hooks
// ============================================================================
export const useActivitiesState = () => {
  const context = useContext(ActivitiesStateContext);
  if (!context) {
    throw new Error("useActivitiesState must be used within an ActivitiesProvider");
  }
  return context;
};

export const useActivitiesActions = () => {
  const context = useContext(ActivitiesActionContext);
  if (!context) {
    throw new Error("useActivitiesActions must be used within an ActivitiesProvider");
  }
  return context;
};
