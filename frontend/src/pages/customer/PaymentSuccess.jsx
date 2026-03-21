import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle,
  Package,
  Calendar,
  User,
  Clock,
  ArrowRight,
  Download,
  Share2,
  Home,
  ShoppingBag
} from 'lucide-react';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate(); // eslint-disable-line no-unused-vars
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="interactive-card bg-white rounded-2xl shadow-sm p-10 max-w-md w-full text-center animate-fade-up">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Order Found</h2>
          <p className="text-gray-500 mb-6">Please check your orders page.</p>
          <Link 
            to="/my-orders" 
            className="hover-glow inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            View My Orders
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Success Animation Header */}
      <div className="pt-16 pb-8 text-center animate-fade-up">
        {/* Animated Success Circle */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <div className="absolute w-24 h-24 bg-green-200 rounded-full animate-ping opacity-25"></div>
          <div className="relative w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-500 text-lg">Your booking has been confirmed</p>
      </div>

      {/* Order Details Card */}
      <div className="max-w-lg mx-auto px-4 pb-16">
        <div className="interactive-card bg-white rounded-2xl shadow-sm overflow-hidden animate-fade-up-delay-1">
          {/* Order Header */}
          <div className="bg-purple-600 px-6 py-4">
            <div className="flex items-center justify-between text-white">
              <span className="text-sm opacity-80">Order ID</span>
              <span className="font-mono text-sm bg-white/20 px-3 py-1 rounded-full">
                #{order.order_id?.slice(0, 8)}
              </span>
            </div>
          </div>

          {/* Order Content */}
          <div className="p-6">
            {/* Service Info */}
            <div className="flex items-start gap-4 pb-6 border-b border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{order.service_title}</h3>
                <div className="flex items-center gap-2 text-gray-500 mt-1">
                  <User className="w-4 h-4" />
                  <span>{order.business_name}</span>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="py-4 space-y-4">
              {order.scheduled_date && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-gray-500">
                    <Calendar className="w-5 h-5" />
                    Scheduled Date
                  </span>
                  <span className="font-medium text-gray-900">
                    {new Date(order.scheduled_date).toLocaleDateString('en-IN', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-500">
                  <Clock className="w-5 h-5" />
                  Status
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                  order.order_status === 'confirmed' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  <CheckCircle className="w-4 h-4" />
                  {order.order_status === 'confirmed' ? 'Confirmed' : 'Pending Confirmation'}
                </span>
              </div>
            </div>

            {/* Amount */}
            <div className="pt-4 mt-2 border-t-2 border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">Amount Paid</span>
                <span className="text-2xl font-bold text-purple-600">₹{order.total_amount}</span>
              </div>
            </div>
          </div>

          {/* Info Message */}
          <div className="bg-purple-50 px-6 py-4">
            <p className="text-sm text-purple-700 text-center">
              The service provider will contact you soon to confirm the appointment.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <Link 
            to="/my-orders"
            className="hover-glow flex items-center justify-center gap-2 w-full bg-purple-600 text-white py-4 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            View My Orders
          </Link>
          
          <Link
            to="/services"
            className="hover-glow flex items-center justify-center gap-2 w-full bg-white border border-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            <Home className="w-5 h-5" />
            Browse More Services
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex items-center justify-center gap-6">
          <button className="hover-glow flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-colors px-3 py-2 rounded-lg">
            <Download className="w-5 h-5" />
            <span className="text-sm">Download Receipt</span>
          </button>
          <button className="hover-glow flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-colors px-3 py-2 rounded-lg">
            <Share2 className="w-5 h-5" />
            <span className="text-sm">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
