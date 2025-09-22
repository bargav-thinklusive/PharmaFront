import axios from "axios";
import TokenService from "./shared/TokenService";
import { REACT_API_URL } from "../../urlConfig";


class AuthService{
    baseUrl:String;

    constructor(){
        this.baseUrl=REACT_API_URL;
    }


    async login(email:string,password:string){
        const payload={email,password}

        try{
            const resp:any=await axios.post(`${this.baseUrl}/login`,payload);
            const newToken=resp.data.access_token;
            TokenService.setToken(newToken)
            return newToken
        }catch(error){
            console.error("Something went wrong while login",error)
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


export default AuthService