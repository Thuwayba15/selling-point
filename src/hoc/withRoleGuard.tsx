"use client";

import type { ComponentType } from "react";

import { ROUTES } from "@/lib/routes";
import type { AuthUser } from "@/providers/auth/context";
import { withAuthGuard } from "./withAuthGuard";

export const withRoleGuard = <P extends object>(
  Wrapped: ComponentType<P>,
  allowedRoles: Array<AuthUser["role"]>,
  options: { redirectTo?: string } = {},
) => {
  const { redirectTo = ROUTES.dashboard } = options;

  return withAuthGuard(Wrapped, { allowedRoles, redirectTo });
};