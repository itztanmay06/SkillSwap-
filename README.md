# 🌟 SkillSwap - Full Stack MERN Application
> **Tagline:** "Exchange Skills, Not Money" | **Course:** 25CS022 (MERN Stack)

A complete MERN stack web platform where students and professionals exchange skills (e.g. Coding for Guitar, UI/UX for Spanish) using a barter-based Skill Points credit economy.

---

## 🚀 How to Run the Complete Project

### 1. Start the Backend API Server
```bash
# Navigate to the server folder
cd server

# Install dependencies (Express, Mongoose, Cors, Dotenv)
npm install

# (Optional) Seed initial skills into the database
npm run seed

# Start the backend server
npm start
```
> The API server will be live at: `http://localhost:5000`

### 2. Start the Frontend React App
Open a second terminal window:
```bash
# In the root project directory:
npm install

# Start Vite dev server
npm run dev
```
> The application will open at: `http://localhost:5173`

---

## 📁 Project Architecture

```
project/
├── server/                    # 🚀 Node.js + Express + MongoDB Backend
│   ├── models/                # 💾 Mongoose Schemas
│   │   ├── User.js            # User profile, wallet points & credentials
│   │   ├── Skill.js           # Skills catalog & provider details
│   │   ├── Request.js         # Exchange requests (Pending/Accepted/Declined)
│   │   └── Transaction.js     # Wallet point credits & debits
│   ├── routes/                # 🛣️ Express REST API Endpoints
│   │   ├── authRoutes.js      # /api/auth (Register, Login, Profile)
│   │   ├── skillRoutes.js     # /api/skills (Catalog, Search, Add Skill)
│   │   ├── requestRoutes.js   # /api/requests (Send, Accept, Reject)
│   │   └── walletRoutes.js    # /api/wallet (Transactions, Add Points)
│   ├── seed.js                # Database seeder with sample skills & user
│   ├── server.js              # Server entry point & MongoDB connection
│   └── package.json           # Server dependencies
│
└── src/                       # ⚛️ React 18 + Vite Frontend
    ├── components/            # UI Pages (Dashboard, Explore, Requests, Wallet, Profile, Auth)
    ├── layout/                # Header, Sidebar, Modals, SVG Icons
    ├── context.jsx            # Global state manager & API connection
    ├── App.jsx                # Main Application Layout
    └── main.jsx               # Entry React root
```

---

## 🛣️ Backend REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new user (+200 welcome points) |
| `POST` | `/api/auth/login` | Login user & verify credentials |
| `GET` | `/api/auth/user/:email` | Get user profile and wallet points |
| `GET` | `/api/skills` | Get all skills (supports `?category=` and `?search=`) |
| `POST` | `/api/skills` | Add/Publish a new skill |
| `GET` | `/api/requests` | Fetch exchange requests for logged-in user |
| `POST` | `/api/requests` | Send a new exchange request & lock escrow points |
| `PUT` | `/api/requests/:id/accept` | Accept request & credit points to provider |
| `PUT` | `/api/requests/:id/reject` | Decline request & refund points |
| `GET` | `/api/wallet/transactions/:email` | Get transaction ledger history |
| `POST` | `/api/wallet/add-points` | Top up points in wallet |

---

## 💡 Key Features
1. **Skill Points Economy:** No real money exchanged; users earn points by teaching and spend points to learn.
2. **Escrow Guarantee:** Points are reserved when a request is sent, and transferred to the provider upon completion.
3. **Resilient Data Sync:** Frontend seamlessly syncs with the Express API and MongoDB, with graceful offline fallbacks.
