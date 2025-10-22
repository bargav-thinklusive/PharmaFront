import { useState } from "react";
import usePost from "../../hooks/usePost";
import useDelete from "../../hooks/useDelete";
import DrugService from "../../services/DrugService";
import { toast } from "react-toastify";

const BookmarkCellRenderer = (params: any) => {
  const [isBookmarked, setIsBookmarked] = useState(false); // Assuming initial state, you might need to fetch from API
  const { postData } = usePost();
  const { deleteData } = useDelete();
  const drugService = new DrugService();

  const handleBookmarkChange = async (checked: boolean) => {
    try {
      if (checked) {
        await postData(drugService.createSearchHistory(), { cid: params.data.cid });
        toast.success("Added to search history");
      } else {
        await deleteData(drugService.deleteSearchHistory(params.data.cid));
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