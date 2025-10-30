
import { REACT_API_URL } from "../../urlConfig";
import { jwtDecode } from "jwt-decode";
import AuthService from "../AuthService";

class TokenService {
  static baseUrl = REACT_API_URL;
  static get authService() {
    if (!this._authService) {
      this._authService = new AuthService();
    }
    return this._authService;
  }
  private static _authService: AuthService | null = null;

  static getToken() {
    const token = document.cookie
      .split(";")
      .find((cookie) => cookie.trim().startsWith("token="));
    return token ? token.split("=")[1] : null;
  }

  static setToken(token: string) {
    const expirationDate = new Date(Date.now() + 60 * 60 * 1000); // 60 minutes in milliseconds
    const formattedExpirationDate = expirationDate.toUTCString();
    document.cookie = `token=${token}; expires=${formattedExpirationDate}; path=/;`;
  }

  static deleteToken() {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }

  static decodeToken() {
    const token = TokenService.getToken();
    if (!token) return;
    try {
      const decoded: any = jwtDecode(token);
      if (decoded) {
        return decoded;
      } else {
        console.error("Failed to decode token");
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  static isTokenExpired() {
    const decoded = this.decodeToken();
    if (!decoded || !decoded.exp) return true;
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  }

  static async refreshToken() {
    const username = "kumar7754@gmail.com";
    const password = "123456789";
    try {
      const resp = await this.authService.login(username, password);
      const newToken = resp.access_token;
      this.setToken(newToken);
      return newToken;
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw error;
    }
  }

  static async getValidToken() {
    if (!this.getToken() || this.isTokenExpired()) {
      await this.refreshToken();
    }
    return this.getToken();
  }

  static async validateUser() {
    try {
      const token = await this.getValidToken();
      if (!token) return false;

      const decoded = this.decodeToken();
      if (!decoded || !decoded.id) return false;

      // Additional validation can be added here if needed
      return true;
    } catch (error) {
      console.error("User validation failed:", error);
      return false;
    }
  }
}

export default TokenService;
