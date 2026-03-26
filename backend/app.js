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
const normalizeOrigin = (origin) => origin.replace(/\/+$/, '');

const parsedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = parsedOrigins.filter(
  (origin) => /^https?:\/\//i.test(origin) && !origin.includes('YOUR_EC2_PUBLIC_IP')
);

const devFallbackOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
const corsOrigins = (allowedOrigins.length ? allowedOrigins : devFallbackOrigins).map(normalizeOrigin);
const corsOriginSet = new Set(corsOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server requests, curl, and health checks without an Origin header.
      if (!origin) {
        callback(null, true);
        return;
      }

      const normalized = normalizeOrigin(origin);
      callback(null, corsOriginSet.has(normalized));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
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
