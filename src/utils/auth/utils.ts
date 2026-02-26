import type { AuthUser, UserRole } from "@/providers/auth/context";

/**
 * Safely parse JSON; returns null if invalid.
 * Treats "undefined" / "null" / empty as invalid.
 */
export const safeParseJson = <T>(raw: unknown): T | null => {
  if (typeof raw !== "string") return null;

  const trimmed = raw.trim();
  if (!trimmed || trimmed === "undefined" || trimmed === "null") return null;

  try {
    return JSON.parse(trimmed) as T;
  } catch {
    return null;
  }
};

/**
 * JWT decode fallback (only used if API doesn't return user fields).
 * Not the primary path because API returns email/roles/tenantId etc.
 */
export const decodeToken = (token: string): AuthUser | null => {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    // pad base64
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");

    const jsonPayload = decodeURIComponent(
      atob(padded)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join(""),
    );

    const payload = JSON.parse(jsonPayload) as any;

    const roleClaim =
      payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ??
      payload.role;

    const rolesFromToken: UserRole[] = Array.isArray(payload.roles)
      ? payload.roles
      : roleClaim
        ? [roleClaim]
        : [];

    return {
      id: String(payload.sub ?? payload.userId ?? ""),
      email: String(payload.email ?? ""),
      firstName: String(payload.firstName ?? ""),
      lastName: String(payload.lastName ?? ""),
      roles: rolesFromToken,
      tenantId: String(payload.tenantId ?? ""),
    };
  } catch {
    return null;
  }
};