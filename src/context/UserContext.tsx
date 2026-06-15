
import { createContext, useContext, useEffect, type ReactNode } from "react";
import UserService from "../services/UserService";
import TokenService from "../services/shared/TokenService";
import AuthService from "../services/AuthService";
import useGet from "../hooks/useGet";
import DrugService from "../services/DrugService";

const tokenService = TokenService;
const UserContext = createContext<any | undefined>(undefined)
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const { fetchData: fetchUser, data: user, loading: userLoading } = useGet();
  const { fetchData: fetchDrugs, data: drugsData, loading: drugsLoading } = useGet();

  const checkTokenAndGetUser = async (): Promise<boolean> => {
    let token = tokenService.getToken();

    // No access token — try to silently refresh before giving up
    if (!token) {
      token = await tokenService.refreshToken();
    }

    if (token) {
      const id = tokenService.decodeToken()?.sub;
      if (id) {
        const userService = new UserService();
        await fetchUser(userService.getUserById(id));
      }
      return true;
    }

    // Not authenticated — PublicOnlyRoute and ProtectedRoute handle redirects
    // at the router level, so no manual navigate() call needed here.
    return false;
  }

  const getDrugs = async () => {
    const drugService = new DrugService()
    await fetchDrugs(drugService.getDrugs())
  }

  useEffect(() => {
    const init = async () => {
      const isAuthenticated = await checkTokenAndGetUser();
      if (isAuthenticated) {
        await getDrugs();
      }
    };
    init();
  }, [])

  // Derive roles: prefer live user data, fallback to localStorage on refresh
  const roles: string[] =
    user?.data?.roles ??
    AuthService.getUserRoles();

  return (
    <UserContext.Provider value={{ user, userLoading, checkTokenAndGetUser, drugsData: Array.isArray(drugsData) ? drugsData : (drugsData?.data || []), drugsLoading, refetchDrugs: getDrugs, roles }}>
      {children}
    </UserContext.Provider>
  )

}


export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
