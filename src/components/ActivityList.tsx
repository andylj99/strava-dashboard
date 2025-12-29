import type { Activity } from "../types/activity";
import { formatMinutesToHhMm } from "../utils/format";

type ActivityListProps = {
  activities: Activity[];
};

function getBadgeClass(type: Activity["type"]): string {
  const base = "activity-type-badge";

  switch (type) {
    case "Ride":
      return `${base} activity-type-badge--ride`;
    case "Run":
      return `${base} activity-type-badge--run`;
    case "Swim":
      return `${base} activity-type-badge--swim`;
    case "Workout":
    default:
      return `${base} activity-type-badge--workout`;
  }
}

export default function ActivityList({ activities }: ActivityListProps) {
  if (activities.length === 0) {
    return <p className="empty-state">No activities to show yet.</p>;
  }

  return (
    <div className="activity-list">
      {activities.map((activity) => (
        <article key={activity.id} className="activity-card">
          <div className="activity-main">
            <h2 className="activity-name">{activity.name}</h2>

            <div className="activity-meta-row">
              <span className={getBadgeClass(activity.type)}>
                {activity.type}
              </span>
              <span>
                {activity.distanceKm.toFixed(1)} km ·{" "}
                {formatMinutesToHhMm(activity.movingTimeMinutes)}
              </span>
            </div>

            <p className="activity-date">
              {new Date(activity.date).toLocaleDateString()}
            </p>
          </div>

          <div className="activity-summary">
            <div className="activity-summary-main">
              {activity.distanceKm.toFixed(1)} km
            </div>
            <div>{formatMinutesToHhMm(activity.movingTimeMinutes)}</div>
          </div>
        </article>
      ))}
    </div>
  );
}
