"use client";

import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/lib/routes";
import { storage } from "@/lib/storage";
import { AUTH_STORAGE_KEY, type AuthUser } from "@/providers/auth/context";

type WithAuthOptions = {
  redirectTo?: string;
  allowedRoles?: Array<AuthUser["role"]>;
};

export const withAuthGuard = <P extends object>(
  Wrapped: ComponentType<P>,
  options: WithAuthOptions = {},
) => {
  const { redirectTo = ROUTES.login, allowedRoles = [] } = options;

  const Guarded = (props: P) => {
    const router = useRouter();
    const [isHydrated, setIsHydrated] = useState(false);
    const [user, setUser] = useState<AuthUser | null>(null);

    useEffect(() => {
      setIsHydrated(true);
      const raw = storage.get(AUTH_STORAGE_KEY);
      if (!raw) {
        setUser(null);
        return;
      }
      try {
        setUser(JSON.parse(raw) as AuthUser);
      } catch {
        setUser(null);
      }
    }, []);

    const userRole = user?.role ?? null;
    const isAuthenticated = Boolean(user);

    useEffect(() => {
      if (!isHydrated) return;
      if (!isAuthenticated) {
        router.replace(redirectTo);
        return;
      }

      if (allowedRoles.length > 0 && userRole && !allowedRoles.includes(userRole)) {
        const fallback = userRole === "admin" ? ROUTES.admin : ROUTES.dashboard;
        router.replace(fallback);
      }
    }, [isHydrated, isAuthenticated, userRole, allowedRoles, router, redirectTo]);

    if (!isHydrated) return null;
    if (!isAuthenticated) return null;
    if (allowedRoles.length > 0 && (!userRole || !allowedRoles.includes(userRole))) {
      return null;
    }

    return <Wrapped {...props} />;
  };

  Guarded.displayName = `withAuthGuard(${Wrapped.displayName ?? Wrapped.name ?? "Component"})`;

  return Guarded;
};