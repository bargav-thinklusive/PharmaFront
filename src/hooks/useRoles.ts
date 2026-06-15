import { useUser } from "../context/UserContext";

/**
 * useRoles — reads the current user's roles from UserContext and exposes
 * convenient boolean flags plus a generic hasRole() helper.
 *
 * Roles defined in the backend:
 *   subscriber → view/search drugs only
 *   editor     → view + add drugs (no delete)
 *   admin      → full access (all CRUD + user management)
 */
export const useRoles = () => {
  const { roles } = useUser();

  const hasRole = (role: string): boolean =>
    Array.isArray(roles) && roles.includes(role);

  const hasAnyRole = (...checkRoles: string[]): boolean =>
    Array.isArray(roles) && checkRoles.some((r) => roles.includes(r));

  return {
    roles,
    hasRole,
    hasAnyRole,
    isAdmin: hasRole("admin"),
    isEditor: hasRole("editor"),
    isSubscriber: hasRole("subscriber"),
    /** editor OR admin can add/edit drugs */
    canEditDrugs: hasAnyRole("editor", "admin"),
    /** only admin can delete drugs or manage users */
    canDeleteDrugs: hasRole("admin"),
    canManageUsers: hasRole("admin"),
  };
};

export default useRoles;
