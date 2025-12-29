// src/services/stravaApi.ts
import { STRAVA_API_BASE_URL } from "../config/strava";
import type { Activity } from "../types/activity";

export interface StravaActivitySummary {
  id: number;
  name: string;
  type: string;
  distance: number; // metres
  moving_time: number; // seconds
  start_date: string; // ISO string
}

export function mapStravaActivityToActivity(
  stravaActivity: StravaActivitySummary
): Activity {
  return {
    id: stravaActivity.id,
    name: stravaActivity.name,
    type:
      stravaActivity.type === "Ride" ||
      stravaActivity.type === "Run" ||
      stravaActivity.type === "Swim" ||
      stravaActivity.type === "Workout"
        ? stravaActivity.type
        : "Workout",
    distanceKm: stravaActivity.distance / 1000,
    movingTimeMinutes: Math.round(stravaActivity.moving_time / 60),
    date: stravaActivity.start_date,
  };
}

export async function fetchRecentActivities(
  accessToken: string,
  perPage = 10
): Promise<Activity[]> {
  const url = `${STRAVA_API_BASE_URL}/athlete/activities?per_page=${perPage}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Strava activities: ${response.status} ${response.statusText}`
    );
  }

  const data = (await response.json()) as StravaActivitySummary[];

  return data.map(mapStravaActivityToActivity);
}