import { REACT_API_URL } from "../urlConfig";


class UserService {
  baseUrl = REACT_API_URL;

  constructor() {
    this.baseUrl = REACT_API_URL;
  }

  getUserById = (user_id: string) => `${this.baseUrl}/user/${user_id}`;
  // Create operation
  createUser = () => `${this.baseUrl}/user`;

  // Read operation
  getUsers = () => `${this.baseUrl}/user`;

  getUsersByProject = (project = "profile.firstName,profile._id") =>
    `${this.baseUrl}/user?project=${project}`;

  getUsersOnlyByProject = (
    project = "profile._id,profile.firstName,profile.lastName,profile.authRole"
  ) => `${this.baseUrl}/user?project=${project}&onlyUsers=true`;

  getAdminsOnlyByProject = (
    project = "profile._id,profile.firstName,profile.lastName,profile.authRole"
  ) => `${this.baseUrl}/user?project=${project}&onlyAdmins=true`;

  getAdminsSourcingMangagerOnlyByProject = (
    project = "profile._id,profile.firstName,profile.lastName,profile.authRole"
  ) =>
    `${this.baseUrl}/user?project=${project}&onlyAdmins=true&sourceManagers=true`;

  getUser = (id: string) => `${this.baseUrl}/user/${id}`;
  
  getUserByRole=()=>`${this.baseUrl}/users?role=recruiter`;


  // // Update operation
  updateUser = (id: string) => `${this.baseUrl}/user/${id}`;

  // // Delete operation
  // deleteUser = () => `${this.baseUrl}/user`;
}

export default UserService;
