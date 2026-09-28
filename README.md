# 🌟 SkillSwap - Full Stack MERN Application
> **Tagline:** "Exchange Skills, Not Money" | **Course:** 25CS022 (MERN Stack)

A complete MERN stack web platform where students and professionals exchange skills (e.g. Coding for Guitar, UI/UX for Spanish) using a barter-based Skill Points credit economy.

---

## 🚀 How to Run the Project

### Option 1: From the Root Directory (Recommended)
```bash
# Terminal 1: Start backend server
npm run backend

# Terminal 2: Start frontend client
npm run frontend
```

---

### Option 2: Running Services Individually

#### 1. Backend API Server (Node.js + Express)
```bash
cd backend
npm install
npm run seed      # (Optional) Seed initial skill catalog into MongoDB
npm start         # Runs API on http://localhost:5000
```

#### 2. Frontend Web Client (React 18 + Vite)
```bash
cd frontend
npm install
npm run dev       # Runs Vite dev server on http://localhost:5173
```

---

## 📁 Project Architecture

```
project/
├── backend/                   # 🚀 Node.js + Express + MongoDB Backend
│   ├── models/                # 💾 Mongoose Schemas (User, Skill, Request, Transaction)
│   ├── routes/                # 🛣️ Express REST API Endpoints
│   ├── seed.js                # Database seeder with sample skills & user
│   ├── server.js              # Server entry point & MongoDB connection
│   ├── .env.example           # Environment configuration template
│   └── package.json           # Backend dependencies
│
├── frontend/                  # ⚛️ React 18 + Vite Frontend
│   ├── src/                   # React components, layout, context, App.jsx
│   ├── public/                # Static public assets & icons
│   ├── index.html             # HTML entry template
│   ├── vite.config.js         # Vite build configuration
│   └── package.json           # Frontend dependencies
│
└── package.json               # Root convenience runner
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
