import { useAppSelector } from "../store/hooks";
import TokenService from "../services/shared/TokenService";
import AuthService from "../services/AuthService";

/**
 * useRoles — reads the current user's roles from Redux store and exposes
 * convenient boolean flags plus generic permission helpers.
 */
export const useRoles = () => {
  const { roles: reduxRoles, user } = useAppSelector((state) => state.user);
  const roles = (Array.isArray(reduxRoles) && reduxRoles.length > 0) ? reduxRoles : AuthService.getUserRoles();

  const hasRole = (role: string): boolean =>
    Array.isArray(roles) && roles.map((r: string) => String(r).toLowerCase()).includes(role.toLowerCase());

  const hasAnyRole = (...checkRoles: string[]): boolean =>
    Array.isArray(roles) && checkRoles.some((r) => hasRole(r));

  const isAdmin = hasRole("admin");
  const isEditor = hasRole("editor");
  const isSubscriber = hasRole("subscriber");

  const currentUserId = user?.data?._id || user?.data?.id || TokenService.decodeToken()?.sub;
  const currentUserEmail = user?.data?.email || TokenService.decodeToken()?.email;

  const isCreator = (drugInput: any): boolean => {
    if (!drugInput) return false;
    const drug = drugInput?.drug || drugInput;
    const creator =
      drug.createdBy ||
      drug.created_by ||
      drug.userId ||
      drug.user_id ||
      drug.createdByEmail ||
      drug.ProductOverview?.createdBy ||
      drug.ProductOverview?.createdByEmail;

    if (!creator) return false;

    return (
      (currentUserId && String(creator) === String(currentUserId)) ||
      (currentUserEmail && String(creator).toLowerCase() === String(currentUserEmail).toLowerCase())
    );
  };

  /**
   * Admin can edit all drugs.
   * Editor can edit drugs if they created them (or if drug has no creator metadata).
   */
  const canEditDrug = (drugInput?: any): boolean => {
    if (isAdmin) return true;
    if (isEditor) {
      if (!drugInput) return true; // Generic check for opening form / adding
      const drug = drugInput?.drug || drugInput;
      const hasCreatorInfo =
        drug.createdBy ||
        drug.created_by ||
        drug.userId ||
        drug.user_id ||
        drug.createdByEmail ||
        drug.ProductOverview?.createdBy;

      if (hasCreatorInfo) return isCreator(drug);
      return true; // Fallback for legacy drugs without creator info
    }
    return false;
  };

  /**
   * Admin can delete all drugs.
   * Editor can delete ONLY drugs created by themselves.
   */
  const canDeleteDrug = (drugInput?: any): boolean => {
    if (isAdmin) return true;
    if (isEditor && drugInput) {
      const drug = drugInput?.drug || drugInput;
      return isCreator(drug);
    }
    return false;
  };

  return {
    roles,
    user,
    hasRole,
    hasAnyRole,
    isAdmin,
    isEditor,
    isSubscriber,
    canEditDrugs: hasAnyRole("editor", "admin"),
    canDeleteDrugs: hasAnyRole("editor", "admin"),
    canManageUsers: isAdmin,
    canEditDrug,
    canDeleteDrug,
    isCreator,
  };
};

export default useRoles;
