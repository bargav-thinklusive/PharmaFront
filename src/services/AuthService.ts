import axios from "axios";
import { REACT_API_URL } from "../urlConfig";
import TokenService from "./shared/TokenService";

class AuthService {
  baseUrl: string;
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

  async forgotPassword(email: string, newPassword: string) {
    const payload={email,new_password:newPassword}
    try {
      const resp = await axios.post(`${this.baseUrl}/forgot-password`, payload);
      return resp.data;
    } catch (error) {
      console.error("Something went wrong while resetting password", error);
      throw error;
    }
  }

  static logout() {
    TokenService.deleteToken();
    localStorage.removeItem('user');
    return true;
  }

  isAuthenticated() {
    const token = TokenService.getToken();
    return !!token;
  }
}

export default AuthService;
