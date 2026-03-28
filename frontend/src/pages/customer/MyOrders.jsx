import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { customerAPI } from '../../services/api';
import { 
  Package, 
  Calendar, 
  Clock, 
  // MapPin, 
  User, 
  X, 
  CheckCircle, 
  // AlertCircle,
  Loader2,
  ShoppingBag,
  ArrowRight,
  // Filter,
  Search
} from 'lucide-react';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchOrders = async () => {
    try {
      const res = await customerAPI.getMyOrders();
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    
    setCancellingId(orderId);
    try {
      await customerAPI.cancelOrder(orderId);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { 
        bg: 'bg-yellow-100', 
        text: 'text-yellow-700', 
        icon: Clock,
        label: 'Pending'
      },
      confirmed: { 
        bg: 'bg-blue-100', 
        text: 'text-blue-700', 
        icon: CheckCircle,
        label: 'Confirmed'
      },
      in_progress: { 
        bg: 'bg-purple-100', 
        text: 'text-purple-700', 
        icon: Loader2,
        label: 'In Progress'
      },
      completed: { 
        bg: 'bg-green-100', 
        text: 'text-green-700', 
        icon: CheckCircle,
        label: 'Completed'
      },
      cancelled: { 
        bg: 'bg-red-100', 
        text: 'text-red-700', 
        icon: X,
        label: 'Cancelled'
      }
    };
    return configs[status] || configs.pending;
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = activeFilter === 'all' || order.order_status === activeFilter;
    const matchesSearch = !searchQuery || 
      order.service_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.business_name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.order_status === 'pending').length,
    completed: orders.filter(o => o.order_status === 'completed').length,
    cancelled: orders.filter(o => o.order_status === 'cancelled').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-up">
          <h1 className="text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-purple-200">Track and manage your service bookings</p>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="interactive-card bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-purple-200 text-sm">Total Orders</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="interactive-card bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-purple-200 text-sm">Pending</p>
              <p className="text-2xl font-bold">{stats.pending}</p>
            </div>
            <div className="interactive-card bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-purple-200 text-sm">Completed</p>
              <p className="text-2xl font-bold">{stats.completed}</p>
            </div>
            <div className="interactive-card bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-purple-200 text-sm">Cancelled</p>
              <p className="text-2xl font-bold">{stats.cancelled}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-up-delay-1">
        {/* Filters & Search */}
        <div className="interactive-card bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="hover-glow w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            {/* Filter Pills */}
            <div className="flex gap-2 flex-wrap">
              {[
                { key: 'all', label: 'All' },
                { key: 'pending', label: 'Pending' },
                { key: 'confirmed', label: 'Confirmed' },
                { key: 'in_progress', label: 'In Progress' },
                { key: 'completed', label: 'Completed' }
              ].map(filter => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`hover-glow px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeFilter === filter.key
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            <span className="ml-3 text-gray-600">Loading orders...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery || activeFilter !== 'all' ? 'No orders found' : 'No orders yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || activeFilter !== 'all' 
                ? 'Try adjusting your filters or search query'
                : 'Book your first service to get started'}
            </p>
            <Link 
              to="/services" 
              className="hover-glow inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Browse Services
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => {
              const statusConfig = getStatusConfig(order.order_status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <div 
                  key={order.order_id} 
                  className="interactive-card bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow animate-fade-up"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Order Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Package className="w-6 h-6 text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {order.service_title || 'Service'}
                              </h3>
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                                <StatusIcon className="w-3.5 h-3.5" />
                                {statusConfig.label}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1.5">
                                <User className="w-4 h-4" />
                                {order.business_name || 'Provider'}
                              </span>
                              {order.scheduled_date && (
                                <span className="flex items-center gap-1.5">
                                  <Calendar className="w-4 h-4" />
                                  {formatDate(order.scheduled_date)}
                                </span>
                              )}
                              <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                #{order.order_id?.slice(0, 8)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Price & Actions */}
                      <div className="flex items-center gap-4 md:pl-4 md:border-l md:border-gray-100">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">₹{order.total_amount}</p>
                          <p className="text-xs text-gray-500">Total Amount</p>
                        </div>
                        
                        {order.order_status === 'pending' && (
                          <button
                            onClick={() => handleCancelOrder(order.order_id)}
                            disabled={cancellingId === order.order_id}
                            className="hover-glow flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                          >
                            {cancellingId === order.order_id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <X className="w-4 h-4" />
                            )}
                            Cancel
                          </button>
                        )}
                        
                        {order.order_status === 'completed' && (
                          <Link
                            to={`/services/${order.service_id}`}
                            className="hover-glow flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            Book Again
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
