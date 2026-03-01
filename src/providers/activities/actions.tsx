import { createAction } from "redux-actions";
import {
  IActivity,
  IActivitiesStateContext,
  IActivityParticipant,
  IPaginationInfo,
} from "./context";

// Enum defining the type of actions that can be dispatched
export enum ActivitiesActionEnums {
  // Get all activities
  getActivitiesPending = "GET_ACTIVITIES_PENDING",
  getActivitiesSuccess = "GET_ACTIVITIES_SUCCESS",
  getActivitiesError = "GET_ACTIVITIES_ERROR",

  // Get my activities
  getMyActivitiesPending = "GET_MY_ACTIVITIES_PENDING",
  getMyActivitiesSuccess = "GET_MY_ACTIVITIES_SUCCESS",
  getMyActivitiesError = "GET_MY_ACTIVITIES_ERROR",

  // Get upcoming activities
  getUpcomingActivitiesPending = "GET_UPCOMING_ACTIVITIES_PENDING",
  getUpcomingActivitiesSuccess = "GET_UPCOMING_ACTIVITIES_SUCCESS",
  getUpcomingActivitiesError = "GET_UPCOMING_ACTIVITIES_ERROR",

  // Get overdue activities
  getOverdueActivitiesPending = "GET_OVERDUE_ACTIVITIES_PENDING",
  getOverdueActivitiesSuccess = "GET_OVERDUE_ACTIVITIES_SUCCESS",
  getOverdueActivitiesError = "GET_OVERDUE_ACTIVITIES_ERROR",

  // Get single activity
  getActivityPending = "GET_ACTIVITY_PENDING",
  getActivitySuccess = "GET_ACTIVITY_SUCCESS",
  getActivityError = "GET_ACTIVITY_ERROR",

  // Get activity participants
  getActivityParticipantsPending = "GET_ACTIVITY_PARTICIPANTS_PENDING",
  getActivityParticipantsSuccess = "GET_ACTIVITY_PARTICIPANTS_SUCCESS",
  getActivityParticipantsError = "GET_ACTIVITY_PARTICIPANTS_ERROR",

  // Create activity
  createActivityPending = "CREATE_ACTIVITY_PENDING",
  createActivitySuccess = "CREATE_ACTIVITY_SUCCESS",
  createActivityError = "CREATE_ACTIVITY_ERROR",

  // Update activity
  updateActivityPending = "UPDATE_ACTIVITY_PENDING",
  updateActivitySuccess = "UPDATE_ACTIVITY_SUCCESS",
  updateActivityError = "UPDATE_ACTIVITY_ERROR",

  // Delete activity
  deleteActivityPending = "DELETE_ACTIVITY_PENDING",
  deleteActivitySuccess = "DELETE_ACTIVITY_SUCCESS",
  deleteActivityError = "DELETE_ACTIVITY_ERROR",

  // Complete activity
  completeActivityPending = "COMPLETE_ACTIVITY_PENDING",
  completeActivitySuccess = "COMPLETE_ACTIVITY_SUCCESS",
  completeActivityError = "COMPLETE_ACTIVITY_ERROR",

  // Cancel activity
  cancelActivityPending = "CANCEL_ACTIVITY_PENDING",
  cancelActivitySuccess = "CANCEL_ACTIVITY_SUCCESS",
  cancelActivityError = "CANCEL_ACTIVITY_ERROR",

  // Utility actions
  clearError = "CLEAR_ERROR",
  clearActivity = "CLEAR_ACTIVITY",
}

// Get Activities Actions
export const getActivitiesPending = createAction<IActivitiesStateContext>(
  ActivitiesActionEnums.getActivitiesPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false }),
);

export const getActivitiesSuccess = createAction<
  IActivitiesStateContext,
  { activities: IActivity[]; pagination?: IPaginationInfo }
>(ActivitiesActionEnums.getActivitiesSuccess, ({ activities, pagination }) => ({
  isPending: false,
  isLoadingDetails: false,
  isSuccess: true,
  isError: false,
  activities,
  pagination,
}));

export const getActivitiesError = createAction<IActivitiesStateContext, string>(
  ActivitiesActionEnums.getActivitiesError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

// Get My Activities Actions
export const getMyActivitiesPending = createAction<IActivitiesStateContext>(
  ActivitiesActionEnums.getMyActivitiesPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false }),
);

export const getMyActivitiesSuccess = createAction<
  IActivitiesStateContext,
  { activities: IActivity[]; pagination?: IPaginationInfo }
>(ActivitiesActionEnums.getMyActivitiesSuccess, ({ activities, pagination }) => ({
  isPending: false,
  isLoadingDetails: false,
  isSuccess: true,
  isError: false,
  activities,
  pagination,
}));

export const getMyActivitiesError = createAction<IActivitiesStateContext, string>(
  ActivitiesActionEnums.getMyActivitiesError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

// Get Upcoming Activities Actions
export const getUpcomingActivitiesPending = createAction<IActivitiesStateContext>(
  ActivitiesActionEnums.getUpcomingActivitiesPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false }),
);

export const getUpcomingActivitiesSuccess = createAction<
  IActivitiesStateContext,
  { activities: IActivity[]; pagination?: IPaginationInfo }
