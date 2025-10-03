import axios from "axios";
import { REACT_API_URL } from "../urlConfig";
import TokenService from "./shared/TokenService";

class AuthService {
  baseUrl: String;
  constructor() {
    this.baseUrl = REACT_API_URL;
  }

  async login(email: string, password: string) {
    const payload = { email: email, password };

    try {
      const resp: any = await axios.post(`${this.baseUrl}/login`, payload);
      const newToken = resp.data.access_token;
      TokenService.setToken(newToken);
      return newToken;
    } catch (error) {
      console.error("Something went wrong while log in", error);
      throw error;
    }
  }

  logout() {
    TokenService.deleteToken();  
    return true;
  }

  isAuthenticated() {
    const token = TokenService.getToken();
    return !!token;
  }
}

export default AuthService;
