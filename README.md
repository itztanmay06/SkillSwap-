# Skill Swap - Frontend (React.js)
> **Tagline:** "Exchange Skills, Not Money" | **Course:** 25CS022

## 🚀 How to Run the Application

```bash
# 1. Install dependencies
npm install

# 2. Start the local development server
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 📁 Ultra-Simple Flat Project Structure

```
src/
│
├── context.jsx        🧠 The Brain (State Manager): Holds points balance, requests, and LocalStorage
├── data.js           💾 Database (Mock Data): Tanmay's profile, skills catalog, activities, reviews
├── App.jsx           🧩 Main App Layout: Connects Header, Sidebar, Pages, and Modals
├── App.css           🎨 Styling for all cards, buttons, and layout
├── index.css         🔤 Global font, reset, and theme variables
├── main.jsx          🚀 React entry point
│
└── components/       🖼️ All UI Screens (Flat in one folder):
    ├── Sidebar.jsx   📌 Left navigation bar with Skill Swap logo
    ├── Header.jsx    🔝 Top bar with greeting, search, and notifications
    ├── Dashboard.jsx 📊 Main Dashboard (4 Metric cards, Recommended skills, Activity, Promo banner)
    ├── Explore.jsx   🔍 Browse and search skills by category
    ├── Requests.jsx  📋 Accept, reject, and complete skill exchanges (Auto point transfer)
    ├── Wallet.jsx    💰 Skill Points wallet & transaction ledger
    ├── Profile.jsx   👤 User profile, bio editor & skills wishlist
    ├── Messages.jsx  💬 Direct messaging between partners
    ├── Reviews.jsx   ⭐ Community rating breakdown & peer testimonials
    ├── Settings.jsx  ⚙️ Account settings & 1-click Demo Data Reset
    └── Modals.jsx    🪟 All pop-up dialogs (Request Skill, Offer Skill, Peer Profile)
```

---

## 💡 How Features Work (Summary)

1. **Dashboard:**
   - 4 live metric cards: **Skill Points (250)**, **Active Requests (3)**, **Completed (12)**, **Rating (4.8)**.
   - Recommended skills with direct *Request* & *View Profile* buttons.
   - Live activity timeline.

2. **Skill Exchange Workflow:**
   - Browse any skill in **Explore** $\rightarrow$ Click **Request Exchange** $\rightarrow$ Select duration (1–4 hrs) $\rightarrow$ Points are calculated $\rightarrow$ Request is submitted.
   - In **Requests**, incoming requests can be **Accepted**, **Declined**, or marked **Completed**.
   - Marking a session as completed **transfers points automatically** to the provider's wallet and creates a transaction record!

3. **Data Persistence:**
   - Everything uses browser `localStorage`, so any requests sent, skills added, or points earned stay saved across refreshes.
   - Click **"Reset Demo Data"** anytime in the sidebar or settings to reset back to initial showcase state.
