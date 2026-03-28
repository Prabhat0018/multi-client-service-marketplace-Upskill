import React, { useState, useEffect, useCallback } from 'react';
import { merchantAPI } from '../../services/api';
import {
  Package,
  Calendar,
  User,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Filter,
  PlayCircle,
  // ArrowRight,
  MessageSquare
} from 'lucide-react';

const MerchantOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await merchantAPI.getOrders(statusFilter);
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await merchantAPI.updateOrderStatus(orderId, newStatus);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
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
        icon: PlayCircle,
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
        icon: XCircle,
        label: 'Cancelled'
      }
    };
    return configs[status] || configs.pending;
  };

  const getNextStatus = (currentStatus) => {
    const flow = {
      pending: 'confirmed',
      confirmed: 'in_progress',
      in_progress: 'completed'
    };
    return flow[currentStatus] || null;
  };

  const getNextStatusConfig = (currentStatus) => {
    const configs = {
      pending: { label: 'Confirm Order', icon: CheckCircle, color: 'bg-blue-600 hover:bg-blue-700' },
      confirmed: { label: 'Start Work', icon: PlayCircle, color: 'bg-purple-600 hover:bg-purple-700' },
      in_progress: { label: 'Mark Complete', icon: CheckCircle, color: 'bg-green-600 hover:bg-green-700' }
    };
    return configs[currentStatus] || null;
  };

  const filterOptions = [
    { value: '', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 mt-1">Manage and track customer orders</p>
        </div>
        
        {/* Filter Dropdown */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {filterOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          <span className="ml-3 text-gray-600">Loading orders...</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-500">
            {statusFilter ? 'Try changing the filter' : 'Orders from customers will appear here'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const statusConfig = getStatusConfig(order.order_status);
            const StatusIcon = statusConfig.icon;
            const nextStatusConfig = getNextStatusConfig(order.order_status);
            const NextIcon = nextStatusConfig?.icon;
            
            return (
              <div 
                key={order.order_id} 
                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Package className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1 flex-wrap">
                            <h3 className="text-lg font-semibold text-gray-900">
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
                              {order.customer_name || 'Customer'}
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
                          {order.notes && (
                            <div className="flex items-start gap-2 mt-3 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                              <MessageSquare className="w-4 h-4 flex-shrink-0 mt-0.5" />
                              <span>{order.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Price & Actions */}
                    <div className="flex items-center gap-4 lg:pl-4 lg:border-l lg:border-gray-100">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">₹{order.total_amount}</p>
                        <p className="text-xs text-gray-500">Total Amount</p>
                      </div>
                      
                      {nextStatusConfig && (
                        <button
                          onClick={() => handleStatusUpdate(order.order_id, getNextStatus(order.order_status))}
                          disabled={updatingId === order.order_id}
                          className={`flex items-center gap-2 px-4 py-2.5 text-white rounded-lg font-medium transition-colors disabled:opacity-50 ${nextStatusConfig.color}`}
                        >
                          {updatingId === order.order_id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <NextIcon className="w-4 h-4" />
                          )}
                          {nextStatusConfig.label}
                        </button>
                      )}
                      
                      {order.order_status === 'completed' && (
                        <span className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-100 text-green-700 rounded-lg font-medium">
                          <CheckCircle className="w-4 h-4" />
                          Done
                        </span>
                      )}
                      
                      {order.order_status === 'cancelled' && (
                        <span className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-100 text-red-700 rounded-lg font-medium">
                          <XCircle className="w-4 h-4" />
                          Cancelled
                        </span>
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
  );
};

export default MerchantOrders;
