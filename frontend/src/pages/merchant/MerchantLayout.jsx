import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { merchantAPI } from '../../services/api';
import {
  LayoutDashboard,
  Wrench,
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  DollarSign,
  ArrowUpRight,
  Menu,
  X
} from 'lucide-react';

const MerchantLayout = () => {
  const location = useLocation();
  const [stats, setStats] = useState({ total_orders: 0, pending_orders: 0, completed_orders: 0, total_earnings: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await merchantAPI.getOrderStats();
        setStats(res.data || { total_orders: 0, pending_orders: 0, completed_orders: 0, total_earnings: 0 });
      } catch (err) {
        console.error('Failed to fetch stats');
      }
    };
    fetchStats();
  }, []);

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const navItems = [
    { path: '/merchant/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/merchant/services', icon: Wrench, label: 'My Services' },
    { path: '/merchant/orders', icon: Package, label: 'Orders' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="font-semibold text-gray-900">Merchant Panel</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-50
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Merchant Panel</h2>
              <p className="text-xs text-gray-500">Manage your business</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  active 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <div className="bg-purple-50 rounded-xl p-4">
            <p className="text-sm text-purple-700 font-medium">Need help?</p>
            <p className="text-xs text-purple-600 mt-1">Contact support for assistance</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0">
        {/* Only show stats on main dashboard */}
        {location.pathname === '/merchant/dashboard' && (
          <div className="p-6 lg:p-8">
            {/* Welcome Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
              <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your business.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
              {/* Total Orders */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.total_orders || 0}</p>
                <p className="text-sm text-gray-500 mt-1">Total Orders</p>
              </div>

              {/* Pending */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending_orders || 0}</p>
                <p className="text-sm text-gray-500 mt-1">Pending</p>
              </div>

              {/* Completed */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-green-600">{stats.completed_orders || 0}</p>
                <p className="text-sm text-gray-500 mt-1">Completed</p>
              </div>

              {/* Earnings */}
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-6 shadow-sm text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-300" />
                </div>
                <p className="text-3xl font-bold">₹{stats.total_earnings || 0}</p>
                <p className="text-sm text-purple-200 mt-1">Total Revenue</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <Link 
                  to="/merchant/services" 
                  className="inline-flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  <Wrench className="w-4 h-4" />
                  Manage Services
                </Link>
                <Link 
                  to="/merchant/orders" 
                  className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  <Package className="w-4 h-4" />
                  View Orders
                </Link>
              </div>
            </div>
          </div>
        )}

        <Outlet />
      </main>
    </div>
  );
};

export default MerchantLayout;
