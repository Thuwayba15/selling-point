"use client";

import { createAction } from "redux-actions";
import { IInvitation } from "./context";

export enum InvitationsActionTypes {
  ADD_GENERATED_INVITATION = "ADD_GENERATED_INVITATION",
  REMOVE_GENERATED_INVITATION = "REMOVE_GENERATED_INVITATION",
  SET_GENERATED_INVITATIONS = "SET_GENERATED_INVITATIONS",
}

// Action creators using redux-actions
export const addGeneratedInvitation = createAction<IInvitation>(
  InvitationsActionTypes.ADD_GENERATED_INVITATION,
);

export const removeGeneratedInvitation = createAction<string>(
  InvitationsActionTypes.REMOVE_GENERATED_INVITATION,
);

export const setGeneratedInvitations = createAction<IInvitation[]>(
  InvitationsActionTypes.SET_GENERATED_INVITATIONS,
);
