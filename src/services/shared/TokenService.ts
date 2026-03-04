import { REACT_API_URL } from "../../urlConfig";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const ACCESS_TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refresh_token";
const REFRESH_TOKEN_EXPIRY_DAYS = 30;

class TokenService {
  static baseUrl = REACT_API_URL;

  // ─── Cookie helpers ───────────────────────────────────────────────────────

  private static setCookie(name: string, value: string, days: number) {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/;`;
  }

  private static getCookie(name: string): string | null {
    const prefix = `${name}=`;
    const match = document.cookie
      .split(";")
      .map(c => c.trim())
      .find((c) => c.startsWith(prefix));
    return match ? match.substring(prefix.length) : null;
  }

  private static deleteCookie(name: string) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  // ─── Access token ─────────────────────────────────────────────────────────

  static getToken(): string | null {
    return this.getCookie(ACCESS_TOKEN_KEY);
  }

  static setToken(token: string) {
    // Access token expires in 60 minutes (1/24 of a day)
    this.setCookie(ACCESS_TOKEN_KEY, token, 1 / 24);
  }

  static deleteToken() {
    this.deleteCookie(ACCESS_TOKEN_KEY);
  }

  // ─── Refresh token ────────────────────────────────────────────────────────

  static getRefreshToken(): string | null {
    return this.getCookie(REFRESH_TOKEN_KEY);
  }

  static setRefreshToken(token: string) {
    this.setCookie(REFRESH_TOKEN_KEY, token, REFRESH_TOKEN_EXPIRY_DAYS);
  }

  static deleteRefreshToken() {
    this.deleteCookie(REFRESH_TOKEN_KEY);
  }

  // ─── Decode ───────────────────────────────────────────────────────────────

  static decodeToken() {
    const token = TokenService.getToken();
    if (!token) return null;
    try {
      return jwtDecode<any>(token);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }

  // ─── Refresh ──────────────────────────────────────────────────────────────

  /**
   * Calls POST /refresh with the current refresh token cookie.
   * On success, saves the new access token (and new refresh token if returned
   * by the backend for rotation).
   * Returns the new access token string, or null if refresh failed.
   */
  static async refreshToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return null;

    try {
      const resp = await axios.post(`${this.baseUrl}/refresh`, {
        refresh_token: refreshToken,
      });

      const { access_token, refresh_token: newRefreshToken } = resp.data;

      if (access_token) {
        this.setToken(access_token);
      }

      // If the backend returns a rotated refresh token, save it
      if (newRefreshToken) {
        this.setRefreshToken(newRefreshToken);
      }

      return access_token ?? null;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return null;
    }
  }

  // ─── Clear all ────────────────────────────────────────────────────────────

  static clearAll() {
    this.deleteToken();
    this.deleteRefreshToken();
    // Also wipe any in-progress drug form draft so the next user on this
    // device / tab starts with a completely blank form.
    try {
      const userId = this.decodeToken()?.sub ?? "anonymous";
      sessionStorage.removeItem(`drug_form_draft_${userId}`);
    } catch {
      // ignore – sessionStorage may not be available
    }
  }
}

export default TokenService;
