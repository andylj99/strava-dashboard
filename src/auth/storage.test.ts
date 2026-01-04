import { describe, it, expect, beforeEach } from "vitest";
import { loadTokens, saveTokens, clearTokens, type StravaTokens } from "./storage";

describe("auth/storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns null when nothing is stored", () => {
    expect(loadTokens()).toBeNull();
  });

  it("returns null when any field is missing", () => {
    localStorage.setItem("strava_access_token", "a");
    localStorage.setItem("strava_refresh_token", "r");
    // missing expires
    expect(loadTokens()).toBeNull();

    localStorage.clear();
    localStorage.setItem("strava_access_token", "a");
    localStorage.setItem("strava_token_expires_at", "123");
    // missing refresh
    expect(loadTokens()).toBeNull();
  });

  it("returns null when expires_at is not a finite number", () => {
    localStorage.setItem("strava_access_token", "a");
    localStorage.setItem("strava_refresh_token", "r");
    localStorage.setItem("strava_token_expires_at", "not-a-number");

    expect(loadTokens()).toBeNull();
  });

  it("saves tokens and loads them back", () => {
    const tokens: StravaTokens = {
      access_token: "access-123",
      refresh_token: "refresh-456",
      expires_at: 1700000000,
    };

    saveTokens(tokens);

    expect(loadTokens()).toEqual(tokens);
  });

  it("clearTokens removes all stored token keys", () => {
    saveTokens({
      access_token: "a",
      refresh_token: "r",
      expires_at: 123,
    });

    clearTokens();

    expect(loadTokens()).toBeNull();
    // optional extra confidence:
    expect(localStorage.getItem("strava_access_token")).toBeNull();
    expect(localStorage.getItem("strava_refresh_token")).toBeNull();
    expect(localStorage.getItem("strava_token_expires_at")).toBeNull();
  });
});
