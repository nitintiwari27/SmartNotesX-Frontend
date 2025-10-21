import { useEffect, useState } from "react";
import {
  Download,
  Eye,
  Bookmark,
  BookmarkCheck,
  User,
  Calendar,
  Edit,
  Trash2,
} from "lucide-react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const NoteCard = ({
  note,
  isInitiallyBookmarked = false,
  onBookmarkToggle,
  onNoteUpdated,
}) => {
  const [isBookmarked, setIsBookmarked] = useState(isInitiallyBookmarked);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [viewCount, setViewCount] = useState(note.views || 0);
  const [downloadCount, setDownloadCount] = useState(note.downloads || 0);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // ✅ Sync prop change with local state (important when switching pages)
  useEffect(() => {
    setIsBookmarked(isInitiallyBookmarked);
  }, [isInitiallyBookmarked]);

  // ✅ View note with tracking
  const handleView = async () => {
    if (!note.fileUrl) {
      toast.error("File URL not available");
      return;
    }

    try {
      // Increment view count on backend
      const response = await api.post(`/notes/${note._id}/view`);

      // Update local state
      if (response.data.success) {
        setViewCount(response.data.data.views);
      }

      // Open the file in new tab
      window.open(note.fileUrl, "_blank");
    } catch (error) {
      console.error("Error tracking view:", error);
      // Still open the file even if tracking fails
      window.open(note.fileUrl, "_blank");
    }
  };

  // ✅ Download note with tracking
  const handleDownload = async () => {
    if (!note.fileUrl) {
      toast.error("File URL not available");
      return;
    }

    try {
      // Increment download count on backend
      const response = await api.post(`/notes/${note._id}/download`);

      // Update local state
      if (response.data.success) {
        setDownloadCount(note.downloads + 1);
      }

      // Download the file
      const fileResponse = await fetch(note.fileUrl);
      const blob = await fileResponse.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = note.originalName || `${note.title}.pdf`;
      link.click();

      toast.success("Download started");
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Download failed");
    }
  };

  // ✅ Handle bookmark toggle with backend sync
  const handleBookmark = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to bookmark notes");
      return;
    }

    setBookmarkLoading(true);
    try {
      if (isBookmarked) {
        await api.delete(`/bookmarks/${note._id}`);
        setIsBookmarked(false);
        toast.success("Bookmark removed");
      } else {
        await api.post(`/bookmarks/${note._id}`);
        setIsBookmarked(true);
        toast.success("Bookmark added");
      }
      if (onBookmarkToggle) onBookmarkToggle();
    } catch (error) {
      toast.error(error.response?.data?.message || "Bookmark action failed");
    } finally {
      setBookmarkLoading(false);
    }
  };

  // ✅ Edit & Delete (only for uploader)
  const handleEdit = () => {
    navigate(`/edit-note/${note._id}`);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await api.delete(`/notes/${note._id}`);
        toast.success("Note deleted successfully");
        if (onNoteUpdated) onNoteUpdated();
      } catch {
        toast.error("Failed to delete note");
      }
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const isUploader = user?._id === note.uploadedBy?._id;

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold  text-gray-900 mb-2 line-clamp-2">
            {note.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3"></p>
        </div>

        {isAuthenticated && (
          <button
            onClick={handleBookmark}
            disabled={bookmarkLoading}
            className="ml-2 text-gray-400 hover:text-primary-600 transition-colors cursor-pointer"
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-5 h-5 fill-yellow-400 stroke-yellow-400" />
            ) : (
              <Bookmark className="w-5 h-5 fill-none stroke-gray-500" />
            )}
          </button>
        )}
      </div>

      {/* Views & Downloads - Using local state */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>{viewCount}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Download className="w-4 h-4" />
            <span>{downloadCount}</span>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(note.createdAt)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        {!isUploader && note.uploadedBy?.name && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span>{note.uploadedBy.name}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={handleView}
            className="btn-secondary py-2 px-4 text-sm flex items-center space-x-2 cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>View</span>
          </button>

          <button
            onClick={handleDownload}
            className="btn-primary py-2 px-4 text-sm flex items-center space-x-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>

          {isUploader && (
            <>
              <button
                onClick={handleEdit}
                className="p-2 rounded-md text-blue-600 hover:bg-blue-50"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 rounded-md text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
