import axios from "axios";
import { REACT_API_URL } from "../urlConfig";

export interface RegulatoryAuthorityItem {
  country: string;
  authority: string;
  abbreviation: string;
}

class MasterDataService {
  baseUrl = REACT_API_URL;

  getTherapeuticAreas = async (): Promise<Record<string, string[]>> => {
    try {
      const response = await axios.get(`${this.baseUrl}/therapeutic-areas/`);
      return response.data?.data || {};
    } catch (error) {
      console.error("Error fetching therapeutic areas:", error);
      return {};
    }
  };

  getRegionsCountries = async (): Promise<Record<string, string[]>> => {
    try {
      const response = await axios.get(`${this.baseUrl}/regions-countries/`);
      return response.data?.data || {};
    } catch (error) {
      console.error("Error fetching regions and countries:", error);
      return {};
    }
  };

  getRegulatoryAuthorities = async (): Promise<RegulatoryAuthorityItem[]> => {
    try {
      const response = await axios.get(`${this.baseUrl}/regulatory-authorities/`);
      return response.data?.data || [];
    } catch (error) {
      console.error("Error fetching regulatory authorities:", error);
      return [];
    }
  };
}

export default MasterDataService;
