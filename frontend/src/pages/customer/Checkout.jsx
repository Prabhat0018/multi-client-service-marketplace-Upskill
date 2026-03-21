import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { customerAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  CreditCard,
  Smartphone,
  Building2,
  Banknote,
  Lock,
  Shield,
  Calendar,
  User,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';

const Checkout = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isCustomer } = useAuth();
  
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  const banks = [
    { id: 'sbi', name: 'State Bank of India' },
    { id: 'hdfc', name: 'HDFC Bank' },
    { id: 'icici', name: 'ICICI Bank' },
    { id: 'axis', name: 'Axis Bank' },
    { id: 'kotak', name: 'Kotak Mahindra Bank' },
    { id: 'pnb', name: 'Punjab National Bank' }
  ];

  const paymentMethods = [
    { id: 'card', label: 'Credit/Debit Card', icon: CreditCard, desc: 'Pay securely with your card' },
    { id: 'upi', label: 'UPI', icon: Smartphone, desc: 'Google Pay, PhonePe, Paytm' },
    { id: 'netbanking', label: 'Net Banking', icon: Building2, desc: 'Pay from your bank account' },
    { id: 'cod', label: 'Pay After Service', icon: Banknote, desc: 'Cash on completion' }
  ];

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setCardDetails({ ...cardDetails, [name]: formatted.slice(0, 19) });
      return;
    }
    
    if (name === 'expiry') {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length >= 2) {
        setCardDetails({ ...cardDetails, [name]: cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4) });
      } else {
        setCardDetails({ ...cardDetails, [name]: cleaned });
      }
      return;
    }
    
    setCardDetails({ ...cardDetails, [name]: value });
  };

  useEffect(() => {
    if (!isAuthenticated || !isCustomer()) {
      navigate('/login');
      return;
    }

    if (!order && orderId) {
      fetchOrder();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, isAuthenticated]);

  const fetchOrder = async () => {
    try {
      const res = await customerAPI.getOrderById(orderId);
      setOrder(res.data.order);
    } catch (err) {
      setError('Order not found');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setError('');

    if (paymentMethod === 'card') {
      if (!cardDetails.cardNumber || cardDetails.cardNumber.replace(/\s/g, '').length < 16) {
        setError('Please enter a valid card number');
        return;
      }
      if (!cardDetails.expiry || cardDetails.expiry.length < 5) {
        setError('Please enter a valid expiry date');
        return;
      }
      if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
        setError('Please enter a valid CVV');
        return;
      }
      if (!cardDetails.name) {
        setError('Please enter cardholder name');
        return;
      }
    }

    if (paymentMethod === 'upi') {
      if (!upiId || !upiId.includes('@')) {
        setError('Please enter a valid UPI ID (e.g., name@upi)');
        return;
      }
    }

    if (paymentMethod === 'netbanking') {
      if (!selectedBank) {
        setError('Please select a bank');
        return;
      }
    }

    setProcessing(true);

    try {
      const res = await customerAPI.processPayment(order.order_id, {
        payment_method: paymentMethod
      });

      if (res.data.success) {
        navigate('/payment-success', { 
          state: { order: res.data.order }
        });
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-sm p-10">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Order not found</h2>
          <p className="text-gray-500 mb-6">The order you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/services')}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Browse Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 animate-fade-up">
          <button 
            onClick={() => navigate(-1)}
            className="hover-glow flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6 animate-fade-up-delay-1">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900">Select Service</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900">Book Order</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                3
              </div>
              <span className="text-sm font-medium text-purple-600">Payment</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-up-delay-2">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            <div className="interactive-card bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Select Payment Method</h2>
              
              {error && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Payment Method Selection */}
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {paymentMethods.map(method => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`interactive-card flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                        paymentMethod === method.id
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        paymentMethod === method.id ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{method.label}</p>
                        <p className="text-sm text-gray-500">{method.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Card Form */}
              {paymentMethod === 'card' && (
                <div className="border-t border-gray-200 pt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.cardNumber}
                        onChange={handleCardChange}
                        maxLength="19"
                        className="hover-glow w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                      <input
                        type="text"
                        name="expiry"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={handleCardChange}
                        maxLength="5"
                        className="hover-glow w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                      <input
                        type="password"
                        name="cvv"
                        placeholder="•••"
                        value={cardDetails.cvv}
                        onChange={handleCardChange}
                        maxLength="4"
                        className="hover-glow w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Name on card"
                      value={cardDetails.name}
                      onChange={handleCardChange}
                      className="hover-glow w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* UPI Form */}
              {paymentMethod === 'upi' && (
                <div className="border-t border-gray-200 pt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID</label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="yourname@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="hover-glow w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      You will receive a payment request on your UPI app
                    </p>
                  </div>
                </div>
              )}

              {/* Net Banking Form */}
              {paymentMethod === 'netbanking' && (
                <div className="border-t border-gray-200 pt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Your Bank</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select 
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="hover-glow w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
                    >
                      <option value="">-- Select Bank --</option>
                      {banks.map(bank => (
                        <option key={bank.id} value={bank.id}>{bank.name}</option>
                      ))}
                    </select>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    You will be redirected to your bank's secure payment page
                  </p>
                </div>
              )}

              {/* Pay After Service Info */}
              {paymentMethod === 'cod' && (
                <div className="border-t border-gray-200 pt-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Banknote className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-800">Pay After Service</p>
                        <p className="text-sm text-yellow-700 mt-1">
                          Pay the service provider in cash after the service is completed. 
                          Please have the exact amount (₹{order.total_amount}) ready.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Security Info */}
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <Shield className="w-5 h-5" />
              <span>Your payment information is encrypted and secure</span>
            </div>
          </div>

          {/* Order Summary - Right Side */}
          <div className="lg:col-span-1">
            <div className="interactive-card bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h3>
              
              {/* Service Info */}
              <div className="pb-4 mb-4 border-b border-gray-200">
                <h4 className="font-medium text-gray-900 mb-1">
                  {order.service_title || order.service?.title}
                </h4>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <User className="w-4 h-4" />
                  {order.business_name || order.merchant?.name}
                </div>
              </div>

              {/* Schedule */}
              {order.scheduled_date && (
                <div className="flex items-center justify-between py-3 text-sm">
                  <span className="flex items-center gap-2 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    Scheduled
                  </span>
                  <span className="font-medium text-gray-900">
                    {new Date(order.scheduled_date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 pt-4 mt-2 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Service Price</span>
                  <span className="text-gray-900">₹{order.total_amount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Platform Fee</span>
                  <span className="text-green-600">FREE</span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t-2 border-gray-200 pt-4 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-purple-600">₹{order.total_amount}</span>
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePayment}
                disabled={processing}
                className="hover-glow w-full mt-6 bg-purple-600 text-white py-4 rounded-xl font-semibold hover:bg-purple-700 transition-colors disabled:bg-purple-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Pay ₹{order.total_amount}
                  </>
                )}
              </button>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  SSL Secured
                </span>
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" />
                  100% Safe
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
