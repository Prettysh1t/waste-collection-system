# ♻️ EcoCollect — Waste Collection Request & Management System

A minimum viable product (MVP) that lets residents request waste pickups and lets administrators manage those requests from a dashboard.

## Project Overview

EcoCollect covers one core workflow end to end:

```
User → Select Waste → Enter Pickup Details → Submit Request → Track Status → Admin Manages Request
```

Users register, submit a pickup request with a waste category, address, date and time slot, and get back a unique Request ID they can track. Admins log in to a separate dashboard where they can search, filter, view, and update the status of every request, plus see basic collection statistics.

## Features

**User**
- Register / log in (JWT auth)
- Browse 6 predefined waste categories
- Submit a pickup request (waste info, pickup info, contact info)
- Optional "Waste Disposal Helper" — type what you're throwing away and get a category suggestion (simple keyword matching, no external AI)
- Receive a unique Request ID (e.g. `WCR-2026-0001`)
- Track request status on a visual timeline
- View pickup history with status filters
- Cancel a pending/scheduled request

**Admin**
- Separate admin login (role-based access)
- Dashboard with total / pending / scheduled / completed counts
- Charts: requests by status, waste category distribution (Recharts)
- Searchable, filterable table of all requests (by Request ID, user name, phone, status, category, date)
- View full request details, including contact info and full status history
- Update request status (PENDING → SCHEDULED → PICKED_UP → COMPLETED, or CANCELLED)

## Tech Stack

**Frontend:** React, Vite, JavaScript, Tailwind CSS, React Router, Lucide React, Recharts, Axios
**Backend:** Node.js, Express.js, REST API
**Database:** SQLite + Prisma ORM
**Auth:** JWT + bcrypt, role-based access (`USER` / `ADMIN`)

## Project Structure

```
waste-collection-system/
├── frontend/          # React + Vite app
│   └── src/
│       ├── components/  # Navbar, Sidebar, StatusBadge, RequestCard, StatCard
│       ├── pages/        # Login, Register, dashboards, request form/details, history
│       ├── services/     # api.js — axios client + endpoint wrappers
│       └── context/      # AuthContext.jsx — auth state
│
├── backend/           # Express API
│   ├── src/
│   │   ├── controllers/  # auth, request, admin logic
│   │   ├── routes/       # route definitions
│   │   ├── middleware/   # authMiddleware, adminMiddleware
│   │   └── utils/        # generateRequestId.js
│   └── prisma/
│       ├── schema.prisma # User, WasteCategory, PickupRequest, StatusHistory
│       └── seed.js       # demo accounts + 10 sample requests
│
└── README.md
```

## Installation

You'll need **Node.js 18+** installed locally.

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies (in another terminal)
cd ../frontend
npm install
```

## Environment Variables

A `.env` file is already included in `backend/.env` for local development. To configure custom values:

```bash
cd backend
cp .env.example .env
```

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="wca_super_secret_dev_key_change_in_production"
PORT=5000
```

## Database Setup

Initialize the SQLite database, apply migrations, and seed demo accounts and sample requests:

```bash
cd backend
npx prisma migrate dev
npx prisma db seed
```

This creates `dev.db` (SQLite), applies migrations, and seeds:
- 6 predefined waste categories
- 1 Admin account (`admin@wasteapp.com` / `admin123`)
- 4 User accounts (including `user@wasteapp.com` / `user123`)
- 10 realistic sample pickup requests across all statuses

## Running Backend

Start the Node.js Express API server:

```bash
cd backend
npm run dev
```

The backend API will run at **http://localhost:5000**. Health check: `GET /api/health`.

## Running Frontend

In a separate terminal, launch the Vite development server:

```bash
cd frontend
npm run dev
```

The frontend will run at **http://localhost:5173** and proxies `/api` calls to port 5000. Visit http://localhost:5173 in your browser.

## Demo Credentials

| Role  | Email                 | Password  |
|-------|------------------------|-----------|
| Admin | admin@wasteapp.com     | admin123  |
| User  | user@wasteapp.com      | user123   |

(The login page also has "Fill Demo User" / "Fill Demo Admin" buttons.)

## API Documentation

All routes are prefixed with `/api`. Protected routes require `Authorization: Bearer <token>`.

### Authentication
| Method | Route              | Description                  | Auth |
|--------|---------------------|-------------------------------|------|
| POST   | `/auth/register`    | Register a new user           | No   |
| POST   | `/auth/login`        | Log in, returns JWT + user     | No   |
| GET    | `/auth/me`           | Get current user               | Yes  |

### Waste Categories
| Method | Route          | Description             | Auth |
|--------|----------------|--------------------------|------|
| GET    | `/categories`  | List all waste categories | No   |

### User Requests
| Method | Route                     | Description                          | Auth |
|--------|----------------------------|----------------------------------------|------|
| POST   | `/requests`                | Create a pickup request                | Yes  |
| GET    | `/requests`                | List the current user's requests       | Yes  |
| GET    | `/requests/:id`             | Get one request (id or requestId)      | Yes  |
| PUT    | `/requests/:id/cancel`      | Cancel a request (owner only)          | Yes  |

### Admin
| Method | Route                          | Description                                         | Auth        |
|--------|----------------------------------|--------------------------------------------------------|-------------|
| GET    | `/admin/requests`                 | List/search/filter all requests (`search`, `status`, `category`, `date` query params) | Admin |
| GET    | `/admin/requests/:id`              | Get one request with full history                     | Admin       |
| PUT    | `/admin/requests/:id/status`       | Update a request's status                              | Admin       |
| GET    | `/admin/statistics`                | Get counts by status and category distribution         | Admin       |

## Future Improvements

- Push/email notifications when status changes
- Route optimization for collection crews
- Photo upload for waste items
- Recurring pickup schedules
- Multi-language support
- PDF receipt / request confirmation download
