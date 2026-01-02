import type { StravaTokens } from "./storage";

export async function exchangeCode(code: string, redirect_uri: string): Promise<StravaTokens> {
  const res = await fetch("/api/strava/exchange", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, redirect_uri }),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function refreshTokens(refresh_token: string): Promise<StravaTokens> {
  const res = await fetch("/api/strava/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token }),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
