"use client";

import type { ComponentType } from "react";

import { ROUTES } from "@/lib/routes";
import type { UserRole } from "@/providers/auth/context";
import { withAuthGuard } from "./withAuthGuard";

export const withRoleGuard = <P extends object>(
  Wrapped: ComponentType<P>,
  allowedRoles: UserRole[],
  options: { redirectTo?: string } = {},
) => {
  const { redirectTo = ROUTES.dashboard } = options;

  return withAuthGuard(Wrapped, { allowedRoles, redirectTo });
};