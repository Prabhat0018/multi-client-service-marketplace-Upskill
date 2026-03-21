import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './styles/App.css';

// Components
import Navbar from './components/Navbar';

// Pages (lazy loaded for faster initial boot)
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Categories = lazy(() => import('./pages/Categories'));

// Customer Pages
const MyOrders = lazy(() => import('./pages/customer/MyOrders'));
const Checkout = lazy(() => import('./pages/customer/Checkout'));
const PaymentSuccess = lazy(() => import('./pages/customer/PaymentSuccess'));

// Profile
const CustomerProfile = lazy(() => import('./pages/customer/CustomerProfile'));
const MerchantProfile = lazy(() => import('./pages/merchant/MerchantProfile'));

// Merchant Pages
const MerchantLayout = lazy(() => import('./pages/merchant/MerchantLayout'));
const MerchantServices = lazy(() => import('./pages/merchant/MerchantServices'));
const MerchantOrders = lazy(() => import('./pages/merchant/MerchantOrders'));

// Protected Route Components
const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, role } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/" />;
  }
  
  return children;
};

const ProfileRedirect = () => {
  const { role } = useAuth();

  if (role === 'merchant') {
    return <Navigate to="/merchant/profile" replace />;
  }

  return <Navigate to="/customer/profile" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/services" element={<Services />} />
      <Route path="/services/:id" element={<ServiceDetail />} />
      <Route path="/categories" element={<Categories />} />

      {/* Customer Routes */}
      <Route 
        path="/my-orders" 
        element={
          <ProtectedRoute allowedRole="customer">
            <MyOrders />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/checkout/:orderId" 
        element={
          <ProtectedRoute allowedRole="customer">
            <Checkout />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/payment-success" 
        element={
          <ProtectedRoute allowedRole="customer">
            <PaymentSuccess />
          </ProtectedRoute>
        } 
      />

      {/* Profile Routes */}
      <Route 
        path="/customer/profile" 
        element={
          <ProtectedRoute allowedRole="customer">
            <CustomerProfile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/merchant/profile" 
        element={
          <ProtectedRoute allowedRole="merchant">
            <MerchantProfile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfileRedirect />
          </ProtectedRoute>
        } 
      />

      {/* Merchant Routes */}
      <Route 
        path="/merchant" 
        element={
          <ProtectedRoute allowedRole="merchant">
            <MerchantLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={null} />
        <Route path="services" element={<MerchantServices />} />
        <Route path="orders" element={<MerchantOrders />} />
      </Route>

      {/* Redirect */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Suspense
          fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-600 border-t-transparent mx-auto mb-3"></div>
                <p className="text-gray-600">Loading...</p>
              </div>
            </div>
          }
        >
          <AppRoutes />
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
