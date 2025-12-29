// src/pages/Dashboard.tsx
import { useState } from "react";
import ActivityList from "../components/ActivityList";
import { mockActivities } from "../data/mockActivities";
import { buildStravaAuthUrl } from "../config/strava";
import type { Activity } from "../types/activity";

export default function Dashboard() {
  const [activities] = useState<Activity[]>(mockActivities);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  const authUrl = buildStravaAuthUrl();

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: "1rem",
          }}>
            <div>
                <h1 className="dashboard-title">Dashboard</h1>
                <p className="dashboard-subtitle">
                    Mock view of your last 10 activities.
                </p>
            </div>
            <a href={authUrl} className="strava-auth-link">Connect Strava</a>
        </div>
      </header>

      {isLoading && (
        <p className="status-message status-message--loading">
          Loading activities…
        </p>
      )}

      {error && (
        <p className="status-message status-message--error">
          {error}
        </p>
      )}

      <ActivityList activities={mockActivities} />
    </div>
  );
}
