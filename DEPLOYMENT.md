# Deployment Guide (Beginner Friendly)

This guide gets your site live with:
- Frontend on Vercel
- Backend + MySQL on Railway

## 1. Push project to GitHub

1. Create a GitHub repository.
2. Push this project.

## 2. Deploy backend on Railway

1. Go to Railway and create a new project.
2. Add a MySQL service in the same project.
3. Add your backend as a service from GitHub:
   - Root directory: backend
   - Start command: npm start
4. In backend service variables, set:

```env
PORT=5000
DB_HOST=<railway-mysql-host>
DB_PORT=<railway-mysql-port>
DB_USER=<railway-mysql-user>
DB_PASSWORD=<railway-mysql-password>
DB_NAME=<railway-mysql-database>
JWT_SECRET=<long-random-secret>
CORS_ORIGIN=http://localhost:3000,http://127.0.0.1:3000,https://<your-vercel-domain>
```

5. Open backend public URL and test:
- https://<your-backend-domain>/health

## 3. Set up database schema on Railway MySQL

Run these SQL files against Railway MySQL:
1. database/schema.sql
2. database/migration-001-orders.sql

You can run them using MySQL Workbench or a MySQL CLI connection.

## 4. Deploy frontend on Vercel

1. Go to Vercel and import your GitHub repo.
2. Set project root to frontend.
3. Add env variable:

```env
REACT_APP_API_BASE_URL=https://<your-backend-domain>/api
```

4. Deploy.

## 5. Final CORS update

After frontend is deployed, update backend CORS_ORIGIN in Railway to include:
- https://<your-vercel-domain>
- https://www.<your-vercel-domain> (if you use www)

Keep localhost values if you still develop locally.

## 6. Smoke test checklist

1. Open frontend deployed URL.
2. Register customer and merchant.
3. Merchant creates service.
4. Customer books and pays.
5. Merchant updates order status.
6. Confirm login works (no CORS errors in browser console).

## 7. Optional custom domain

- Attach domain in Vercel (frontend).
- Attach API subdomain in Railway (backend), e.g. api.yourdomain.com.
- Update REACT_APP_API_BASE_URL and CORS_ORIGIN accordingly.

## Quick fallback option

If Railway is unavailable, use Render for backend and Neon/Aiven for database.
Vercel frontend steps remain the same.
