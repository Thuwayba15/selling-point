import { handleActions } from "redux-actions";
import { INITIAL_STATE, IActivitiesStateContext } from "./context";
import { ActivitiesActionEnums } from "./actions";

export const ActivitiesReducer = handleActions<IActivitiesStateContext, IActivitiesStateContext>(
  {
    // Get Activities
    [ActivitiesActionEnums.getActivitiesPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ActivitiesActionEnums.getActivitiesSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ActivitiesActionEnums.getActivitiesError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    // Get My Activities
    [ActivitiesActionEnums.getMyActivitiesPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ActivitiesActionEnums.getMyActivitiesSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ActivitiesActionEnums.getMyActivitiesError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    // Get Upcoming Activities
    [ActivitiesActionEnums.getUpcomingActivitiesPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ActivitiesActionEnums.getUpcomingActivitiesSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ActivitiesActionEnums.getUpcomingActivitiesError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    // Get Overdue Activities
    [ActivitiesActionEnums.getOverdueActivitiesPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ActivitiesActionEnums.getOverdueActivitiesSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ActivitiesActionEnums.getOverdueActivitiesError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    // Get Single Activity
    [ActivitiesActionEnums.getActivityPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ActivitiesActionEnums.getActivitySuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ActivitiesActionEnums.getActivityError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    // Get Activity Participants
    [ActivitiesActionEnums.getActivityParticipantsPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ActivitiesActionEnums.getActivityParticipantsSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ActivitiesActionEnums.getActivityParticipantsError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    // Create Activity
    [ActivitiesActionEnums.createActivityPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ActivitiesActionEnums.createActivitySuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ActivitiesActionEnums.createActivityError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    // Update Activity
    [ActivitiesActionEnums.updateActivityPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ActivitiesActionEnums.updateActivitySuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ActivitiesActionEnums.updateActivityError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    // Delete Activity
    [ActivitiesActionEnums.deleteActivityPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ActivitiesActionEnums.deleteActivitySuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ActivitiesActionEnums.deleteActivityError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    // Complete Activity
    [ActivitiesActionEnums.completeActivityPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ActivitiesActionEnums.completeActivitySuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ActivitiesActionEnums.completeActivityError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    // Cancel Activity
    [ActivitiesActionEnums.cancelActivityPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ActivitiesActionEnums.cancelActivitySuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ActivitiesActionEnums.cancelActivityError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    // Utility Actions
    [ActivitiesActionEnums.clearError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ActivitiesActionEnums.clearActivity]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
  },
  INITIAL_STATE,
);
