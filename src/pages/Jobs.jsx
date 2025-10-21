import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import JobCard from '../components/jobs/jobcard';
import Loader from '../components/common/Loader';
import { Briefcase, Search, Filter, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    locationType: '',
    search: '',
  });
  const { isAdmin } = useAuth();

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/jobs', { params: filters });
      setJobs(data.data.jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleFilterChange = (name, value) => {
    setFilters({ ...filters, [name]: value });
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Jobs & Internships</h1>
            <p className="text-gray-600">Find your next opportunity</p>
          </div>
        </div>

        {isAdmin && (
          <Link to="/jobs/create" className="btn-primary flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Post Job</span>
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input-field pl-10"
                placeholder="Search jobs, companies..."
              />
            </div>
          </div>

          {/* Type Filter */}
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="input-field"
          >
            <option value="">All Types</option>
            <option value="Job">Jobs</option>
            <option value="Internship">Internships</option>
          </select>

          {/* Location Type Filter */}
          <select
            value={filters.locationType}
            onChange={(e) => handleFilterChange('locationType', e.target.value)}
            className="input-field"
          >
            <option value="">All Locations</option>
            <option value="Remote">Remote</option>
            <option value="On-site">On-site</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>
      </div>

      {/* Jobs Grid */}
      {jobs.length === 0 ? (
        <div className="text-center py-12">
          <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No opportunities found
          </h3>
          <p className="text-gray-600">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;