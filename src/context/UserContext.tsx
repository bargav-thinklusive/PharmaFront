
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import UserService from "../services/UserService";
import TokenService from "../services/shared/TokenService";
import AuthService from "../services/AuthService";
import useGet from "../hooks/useGet";
import DrugService from "../services/DrugService";
import DraftService from "../services/DraftService";

import MasterDataService from "../services/MasterDataService";

const tokenService = TokenService;
const UserContext = createContext<any | undefined>(undefined)
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const { fetchData: fetchUser, data: user, loading: userLoading } = useGet();
  const { fetchData: fetchDrugs, data: drugsData, loading: drugsLoading } = useGet();
  const { fetchData: fetchDrafts, data: draftsRawData, loading: draftsLoading } = useGet();

  const [masterData, setMasterData] = useState<{
    therapeuticAreas: Record<string, string[]>;
    regionsCountries: Record<string, string[]>;
    regulatoryAuthorities: any[];
  }>({
    therapeuticAreas: {},
    regionsCountries: {},
    regulatoryAuthorities: []
  });

  const getMasterData = async () => {
    const masterDataService = new MasterDataService();
    const [ta, rc, ra] = await Promise.all([
      masterDataService.getTherapeuticAreas(),
      masterDataService.getRegionsCountries(),
      masterDataService.getRegulatoryAuthorities()
    ]);
    setMasterData({
      therapeuticAreas: ta,
      regionsCountries: rc,
      regulatoryAuthorities: ra
    });
  };

  const checkTokenAndGetUser = async (): Promise<boolean> => {
    let token = tokenService.getToken();

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
    return false;
  }

  const getDrugs = async () => {
    const drugService = new DrugService()
    await fetchDrugs(drugService.getDrugs())
  }

  const getDrafts = async () => {
    const rolesList = user?.data?.roles ?? AuthService.getUserRoles() ?? [];
    const normalized = rolesList.map((r: string) => r.toLowerCase());
    const isEditor = normalized.includes("editor") || normalized.includes("admin");
    if (!isEditor) return;

    const draftService = new DraftService();
    await fetchDrafts(draftService.getDrafts());
  }

  useEffect(() => {
    checkTokenAndGetUser();
    getMasterData();
  }, []);

  useEffect(() => {
    if (user) {
      getDrugs();
      getDrafts();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const roles: string[] =
    user?.data?.roles ??
    AuthService.getUserRoles();

  const drafts = Array.isArray(draftsRawData) ? draftsRawData : [];

  const [selectedList, setSelectedList] = useState<'fda' | 'cmcintel'>('fda');

  return (
    <UserContext.Provider value={{
      user,
      userLoading,
      checkTokenAndGetUser,
      drugsData: Array.isArray(drugsData) ? drugsData : (drugsData?.data || []),
      drugsLoading,
      refetchDrugs: getDrugs,
      drafts,
      draftsLoading,
      refetchDrafts: getDrafts,
      roles,
      selectedList,
      setSelectedList,
      masterData,
      refetchMasterData: getMasterData
    }}>
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
