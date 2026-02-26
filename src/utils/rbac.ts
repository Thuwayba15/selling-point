import type { UserRole } from "@/providers/auth/context";

/**
 * Permission matrix: what each role can do
 * Based on Sales Automation API documentation
 */
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  Admin: [
    // Users & System
    "manage:users",
    "manage:config",
    "view:reports",

    // Clients
    "create:client",
    "update:client",
    "delete:client",

    // Contacts
    "create:contact",
    "update:contact",
    "delete:contact",

    // Opportunities
    "create:opportunity",
    "update:opportunity",
    "delete:opportunity",
    "assign:opportunity",
    "view:all-opportunities",

    // Proposals
    "create:proposal",
    "update:proposal",
    "delete:proposal",
    "approve:proposal",
    "reject:proposal",

    // Pricing Requests
    "create:pricing-request",
    "update:pricing-request",
    "assign:pricing-request",
    "complete:pricing-request",
    "view:all-pricing-requests",

    // Contracts
    "create:contract",
    "update:contract",
    "delete:contract",
    "activate:contract",

    // Activities
    "create:activity",
    "update:activity",
    "delete:activity",

    // Documents
    "delete:document",

    // Notes
    "create:note",
    "update:note",
    "delete:note",
  ],

  SalesManager: [
    // Clients
    "create:client",
    "update:client",
    "delete:client",

    // Contacts
    "create:contact",
    "update:contact",
    "delete:contact",

    // Opportunities
    "create:opportunity",
    "update:opportunity",
    "delete:opportunity",
    "assign:opportunity",
    "view:all-opportunities",

    // Proposals
    "create:proposal",
    "update:proposal",
    "delete:proposal",
    "approve:proposal",
    "reject:proposal",

    // Pricing Requests
    "create:pricing-request",
    "update:pricing-request",
    "assign:pricing-request",
    "complete:pricing-request",
    "view:all-pricing-requests",

    // Contracts
    "create:contract",
    "update:contract",
    "activate:contract",

    // Activities
    "create:activity",
    "update:activity",
    "delete:activity",

    // Reports
    "view:reports",

    // Notes
    "create:note",
    "update:note",
    "delete:note",
  ],

  BusinessDevelopmentManager: [
    // Clients
    "create:client",
    "update:client",

    // Contacts
    "create:contact",
    "update:contact",
    "delete:contact",

    // Opportunities
    "create:opportunity",
    "update:opportunity",

    // Proposals
    "create:proposal",
    "update:proposal",

    // Pricing Requests
    "create:pricing-request",
    "update:pricing-request",
    "complete:pricing-request",

    // Contracts
    "create:contract",
    "update:contract",

    // Activities
    "create:activity",
    "update:activity",

    // Notes
    "create:note",
    "update:note",
  ],

  SalesRep: [
    // Clients
    "create:client",
    "update:client",

    // Contacts
    "create:contact",
    "update:contact",

    // Opportunities
    "create:opportunity",
    "update:opportunity",

    // Pricing Requests
    "create:pricing-request",

    // Activities
    "create:activity",
    "update:activity",

    // Notes
    "create:note",
    "update:note",
  ],
};

/**
 * Check if user has a specific permission
 */
export const hasPermission = (roles: UserRole[], permission: string): boolean => {
  return roles.some((role) => ROLE_PERMISSIONS[role]?.includes(permission) ?? false);
};

/**
 * Check if user has all permissions (AND logic)
 */
export const hasAllPermissions = (roles: UserRole[], permissions: string[]): boolean => {
  return permissions.every((permission) => hasPermission(roles, permission));
};

/**
 * Check if user has any permission (OR logic)
 */
export const hasAnyPermission = (roles: UserRole[], permissions: string[]): boolean => {
  return permissions.some((permission) => hasPermission(roles, permission));
};

/**
 * Check if user is admin
 */
export const isAdmin = (roles: UserRole[]): boolean => {
  return roles.includes("Admin");
};

/**
 * Check if user is manager (Admin or SalesManager)
 */
export const isManager = (roles: UserRole[]): boolean => {
  return roles.includes("Admin") || roles.includes("SalesManager");
};

/**
 * Get user's primary role (highest privilege)
 * Priority: Admin > SalesManager > BusinessDevelopmentManager > SalesRep
 */
export const getPrimaryRole = (roles: UserRole[]): UserRole => {
  const priority: UserRole[] = ["Admin", "SalesManager", "BusinessDevelopmentManager", "SalesRep"];
  return priority.find((role) => roles.includes(role)) ?? "SalesRep";
};
