// src/pages/AuthCallback.tsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { STRAVA_BACKEND_URL } from "../config/strava";
import type { Activity } from "../types/activity";

interface TokenExchangeResponse {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  athlete?: unknown;
}

function useQueryParam(name: string): string | null {
  const search = window.location.search;
  const params = new URLSearchParams(search);
  return params.get(name);
}

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isExchanging, setIsExchanging] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = useQueryParam("code");
    const errorParam = useQueryParam("error");

    if (errorParam) {
      setIsExchanging(false);
      setError(`Strava returned an error: ${errorParam}`);
      return;
    }

    if (!code) {
      setIsExchanging(false);
      setError("Missing authorization code from Strava.");
      return;
    }

    // Call backend to exchange the code for tokens
    (async () => {
      try {
        setIsExchanging(true);
        setError(null);

        const response = await fetch(
          `${STRAVA_BACKEND_URL}/strava/exchange-token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code }),
          }
        );

        if (!response.ok) {
          const text = await response.text();
          throw new Error(
            `Token exchange failed: ${response.status} ${response.statusText} – ${text}`
          );
        }

        const data = (await response.json()) as TokenExchangeResponse;

        // For this personal project, we'll store the access token in localStorage.
        // (For production, you'd use a more secure approach!)
        localStorage.setItem("strava_access_token", data.access_token);
        localStorage.setItem(
          "strava_token_expires_at",
          data.expires_at.toString()
        );
        localStorage.setItem("strava_refresh_token", data.refresh_token);

        // Redirect back to dashboard
        navigate("/dashboard", { replace: true });
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error
            ? err.message
            : "Unexpected error during token exchange."
        );
      } finally {
        setIsExchanging(false);
      }
    })();
  }, [location.search, navigate]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Connecting to Strava…</h1>
        <p className="dashboard-subtitle">
          Handling the response from Strava. This happens after you approve
          access.
        </p>
      </header>

      {isExchanging && (
        <p className="status-message status-message--loading">
          Exchanging authorization code for access token…
        </p>
      )}

      {error && (
        <p className="status-message status-message--error">
          {error}
        </p>
      )}
    </div>
  );
}
