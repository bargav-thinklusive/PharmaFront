import { useState, useEffect } from "react";
import usePost from "../../hooks/usePost";
import useDelete from "../../hooks/useDelete";
import { toast } from "react-toastify";
import BookMarkService from "../../services/BookmarkService";
import { FiBookmark } from "react-icons/fi";

const BookmarkCellRenderer = (params: any) => {
  const [isBookmarked, setIsBookmarked] = useState(params.data?.isBookmarked || false);
  const { postData } = usePost();
  const { deleteData } = useDelete();
  const bookMark = new BookMarkService();

  useEffect(() => {
    setIsBookmarked(params.data?.isBookmarked || false);
  }, [params.data?.isBookmarked]);

  const handleBookmarkToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !isBookmarked;
    try {
      if (nextState) {
        const { _id } = params.data;
        const payload = { drugId: _id };

        await postData(bookMark.createBookmark(), payload);
        toast.success("Added to BookMark");
      } else {
        await deleteData(bookMark.deleteBookmark(params.data._id));
        toast.success("Removed from BookMark");
      }
      setIsBookmarked(nextState);

      // Update the row data directly in the grid if params.node exists
      if (params.node && params.node.setDataValue) {
        params.node.setDataValue('isBookmarked', nextState);
      }
    } catch (error) {
      console.error("Error updating bookmark:", error);
      toast.error("Failed to update bookmark");
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-full">
      <button
        onClick={handleBookmarkToggle}
        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center cursor-pointer"
        title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
      >
        <FiBookmark
          className={`w-5 h-5 transition-all ${
            isBookmarked ? "text-[#0E8A67]" : "text-gray-400 hover:text-[#0E8A67]"
          }`}
          fill={isBookmarked ? "#0E8A67" : "none"}
        />
      </button>
    </div>
  );
};

export default BookmarkCellRenderer;