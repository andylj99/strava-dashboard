// src/pages/Dashboard.tsx
import ActivityList from "../components/ActivityList";
import { mockActivities } from "../data/mockActivities";

export default function Dashboard() {
  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <header
        style={{
          marginBottom: "1.5rem",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "1.8rem",
          }}
        >
          Dashboard
        </h1>
        <p
          style={{
            margin: "0.5rem 0 0",
            color: "#555",
          }}
        >
          Mock view of your last 10 activities.
        </p>
      </header>

      <ActivityList activities={mockActivities} />
    </div>
  );
}
