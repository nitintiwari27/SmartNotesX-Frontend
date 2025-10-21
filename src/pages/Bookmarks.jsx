import { useState, useEffect } from "react";
import api from "../api/axios";
import NoteCard from "../components/notes/NoteCard";
import Loader from "../components/common/Loader";
import { Bookmark } from "lucide-react";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkedNoteIds, setBookmarkedNoteIds] = useState([]);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/bookmarks");
      const notes = data.data; // assuming API returns an array of bookmarked notes
      setBookmarks(notes);
      setBookmarkedNoteIds(notes.map((note) => note._id)); // save IDs for NoteCard
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
          <Bookmark className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Bookmarks</h1>
          <p className="text-gray-600">Notes you've saved for later</p>
        </div>
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-16">
          <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No bookmarks yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start bookmarking notes to access them quickly later
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              isInitiallyBookmarked={bookmarkedNoteIds.includes(note._id)}
              onBookmarkToggle={fetchBookmarks} // re-fetch bookmarks after toggle
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
