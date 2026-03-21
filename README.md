# Multi-Client Service Marketplace

This project is a full-stack marketplace where customers can discover and book local services, while merchants can publish services and manage incoming orders.

## What This Software Does

The platform supports two user roles:

- Customer: browse categories and services, place orders, pay, and leave reviews.
- Merchant: register business profile, create service listings, and manage order status.

Core capabilities:

- Authentication for customers and merchants (JWT-based)
- Public marketplace browsing (categories, services, merchants, search)
- Merchant service management (create, update, delete)
- Customer order flow (create order, pay, cancel, review)
- Merchant order management and stats
- MySQL-backed data model for users, merchants, services, orders, payments, and reviews

## Tech Stack

- Backend: Node.js, Express, MySQL (`mysql2`), JWT
- Frontend: React + Axios
- Database: MySQL

## Project Structure

- `backend`: Express API server
- `frontend`: React web application
- `database`: SQL schema and migration scripts

## Run Locally

### 1. Prerequisites

- Node.js 18+ (recommended)
- npm 9+ (comes with Node)
- MySQL 8+

### 2. Clone and enter the project

```bash
git clone <your-repo-url>
cd multi-client-service-marketplace-UCT-
```

### 3. Set up the MySQL database

1. Open MySQL Workbench (or MySQL CLI).
2. Run `database/schema.sql`.
3. If your current database already has older tables, run `database/migration-001-orders.sql` to add order-related columns.

This creates the database named `service_marketplace`.

### 4. Configure backend environment variables

1. Go to the backend folder.
2. Copy `.env.example` to `.env`.
3. Update values for your local machine.

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your-db-password
DB_NAME=service_marketplace
JWT_SECRET=replace-with-long-random-secret
CORS_ORIGIN=http://localhost:3000
```

### 5. Install dependencies

```bash
# backend deps
cd backend
npm install

# frontend deps
cd ../frontend
npm install
```

### 6. Start the backend API

```bash
cd backend
npm run dev
```

Backend default URL: `http://localhost:5000`

Health check: `http://localhost:5000/health`

### 7. Start the frontend app

In a second terminal:

```bash
cd frontend
npm start
```

Frontend URL: `http://localhost:3000`

The frontend calls `http://localhost:5000/api` by default in development.

## API Routes Overview

- Auth: `/api/auth/...`
- Public marketplace: `/api/categories`, `/api/services`, `/api/merchants`, `/api/search`
- Customer orders: `/api/orders/...`
- Merchant services: `/api/merchant/services/...`
- Merchant orders: `/api/merchant/orders/...`

## Typical Local Test Flow

1. Register a merchant and create at least one service.
2. Register a customer account.
3. Browse services and place an order as customer.
4. Complete payment and add a review.
5. Login as merchant and update order status.

## Troubleshooting

- CORS errors: set `CORS_ORIGIN=http://localhost:3000` in `backend/.env`.
- DB connection errors: verify `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.
- Port conflict: change `PORT` in `backend/.env` and restart backend.
