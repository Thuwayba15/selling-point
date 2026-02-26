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
          console.log("Auth Guard - User from storage:", user);
        } catch (error) {
          console.error("Auth Guard - Failed to parse user:", error);
          user = null;
          storage.remove(AUTH_STORAGE_KEY);
        }
      } else {
        console.log("Auth Guard - No valid user in storage, raw value:", raw);
      }

      const isAuthenticated = Boolean(user);
      const userRole = user?.role ?? null;

      console.log("Auth Guard - isAuthenticated:", isAuthenticated, "role:", userRole);

      // Redirect if not authenticated
      if (!isAuthenticated) {
        console.log("Auth Guard - Not authenticated, redirecting to:", redirectTo);
        router.replace(redirectTo);
        return;
      }

      // Check role restrictions
      if (allowedRoles.length > 0 && userRole && !allowedRoles.includes(userRole)) {
        // Redirect to appropriate default route based on role
        const fallback = userRole === "Admin" ? ROUTES.admin : ROUTES.dashboard;
        console.log("Auth Guard - Role not allowed, redirecting to:", fallback);
        router.replace(fallback);
      } else {
        console.log("Auth Guard - Access granted");
      }
    }, [isHydrated, router, redirectTo]);

    if (!isHydrated) return null;

    const raw = storage.get(AUTH_STORAGE_KEY);
    let user: AuthUser | null = null;

    if (raw && raw !== "undefined" && raw !== "null") {
      try {
        user = JSON.parse(raw) as AuthUser;
      } catch (error) {
        console.error("Auth Guard (render) - Failed to parse user:", error);
        user = null;
        storage.remove(AUTH_STORAGE_KEY);
      }
    }

    const isAuthenticated = Boolean(user);
    const userRole = user?.role ?? null;

    if (!isAuthenticated) {
      console.log("Auth Guard (render) - Not authenticated, returning null");
      return null;
    }

    if (allowedRoles.length > 0 && (!userRole || !allowedRoles.includes(userRole))) {
      console.log("Auth Guard (render) - Role not allowed, returning null");
      return null;
    }

    return <Wrapped {...props} />;
  };

  Guarded.displayName = `withAuthGuard(${Wrapped.displayName ?? Wrapped.name ?? "Component"})`;

  return Guarded;
};