import { handleActions } from "redux-actions";
import { IInvitation, INITIAL_STATE, IInvitationsStateContext } from "./context";
import { InvitationsActionTypes } from "./actions";

export const InvitationsReducer = handleActions<IInvitationsStateContext, any>(
  {
    [InvitationsActionTypes.ADD_GENERATED_INVITATION]: (
      state,
      action: { payload: IInvitation },
    ) => ({
      ...state,
      generatedInvitations: [...state.generatedInvitations, action.payload],
    }),

    [InvitationsActionTypes.REMOVE_GENERATED_INVITATION]: (state, action: { payload: string }) => ({
      ...state,
      generatedInvitations: state.generatedInvitations.filter((inv) => inv.id !== action.payload),
    }),

    [InvitationsActionTypes.SET_GENERATED_INVITATIONS]: (
      state,
      action: { payload: IInvitation[] },
    ) => ({
      ...state,
      generatedInvitations: action.payload,
    }),
  },
  INITIAL_STATE,
);
