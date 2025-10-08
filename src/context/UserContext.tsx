

import { createContext, useContext, useEffect, type ReactNode } from "react";
//import { useNavigate } from "react-router";
import UserService from "../services/UserService";
import TokenService from "../services/shared/TokenService";
//import { LOGIN_URL } from "../urlConfig";
import useGet from "../hooks/useGet";

const tokenService = TokenService;
const UserContext = createContext<any | undefined>(undefined)
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  //const navigate = useNavigate();
  const { fetchData, data: user, loading } = useGet();

  const checkTokenAndGetUser=async()=>{
    const id=tokenService.decodeToken()?.id
    if(id){
      const userService=new UserService()
      const user=await fetchData(userService.getUserById(id))
      return user
    }else{
      //navigate(LOGIN_URL)
    }
  }

  useEffect(()=>{
    checkTokenAndGetUser()
  },[])

  // if(loading || !user){
  //   return <div>Loading...</div>
  // }

  return (
    <UserContext.Provider value={{user,loading,checkTokenAndGetUser}}>
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

