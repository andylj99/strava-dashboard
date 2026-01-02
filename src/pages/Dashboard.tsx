import { useEffect, useState } from "react";
import { getRecentActivities } from "../api/strava";
import StravaConnectButton from "../auth/StravaConnectButton";

type StravaActivity = {
  id: number;
  name: string;
  type: string;
  distance: number; // meters
  moving_time: number; // seconds
  start_date: string; // ISO string
};

function badgeClass(type: string) {
  const t = (type || "").toLowerCase();
  if (t.includes("ride")) return "activity-type-badge activity-type-badge--ride";
  if (t.includes("run")) return "activity-type-badge activity-type-badge--run";
  if (t.includes("swim")) return "activity-type-badge activity-type-badge--swim";
  return "activity-type-badge activity-type-badge--workout";
}

function formatKm(meters: number) {
  return `${(meters / 1000).toFixed(1)} km`;
}

function formatMins(seconds: number) {
  return `${Math.round(seconds / 60)} min`;
}

export default function Dashboard() {
  const [activities, setActivities] = useState<StravaActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = (await getRecentActivities(10)) as StravaActivity[];
        if (!cancelled) setActivities(data);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to load activities");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const notAuthed =
    (error ?? "").toLowerCase().includes("not authenticated") ||
    (error ?? "").toLowerCase().includes("no token");

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">
          Recent Strava activities
          {notAuthed ? " — connect your account to load data." : "."}
        </p>

        {notAuthed && <StravaConnectButton />}
      </div>

      {loading && (
        <div className="status-message status-message--loading">
          Loading activities…
        </div>
      )}

      {!loading && error && (
        <div className="status-message status-message--error">{error}</div>
      )}

      {!loading && !error && activities.length === 0 && (
        <div className="empty-state">No activities found.</div>
      )}

      {!loading && !error && activities.length > 0 && (
        <div className="activity-list">
          {activities.map((a) => (
            <div key={a.id} className="activity-card">
              <div className="activity-main">
                <p className="activity-name">{a.name}</p>
                <div className="activity-meta-row">
                  <span className={badgeClass(a.type)}>{a.type}</span>
                  <span>{formatKm(a.distance)}</span>
                  <span>•</span>
                  <span>{formatMins(a.moving_time)}</span>
                </div>
                <p className="activity-date">
                  {new Date(a.start_date).toLocaleDateString()}
                </p>
              </div>

              <div className="activity-summary">
                <div className="activity-summary-main">{formatKm(a.distance)}</div>
                <div>{formatMins(a.moving_time)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
