// src/pages/Dashboard.tsx
import ActivityList from "../components/ActivityList";
import { mockActivities } from "../data/mockActivities";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">
          Mock view of your last 10 activities.
        </p>
      </header>

      <ActivityList activities={mockActivities} />
    </div>
  );
}
