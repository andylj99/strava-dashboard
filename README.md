
# strava-dashboard

React + TypeScript + Vite

## 📝 Development Log

### Day 1 — Project Setup & Git Learning (26 Dec 2025)
- Created new Vite + React + TypeScript project
- Initialized repo and connected to GitHub
- Set up initial file structure under `src/`
- Added first reusable layout structure and home page
- Practiced resolving Git conflicts and finishing a rebase
- Successfully pushed clean code to main

**Key learning:** Deeper understanding of Git workflows (rebasing, staging, commit editing)

---

### Day 2 — Routing & Dashboard Mock (27 Dec 2025)
- Installed and configured React Router with browser history
- Added navigation + integrated layout for persistent header
- Created a new Dashboard page (`Dashboard.tsx`)
- Built first typed component (`ActivityList.tsx`)
- Added a domain model using TypeScript (`Activity` interface)
- Rendered a mock “Last 10 activities” list
- Improved UI styling to better resemble a Strava-like dashboard
- Committed clean milestone to GitHub

**Key learning:** Passing typed props, component composition, handling lists, formatting UI-ready data

---

### Day 3 — Styling & Strava Integration Prep (29 Dec 2025)

What I did:
- Moved UI styling out of inline objects into index.css
- Added global layout and dashboard CSS classes for cleaner components
- Created src/utils/format.ts for reusable formatting helpers
- Created src/data/mockActivities.ts to separate data from UI logic
- Introduced Strava OAuth config in src/config/strava.ts
- Scaffolded a Strava API service (fetchRecentActivities) with type mapping

Key learning:
- How separation of concerns improves maintainability (UI vs data vs utilities vs services)
- How to organize code in a scalable structure for future API integration
- Mapping external API data into an internal domain model

---

### Day 4 - Integrating with Strava (31 Dec 2025)

What I did:
- Successfully fetched real Strava activities via a backend proxy
- Switched from mock data to live data when a token is present
- Added token detection + conditional UI states
- Hardened API service structure

What I learned:
- CORS rules block browser → Strava direct fetches
- Best practice: untrusted frontend → backend proxy → Strava API
- Using .env properly for local-only personal tokens
- Testing and debugging real API flows

🚀 Next Planned Steps
## Future
- Implement OAuth callback page and token exchange
- Style up authentication and state transitions
- Introduce charts/graphs for activity summaries
- Unit tests


┌───────────────────────────────────────────┐
│                  UI / Pages               │
│                                           │
│   App.tsx (routing + layout wrapper)      │
│        ├─ Home.tsx                        │
│        └─ Dashboard.tsx                   │
│               │                           │
│               ▼                           │
│     ActivityList.tsx (presentational UI)  │
└───────────────┬───────────────────────────┘
                │ props: Activity[]
                │
                ▼
┌───────────────────────────────────────────┐
│         Data + Domain Model Layer         │
│                                           │
│   types/activity.ts (Activity interface)  │
│   data/mockActivities.ts (temporary data) │
└────────────────┬──────────────────────────┘
                 │ mapping into Activity shape
                 ▼
┌───────────────────────────────────────────┐
│             Service Layer (API)           │
│                                           │
│   services/stravaApi.ts                   │
│     - fetchRecentActivities()             │
│     - mapStravaActivityToActivity()       │
│                                           │
│   config/strava.ts                        │
│     - OAuth URL builder                   │
│     - Config constants                     │
└───────────────────────────────────────────┘


## Strava OAuth (Local Development)

This app uses Strava OAuth to obtain an access token and refresh token.

### Prerequisites
- A Strava API application created in the Strava Developer Portal
- In your Strava app settings:
  - **Authorization Callback Domain**: `localhost`

### Environment variables

Frontend (`.env.local`):
- `VITE_STRAVA_CLIENT_ID=<your_strava_client_id>`

Backend (`server/.env`):
- `STRAVA_CLIENT_ID=<your_strava_client_id>`
- `STRAVA_CLIENT_SECRET=<your_strava_client_secret>`
- `PORT=3001` (or whatever your backend runs on)

### Run locally

1. Start the backend API:
   - `cd server`
   - `npm install`
   - `npm run dev` (or `node index.js` depending on setup)

2. Start the frontend:
   - `npm install`
   - `npm run dev`

### OAuth flow

1. Click **Connect with Strava**
2. Strava redirects back to:
   - `http://localhost:5173/auth/callback?code=...`
3. The frontend calls the backend to exchange the authorization code for tokens.
4. Tokens are stored in localStorage:
   - `strava_access_token`
   - `strava_refresh_token`
   - `strava_token_expires_at`

> Note: In React 18 dev mode, effects can run twice due to StrictMode. The callback handler includes a guard to ensure the authorization code is exchanged only once (authorization codes are single-use).