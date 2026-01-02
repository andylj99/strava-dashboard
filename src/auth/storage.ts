export type StravaTokens = {
  access_token: string;
  refresh_token: string;
  expires_at: number; // unix seconds
};

const KEYS = {
  access: "strava_access_token",
  refresh: "strava_refresh_token",
  expiresAt: "strava_token_expires_at",
} as const;

export function loadTokens(): StravaTokens | null {
  const access_token = localStorage.getItem(KEYS.access);
  const refresh_token = localStorage.getItem(KEYS.refresh);
  const expires_at_raw = localStorage.getItem(KEYS.expiresAt);

  if (!access_token || !refresh_token || !expires_at_raw) return null;

  const expires_at = Number(expires_at_raw);
  if (!Number.isFinite(expires_at)) return null;

  return { access_token, refresh_token, expires_at };
}

export function saveTokens(t: StravaTokens) {
  localStorage.setItem(KEYS.access, t.access_token);
  localStorage.setItem(KEYS.refresh, t.refresh_token);
  localStorage.setItem(KEYS.expiresAt, String(t.expires_at));
}

export function clearTokens() {
  localStorage.removeItem(KEYS.access);
  localStorage.removeItem(KEYS.refresh);
  localStorage.removeItem(KEYS.expiresAt);
}
