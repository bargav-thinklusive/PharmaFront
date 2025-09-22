
import { jwtDecode } from "jwt-decode";
import AuthService from "../AuthService";
import { REACT_API_URL } from "../../../urlConfig";



class TokenService{
    static baseUrl=REACT_API_URL;
    static authService=new AuthService()

    static getToken(){
        const token=document.cookie.split(";").find((cookie)=>cookie.trim().startsWith("token="));
        return token?token.split("=")[1]:null;
    }

    static setToken(token:string){
        const expirationDate=new Date(Date.now()+60*60*1000);
        const formattedExpirationDate=expirationDate.toUTCString();
        document.cookie=`token=${token}; expires=${formattedExpirationDate}; path="/`;
    }

    static deleteToken(){
        document.cookie="token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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

  static async refreshToken() {
    const username = "siva8374@gmail.com";
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
}


export default TokenService