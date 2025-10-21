import { useState, useEffect } from 'react';
import api from '../../api/axios';
import NoteCard from './NoteCard';
import NoteFilters from './NoteFilters';
import Loader from '../common/Loader';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; // Import auth context

const NotesList = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkedNoteIds, setBookmarkedNoteIds] = useState([]); // ✅ Add this
  const { isAuthenticated } = useAuth(); // ✅ Add this
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchNotes();
    if (isAuthenticated) {
      fetchBookmarkedNotes(); // ✅ Fetch bookmarks on mount
    }
  }, [pagination.page, filters, searchQuery, isAuthenticated]);

  // ✅ New function to fetch bookmarked notes
  const fetchBookmarkedNotes = async () => {
    try {
      const { data } = await api.get('/bookmarks');
      const bookmarkedIds = data.data.map((note) => note._id);
      setBookmarkedNoteIds(bookmarkedIds);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    }
  };

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: 12,
        ...filters,
        search: searchQuery,
      };

      const { data } = await api.get('/notes', { params });
      setNotes(data.data.notes);
      setPagination(data.data.pagination);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination({ ...pagination, page: 1 });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPagination({ ...pagination, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ✅ Update bookmark toggle handler
  const handleBookmarkToggle = () => {
    fetchBookmarkedNotes(); // Re-fetch bookmarks after toggle
  };

  if (loading && notes.length === 0) {
    return <Loader fullScreen />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <NoteFilters onFilterChange={handleFilterChange} onSearch={handleSearch} />

      {notes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No notes found. Try adjusting your filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {notes.map((note) => (
              <NoteCard 
                key={note._id} 
                note={note} 
                isInitiallyBookmarked={bookmarkedNoteIds.includes(note._id)} // ✅ Pass bookmark status
                onBookmarkToggle={handleBookmarkToggle} // ✅ Pass callback
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="btn-secondary py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-2">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === pagination.pages ||
                      Math.abs(page - pagination.page) <= 2
                  )
                  .map((page, index, array) => (
                    <div key={page}>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="text-gray-500">...</span>
                      )}
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          page === pagination.page
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {page}
                      </button>
                    </div>
                  ))}
              </div>

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="btn-secondary py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NotesList;