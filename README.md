
# strava-dashboard

A personal learning project built with **React**, **TypeScript**, and **Vite**, focused on integrating with the Strava API using OAuth and building a maintainable, testable frontend architecture.

---

## Tech Stack

- React 18
- TypeScript
- Vite
- Vitest (testing)
- Strava API (via backend proxy)

---

## Testing

This project uses **Vitest** with a **jsdom** environment.

### Run tests

- Watch mode:
  - `npm test`
- Single run:
  - `npm run test:run`

### Auth coverage

Auth logic has unit test coverage for:
- `src/auth/storage.ts` (persist/load/clear tokens)
- `src/auth/tokenManager.ts` (expiry handling + refresh + single-flight refresh)
- `src/auth/api.ts` (token exchange + refresh via backend endpoints)

## 📝 Development Log

## Day 1 — Project Setup & Git Learning (26 Dec 2025)
- Created new Vite + React + TypeScript project
- Initialized repo and connected to GitHub
- Set up initial file structure under `src/`
- Added first reusable layout structure and home page
- Practiced resolving Git conflicts and finishing a rebase
- Successfully pushed clean code to main

**Key learning:** Deeper understanding of Git workflows (rebasing, staging, commit editing)

---

## Day 2 — Routing & Dashboard Mock (27 Dec 2025)
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

## Day 3 — Styling & Strava Integration Prep (29 Dec 2025)

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

## Day 4 - Integrating with Strava (31 Dec 2025)

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

## Day 5 - Strava OAuth Refactor (02 Jan 2026)
What I did
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

---

## Day 6 — Auth Testing & Hardening (04 Jan 2026)

**Focus:** Adding automated tests to stabilise Strava OAuth and token handling

### What I did
Today focused on turning a fragile-but-working OAuth flow into something I can change with confidence.

I added a full test setup using **Vitest** and implemented unit tests around the core authentication layers of the app:

- **Token storage (`storage.ts`)**
  - Verified tokens are correctly saved, loaded, validated, and cleared from `localStorage`
  - Guarded against partial or corrupt token state

- **Token lifecycle management (`tokenManager.ts`)**
  - Tested access-token expiry logic, including an early refresh buffer (60s)
  - Verified refresh behaviour when tokens are expired
  - Ensured tokens are cleared if refresh fails
  - Tested *single-flight refresh* so concurrent API calls only trigger **one** refresh request

- **Auth API calls (`api.ts`)**
  - Tested backend proxy endpoints for:
    - OAuth code exchange
    - Token refresh
  - Verified request payloads and error handling

All tests are green and run reliably in a browser-like test environment (`jsdom`).

---

### How the tests work

The test setup mirrors runtime behaviour while keeping tests fast and deterministic:

- **Vitest** is used as the test runner (Vite-native, TypeScript-friendly)
- **jsdom** provides browser APIs such as `localStorage`
- **fetch** is stubbed in tests to simulate backend responses (success and failure cases)
- External boundaries (`fetch`, storage, time) are mocked, while internal logic is tested end-to-end

Key principles:
- Test **behaviour**, not implementation details
- Mock only at module boundaries (storage and API calls)
- Make auth logic deterministic and safe under concurrency

This allows safe refactoring of OAuth and token refresh logic without fear of:
- stale tokens being reused
- silent refresh failures
- duplicate concurrent refresh calls

---

### Outcome
- Authentication is now covered by fast, deterministic unit tests
- OAuth and token refresh logic is stable and future-proof
- The app is well positioned for adding further Strava API integrations

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

OAuth Flow Summary

1. User navigates to /dashboard
2. If not authenticated, a Connect with Strava button is shown
3. User is redirected to Strava authorisation
4. Strava redirects back to /auth/callback?code=...
5. The code is exchanged via the backend
6. Tokens are stored (access_token, refresh_token, expires_at)
7. User is redirected back to /dashboard
8. All API calls use a central token manager which refreshes tokens automatically

Note on React 18 StrictMode
In development, effects may run twice. The auth callback includes a guard to ensure the Strava authorisation code (single-use) is exchanged exactly once.