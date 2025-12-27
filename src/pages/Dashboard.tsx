// src/pages/Dashboard.tsx
import ActivityList from "../components/ActivityList";
import type { Activity } from "../types/activity";

const mockActivities: Activity[] = [
  {
    id: 1,
    name: "Evening Ride",
    type: "Ride",
    distanceKm: 42.7,
    movingTimeMinutes: 95,
    date: "2025-12-20T18:30:00Z",
  },
  {
    id: 2,
    name: "Commute to work",
    type: "Ride",
    distanceKm: 16.3,
    movingTimeMinutes: 38,
    date: "2025-12-19T08:10:00Z",
  },
  {
    id: 3,
    name: "Lunchtime Run",
    type: "Run",
    distanceKm: 5.4,
    movingTimeMinutes: 29,
    date: "2025-12-18T12:05:00Z",
  },
  {
    id: 4,
    name: "Zwift Workout",
    type: "Workout",
    distanceKm: 28.1,
    movingTimeMinutes: 60,
    date: "2025-12-17T19:00:00Z",
  },
  {
    id: 5,
    name: "Morning Ride",
    type: "Ride",
    distanceKm: 31.2,
    movingTimeMinutes: 72,
    date: "2025-12-16T07:15:00Z",
  },
  {
    id: 6,
    name: "Recovery Spin",
    type: "Ride",
    distanceKm: 20.0,
    movingTimeMinutes: 50,
    date: "2025-12-15T17:45:00Z",
  },
  {
    id: 7,
    name: "Hill Repeats",
    type: "Ride",
    distanceKm: 18.5,
    movingTimeMinutes: 56,
    date: "2025-12-14T10:00:00Z",
  },
  {
    id: 8,
    name: "Group Ride",
    type: "Ride",
    distanceKm: 75.3,
    movingTimeMinutes: 160,
    date: "2025-12-13T09:00:00Z",
  },
  {
    id: 9,
    name: "Easy Run",
    type: "Run",
    distanceKm: 6.0,
    movingTimeMinutes: 34,
    date: "2025-12-12T18:00:00Z",
  },
  {
    id: 10,
    name: "Cafe Spin",
    type: "Ride",
    distanceKm: 40.5,
    movingTimeMinutes: 100,
    date: "2025-12-11T09:30:00Z",
  },
];

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
