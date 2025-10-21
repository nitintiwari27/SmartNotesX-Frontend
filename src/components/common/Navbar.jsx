import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  BookOpen,
  Upload,
  Bookmark,
  LogOut,
  LayoutDashboard,
  User,
  Menu,
  X,
  Briefcase,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 840) setIsOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showHamburger = windowWidth < 840;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">SmartNotesX</span>
          </Link>

          {/* Desktop Links */}
          {windowWidth >= 840 && (
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/notes"
                    className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                  >
                    Browse Notes
                  </Link>

                  <Link
                    to="/jobs"
                    className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors font-medium"
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>Jobs & Internships</span>
                  </Link>

                  <Link
                    to="/upload"
                    className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors font-medium"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload</span>
                  </Link>

                  <Link
                    to="/bookmarks"
                    className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors font-medium"
                  >
                    <Bookmark className="w-4 h-4" />
                    <span>Bookmarks</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors font-medium"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Admin</span>
                    </Link>
                  )}

                  <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-300">
                    <div className="flex items-center space-x-2">
                      <User className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        {user?.name || 'User'}
                      </span>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/notes"
                    className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                  >
                    Browse Notes
                  </Link>

                  <Link
                    to="/jobs"
                    className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors font-medium"
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>Jobs & Internships</span>
                  </Link>

                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors font-medium"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Hamburger Menu Button */}
          {showHamburger && (
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {showHamburger && isOpen && (
        <div className="bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/notes"
                  onClick={toggleMenu}
                  className="block text-gray-700 hover:text-blue-600 font-medium"
                >
                  Browse Notes
                </Link>

                <Link
                  to="/jobs"
                  onClick={toggleMenu}
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Jobs & Internships</span>
                </Link>

                <Link
                  to="/upload"
                  onClick={toggleMenu}
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload</span>
                </Link>

                <Link
                  to="/bookmarks"
                  onClick={toggleMenu}
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium"
                >
                  <Bookmark className="w-4 h-4" />
                  <span>Bookmarks</span>
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={toggleMenu}
                    className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Admin</span>
                  </Link>
                )}

                <div className="flex items-center space-x-3 mt-3 border-t border-gray-200 pt-2">
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {user?.name || 'User'}
                  </span>
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/notes"
                  onClick={toggleMenu}
                  className="block text-gray-700 hover:text-blue-600 font-medium"
                >
                  Browse Notes
                </Link>

                <Link
                  to="/jobs"
                  onClick={toggleMenu}
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Jobs & Internships</span>
                </Link>

                <Link
                  to="/login"
                  onClick={toggleMenu}
                  className="block text-gray-700 hover:text-blue-600 font-medium"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={toggleMenu}
                  className="block bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
