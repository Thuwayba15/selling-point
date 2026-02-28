"use client";

import { useContext, useReducer, useCallback } from "react";
import type { UserRole } from "@/providers/auth";
import {
  INITIAL_STATE,
  IInvitation,
  InvitationsActionContext,
  InvitationsStateContext,
} from "./context";
import { InvitationsReducer } from "./reducer";
import {
  addGeneratedInvitation,
  removeGeneratedInvitation,
  setGeneratedInvitations,
} from "./actions";

export const InvitationsProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(InvitationsReducer, INITIAL_STATE);

  // ============================================================================
  // Generate Invitation Link
  // ============================================================================
  const generateInvitationLink = useCallback(
    (tenantId: string, invitedEmail: string, role: UserRole): IInvitation => {
      const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
      const inviteLink = `${baseUrl}/register?tenantId=${encodeURIComponent(tenantId)}&role=${encodeURIComponent(role)}&email=${encodeURIComponent(invitedEmail)}`;

      const invitation: IInvitation = {
        id: Math.random().toString(36).substring(7),
        invitedEmail,
        role,
        inviteLink,
        createdAt: new Date().toISOString(),
      };

      dispatch(addGeneratedInvitation(invitation));

      return invitation;
    },
    [],
  );

  // ============================================================================
  // Get Generated Invitations
  // ============================================================================
  const getGeneratedInvitations = useCallback(() => {
    return state.generatedInvitations;
  }, [state.generatedInvitations]);

  // ============================================================================
  // Delete Generated Invitation
  // ============================================================================
  const deleteGeneratedInvitation = useCallback((id: string) => {
    dispatch(removeGeneratedInvitation(id));
  }, []);

  return (
    <InvitationsStateContext.Provider value={state}>
      <InvitationsActionContext.Provider
        value={{
          generateInvitationLink,
          getGeneratedInvitations,
          deleteGeneratedInvitation,
        }}
      >
        {children}
      </InvitationsActionContext.Provider>
    </InvitationsStateContext.Provider>
  );
};

// ============================================================================
// Hooks
// ============================================================================
export const useInvitationsState = () => {
  const context = useContext(InvitationsStateContext);
  if (!context) {
    throw new Error("useInvitationsState must be used within InvitationsProvider");
  }
  return context;
};

export const useInvitationsActions = () => {
  const context = useContext(InvitationsActionContext);
  if (!context) {
    throw new Error("useInvitationsActions must be used within InvitationsProvider");
  }
  return context;
};

export { InvitationsStateContext, InvitationsActionContext };
export type { IInvitation };
export { INITIAL_STATE } from "./context";
export {
  addGeneratedInvitation,
  removeGeneratedInvitation,
  setGeneratedInvitations,
  InvitationsActionTypes,
} from "./actions";
