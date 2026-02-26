"use client";

import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/lib/routes";
import { storage } from "@/lib/storage";
import { AUTH_STORAGE_KEY, type AuthUser, type UserRole } from "@/providers/auth/context";

type WithAuthOptions = {
  redirectTo?: string;
  allowedRoles?: UserRole[];
};

export const withAuthGuard = <P extends object>(
  Wrapped: ComponentType<P>,
  options: WithAuthOptions = {},
) => {
  const { redirectTo = ROUTES.login, allowedRoles = [] } = options;

  const Guarded = (props: P) => {
    const router = useRouter();
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
      setIsHydrated(true);
    }, []);

    useEffect(() => {
      if (!isHydrated) return;

      const raw = storage.get(AUTH_STORAGE_KEY);
      let user: AuthUser | null = null;

      if (raw && raw !== "undefined" && raw !== "null") {
        try {
          user = JSON.parse(raw) as AuthUser;
        } catch (error) {
          console.error("Auth Guard - Failed to parse user:", error);
          user = null;
          storage.remove(AUTH_STORAGE_KEY);
        }
      } else {
      }

      const isAuthenticated = Boolean(user);
      const userRoles = user?.roles ?? [];

      // Redirect if not authenticated
      if (!isAuthenticated) {
        router.replace(redirectTo);
        return;
      }

      // Check role restrictions
      if (allowedRoles.length > 0) {
        const hasRequiredRole = userRoles.some((role) => allowedRoles.includes(role));
        if (!hasRequiredRole) {
          // Redirect to dashboard as default fallback route
          router.replace(ROUTES.dashboard);
        } else {
        }
      } else {
      }
    }, [isHydrated, router, redirectTo, allowedRoles]);

    if (!isHydrated) return null;

    const raw = storage.get(AUTH_STORAGE_KEY);
    let user: AuthUser | null = null;

    if (raw && raw !== "undefined" && raw !== "null") {
      try {
        user = JSON.parse(raw) as AuthUser;
      } catch (error) {
        user = null;
        storage.remove(AUTH_STORAGE_KEY);
      }
    }

    const isAuthenticated = Boolean(user);
    const userRoles = user?.roles ?? [];

    if (!isAuthenticated) {
      return null;
    }

    if (allowedRoles.length > 0) {
      const hasRequiredRole = userRoles.some((role) => allowedRoles.includes(role));
      if (!hasRequiredRole) {
        return null;
      }
    }

    return <Wrapped {...props} />;
  };

  Guarded.displayName = `withAuthGuard(${Wrapped.displayName ?? Wrapped.name ?? "Component"})`;

  return Guarded;
};