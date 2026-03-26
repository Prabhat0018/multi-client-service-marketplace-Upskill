import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { publicAPI, customerAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Reviews from '../components/Reviews';
import { 
  Clock, MapPin, Calendar, FileText, Star, Shield, 
  CheckCircle, ArrowLeft, ChevronRight, User, Phone
} from 'lucide-react';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isCustomer } = useAuth();
  
  const [service, setService] = useState(null);
  const [merchant, setMerchant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [bookingData, setBookingData] = useState({
    scheduled_date: '',
    address: '',
    notes: ''
  });

  useEffect(() => {
    const fetchServiceAndMerchant = async () => {
      try {
        // Get all services and find the one we need
        const servRes = await publicAPI.getServices();
        const foundService = (servRes.data.services || []).find(s => s.service_id === id);
        
        if (foundService) {
          setService(foundService);
          
          // Get merchant details
          try {
            const merchRes = await publicAPI.getMerchantById(foundService.merchant_id);
            setMerchant(merchRes.data.merchant);
          } catch (err) {
            console.error('Failed to fetch merchant');
          }
        }
      } catch (err) {
        console.error('Failed to fetch service');
      } finally {
        setLoading(false);
      }
    };
    fetchServiceAndMerchant();
  }, [id]);

  const handleBookingChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const handleBookService = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login', { state: { returnTo: `/services/${id}`, bookingData } });
      return;
    }

    if (!isCustomer()) {
      setError('Only customers can book services');
      return;
    }

    if (!bookingData.scheduled_date) {
      setError('Please select a date for the service');
      return;
    }

    if (!bookingData.address || bookingData.address.trim().length < 5) {
      setError('Please enter a valid service address (at least 5 characters)');
      return;
    }

    setBooking(true);
    setError('');
    setSuccess('');

    try {
      const res = await customerAPI.createOrder({
        service_id: service.service_id,
        merchant_id: service.merchant_id,
        scheduled_date: bookingData.scheduled_date,
        address: bookingData.address,
        notes: bookingData.notes
      });

      // Redirect to checkout page with order details
      navigate(`/checkout/${res.data.order.order_id}`, {
        state: {
          order: res.data.order,
          scrollToPaymentOptions: true
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book service');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <FileText className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Service not found</h3>
          <p className="text-gray-600 mb-6">This service may have been removed</p>
          <button 
            onClick={() => navigate('/services')}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition"
          >
            Browse Services
          </button>
        </div>
      </div>
    );
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm overflow-x-auto whitespace-nowrap">
            <Link to="/" className="text-gray-500 hover:text-purple-600 transition">Home</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link to="/services" className="text-gray-500 hover:text-purple-600 transition">Services</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium truncate">{service.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Services
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Service Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Service Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Header with category */}
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
                <span className="inline-block px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-full">
                  {service.category_name || 'Service'}
                </span>
              </div>

              <div className="p-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {service.title}
                </h1>

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-4 sm:gap-6 mb-6 pb-6 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-semibold text-gray-900">{service.duration} mins</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                      <Star className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Rating</p>
                      <p className="font-semibold text-gray-900">4.8 (120+)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                      <Shield className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-semibold text-green-600">Verified</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">About this service</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Features */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">What's included</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 text-gray-600">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Professional service</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Quality guaranteed</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Secure payment</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>24/7 support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Provider Card */}
            {merchant && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Provider</h3>
                
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  {/* Avatar */}
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                    {merchant.business_name?.charAt(0) || 'M'}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">
                      {merchant.business_name}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span>4.8 rating</span>
                      </div>
                      <span>•</span>
                      <span>100+ tasks completed</span>
                    </div>
                    
                    {merchant.description && (
                      <p className="text-gray-600 text-sm mb-3">
                        {merchant.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm">
                      {merchant.address && (
                        <div className="flex items-center gap-1 text-gray-500">
                          <MapPin className="w-4 h-4" />
                          <span>{merchant.address}</span>
                        </div>
                      )}
                      {merchant.phone && (
                        <div className="flex items-center gap-1 text-gray-500">
                          <Phone className="w-4 h-4" />
                          <span>{merchant.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Verification badges */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-full flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Verified Provider
                  </span>
                  <span className="px-3 py-1 bg-purple-50 text-purple-600 text-xs font-medium rounded-full">
                    Background Checked
                  </span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                    Top Rated
                  </span>
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <Reviews serviceId={service.service_id} merchantId={service.merchant_id} />
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden lg:sticky lg:top-24">
              {/* Price Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-purple-600">₹{service.price}</span>
                  <span className="text-gray-500">/ service</span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Book This Service</h3>
                
                {/* Error/Success Messages */}
                {error && (
                  <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
                    {success}
                  </div>
                )}

                <form onSubmit={handleBookService} className="space-y-4">
                  {/* Date Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        name="scheduled_date"
                        value={bookingData.scheduled_date}
                        onChange={handleBookingChange}
                        min={today}
                        required
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="address"
                        placeholder="Enter your full address"
                        value={bookingData.address}
                        onChange={handleBookingChange}
                        required
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                      <textarea
                        name="notes"
                        placeholder="Any special requirements?"
                        value={bookingData.notes}
                        onChange={handleBookingChange}
                        rows={3}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition resize-none"
                      />
                    </div>
                  </div>

                  {/* Price Summary */}
                  <div className="pt-4 border-t border-gray-100 space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Service Price</span>
                      <span className="font-medium text-gray-900">₹{service.price}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Duration</span>
                      <span className="text-gray-900">{service.duration} mins</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  {isAuthenticated && isCustomer() ? (
                    <button
                      type="submit"
                      disabled={booking}
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {booking ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Booking...
                        </>
                      ) : (
                        'Book Now'
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => navigate('/login', { state: { returnTo: `/services/${id}` } })}
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-purple-200"
                    >
                      <User className="w-5 h-5" />
                      Login to Book
                    </button>
                  )}
                </form>

                {/* Trust badges */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-start sm:items-center justify-center gap-2 text-sm text-gray-500 text-center sm:text-left">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>Secure booking with money-back guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