>(ActivitiesActionEnums.getUpcomingActivitiesSuccess, ({ activities, pagination }) => ({
  isPending: false,
  isLoadingDetails: false,
  isSuccess: true,
  isError: false,
  activities,
  pagination,
}));

export const getUpcomingActivitiesError = createAction<IActivitiesStateContext, string>(
  ActivitiesActionEnums.getUpcomingActivitiesError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

// Get Overdue Activities Actions
export const getOverdueActivitiesPending = createAction<IActivitiesStateContext>(
  ActivitiesActionEnums.getOverdueActivitiesPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false }),
);

export const getOverdueActivitiesSuccess = createAction<
  IActivitiesStateContext,
  { activities: IActivity[]; pagination?: IPaginationInfo }
>(ActivitiesActionEnums.getOverdueActivitiesSuccess, ({ activities, pagination }) => ({
  isPending: false,
  isLoadingDetails: false,
  isSuccess: true,
  isError: false,
  activities,
  pagination,
}));

export const getOverdueActivitiesError = createAction<IActivitiesStateContext, string>(
  ActivitiesActionEnums.getOverdueActivitiesError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

// Get Single Activity Actions
export const getActivityPending = createAction<IActivitiesStateContext>(
  ActivitiesActionEnums.getActivityPending,
  () => ({ isPending: false, isLoadingDetails: true, isSuccess: false, isError: false }),
);

export const getActivitySuccess = createAction<IActivitiesStateContext, IActivity>(
  ActivitiesActionEnums.getActivitySuccess,
  (activity: IActivity) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
    activity,
  }),
);

export const getActivityError = createAction<IActivitiesStateContext, string>(
  ActivitiesActionEnums.getActivityError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

// Get Activity Participants Actions
export const getActivityParticipantsPending = createAction<IActivitiesStateContext>(
  ActivitiesActionEnums.getActivityParticipantsPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false }),
);

export const getActivityParticipantsSuccess = createAction<
  IActivitiesStateContext,
  IActivityParticipant[]
>(ActivitiesActionEnums.getActivityParticipantsSuccess, (participants: IActivityParticipant[]) => ({
  isPending: false,
  isLoadingDetails: false,
  isSuccess: true,
  isError: false,
  participants,
}));

export const getActivityParticipantsError = createAction<IActivitiesStateContext, string>(
  ActivitiesActionEnums.getActivityParticipantsError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

// Create Activity Actions
export const createActivityPending = createAction<IActivitiesStateContext>(
  ActivitiesActionEnums.createActivityPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false }),
);

export const createActivitySuccess = createAction<IActivitiesStateContext, IActivity>(
  ActivitiesActionEnums.createActivitySuccess,
  (activity: IActivity) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
    activity,
  }),
);

export const createActivityError = createAction<IActivitiesStateContext, string>(
  ActivitiesActionEnums.createActivityError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

// Update Activity Actions
export const updateActivityPending = createAction<IActivitiesStateContext>(
  ActivitiesActionEnums.updateActivityPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false }),
);

export const updateActivitySuccess = createAction<IActivitiesStateContext, IActivity>(
  ActivitiesActionEnums.updateActivitySuccess,
  (activity: IActivity) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
    activity,
  }),
);

export const updateActivityError = createAction<IActivitiesStateContext, string>(
  ActivitiesActionEnums.updateActivityError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

// Delete Activity Actions
export const deleteActivityPending = createAction<IActivitiesStateContext>(
  ActivitiesActionEnums.deleteActivityPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false }),
);

export const deleteActivitySuccess = createAction<IActivitiesStateContext>(
  ActivitiesActionEnums.deleteActivitySuccess,
  () => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
  }),
);

export const deleteActivityError = createAction<IActivitiesStateContext, string>(
  ActivitiesActionEnums.deleteActivityError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

// Complete Activity Actions
export const completeActivityPending = createAction<IActivitiesStateContext>(
  ActivitiesActionEnums.completeActivityPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false }),
);

export const completeActivitySuccess = createAction<IActivitiesStateContext, IActivity>(
  ActivitiesActionEnums.completeActivitySuccess,
  (activity: IActivity) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
    activity,
  }),
);

export const completeActivityError = createAction<IActivitiesStateContext, string>(
  ActivitiesActionEnums.completeActivityError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

// Cancel Activity Actions
export const cancelActivityPending = createAction<IActivitiesStateContext>(
  ActivitiesActionEnums.cancelActivityPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false }),
);

export const cancelActivitySuccess = createAction<IActivitiesStateContext, IActivity>(
  ActivitiesActionEnums.cancelActivitySuccess,
  (activity: IActivity) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
    activity,
  }),
);

export const cancelActivityError = createAction<IActivitiesStateContext, string>(
  ActivitiesActionEnums.cancelActivityError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

// Utility Actions
export const clearError = createAction<IActivitiesStateContext>(
  ActivitiesActionEnums.clearError,
  () => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: false,
    errorMessage: undefined,
  }),
);

export const clearActivity = createAction<IActivitiesStateContext>(
  ActivitiesActionEnums.clearActivity,
  () => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: false,
    activity: undefined,
  }),
);
