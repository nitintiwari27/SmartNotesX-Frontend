import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Loader from '../common/Loader';
import { Users, FileText, Download, Eye, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/admin/stats');
      setStats(data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.overview?.totalUsers || 0,
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Total Notes',
      value: stats?.overview?.totalNotes || 0,
      icon: FileText,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Total Downloads',
      value: stats?.overview?.totalDownloads || 0,
      icon: Download,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Total Views',
      value: stats?.overview?.totalViews || 0,
      icon: Eye,
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Notes by Branch */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes by Branch</h3>
        <div className="space-y-3">
          {stats?.notesByBranch?.map((item) => (
            <div key={item._id} className="flex items-center justify-between">
              <span className="text-gray-700">{item._id}</span>
              <span className="font-semibold text-primary-600">{item.count} notes</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Contributors */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <TrendingUp className="w-5 h-5" />
          <span>Top Contributors</span>
        </h3>
        <div className="space-y-4">
          {stats?.topContributors?.map((user, index) => (
            <div key={user._id} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.branch}</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-700">
                {user.notesCount} notes
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Notes */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Uploads</h3>
        <div className="space-y-4">
          {stats?.recentNotes?.map((note) => (
            <div key={note._id} className="flex items-start justify-between py-3 border-b border-gray-200 last:border-0">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{note.title}</p>
                <p className="text-sm text-gray-600">
                  {note.subject} • Sem {note.semester} • {note.branch}
                </p>
                <p className="text-sm text-gray-500">
                  By {note.uploadedBy?.name}
                </p>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(note.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;