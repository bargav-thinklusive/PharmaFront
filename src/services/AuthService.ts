import axios from "axios";
import { REACT_API_URL } from "../urlConfig";
import TokenService from "./shared/TokenService";

class AuthService {
  baseUrl: string;
  constructor() {
    this.baseUrl = REACT_API_URL;
  }

  async login(email: string, password: string) {
    const payload = { email, password };
    try {
      const resp: any = await axios.post(`${this.baseUrl}/login`, payload);
      const { access_token, refresh_token } = resp.data;

      // Save both tokens as cookies
      TokenService.setToken(access_token);
      if (refresh_token) {
        TokenService.setRefreshToken(refresh_token);
      }

      return resp.data;
    } catch (error) {
      console.error("Something went wrong while logging in", error);
      throw error;
    }
  }

  async forgotPassword(email: string, newPassword: string) {
    const payload = { email, new_password: newPassword };
    try {
      const resp = await axios.post(`${this.baseUrl}/forgot-password`, payload);
      return resp.data;
    } catch (error) {
      console.error("Something went wrong while resetting password", error);
      throw error;
    }
  }

  static logout() {
    TokenService.clearAll();
    localStorage.removeItem("user");
  }

  isAuthenticated() {
    return !!TokenService.getToken();
  }
}

export default AuthService;
