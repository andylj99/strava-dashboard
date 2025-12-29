
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

🚀 Next Planned Steps

## Later today
- Add loading / error states to Dashboard
- Add a “Connect Strava” button that links to the Strava OAuth flow
- Prepare a placeholder for showing real data once authenticated

## Future

- Implement OAuth callback page and token exchange
- Fetch real activity data from Strava API
- Style up authentication and state transitions
- Introduce charts/graphs for activity summaries


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
