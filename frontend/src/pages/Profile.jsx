import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI, publicAPI } from '../services/api';
import {
  User, Mail, Phone, Building2, FileText, Lock, Save,
  CheckCircle, AlertCircle, ArrowLeft, Shield, Calendar, Tag
} from 'lucide-react';

const Profile = () => {
  const { user, isAuthenticated, isCustomer, isMerchant, login } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [categories, setCategories] = useState([]);

  // Customer fields
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Merchant fields
  const [merchantData, setMerchantData] = useState({
    business_name: '',
    email: '',
    description: '',
    category_id: '',
  });

  // Password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchProfile();
    if (isMerchant()) fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const fetchCategories = async () => {
    try {
      const res = await publicAPI.getCategories();
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error('Failed to fetch categories');
    }
  };

  const fetchProfile = async () => {
    try {
      if (isCustomer()) {
        const res = await authAPI.getCustomerProfile();
        const u = res.data.user;
        setCustomerData({
          name: u.name || '',
          email: u.email || '',
          phone: u.phone || '',
        });
      } else if (isMerchant()) {
        const res = await authAPI.getMerchantProfile();
        const m = res.data.merchant;
        setMerchantData({
          business_name: m.business_name || '',
          email: m.email || '',
          description: m.description || '',
          category_id: m.category_id || '',
        });
      }
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate password fields if changing password
    if (showPasswordSection && passwordData.newPassword) {
      if (passwordData.newPassword.length < 6) {
        setError('New password must be at least 6 characters');
        return;
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError('New passwords do not match');
        return;
      }
      if (!passwordData.currentPassword) {
        setError('Current password is required');
        return;
      }
    }

    setSaving(true);
    try {
      if (isCustomer()) {
        const payload = {
          name: customerData.name,
          phone: customerData.phone,
        };
        if (showPasswordSection && passwordData.newPassword) {
          payload.currentPassword = passwordData.currentPassword;
          payload.newPassword = passwordData.newPassword;
        }
        const res = await authAPI.updateCustomerProfile(payload);
        const updated = res.data.user;
        // Update session
        login({ ...user, name: updated.name, email: updated.email }, sessionStorage.getItem('token'));
        setSuccess('Profile updated successfully!');
      } else if (isMerchant()) {
        const payload = {
          business_name: merchantData.business_name,
          description: merchantData.description,
          category_id: merchantData.category_id,
        };
        if (showPasswordSection && passwordData.newPassword) {
          payload.currentPassword = passwordData.currentPassword;
          payload.newPassword = passwordData.newPassword;
        }
        const res = await authAPI.updateMerchantProfile(payload);
        const updated = res.data.merchant;
        login({ ...user, business_name: updated.business_name, email: updated.email }, sessionStorage.getItem('token'));
        setSuccess('Profile updated successfully!');
      }
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordSection(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-up">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="hover-glow flex items-center gap-2 text-gray-600 hover:text-purple-600 transition mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        {/* Header */}
        <div className="animate-fade-up-delay-1 flex items-center gap-4 mb-8">
          <div className="interactive-card w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {isCustomer()
              ? (customerData.name?.charAt(0) || 'U').toUpperCase()
              : (merchantData.business_name?.charAt(0) || 'M').toUpperCase()
            }
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isCustomer() ? 'My Profile' : 'Business Profile'}
            </h1>
            <p className="text-gray-500 flex items-center gap-2 mt-1">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-sm">{isCustomer() ? 'Customer Account' : 'Merchant Account'}</span>
              <span className="text-gray-300">•</span>
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm">Member since {new Date(user?.created_at || Date.now()).getFullYear()}</span>
            </p>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm flex items-center gap-2">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            {success}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6 animate-fade-up-delay-2">
          {/* Personal/Business Info */}
          <div className="interactive-card bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              {isCustomer() ? 'Personal Information' : 'Business Information'}
            </h2>

            <div className="space-y-5">
              {isCustomer() ? (
                <>
                  {/* Customer Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={customerData.name}
                        onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                        required
                        className="hover-glow w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Email (read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={customerData.email}
                        disabled
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-500 bg-gray-50 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={customerData.phone}
                        onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                        placeholder="Enter your phone number"
                        className="hover-glow w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Business Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={merchantData.business_name}
                        onChange={(e) => setMerchantData({ ...merchantData, business_name: e.target.value })}
                        required
                        className="hover-glow w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Email (read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={merchantData.email}
                        disabled
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-500 bg-gray-50 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Category</label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        value={merchantData.category_id}
                        onChange={(e) => setMerchantData({ ...merchantData, category_id: e.target.value })}
                        className="hover-glow w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
                      >
                        <option value="">Select a category</option>
                        {categories.map(cat => (
                          <option key={cat.category_id} value={cat.category_id}>
                            {cat.category_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Description</label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                      <textarea
                        value={merchantData.description}
                        onChange={(e) => setMerchantData({ ...merchantData, description: e.target.value })}
                        rows={4}
                        placeholder="Describe your business and services..."
                        className="hover-glow w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Change Password Section */}
          <div className="interactive-card bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
              <button
                type="button"
                onClick={() => {
                  setShowPasswordSection(!showPasswordSection);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="text-sm text-purple-600 hover:underline font-medium"
              >
                {showPasswordSection ? 'Cancel' : 'Change Password'}
              </button>
            </div>

            {showPasswordSection ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      placeholder="Enter current password"
                      className="hover-glow w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      placeholder="Enter new password (min 6 characters)"
                      className="hover-glow w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      placeholder="Confirm new password"
                      className="hover-glow w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Your password is securely stored. Click "Change Password" to update it.</p>
            )}
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={saving}
            className="hover-glow w-full flex items-center justify-center gap-2 px-6 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
