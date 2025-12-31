// src/config/strava.ts

export const STRAVA_CLIENT_ID = import.meta.env.VITE_STRAVA_CLIENT_ID;
export const STRAVA_REDIRECT_URI = import.meta.env.VITE_STRAVA_REDIRECT_URI;
export const STRAVA_API_BASE_URL =
  import.meta.env.VITE_STRAVA_API_BASE_URL ?? "https://www.strava.com/api/v3";

export const STRAVA_BACKEND_URL =
  import.meta.env.VITE_STRAVA_BACKEND_URL ?? "http://localhost:4000";


// Simple helper to build the OAuth URL (we'll plug this into a "Connect Strava" button later)
export function buildStravaAuthUrl(scope = "read,activity:read_all"): string {
  const url = new URL("https://www.strava.com/oauth/authorize");

  url.searchParams.set("client_id", String(STRAVA_CLIENT_ID));
  url.searchParams.set("redirect_uri", String(STRAVA_REDIRECT_URI));
  url.searchParams.set("response_type", "code");
  url.searchParams.set("approval_prompt", "force");
  url.searchParams.set("scope", scope);

  return url.toString();
}
