import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Briefcase, ArrowLeft } from 'lucide-react';
import { BRANCHES } from '../utils/constants';

const CreateJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    type: 'Job',
    location: '',
    locationType: 'On-site',
    salary: { min: '', max: '', currency: 'INR' },
    stipend: { amount: '', currency: 'INR', duration: 'per month' },
    duration: '',
    skills: '',
    eligibility: {
      branches: [],
      minCGPA: '',
      graduationYear: [],
    },
    applicationDeadline: '',
    applyLink: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: { ...formData[parent], [child]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleBranchChange = (branch) => {
    const branches = formData.eligibility.branches.includes(branch)
      ? formData.eligibility.branches.filter((b) => b !== branch)
      : [...formData.eligibility.branches, branch];
    
    setFormData({
      ...formData,
      eligibility: { ...formData.eligibility, branches },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const jobData = {
        ...formData,
        skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
        eligibility: {
          ...formData.eligibility,
          minCGPA: formData.eligibility.minCGPA ? parseFloat(formData.eligibility.minCGPA) : undefined,
        },
      };

      // Clean up salary/stipend based on type
      if (formData.type === 'Job') {
        jobData.salary.min = parseFloat(formData.salary.min) || undefined;
        jobData.salary.max = parseFloat(formData.salary.max) || undefined;
        delete jobData.stipend;
      } else {
        jobData.stipend.amount = parseFloat(formData.stipend.amount) || undefined;
        delete jobData.salary;
      }

      await api.post('/jobs', jobData);
      toast.success('Job posted successfully!');
      navigate('/jobs');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/jobs')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Jobs</span>
      </button>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Post Job/Internship</h2>
            <p className="text-gray-600">Fill in the details below</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Software Developer"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Tech Corp"
                required
              />
            </div>
          </div>

        

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input-field"
              rows="6"
              placeholder="Detailed job description..."
              required
            />
          </div>

          {/* Type & Location */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="Job">Job</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Mumbai, India"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location Type *
              </label>
              <select
                name="locationType"
                value={formData.locationType}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          {/* Salary/Stipend */}
          {formData.type === 'Job' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Salary (₹)
                </label>
                <input
                  type="number"
                  name="salary.min"
                  value={formData.salary.min}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="300000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Salary (₹)
                </label>
                <input
                  type="number"
                  name="salary.max"
                  value={formData.salary.max}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="500000"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stipend Amount (₹)
                </label>
                <input
                  type="number"
                  name="stipend.amount"
                  value={formData.stipend.amount}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="15000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., 3 months"
                />
              </div>
            </div>
          )}

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills Required (comma separated)
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="input-field"
              placeholder="React, Node.js, MongoDB"
            />
          </div>

          {/* Eligibility */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Eligible Branches
            </label>
            <div className="flex flex-wrap gap-2">
              {BRANCHES.map((branch) => (
                <label key={branch} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.eligibility.branches.includes(branch)}
                    onChange={() => handleBranchChange(branch)}
                    className="rounded text-primary-600"
                  />
                  <span className="text-sm text-gray-700">{branch}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum CGPA
            </label>
            <input
              type="number"
              step="0.01"
              name="eligibility.minCGPA"
              value={formData.eligibility.minCGPA}
              onChange={handleChange}
              className="input-field"
              placeholder="7.0"
              min="0"
              max="10"
            />
          </div>

          {/* Application Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Deadline *
              </label>
              <input
                type="date"
                name="applicationDeadline"
                value={formData.applicationDeadline}
                onChange={handleChange}
                className="input-field"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Link *
              </label>
              <input
                type="url"
                name="applyLink"
                value={formData.applyLink}
                onChange={handleChange}
                className="input-field"
                placeholder="https://company.com/apply"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary py-3 disabled:opacity-50"
            >
              {loading ? 'Posting...' : 'Post Job'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/jobs')}
              className="flex-1 btn-secondary py-3"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJob;