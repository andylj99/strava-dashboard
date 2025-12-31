// strava-server.js
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Go UP one level from /server to project root and load .env.server
dotenv.config({ path: path.join(__dirname, "..", ".env.server") });

console.log("Loaded env from:", path.join(__dirname, "..", ".env.server"));

import express from "express";
import cors from "cors";

// If you're on Node 18+, fetch is global. If not, install node-fetch and import it.
// import fetch from "node-fetch";

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
const STRAVA_REDIRECT_URI =
  process.env.STRAVA_REDIRECT_URI || "http://localhost:5173/auth/callback";

console.log("Using Strava client id:", STRAVA_CLIENT_ID);
console.log("Using redirect URI:", STRAVA_REDIRECT_URI);


if (!STRAVA_CLIENT_ID || !STRAVA_CLIENT_SECRET) {
  console.warn(
    "WARNING: STRAVA_CLIENT_ID and/or STRAVA_CLIENT_SECRET are not set in environment variables."
  );
}

// POST /strava/exchange-token
app.post("/strava/exchange-token", async (req, res) => {
  try {
    const { code } = req.body;

    console.log("Received code from frontend:", code);

    if (!code) {
      return res.status(400).json({ error: "Missing 'code' in request body." });
    }

    const tokenUrl = "https://www.strava.com/oauth/token";

    const body = new URLSearchParams();
    body.set("client_id", String(STRAVA_CLIENT_ID));
    body.set("client_secret", String(STRAVA_CLIENT_SECRET));
    body.set("code", code);
    body.set("grant_type", "authorization_code");
    body.set("redirect_uri", STRAVA_REDIRECT_URI);

    const stravaResponse = await fetch(tokenUrl, {
    method: "POST",
    body, // URLSearchParams -> form-encoded
    });

    if (!stravaResponse.ok) {
    const text = await stravaResponse.text();
    console.error("Strava token exchange failed:", text);
    return res
        .status(stravaResponse.status)
        .json({ error: "Failed to exchange code with Strava", details: text });
    }

    const data = await stravaResponse.json();

    // You could choose to store tokens server-side here.
    // For now, we just pass them back to the frontend, since this is a personal app.
    res.json({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: data.expires_at,
      athlete: data.athlete,
    });
  } catch (err) {
    console.error("Unexpected error in /strava/exchange-token:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Strava helper server running on http://localhost:${port}`);
});
