import { REACT_API_URL } from "../urlConfig";


class DrugService {
  baseUrl = REACT_API_URL;
  

  constructor() {
    this.baseUrl = REACT_API_URL;
    console.log("DrugService Base URL:", this.baseUrl);
  }

  getDrugById = (drug_id: string) => {
    console.log("DrugService Base URL:", this.baseUrl);
    return `${this.baseUrl}/drug/${drug_id}`;
  };
  // Create operation
  createDrug = () => `${this.baseUrl}/drugs`;

  // Read operation
  getDrugs = () => {
    return `${this.baseUrl}/drugs/`;
  };

  getDrugsByProject = (project = "profile.firstName,profile._id") =>
    `${this.baseUrl}/drug?project=${project}`;

  getDrugsOnlyByProject = (
    project = "profile._id,profile.firstName,profile.lastName,profile.authRole"
  ) => `${this.baseUrl}/drug?project=${project}&onlydrugs=true`;

  getAdminsOnlyByProject = (
    project = "profile._id,profile.firstName,profile.lastName,profile.authRole"
  ) => `${this.baseUrl}/drug?project=${project}&onlyAdmins=true`;

  getAdminsSourcingMangagerOnlyByProject = (
    project = "profile._id,profile.firstName,profile.lastName,profile.authRole"
  ) =>
    `${this.baseUrl}/drug?project=${project}&onlyAdmins=true&sourceManagers=true`;

  getDrug = (id: string) => `${this.baseUrl}/drug/${id}`;
  
  getDrugByRole=()=>`${this.baseUrl}/drugs?role=recruiter`;


  // // Update operation
  updateDrug = (id: string) => `${this.baseUrl}/drug/${id}`;

  // // Delete operation
  deleteDrug = (id:string) => `${this.baseUrl}/drug/${id}`;
}

export default DrugService;
