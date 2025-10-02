import { REACT_API_URL } from "../urlConfig";

class LoginService {
  baseUrl = REACT_API_URL;

  constructor() {
    this.baseUrl = REACT_API_URL;
  }

  //createRegister
  createRegister = () => `${this.baseUrl}/register`;
  // Create operation
  createLogin = () => `${this.baseUrl}/login`;

  

  // Delete operation
  async deleteLogin() {
    throw "Not implemented";
  }
}

export default LoginService;
