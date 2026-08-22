# AiraFi — Personal Expense Tracker

Full-stack MERN expense tracker. Split-schema architecture (User / Profile / Transaction),
hybrid cache totals on Profile, atomic updates, compound-indexed transaction history,
JWT auth, and a sky-blue pastel React frontend.

```
airafi/
├── server/   # Express + MongoDB API
└── client/   # React + Vite + Tailwind v4 frontend
```

## 1. Backend setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env`:
- `MONGO_URI` — your local MongoDB (`mongodb://127.0.0.1:27017/airafi`) or an Atlas connection string
- `JWT_SECRET` — any long random string
- `PORT` — defaults to 8000 (5000 is avoided — see AirPlay note below)

```bash
npm run dev      # nodemon, auto-restarts on file changes
# or
npm start
```

Health check: `GET http://localhost:8000/api/health`

## 2. Frontend setup

```bash
cd client
npm install
cp .env.example .env   # VITE_API_URL should point at your running backend
npm run dev
```

Open `http://localhost:5173`.

## 3. Full user flow

1. **Register** (`/register`) — creates identity (username, email, password)
2. **Onboarding** (`/onboarding`) — sets full name + optional starting balance, creates the linked `Profile`
3. **Dashboard** (`/dashboard`) — Net Balance / Total Income / Total Expense, add transactions
4. **Ledger** (`/ledger`) — search (fuzzy, case-insensitive) + month filter, edit/delete transactions

Every transaction create/edit/delete updates the cached Profile totals atomically via MongoDB's
`$inc` — the dashboard never runs a collection-wide aggregation.

## 4. Known environment notes (carried over from the original spec)

- **Port 5000 AirPlay conflict** (macOS): backend defaults to port 8000 instead.
- **dotenvx crash**: `dotenv` is pinned to `16.4.5` in `server/package.json` — do not upgrade
  past this without checking for the `dotenvx` breaking change.
- **Double-hash bug**: onboarding links the Profile to the User via `User.findByIdAndUpdate`,
  never a second `.save()` on a `User` document, so the password-hashing `pre('save')` hook
  never re-fires.