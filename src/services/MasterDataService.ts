import axios from "axios";
import { REACT_API_URL } from "../urlConfig";
import TokenService from "./shared/TokenService";

export interface RegulatoryAuthorityItem {
  country: string;
  authority: string;
  abbreviation: string;
}

class MasterDataService {
  baseUrl = REACT_API_URL;

  private getAuthHeaders = () => {
    const token = TokenService.getToken();
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  getTherapeuticAreas = async (): Promise<Record<string, string[]>> => {
    try {
      const response = await axios.get(`${this.baseUrl}/therapeutic-areas/`, this.getAuthHeaders());
      const data = response.data?.data ?? response.data?.results ?? response.data;
      return typeof data === 'object' && data !== null && !Array.isArray(data) ? data : {};
    } catch (error) {
      console.error("Error fetching therapeutic areas:", error);
      return {};
    }
  };

  getRegionsCountries = async (): Promise<Record<string, string[]>> => {
    try {
      const response = await axios.get(`${this.baseUrl}/regions-countries/`, this.getAuthHeaders());
      const data = response.data?.data ?? response.data?.results ?? response.data;
      return typeof data === 'object' && data !== null && !Array.isArray(data) ? data : {};
    } catch (error) {
      console.error("Error fetching regions and countries:", error);
      return {};
    }
  };

  getRegulatoryAuthorities = async (): Promise<RegulatoryAuthorityItem[]> => {
    try {
      const response = await axios.get(`${this.baseUrl}/regulatory-authorities/`, this.getAuthHeaders());
      const data = response.data?.data ?? response.data?.results ?? response.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error fetching regulatory authorities:", error);
      return [];
    }
  };
}

export default MasterDataService;
