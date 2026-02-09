

import { createContext, useContext, useEffect, type ReactNode } from "react";
//import { useNavigate } from "react-router";
import UserService from "../services/UserService";
import TokenService from "../services/shared/TokenService";
//import { LOGIN_URL } from "../urlConfig";
import useGet from "../hooks/useGet";
import DrugService from "../services/DrugService";
import { useNavigate, useLocation } from "react-router";
import { LOGIN_URL } from "../urlConfig";

const tokenService = TokenService;
const UserContext = createContext<any | undefined>(undefined)
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const navigate = useNavigate();
  const location = useLocation();
  const { fetchData: fetchUser, data: user, loading: userLoading } = useGet();
  const { fetchData: fetchDrugs, data: drugsData, loading: drugsLoading } = useGet();

  const checkTokenAndGetUser = async () => {
    const token = tokenService.getToken();
    if (token) {
      const id = tokenService.decodeToken()?.sub
      if (id) {
        const userService = new UserService()
        await fetchUser(userService.getUserById(id))
      }
    } else {
      const publicPaths = ['/login', '/register', '/home1', '/', '/what-we-do', '/areas-served', '/about', '/contacts'];
      if (!publicPaths.includes(location.pathname)) {
        navigate(LOGIN_URL)
      }
    }
  }

  const getDrugs = async () => {
    const drugService = new DrugService()
    await fetchDrugs(drugService.getDrugs())
  }

  useEffect(() => {
    const init = async () => {
      const hasToken = !!tokenService.getToken();
      await checkTokenAndGetUser();
      if (hasToken) {
        await getDrugs();
      }
    };
    init();
  }, [])

  // const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  // if(!isAuthPage && (userLoading || !user)){
  //   return <div>Loading...</div>
  // }

  return (
    <UserContext.Provider value={{ user, userLoading, checkTokenAndGetUser, drugsData: drugsData?.data || [], drugsLoading, refetchDrugs: getDrugs }}>
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

