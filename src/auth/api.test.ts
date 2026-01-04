import { describe, it, expect, beforeEach, vi } from "vitest";
import { exchangeCode, refreshTokens } from "./api";

describe("auth/api", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.resetAllMocks();
  });

  it("exchangeCode posts to /api/strava/exchange with code + redirect_uri and returns tokens", async () => {
    const fetchMock = vi.fn(async () => {
      return {
        ok: true,
        json: async () => ({
          access_token: "access-1",
          refresh_token: "refresh-1",
          expires_at: 9999,
        }),
      } as any;
    });

    vi.stubGlobal("fetch", fetchMock as any);

    const result = await exchangeCode("auth-code-123", "http://localhost:5173/auth/callback");

    expect(result).toEqual({
      access_token: "access-1",
      refresh_token: "refresh-1",
      expires_at: 9999,
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith("/api/strava/exchange", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: "auth-code-123",
        redirect_uri: "http://localhost:5173/auth/callback",
      }),
    });
  });

  it("exchangeCode throws with response text when non-ok", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: false,
        text: async () => "bad exchange",
      })) as any
    );

    await expect(exchangeCode("x", "y")).rejects.toThrow("bad exchange");
  });

  it("refreshTokens posts to /api/strava/refresh with refresh_token and returns tokens", async () => {
    const fetchMock = vi.fn(async () => {
      return {
        ok: true,
        json: async () => ({
          access_token: "access-2",
          refresh_token: "refresh-2",
          expires_at: 8888,
        }),
      } as any;
    });

    vi.stubGlobal("fetch", fetchMock as any);

    const result = await refreshTokens("refresh-old");

    expect(result).toEqual({
      access_token: "access-2",
      refresh_token: "refresh-2",
      expires_at: 8888,
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith("/api/strava/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: "refresh-old" }),
    });
  });

  it("refreshTokens throws with response text when non-ok", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: false,
        text: async () => "bad refresh",
      })) as any
    );

    await expect(refreshTokens("r")).rejects.toThrow("bad refresh");
  });
});
