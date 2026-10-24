# QueueLess — Virtual Queue Management System

> **A full-stack MERN application that replaces physical waiting lines with digital tokens, live position tracking, and estimated wait times.**

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-teal.svg)](https://react.dev/)
[![React](https://img.shields.io/badge/Frontend-React_18_%2B_Vite-blue.svg)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js_%2B_Express-green.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB_%2B_Mongoose-brightgreen.svg)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📌 Project Overview

**QueueLess** is an intelligent digital queuing solution designed for civic centers, healthcare clinics, campus administrative departments, and customer service hubs. Rather than forcing people to congregate in crowded physical waiting halls, customers can join a virtual queue online, receive a sequential token number, monitor their queue standing in real time, and arrive right when their token is called.

### Key Highlights
- **Real-time Queue Tracking**: Computes live position in line (`#1`, `#2`, `#3`), tokens ahead, and estimated wait minutes.
- **Three-Tier Role-Based Access Control**:
  - 👤 **Customer**: Browse services, claim digital tokens, view live positions, cancel waiting tickets, and review ticket history.
  - 👨‍💼 **Staff Operator**: Counter desk operator console to call next ticket, mark as serving, complete service, and skip absent customers.
  - 👑 **Administrator**: Comprehensive dashboard to manage service locations, services, staff accounts, and view daily throughput metrics.
- **Academic Readiness**: Complete with clean MVC structure, automated testing, seed data, and a full academic project report.

---

## 🏗️ Project Architecture & Directory Structure

```
project/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection & health probe
│   │   ├── controllers/
│   │   │   ├── authController.js     # User registration, login, JWT issuance
│   │   │   ├── locationController.js # Multi-branch locations CRUD
│   │   │   ├── serviceController.js  # Service departments & queue metrics
│   │   │   ├── queueController.js    # Token generation, live position, status transitions
│   │   │   └── adminController.js    # Admin stats & staff account management
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js     # JWT verification middleware
│   │   │   ├── roleMiddleware.js     # Role-based authorization guard
│   │   │   └── errorMiddleware.js    # Centralized 404 & error handlers
│   │   ├── models/
│   │   │   ├── User.js               # User schema with bcrypt pre-save hash
│   │   │   ├── Location.js           # Branch locations schema
│   │   │   ├── Service.js            # Services schema with daily capacity & avg wait
│   │   │   └── QueueEntry.js         # Daily sequential token entries schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── locationRoutes.js
│   │   │   ├── serviceRoutes.js
│   │   │   ├── queueRoutes.js
│   │   │   └── adminRoutes.js
│   │   ├── scripts/
│   │   │   └── seed.js               # Database seeder with demo accounts & records
│   │   ├── tests/
│   │   │   └── api.test.js           # Automated integration test suite
│   │   └── server.js                 # Express application entry point
│   ├── .env.example
│   ├── .env
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Responsive navigation with role links
│   │   │   ├── Footer.jsx            # Project footer
│   │   │   ├── ProtectedRoute.jsx    # Client route protection by role
│   │   │   ├── StatusBadge.jsx       # Animated status indicators
│   │   │   ├── StatCard.jsx          # Metric cards
│   │   │   ├── Alert.jsx             # Alert notification banners
│   │   │   └── Modal.jsx             # Reusable modal dialog
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Session state and auth methods
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx       # Public landing page with instant demo buttons
│   │   │   ├── LoginPage.jsx         # Sign in with role presets
│   │   │   ├── RegisterPage.jsx      # Customer self-registration
│   │   │   ├── ServicesPage.jsx      # Browse services & join queue modal
│   │   │   ├── CustomerDashboard.jsx # Active tokens list & live standing
│   │   │   ├── QueueTrackPage.jsx    # Real-time token tracker with step timeline
│   │   │   ├── CustomerHistoryPage.jsx # Past tokens table
│   │   │   ├── StaffDashboard.jsx    # Staff counter desk & queue management
│   │   │   ├── AdminDashboard.jsx    # System administration & metrics
│   │   │   └── NotFoundPage.jsx      # 404 page
│   │   ├── services/
│   │   │   └── api.js                # Axios client with JWT interceptor
│   │   ├── App.jsx                   # Route declarations
│   │   ├── main.jsx                  # React DOM mount point
│   │   └── index.css                 # Navy, White & Teal design system
│   ├── index.html
│   ├── vite.config.js
│   ├── .env.example
│   ├── .env
│   └── package.json
├── screenshots/
│   └── README.md                     # Screenshot checklist for submission
├── .gitignore
├── PROJECT_REPORT.md                 # Complete academic documentation
└── README.md
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
Ensure you have the following installed:
- **Node.js**: v18.0.0 or higher (`node -v`)
- **npm**: v9.0.0 or higher (`npm -v`)
- **MongoDB**: Local MongoDB Community Edition OR free cloud MongoDB Atlas cluster.

---

### 2. Database Setup

#### Option A: MongoDB Atlas (Cloud - Recommended & Free)
1. Sign up for free at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free **M0 Sandbox** cluster.
3. Under **Database Access**, create a database user (e.g., username `queueless_user` and password).
4. Under **Network Access**, add IP `0.0.0.0/0` (allow access from anywhere).
5. Click **Connect** > **Drivers** > copy connection string:
   ```
   mongodb+srv://queueless_user:<password>@cluster0.mongodb.net/queueless?retryWrites=true&w=majority
   ```
6. Paste this URI into `backend/.env` under `MONGODB_URI`.

#### Option B: Local MongoDB
If you have MongoDB installed locally, start the service:
```powershell
# Windows
net start MongoDB
# Or run mongod directly:
mongod --dbpath "C:\data\db"
```
The default connection string in `backend/.env` (`mongodb://localhost:27017/queueless`) will connect automatically.

---

### 3. Installation & Database Seeding

#### Backend Setup
```bash
cd backend
npm install
# Seed the database with demo accounts, locations, services, and queue entries:
npm run seed
```

#### Frontend Setup
```bash
cd ../frontend
npm install
```

---

### 4. Running the Application

Open two terminal windows:

#### Terminal 1 — Start Backend Server (Port 5000)
```bash
cd backend
npm start
# Or for live file watching:
npm run dev
```
*Health Check will be available at:* `http://localhost:5000/api/health`

#### Terminal 2 — Start Frontend Server (Port 5173)
```bash
cd frontend
npm run dev
```
*Open your browser at:* `http://localhost:5173`

---

## 🔑 Demo Login Credentials

The database seeder automatically creates pre-configured accounts for testing:

| Role | Email | Password | Assigned Service | Permissions |
| :--- | :--- | :--- | :--- | :--- |
| 👑 **Administrator** | `admin@queueless.com` | `Admin123!` | All / System-wide | Full access: Locations, Services, Staff, Analytics |
| 👨‍💼 **Staff Operator** | `staff1@queueless.com` | `Staff123!` | Passport & Identity | Counter Desk: Call Next, Serve, Complete, Skip |
| 👩‍💼 **Staff Operator** | `staff2@queueless.com` | `Staff123!` | Health Clinic GP | Counter Desk: Call Next, Serve, Complete, Skip |
| 👤 **Customer** | `customer@queueless.com` | `Customer123!` | None (Public) | Browse services, join queue, track live position |

*(Tip: On the Login page, click any of the "Fill Demo Credentials" buttons to autofill instantly!)*

---

## 🔌 API Overview

All routes are prefixed with `/api`. Protected routes require `Authorization: Bearer <JWT_TOKEN>`.

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new customer account |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Private | Get current authenticated profile |
| `PUT` | `/api/auth/profile` | Private | Update user details (name, phone) |

### Services & Locations (`/api/services`, `/api/locations`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/locations` | Public | List all active locations |
| `POST` | `/api/locations` | Admin | Create a new location branch |
| `GET` | `/api/services` | Public | List services with live queue stats & wait times |
| `POST` | `/api/services` | Admin | Create a new service department |
| `PUT` | `/api/services/:id` | Admin/Staff | Update service details or toggle intake open/closed |

### Queue Operations (`/api/queue`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/queue/join` | Customer | Claim a unique token for a service |
| `GET` | `/api/queue/my-active` | Customer | Get user's active tokens with live standing |
| `GET` | `/api/queue/my-history` | Customer | Get user's past token history |
| `GET` | `/api/queue/track/:token` | Public | Track any token's real-time position |
| `PUT` | `/api/queue/:id/cancel` | Customer/Staff | Cancel a waiting token |
| `GET` | `/api/queue/service/:id` | Staff/Admin | Full queue list and serving state for counter |
| `POST` | `/api/queue/service/:id/call-next` | Staff/Admin | Call next customer in sequential line |
| `PUT` | `/api/queue/:id/status` | Staff/Admin | Transition status (`serving`, `completed`, `skipped`) |

### Administration (`/api/admin`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/stats` | Admin | System statistics & today's token throughput |
| `GET` | `/api/admin/staff` | Admin | List all staff & operator accounts |
| `POST` | `/api/admin/staff` | Admin | Create staff account with assigned service |
| `PUT` | `/api/admin/staff/:id` | Admin | Update staff role or toggle active state |

---

## 🧪 Automated Testing

QueueLess includes an automated integration test suite:

```bash
cd backend
npm test
```

### What the test suite validates:
1. **Database Schema & Models**: User password hashing via bcrypt, uniqueness constraints.
2. **Safe Token Generation**: Sequential token generation (`PASS-001`, `PASS-002`) and duplicate active ticket prevention.
3. **Queue Position & Wait Algorithm**: Accurate calculation of people ahead and dynamic estimated wait minutes.
4. **Staff Queue Transitions**: Calling next customer, serving, and completion timestamp recording.
5. **Customer Cancellation**: Verification that cancelled entries release queue position.
6. **Role Permissions Guard**: Ensures customers cannot access staff/admin endpoints.

---

## 🚀 Deployment Instructions

### 1. Database (MongoDB Atlas)
- Setup free cluster as described in [Database Setup](#option-a-mongodb-atlas-cloud---recommended--free).
- Obtain your connection URI: `mongodb+srv://...`

### 2. Backend Deployment (Render.com or Railway.app)
1. Push your repository to GitHub.
2. Create a new **Web Service** on [Render](https://render.com).
3. Connect your repository and configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add Environment Variables in Render dashboard:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGODB_URI`: `<Your MongoDB Atlas Connection String>`
   - `JWT_SECRET`: `<Generate a random 32+ character string>`
   - `CLIENT_ORIGIN`: `<Your frontend URL once deployed>`
5. Copy your live backend URL (e.g. `https://queueless-api.onrender.com`).

### 3. Frontend Deployment (Vercel or Netlify)
1. Go to [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
2. Connect your GitHub repository.
3. Configure project settings:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variable:
   - `VITE_API_BASE_URL`: `https://queueless-api.onrender.com/api`
5. Deploy! Your QueueLess application is now live on the internet.

---

## 📄 Git & GitHub Setup

To publish this project to your GitHub account:

```bash
# 1. Initialize git repository
git init

# 2. Stage all files
git add .

# 3. Create initial commit
git commit -m "feat: complete QueueLess virtual queue management system"

# 4. Link your GitHub remote repository
git remote add origin https://github.com/<your-username>/queueless.git

# 5. Push to main branch
git branch -M main
git push -u origin main
```

---

## 👥 Academic Project Information

- **Project Title:** QueueLess — Virtual Queue Management System
- **Student Name:** [Your Name / Student ID]
- **Degree / Course:** [Degree Name, e.g. B.Tech / B.Sc Computer Science]
- **Institution:** [College / University Name]
- **Academic Year:** 2026
