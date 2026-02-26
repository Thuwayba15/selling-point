import { useAuthState } from "@/providers/auth";
import {
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  isAdmin,
  isManager,
  getPrimaryRole,
} from "@/utils/rbac";

/**
 * Hook for RBAC permission checking in components
 *
 * @example
 * const { can, isAdmin, isManager } = useRbac();
 * if (can("approve:proposal")) <button>Approve</button>
 * if (isAdmin) <AdminPanel />
 */
export const useRbac = () => {
  const { user } = useAuthState();
  const roles = user?.roles ?? [];

  return {
    // Permission checking functions
    can: (permission: string) => hasPermission(roles, permission),
    canAll: (permissions: string[]) => hasAllPermissions(roles, permissions),
    canAny: (permissions: string[]) => hasAnyPermission(roles, permissions),

    // Role checking
    isAdmin: isAdmin(roles),
    isManager: isManager(roles),
    primaryRole: getPrimaryRole(roles),
    roles,

    // User info
    user,
    isAuthenticated: !!user,
  };
};
