import { createContext, useContext, type ReactNode } from "react";


const UserContext=createContext<any|undefined>(undefined)


export const UserProvider: React.FC<{ children: ReactNode }>=({children})=>{



    return(
        <UserContext.Provider value={{}}>
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