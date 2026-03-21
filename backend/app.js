require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import Routes
const authRoutes = require('./routes/auth.routes');
const serviceRoutes = require('./routes/service.routes');
const publicRoutes = require('./routes/public.routes');
const orderRoutes = require('./routes/order.routes');
const merchantOrderRoutes = require('./routes/merchant.order.routes');

const app = express();

// Middleware
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors(
  allowedOrigins.length
    ? { origin: allowedOrigins }
    : undefined
));
app.use(express.json());

// ============================================
// 🛣️ ROUTE REGISTRATION
// ============================================

// Auth routes (login/signup)
app.use('/api/auth', authRoutes);

// Merchant routes (protected - requires JWT)
app.use('/api/merchant/services', serviceRoutes);
app.use('/api/merchant/orders', merchantOrderRoutes);

// Customer order routes (protected - requires JWT)
app.use('/api/orders', orderRoutes);

// Public routes (customer marketplace - no auth)
// Handles: /api/services, /api/categories, /api/merchants, /api/search
app.use('/api', publicRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running 🚀' });
});

module.exports = app;
