
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

---

### Day 5 - Strava OAuth Refactor (02 Jan 2026)
What we did
- Fixed Strava OAuth failures caused by React 18 StrictMode double-running useEffect
- Added a guard to ensure the authorization code is exchanged exactly once
- Removed the temporary environment-token bypass
- App now relies solely on OAuth-issued tokens

Centralised authentication logic:
- Created auth/ folder for token storage, exchange, and refresh
- Added a token manager to return a valid access token and refresh automatically
- Centralised Strava API calls in api/strava.ts

Refactored Dashboard.tsx to be UI-only:
- No OAuth or localStorage logic
- Renders activities, loading/error states, and connect CTA
- Refactored AuthCallback.tsx to a single responsibility:
- Exchange code → save tokens → redirect
- Restored dashboard styling using existing index.css
- Added a reusable Connect with Strava button component

Updated README to document:
- OAuth flow
- StrictMode behaviour
- Project structure and environment variables

Key learnings
- OAuth authorization codes are single-use
- React 18 StrictMode can surface real-world side-effect bugs
- Token logic must be idempotent and centralised
- Separating auth, API, and UI logic dramatically simplifies components

Current state
✅ OAuth working end-to-end
✅ Tokens stored and refreshed correctly
✅ Dashboard loads activities reliably
✅ Clean, maintainable structure in place

🚀 Next Planned Steps
## Future
- UI/visual restyling and polish
- Possibly add logout / disconnect
- Introduce charts/graphs for activity summaries
- Unit tests


┌────────────────────────────────────────────────────┐
│                     Browser                        │
│                                                    │
│  ┌──────────────────────────────────────────────┐ │
│  │              App Shell / Router               │ │
│  │                                              │ │
│  │  Routes:                                     │ │
│  │   /              → Home / Landing             │ │
│  │   /dashboard     → Dashboard                  │ │
│  │   /auth/callback → AuthCallback               │ │
│  └───────────────┬──────────────────────────────┘ │
│                  │                                │
│                  ▼                                │
│  ┌──────────────────────────────────────────────┐ │
│  │            Home Page (/)                      │ │
│  │  - Landing / intro                            │ │
│  │  - Navigation to Dashboard                    │ │
│  └──────────────────────────────────────────────┘ │
│                                                    │
│                  ┌──────────────────────────────┐ │
│                  │                              │ │
│                  ▼                              │ │
│  ┌──────────────────────────────────────────────┐ │
│  │        Dashboard Page (/dashboard)            │ │
│  │                                              │ │
│  │  - UI only                                   │ │
│  │  - Calls getRecentActivities()                │ │
│  │  - Shows loading / error / empty states       │ │
│  │  - If NOT authenticated → shows Connect btn   │─┼─────┐
│  └───────────────┬──────────────────────────────┘ │     │
│                  │                                │     │ OAuth redirect
│                  ▼                                │     ▼
│  ┌──────────────────────────────────────────────┐ │  ┌───────────────┐
│  │            api/strava.ts                      │ │  │     Strava     │
│  │  - All Strava API requests                    │ │  │ Authorization │
│  └───────────────┬──────────────────────────────┘ │  └───────┬───────┘
│                  │                                │          │
│                  ▼                                │          │ ?code=...
│  ┌──────────────────────────────────────────────┐ │          ▼
│  │       auth/tokenManager.ts                    │ │  ┌──────────────────────┐
│  │  - Load tokens                               │ │  │ AuthCallback (/auth/  │
│  │  - Check expiry                              │ │  │ callback)             │
│  │  - Refresh if required                       │ │  │  - guard double-run   │
│  │  - Return valid access token                 │ │  │  - exchange code      │
│  └───────────────┬──────────────────────────────┘ │  │  - save tokens         │
│                  │                                │  │  - redirect /dashboard │
│                  ▼                                │  └──────────────────────┘
│  ┌──────────────────────────────────────────────┐ │
│  │           auth/storage.ts                     │ │
│  │  - localStorage read/write/clear              │ │
│  └──────────────────────────────────────────────┘ │
│                                                    │
└───────────────────────┬────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────┐
│                     Backend                        │
│                                                    │
│  POST /api/strava/exchange                          │
│   - Exchanges code → access/refresh tokens           │
│                                                    │
│  POST /api/strava/refresh                           │
│   - Refreshes access token when expired              │
│                                                    │
│  (Client secret lives only here)                    │
└────────────────────────────────────────────────────┘


🔐 OAuth Flow

User navigates to Dashboard (/dashboard)

If the user is not authenticated, Dashboard shows Connect with Strava

Clicking Connect redirects the user to Strava’s authorization page

Strava redirects back to:

/auth/callback?code=...

AuthCallback.tsx exchanges the single-use code via the backend, stores:

access_token

refresh_token

expires_at

User is redirected back to /dashboard

All API calls use a central token manager which refreshes tokens automatically when expired

React 18 StrictMode note: In dev mode, effects can run twice. The callback includes a guard so the code is exchanged only once (Strava codes are single-use).