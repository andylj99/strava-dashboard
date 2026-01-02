import { loadTokens, saveTokens, clearTokens } from "./storage";
import { refreshTokens } from "./api";

let inFlightRefresh: Promise<string | null> | null = null;

export async function getValidAccessToken(): Promise<string | null> {
  const tokens = loadTokens();
  if (!tokens) return null;

  const now = Math.floor(Date.now() / 1000);
  const refreshEarlyBy = 60;

  if (now < tokens.expires_at - refreshEarlyBy) return tokens.access_token;

  if (!inFlightRefresh) {
    inFlightRefresh = (async () => {
      try {
        const updated = await refreshTokens(tokens.refresh_token);
        saveTokens(updated);
        return updated.access_token;
      } catch {
        clearTokens();
        return null;
      } finally {
        inFlightRefresh = null;
      }
    })();
  }

  return inFlightRefresh;
}
