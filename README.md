# Personal Finance Tracker

A full-stack web app for tracking income and expenses, with authentication,
a database, and interactive charts. Built as a portfolio project.

## Tech Stack
- **Frontend:** React (Vite), React Router, Recharts, Axios
- **Backend:** Node.js, Express, JWT authentication, bcrypt password hashing
- **Database:** SQLite (via better-sqlite3) — zero-config, file-based

## Features
- User signup / login with hashed passwords and JWT-based sessions
- Add, view, and delete transactions (income or expense)
- Dashboard with balance, total income, and total expense
- Pie chart of spending by category
- Bar chart of income vs. expense by month
- Each user only sees their own data

## Project Structure
```
finance-tracker/
├── backend/
│   ├── server.js          # Express app entry point
│   ├── db.js               # SQLite setup + schema
│   ├── middleware/auth.js  # JWT verification middleware
│   └── routes/
│       ├── auth.js         # signup / login
│       └── transactions.js # CRUD + summary stats
└── frontend/
    └── src/
        ├── pages/          # Login, Signup, Dashboard
        ├── components/     # TransactionForm, TransactionList, Charts
        ├── api.js          # Axios instance with auto JWT header
        └── App.jsx         # Routing
```

## Getting Started

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
# Open .env and set JWT_SECRET to any random string
npm run dev
```
The API runs at `http://localhost:5000`. A `finance.db` SQLite file is
created automatically on first run.

### 2. Frontend
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
The app runs at `http://localhost:5173` and proxies `/api` requests to the
backend automatically (see `vite.config.js`).

### 3. Try it out
Open `http://localhost:5173`, sign up for an account, and start adding
transactions.

## Possible Next Steps (good for a v2 commit)
- Per-category monthly budgets with progress bars
- CSV export / import
- Recurring transactions
- Dark mode
- Deploy: frontend to Vercel/Netlify, backend to Render, swap SQLite for
  hosted Postgres (e.g. Neon or Supabase) for a fully cloud-hosted version

## Screenshots
## Screenshots

### Finance Tracker Dashboard

![Finance Tracker Dashboard](./Screenshot%202026-09-19%20224258.png)

### Finance Tracker

![Finance Tracker](./Screenshot%202026-09-19%20224313.png)
