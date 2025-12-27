// src/components/ActivityList.tsx
import type { Activity } from "../types/activity";

type ActivityListProps = {
  activities: Activity[];
};

function formatMinutesToHhMm(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} min`;
  return `${hours}h ${mins.toString().padStart(2, "0")}m`;
}

const cardBaseStyle: React.CSSProperties = {
  borderRadius: "10px",
  padding: "0.9rem 1.1rem",
  border: "1px solid #eee",
  backgroundColor: "#fff",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "1rem",
};

const typeBadgeBaseStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "0.15rem 0.5rem",
  borderRadius: "999px",
  fontSize: "0.75rem",
  fontWeight: 600,
};

function getTypeBadgeStyle(type: Activity["type"]): React.CSSProperties {
  const base = { ...typeBadgeBaseStyle };

  switch (type) {
    case "Ride":
      return {
        ...base,
        backgroundColor: "#ff7f32", // Strava-ish orange
        color: "#fff",
      };
    case "Run":
      return {
        ...base,
        backgroundColor: "#2d7ff9",
        color: "#fff",
      };
    case "Swim":
      return {
        ...base,
        backgroundColor: "#00a6a6",
        color: "#fff",
      };
    default:
      return {
        ...base,
        backgroundColor: "#e0e0e0",
        color: "#333",
      };
  }
}

export default function ActivityList({ activities }: ActivityListProps) {
  if (activities.length === 0) {
    return <p>No activities to show yet.</p>;
  }

  return (
    <div
      style={{
        display: "grid",
        gap: "0.75rem",
      }}
    >
      {activities.map((activity) => (
        <article
          key={activity.id}
          style={cardBaseStyle}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "1rem",
              }}
            >
              {activity.name}
            </h2>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginTop: "0.35rem",
              }}
            >
              <span style={getTypeBadgeStyle(activity.type)}>
                {activity.type}
              </span>
              <span
                style={{
                  fontSize: "0.9rem",
                  color: "#555",
                }}
              >
                {activity.distanceKm.toFixed(1)} km ·{" "}
                {formatMinutesToHhMm(activity.movingTimeMinutes)}
              </span>
            </div>
            <p
              style={{
                margin: "0.35rem 0 0",
                fontSize: "0.8rem",
                color: "#777",
              }}
            >
              {new Date(activity.date).toLocaleDateString()}
            </p>
          </div>

          <div
            style={{
              textAlign: "right",
              fontSize: "0.9rem",
              color: "#444",
              minWidth: "90px",
            }}
          >
            <div
              style={{
                fontWeight: 600,
              }}
            >
              {activity.distanceKm.toFixed(1)} km
            </div>
            <div>{formatMinutesToHhMm(activity.movingTimeMinutes)}</div>
          </div>
        </article>
      ))}
    </div>
  );
}
