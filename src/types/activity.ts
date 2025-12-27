// src/types/activity.ts

export type ActivityType = "Ride" | "Run" | "Swim" | "Workout";

export interface Activity {
  id: number;
  name: string;
  type: ActivityType;
  distanceKm: number;
  movingTimeMinutes: number;
  date: string; // ISO date string for now
}
