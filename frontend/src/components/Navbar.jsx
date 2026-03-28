import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { merchantAPI } from '../services/api';
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard, ShoppingBag, Bell, Moon, Sun } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout, isCustomer, isMerchant } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;

    const savedTheme = window.localStorage.getItem('theme');
    if (savedTheme) return savedTheme === 'dark';

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const merchantLoggedIn = isAuthenticated && isMerchant();

  useEffect(() => {
    const fetchPendingOrders = async () => {
      if (!merchantLoggedIn) {
        setPendingOrdersCount(0);
        return;
      }

      try {
        const res = await merchantAPI.getOrders('pending');
        setPendingOrdersCount((res.data?.orders || []).length);
      } catch (err) {
        setPendingOrdersCount(0);
      }
    };

    // Fetch immediately, then refresh periodically for new pending orders.
    fetchPendingOrders();

    const intervalId = setInterval(fetchPendingOrders, 45000);
    return () => clearInterval(intervalId);
  }, [merchantLoggedIn]);

  useEffect(() => {
    const root = document.documentElement;

    if (isDarkMode) {
      root.classList.add('dark');
      window.localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      window.localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenuOpen(false);
  };

  return (
    <nav className="bg-white/95 backdrop-blur border-b border-gray-100 sticky top-0 z-50 transition-shadow duration-300 hover:shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center transition-transform duration-200 hover:scale-[1.02]">
            <span className="text-xl font-bold text-gray-900 animate-fade-up">
              Service<span className="text-purple-600">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/categories" 
              className="nav-link-fancy text-gray-600 hover:text-gray-900 font-medium transition"
            >
              Categories
            </Link>
            <Link 
              to="/services" 
              className="nav-link-fancy text-gray-600 hover:text-gray-900 font-medium transition"
            >
              Services
            </Link>
            {isAuthenticated && isCustomer() && (
              <Link 
                to="/my-orders" 
                className="nav-link-fancy text-gray-600 hover:text-gray-900 font-medium transition"
              >
                My Orders
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setIsDarkMode((prev) => !prev)}
              className="hover-glow inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span className="hidden lg:inline text-sm font-medium">
                {isDarkMode ? 'Light' : 'Dark'}
              </span>
            </button>

            {isAuthenticated ? (
              <>
                {isMerchant() && (
                  <Link
                    to="/merchant/orders"
                    className="hover-glow inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition relative"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                    {pendingOrdersCount > 0 && (
                      <span className="inline-flex items-center gap-1 ml-1 px-2 py-0.5 text-xs font-semibold bg-yellow-300 text-gray-900 rounded-full">
                        <Bell className="w-3 h-3" />
                        {pendingOrdersCount} pending
                      </span>
                    )}
                  </Link>
                )}

                <div className="relative">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="hover-glow flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition max-w-[220px]"
                >
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="font-medium text-gray-700 truncate">
                    {user?.name || user?.business_name || 'User'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="animate-fade-up absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <Link 
                      to={isMerchant() ? '/merchant/profile' : '/customer/profile'}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
                    >
                      <User className="w-5 h-5 text-gray-400" />
                      My Profile
                    </Link>
                    {isMerchant() && (
                      <Link 
                        to="/merchant/orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
                      >
                        <LayoutDashboard className="w-5 h-5 text-gray-400" />
                        Dashboard
                        {pendingOrdersCount > 0 && (
                          <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
                            {pendingOrdersCount}
                          </span>
                        )}
                      </Link>
                    )}
                    {isCustomer() && (
                      <>
                        <Link 
                          to="/my-orders"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
                        >
                          <ShoppingBag className="w-5 h-5 text-gray-400" />
                          My Orders
                        </Link>
                        <Link 
                          to="/register"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-purple-600 hover:bg-purple-50 transition"
                        >
                          <User className="w-5 h-5" />
                          Become a Provider
                        </Link>
                      </>
                    )}
                    <hr className="my-2 border-gray-100" />
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </div>
                )}
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-gray-900 font-medium transition"
                >
                  Sign up / Log in
                </Link>
                <Link 
                  to="/register" 
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition"
                >
                  Become a Provider
                </Link>
              </>
            )}
          </div>

          {/* Mobile controls */}
          <div className="md:hidden flex items-center gap-1">
            <button
              onClick={() => setIsDarkMode((prev) => !prev)}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-gray-600" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="px-4 py-4 space-y-3 pb-6">
            <Link 
              to="/categories" 
              onClick={() => setMobileMenuOpen(false)}
                  className="nav-link-fancy block px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition"
            >
              Categories
            </Link>
            <Link 
              to="/services" 
              onClick={() => setMobileMenuOpen(false)}
                  className="nav-link-fancy block px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition"
            >
              Services
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to={isMerchant() ? '/merchant/profile' : '/customer/profile'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="nav-link-fancy block px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition"
                >
                  My Profile
                </Link>
                {isCustomer() && (
                  <Link 
                    to="/my-orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition"
                  >
                    My Orders
                  </Link>
                )}
                {isMerchant() && (
                  <Link 
                    to="/merchant/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition"
                  >
                    <span className="inline-flex items-center gap-2">
                      Dashboard
                      {pendingOrdersCount > 0 && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
                          {pendingOrdersCount} pending
                        </span>
                      )}
                    </span>
                  </Link>
                )}
                <hr className="border-gray-100" />
                <div className="px-4 py-3 flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="font-medium text-gray-700">
                    {user?.name || user?.business_name || 'User'}
                  </span>
                </div>
                <button 
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg font-medium transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <hr className="border-gray-100" />
                <Link 
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition"
                >
                  Sign up / Log in
                </Link>
                <Link 
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 bg-purple-600 text-white text-center rounded-lg font-medium hover:bg-purple-700 transition"
                >
                  Become a Provider
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
