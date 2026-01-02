import { getValidAccessToken } from "../auth/tokenManager";

export async function getRecentActivities(perPage = 10) {
  const token = await getValidAccessToken();
  if (!token) throw new Error("Not authenticated with Strava");

  const res = await fetch(
    `https://www.strava.com/api/v3/athlete/activities?per_page=${perPage}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!res.ok) throw new Error(`Strava API error: ${res.status}`);
  return res.json();
}