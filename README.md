# 💸 Payout Management MVP

A full-stack payout management system with role-based access control, built for efficiently managing vendor payouts through a structured approval workflow.

---

## 🌐 Live Demo

| | URL |
|---|---|
| **Frontend** | https://cord4-practical-frontend.vercel.app |
| **Backend API** | https://cord4-practical-backend.vercel.app |

---

## 🎯 What is this project?

This is a **Payout Management MVP** that allows two types of users — **OPS** and **FINANCE** — to collaboratively manage vendor payout requests through a defined approval lifecycle.

- **OPS** users create vendors and initiate payout requests
- **FINANCE** users review submitted payouts and either approve or reject them
- Every action is recorded in an **audit trail** for full transparency

---

## ✨ Features

### 🔐 Authentication
- JWT-based login (stored in localStorage)
- Role-based access enforced on the **backend** (not just frontend)
- Two roles: `OPS` and `FINANCE`

### 🏪 Vendor Management
- List all vendors with status indicators
- Add new vendors with optional UPI ID, bank account, and IFSC

### 📋 Payout Requests
| Status | Who can trigger | Action |
|---|---|---|
| `Draft` | OPS | Create payout |
| `Submitted` | OPS | Submit draft for review |
| `Approved` | FINANCE | Approve submitted payout |
| `Rejected` | FINANCE | Reject with mandatory reason |

- Filter payouts by **status** and **vendor**
- Status transitions are strictly enforced on the backend (no skipping)

### 📜 Audit Trail
- Every action logged: `CREATED`, `SUBMITTED`, `APPROVED`, `REJECTED`
- Records who performed the action + timestamp
- Displayed as a timeline on the payout detail page

---

## 🛠 Tech Stack

### Backend
| Tech | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB Atlas | Cloud database |
| Mongoose | ODM for MongoDB |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT authentication |
| dotenv | Environment config |

### Frontend
| Tech | Purpose |
|---|---|
| React 18 + Vite | UI framework + build tool |
| Redux Toolkit | Global state management |
| React Router v6 | Client-side routing |
| Axios | HTTP API client |
| react-hot-toast | Toast notifications |
| Inter (Google Fonts) | Modern typography |

---

## 🚀 Local Setup (Under 5 Minutes)

### Prerequisites
- Node.js v18+
- npm v8+
- MongoDB Atlas account (or local MongoDB)

---

### 1️⃣ Clone the repository

```bash
git clone https://github.com/bhaveshpatel12041-eng/cord4-practical-backend.git
git clone https://github.com/bhaveshpatel12041-eng/cord4-practical-frontend.git
```

---

### 2️⃣ Backend Setup

```bash
cd cord4-practical-backend
npm install
```

Create / update your `.env` file:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/payoutdb
JWT_SECRET=your_secret_key_here
```

> ⚠️ **Note:** If you're behind a corporate/ISP firewall that blocks MongoDB SRV DNS lookups, the `dns.setServers(['8.8.8.8'])` fix is already applied in `index.js` and `seeder.js`.

**Seed the database** (creates demo users + sample vendors):

```bash
node seeder.js
```

**Start the backend:**

```bash
npm run dev
```

Backend runs at → `http://localhost:5000`

---

### 3️⃣ Frontend Setup

```bash
cd cord4-practical-frontend
npm install
```

Create / update your `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

**Start the frontend:**

```bash
npm run dev
```

Frontend runs at → `http://localhost:5173`

---

## 👤 Demo Credentials

| Role | Email | Password |
|---|---|---|
| OPS | ops@demo.com | ops123 |
| FINANCE | finance@demo.com | fin123 |

---

## 📁 Project Structure

### Backend (`cord4-practical-backend`)
```
├── controllers/
│   ├── authController.js      # Login logic + JWT generation
│   ├── vendorController.js    # Vendor CRUD
│   └── payoutController.js    # Payout ops + audit logging
├── middleware/
│   └── auth.js                # JWT protect + RBAC authorize
├── models/
│   ├── User.js                # User schema (email, password, role)
│   ├── Vendor.js              # Vendor schema
│   ├── Payout.js              # Payout schema with status enum
│   └── PayoutAudit.js         # Audit log schema
├── routes/
│   ├── authRoutes.js          # POST /api/auth/login
│   └── apiRoutes.js           # Vendor + Payout routes
├── db/connect.js              # MongoDB connection
├── seeder.js                  # Seed demo data
├── index.js                   # Express app entry point
└── vercel.json                # Vercel serverless config
```

### Frontend (`cord4-practical-frontend`)
```
src/
├── components/
│   └── Layout.jsx             # Sidebar + nav layout
├── pages/
│   ├── Login.jsx              # Auth page
│   ├── VendorList.jsx         # Vendor listing
│   ├── AddVendor.jsx          # Add vendor form
│   ├── PayoutList.jsx         # Payouts with filters
│   ├── AddPayout.jsx          # Create payout (OPS only)
│   └── PayoutDetail.jsx       # Detail + actions + audit trail
├── store/
│   ├── index.js               # Redux store config
│   └── slices/
│       ├── authSlice.js       # Auth state + JWT
│       ├── vendorSlice.js     # Vendor state + API calls
│       └── payoutSlice.js     # Payout state + API calls
├── utils/api.js               # Axios instance + auth interceptor
├── index.css                  # Global dark design system
└── App.jsx                    # Routes + protected route guards
```

---

## 🔗 API Endpoints

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/api/auth/login` | ❌ | Any | Login and get JWT |
| GET | `/api/vendors` | ✅ | Any | List all vendors |
| POST | `/api/vendors` | ✅ | Any | Add a new vendor |
| GET | `/api/payouts` | ✅ | Any | List payouts (with filters) |
| POST | `/api/payouts` | ✅ | OPS | Create payout draft |
| GET | `/api/payouts/:id` | ✅ | Any | Get payout + audit trail |
| POST | `/api/payouts/:id/submit` | ✅ | OPS | Draft → Submitted |
| POST | `/api/payouts/:id/approve` | ✅ | FINANCE | Submitted → Approved |
| POST | `/api/payouts/:id/reject` | ✅ | FINANCE | Submitted → Rejected |

---

## 🔒 Security Notes

- Passwords are hashed with **bcrypt** (salt rounds: 10)
- JWT tokens expire and are verified on every protected route
- **Role enforcement happens server-side** — the frontend role display is purely cosmetic
- CORS is configured to only allow the deployed frontend origin

---

## 🎨 UI Design

The frontend uses a custom dark design system with:
- **Dark theme** inspired by GitHub's dark mode (`#0d1117`)
- **Inter** font from Google Fonts
- CSS variables for consistent theming
- Smooth hover transitions and micro-animations
- Responsive sidebar navigation

---

## 📝 Assumptions

1. Only the two seeded users can log in (no self-registration)
2. Vendors cannot be edited or deleted once created (read/create only)
3. Payout status transitions are strictly linear — you cannot skip steps
4. Audit trail is append-only and stored in a separate collection

---

## 🙋 Author

Built by **Bhavesh Patel** as part of a full-stack technical assessment.
