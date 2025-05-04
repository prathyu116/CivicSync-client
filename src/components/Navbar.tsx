import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, AlertTriangle, Map, Home, PlusCircle, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { auth, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { to: '/map', label: 'Map View', icon: <Map className="w-5 h-5" /> },
    { to: '/report', label: 'Report Issue', icon: <PlusCircle className="w-5 h-5" /> },
    { to: '/my-issues', label: 'My Issues', icon: <AlertTriangle className="w-5 h-5" /> },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-teal-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-amber-300" />
              <span className="font-bold text-xl">CivicSync</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {auth.user ? (
              <>
                <div className="flex space-x-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors
                        ${isActive(link.to) 
                          ? 'bg-teal-800 text-white' 
                          : 'text-teal-100 hover:bg-teal-600 hover:text-white'
                        }`}
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </div>
                <div className="ml-4 flex items-center">
                  <div className="flex items-center space-x-2 px-3 py-2">
                    <User className="w-5 h-5" />
                    <span className="text-sm font-medium">{auth.user.name}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="ml-4 px-4 py-2 rounded-md text-sm font-medium bg-teal-800 hover:bg-teal-900 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md text-sm font-medium bg-teal-600 hover:bg-teal-500 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-md text-sm font-medium bg-amber-500 hover:bg-amber-400 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-teal-600 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-teal-800 pb-3 pt-2">
          {auth.user ? (
            <div className="px-2 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-3
                    ${isActive(link.to) 
                      ? 'bg-teal-900 text-white' 
                      : 'text-teal-100 hover:bg-teal-700 hover:text-white'
                    }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
              <div className="mt-4 pt-4 border-t border-teal-700">
                <div className="px-3 py-2 text-teal-100 font-medium flex items-center space-x-3">
                  <User className="w-5 h-5" />
                  <span>{auth.user.name}</span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="mt-2 block w-full px-3 py-2 rounded-md text-base font-medium bg-teal-900 text-white hover:bg-teal-700"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium bg-teal-700 hover:bg-teal-600 text-white"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block px-3 py-2 rounded-md text-base font-medium bg-amber-500 hover:bg-amber-400 text-white"
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;