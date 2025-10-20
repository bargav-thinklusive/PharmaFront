

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import UserService from "../services/UserService";
import TokenService from "../services/shared/TokenService";
import useGet from "../hooks/useGet";
import { drugData } from "../sampleData/data";

const tokenService = TokenService;
const UserContext = createContext<any | undefined>(undefined)

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { fetchData: fetchUser, data: user, loading: userLoading } = useGet();
  const [drugsData] = useState(drugData);

  const checkTokenAndGetUser = async () => {
    const id = tokenService.decodeToken()?.id
    if (id) {
      const userService = new UserService()
      const user = await fetchUser(userService.getUserById(id))
      return user
    }
  }

  useEffect(() => {
    checkTokenAndGetUser()
  }, [])

  return (
    <UserContext.Provider value={{ user, userLoading, checkTokenAndGetUser, drugsData }}>
      { children }
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

