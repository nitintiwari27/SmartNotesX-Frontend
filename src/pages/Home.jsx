import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Upload,
  Search,
  Users,
  TrendingUp,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import NoteCard from "../components/notes/NoteCard";
import JobCard from "../components/jobs/JobCard";
import Loader from "../components/common/Loader";

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [popularNotes, setPopularNotes] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch top notes
      const notesResponse = await api.get("/notes", {
        params: { sortBy: "downloads", order: "desc", limit: 6 },
      });
      setPopularNotes(notesResponse.data.data.notes || []);

      // Fetch recent jobs
      const jobsResponse = await api.get("/jobs", {
        params: { sortBy: "createdAt", order: "desc", limit: 3 },
      });
      setRecentJobs(jobsResponse.data.data.jobs || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Search,
      title: "Easy Search",
      description: "Find notes by semester, branch, and subject instantly",
      color: "text-blue-600 bg-blue-100",
    },
    {
      icon: Upload,
      title: "Upload & Share",
      description: "Contribute your notes and help fellow students",
      color: "text-green-600 bg-green-100",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Built by students, for students",
      color: "text-purple-600 bg-purple-100",
    },
    {
      icon: TrendingUp,
      title: "Quality Content",
      description: "Access high-quality study materials",
      color: "text-orange-600 bg-orange-100",
    },
    {
      icon: Briefcase,
      title: "Job Opportunities",
      description: "Apply for internships and part-time jobs",
      color: "text-teal-600 bg-teal-100",
    },
  ];

  // ✅ Logged-in User Dashboard
  if (isAuthenticated) {
    if (loading) return <Loader fullScreen />;

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-primary-600 to-blue-700 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-24 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Welcome Back 👋
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 mb-6">
              Continue learning, explore top notes, and discover new jobs
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/notes"
                className="bg-white text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 shadow-md transition-all"
              >
                Browse Notes
              </Link>
              <Link
                to="/upload"
                className="bg-primary-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-800 transition-all shadow-md border-2 border-white"
              >
                Upload Note
              </Link>
              <Link
                to="/jobs"
                className="bg-primary-900 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-md border-2 border-white"
              >
                Jobs
              </Link>
            </div>
          </div>
        </div>

        {/* Popular Notes */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Popular Notes</h2>
              <p className="text-gray-600">
                Most downloaded and recommended by students
              </p>
            </div>
            <Link
              to="/notes"
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {popularNotes.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No notes available yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularNotes.map((note) => (
                <NoteCard key={note._id} note={note} />
              ))}
            </div>
          )}
        </div>

        {/* Latest Jobs */}
        <div className="bg-blue-50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Latest Opportunities
                </h2>
                <p className="text-gray-600">
                  Discover new internships and part-time jobs
                </p>
              </div>
              <Link
                to="/jobs"
                className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {recentJobs.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No jobs available yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recentJobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ✅ Public Landing Page (when user NOT logged in)
  return (
    <div className="min-h-screen">
      <div className="relative bg-gradient-to-br from-primary-600 to-blue-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-24 text-center">
          <div className="flex items-center justify-center mb-6">
            <BookOpen className="w-16 h-16" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            Smart Study Material Hub
          </h1>
          <p className="text-xl sm:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Your one-stop destination for college notes, study materials, and
            job opportunities. Find, share, and excel in your studies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-black text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all shadow-md"
            >
              Get Started
            </Link>
            <Link
              to="/notes"
              className="bg-primary-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-800 transition-all shadow-md border-2 border-white"
            >
              Browse Notes
            </Link>
            <Link
              to="/jobs"
              className="text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-md border-2 border-white"
            >
              Jobs
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose SmartNotesX?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <div
                  className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-primary-600 mb-2">1000+</div>
            <div className="text-gray-600 text-lg">Study Notes</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-600 mb-2">500+</div>
            <div className="text-gray-600 text-lg">Active Students</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-600 mb-2">50+</div>
            <div className="text-gray-600 text-lg">Subjects Covered</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-600 mb-2">100+</div>
            <div className="text-gray-600 text-lg">Jobs & Internships</div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-br from-primary-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Boost Your Studies?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of students sharing and accessing quality study
            materials and job opportunities.
          </p>
          <Link
            to="/register"
            className="bg-blue-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-600 transition-all shadow-md inline-block"
          >
            Sign Up Now - It's Free!
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
