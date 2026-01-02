// src/pages/Dashboard.tsx
import { useState, useEffect } from "react";
import ActivityList from "../components/ActivityList";
import { mockActivities } from "../data/mockActivities";
import { buildStravaAuthUrl } from "../config/strava";
import { fetchRecentActivities } from "../services/stravaApi";
import type { Activity } from "../types/activity";

export default function Dashboard() {
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const authUrl = buildStravaAuthUrl();

  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("strava_access_token");

    const token = tokenFromLocalStorage;

    if (!token) {
      console.log("No Strava access token found in localStorage. User not authenticated.");
      setIsConnected(false);
      return;
    }

    console.log("Using token source:", {
      fromLocalStorage: !!tokenFromLocalStorage,
    });

    setIsConnected(true);
    setIsLoading(true);
    setError(null);

    fetchRecentActivities(token)
      .then((realActivities) => {
        console.log("Fetched activities:", realActivities.length);
        if (realActivities.length > 0) {
          setActivities(realActivities);
        }
      })
      .catch((err) => {
        console.error(err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load Strava activities."
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: "1rem",
          }}
        >
          <div>
            <h1 className="dashboard-title">Dashboard</h1>
            <p className="dashboard-subtitle">
              Last 10 activities (Strava if a token is available, otherwise
              mock data).
            </p>
          </div>

          {isConnected ? (
            <span className="status-message status-message--loading">
              Strava connected
            </span>
          ) : (
            <a href={authUrl} className="primary-button">
              Connect Strava
            </a>
          )}
        </div>
      </header>

      {isLoading && (
        <p className="status-message status-message--loading">
          Loading activities…
        </p>
      )}

      {error && (
        <p className="status-message status-message--error">{error}</p>
      )}

      <ActivityList activities={activities} />
    </div>
  );
}
