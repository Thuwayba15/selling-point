"use client";

import { createContext } from "react";
import type { UserRole } from "@/providers/auth";

// Interface for a generated invitation link
export interface IInvitation {
  id: string;
  invitedEmail: string;
  role: UserRole;
  inviteLink: string;
  createdAt: string;
  createdByEmail?: string;
}

// Interface defining the state shape for our context
export interface IInvitationsStateContext {
  generatedInvitations: IInvitation[];
}

// Interface defining all the actions that can be performed
export interface IInvitationsActionContext {
  generateInvitationLink: (
    tenantId: string,
    invitedEmail: string,
    role: UserRole,
  ) => IInvitation;
  getGeneratedInvitations: () => IInvitation[];
  deleteGeneratedInvitation: (id: string) => void;
}

// Initial state
export const INITIAL_STATE: IInvitationsStateContext = {
  generatedInvitations: [],
};

// Create contexts
export const InvitationsStateContext = createContext<IInvitationsStateContext>(INITIAL_STATE);
export const InvitationsActionContext = createContext<IInvitationsActionContext | undefined>(
  undefined,
);
