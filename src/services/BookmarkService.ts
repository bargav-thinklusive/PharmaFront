import { REACT_API_URL } from "../urlConfig";


class BookMarkService {
  baseUrl = REACT_API_URL;
  

  constructor() {
    this.baseUrl = REACT_API_URL;
  }


    createBookmark = () => `${this.baseUrl}/bookmarks`;
    getBookmarks = () => `${this.baseUrl}/bookmarks`;
  deleteBookmark = (id: string) => `${this.baseUrl}/bookmarks/${id}`;

}
export default BookMarkService;