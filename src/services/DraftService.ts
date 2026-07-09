import { REACT_API_URL } from "../urlConfig";

class DraftService {
  baseUrl = REACT_API_URL;

  constructor() {
    this.baseUrl = REACT_API_URL;
  }

  saveDraft = () => `${this.baseUrl}/drafts/`;

  getDrafts = () => `${this.baseUrl}/drafts/`;

  getDraftById = (id: string) => `${this.baseUrl}/drafts/${id}`;

  deleteDraft = (id: string) => `${this.baseUrl}/drafts/${id}`;
}

export default DraftService;
