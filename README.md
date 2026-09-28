# 🌟 SkillSwap - Full Stack MERN Application
> **Tagline:** "Exchange Skills, Not Money" | **Course:** 25CS022 (MERN Stack)

A complete MERN stack web platform where students and professionals exchange skills (e.g. Coding for Guitar, UI/UX for Spanish) using a barter-based Skill Points credit economy.

---

## 🚀 How to Run the Complete Project

### Option A: Quick 1-Click Batch Files (Windows)
Double-click:
1. `start-backend.bat` ➔ Starts Node.js Express server on port 5000
2. `start-frontend.bat` ➔ Starts React Vite dev server on port 5173

---

### Option B: From the Root Directory
```bash
# Start backend
npm run backend

# In a separate terminal, start frontend
npm run frontend
```

---

### Option C: Manual Commands in Separate Terminals

#### 1. Start the Backend API Server
```bash
# Navigate to the backend folder
cd backend

# Install dependencies (if not done yet)
npm install

# (Optional) Seed initial skills into the database
npm run seed

# Start the backend server
npm start
```
> The API server will be live at: `http://localhost:5000`

#### 2. Start the Frontend React App
```bash
# Navigate to the frontend folder
cd frontend

# Install dependencies (if not done yet)
npm install

# Start Vite dev server
npm run dev
```
> The application will open at: `http://localhost:5173`

---

## 📁 Project Architecture

```
project/
├── backend/                   # 🚀 Node.js + Express + MongoDB Backend
│   ├── models/                # 💾 Mongoose Schemas (User, Skill, Request, Transaction)
│   ├── routes/                # 🛣️ Express REST API Endpoints
│   ├── seed.js                # Database seeder with sample skills & user
│   ├── server.js              # Server entry point & MongoDB connection
│   └── package.json           # Backend dependencies
│
├── frontend/                  # ⚛️ React 18 + Vite Frontend
│   ├── src/                   # React components, layout, context, App.jsx
│   ├── public/                # Static public assets
│   ├── index.html             # HTML entry template
│   ├── vite.config.js         # Vite configuration
│   └── package.json           # Frontend dependencies
│
├── start-backend.bat          # ⚡ 1-click launcher for backend
├── start-frontend.bat         # ⚡ 1-click launcher for frontend
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
