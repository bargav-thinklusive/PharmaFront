import { useState } from "react";
import usePost from "../../hooks/usePost";
import useDelete from "../../hooks/useDelete";
import { toast } from "react-toastify";
import BookMarkService from "../../services/BookmarkService";

const BookmarkCellRenderer = (params: any) => {
  const [isBookmarked, setIsBookmarked] = useState(false); // Assuming initial state, you might need to fetch from API
  const { postData } = usePost();
  const { deleteData } = useDelete();
  const bookMark = new BookMarkService();

  const handleBookmarkChange = async (checked: boolean) => {
    try {
      if (checked) {
        const {_id}=params.data; 
        const payload={drugId:_id,};

        await postData(bookMark.createBookmark(),payload);
        toast.success("Added to search history");
      } else {
        await deleteData(bookMark.deleteBookmark(params.data.cid));
        toast.success("Removed from search history");
      }
      setIsBookmarked(checked);
    } catch (error) {
      console.error("Error updating bookmark:", error);
      toast.error("Failed to update bookmark");
    }
  };

  return (
    <input
      type="checkbox"
      checked={isBookmarked}
      onChange={(e) => handleBookmarkChange(e.target.checked)}
    />
  );
};

export default BookmarkCellRenderer;