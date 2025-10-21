import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import Loader from '../components/common/Loader';
import { 
  MapPin, Briefcase, Calendar, ExternalLink, DollarSign, 
  Clock, Users, Award, ArrowLeft, CheckCircle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
console.log(job)
  const fetchJob = useCallback(async () => {
    try {
      const { data } = await api.get(`/jobs/${id}`);
      setJob(data.data);
    } catch (error) {
      console.error('Error fetching job:', error);
      toast.error('Failed to load job details');
    } finally {
      setLoading(false);
    }
  }, [id]);

    const checkApplicationStatus = useCallback(async () => {
    try {
      const { data } = await api.get('/jobs/user/my-applications');
      const applied = data.data.some(app => app.job._id === id);
      setHasApplied(applied);
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchJob();
    if (isAuthenticated) {
      checkApplicationStatus();
    }
  }, [id, fetchJob, checkApplicationStatus, isAuthenticated]);

  



  const handleApply = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to apply');
      navigate('/login');
      return;
    }

    setApplying(true);
    try {
      //  i wamt to redirect on a new page after on application link job.applyLink
      window.open(job.applyLink, '_blank');


      await api.post(`/jobs/${id}/apply`, { coverLetter });
      toast.success('Application submitted successfully!');
      setHasApplied(true);
      setShowApplyModal(false);
      setCoverLetter('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Application failed');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Job not found</h2>
        <button onClick={() => navigate('/jobs')} className="btn-primary">
          Back to Jobs
        </button>
      </div>
    );
  }

  const formatSalary = () => {
    if (job.type === 'Job' && job.salary?.min && job.salary?.max) {
      return `₹${job.salary.min / 1000}k - ₹${job.salary.max / 1000}k per year`;
    }
    if (job.type === 'Internship' && job.stipend?.amount) {
      return `₹${job.stipend.amount}/${job.stipend.duration || 'month'}`;
    }
    return 'Not disclosed';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/jobs')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Jobs</span>
      </button>

      <div className="bg-white rounded-lg shadow-md p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start space-x-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <p className="text-xl text-gray-700 font-medium mb-2">{job.company}</p>
              <div className="flex flex-wrap gap-2">
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${
                    job.type === 'Job'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {job.type}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
                  {job.locationType}
                </span>
                {job.isVerified && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>Verified</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {hasApplied ? (
            <button disabled className="btn-secondary opacity-50 cursor-not-allowed">
              Already Applied
            </button>
          ) : (
            <button
              onClick={() => setShowApplyModal(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <ExternalLink className="w-5 h-5" />
              <span>Apply Now</span>
            </button>
          )}
        </div>

        {/* Key Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm text-gray-600">Location</p>
              <p className="font-medium text-gray-900">{job.location}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <DollarSign className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm text-gray-600">
                {job.type === 'Job' ? 'Salary' : 'Stipend'}
              </p>
              <p className="font-medium text-gray-900">{formatSalary()}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm text-gray-600">Apply By</p>
              <p className="font-medium text-gray-900">
                {new Date(job.applicationDeadline).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
          <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
        </div>

        {/* Skills Required */}
        {job.skills && job.skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Skills Required</h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Eligibility */}
        {job.eligibility && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Eligibility</h2>
            <div className="space-y-3">
              {job.eligibility.branches && job.eligibility.branches.length > 0 && (
                <div className="flex items-start space-x-3">
                  <Award className="w-5 h-5 text-gray-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Branches</p>
                    <p className="text-gray-700">{job.eligibility.branches.join(', ')}</p>
                  </div>
                </div>
              )}
              {job.eligibility.minCGPA && (
                <div className="flex items-start space-x-3">
                  <Award className="w-5 h-5 text-gray-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Minimum CGPA</p>
                    <p className="text-gray-700">{job.eligibility.minCGPA}</p>
                  </div>
                </div>
              )}
              {job.eligibility.graduationYear && job.eligibility.graduationYear.length > 0 && (
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-gray-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Graduation Year</p>
                    <p className="text-gray-700">
                      {job.eligibility.graduationYear.join(', ')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Duration */}
        {job.duration && (
          <div className="mb-8">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Duration</p>
                <p className="text-gray-700">{job.duration}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center space-x-6 pt-6 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-gray-600">
            <Users className="w-5 h-5" />
            <span>{job.applicants?.length || 0} applicants</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar className="w-5 h-5" />
            <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Apply for {job.title}</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Letter (Optional)
              </label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="input-field"
                rows="6"
                placeholder="Tell us why you're a great fit for this role..."
                maxLength={1000}
              />
              <p className="text-sm text-gray-500 mt-1">
                {coverLetter.length}/1000 characters
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                🔗 You'll be redirected to the company's application page after submitting.
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleApply}
                disabled={applying}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {applying ? 'Submitting...' : 'Submit Application'}
              </button>
              <button
                onClick={() => setShowApplyModal(false)}
                className="flex-1 btn-secondary"
                disabled={applying}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;