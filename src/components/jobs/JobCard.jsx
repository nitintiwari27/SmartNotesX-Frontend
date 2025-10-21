import {
  MapPin,
  Briefcase,
  Calendar,
  ExternalLink,
  Eye,
  DollarSign,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  const formatDeadline = (date) => {
    const deadline = new Date(date);
    const today = new Date();
    const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) return "Expired";
    if (daysLeft === 0) return "Today";
    if (daysLeft === 1) return "Tomorrow";
    return `${daysLeft} days left`;
  };

  const getTypeColor = (type) => {
    return type === "Job"
      ? "bg-green-100 text-green-700"
      : "bg-blue-100 text-blue-700";
  };

  const getLocationTypeColor = (locationType) => {
    const colors = {
      Remote: "bg-purple-100 text-purple-700",
      "On-site": "bg-orange-100 text-orange-700",
      Hybrid: "bg-teal-100 text-teal-700",
    };
    return colors[locationType] || "bg-gray-100 text-gray-700";
  };

  const formatSalary = () => {
    if (job.type === "Job" && job.salary) {
      if (job.salary.min && job.salary.max) {
        return `₹${job.salary.min / 1000}k - ₹${job.salary.max / 1000}k`;
      }
    }
    if (job.type === "Internship" && job.stipend) {
      return `₹${job.stipend.amount}/${job.stipend.duration || "month"}`;
    }
    return null;
  };

  return (
    <div
      className="card hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => navigate(`/jobs/${job._id}`)}
    >
      <div className="flex items-start space-x-4 mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
            {job.title}
          </h3>
          <p className="text-gray-600 font-medium">{job.company}</p>
        </div>
      </div>

      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
        {job.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        <span
          className={`px-3 py-1 ${getTypeColor(
            job.type
          )} text-xs font-medium rounded-full`}
        >
          {job.type}
        </span>
        <span
          className={`px-3 py-1 ${getLocationTypeColor(
            job.locationType
          )} text-xs font-medium rounded-full`}
        >
          {job.locationType}
        </span>
        {job.duration && (
          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
            {job.duration}
          </span>
        )}
      </div>

      <div className="space-y-2 mb-4 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4" />
          <span>{job.location}</span>
        </div>

        {formatSalary() && (
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4" />
            <span>{formatSalary()}</span>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4" />
          <span
            className={`${
              formatDeadline(job.applicationDeadline).includes("day")
                ? "text-orange-600"
                : ""
            }`}
          >
            Apply by: {new Date(job.applicationDeadline).toLocaleDateString()}
            <span className="ml-1 font-medium">
              ({formatDeadline(job.applicationDeadline)})
            </span>
          </span>
        </div>
      </div>

      {job.skills && job.skills.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {job.skills.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
              +{job.skills.length - 3} more
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-1 text-sm text-gray-500">
          <Eye className="w-4 h-4" />
          <span>{job.views || 0} Applicants Applied</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/jobs/${job._id}`);
          }}
          className="btn-primary py-2 px-4 text-sm flex items-center space-x-2 cursor-pointer"
        >
          <span>View Details</span>
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default JobCard;
