import { describe, it, expect, beforeEach, vi } from "vitest";

// We’ll mock dependencies used by tokenManager.ts
vi.mock("./storage", () => ({
  loadTokens: vi.fn(),
  saveTokens: vi.fn(),
  clearTokens: vi.fn(),
}));

vi.mock("./api", () => ({
  refreshTokens: vi.fn(),
}));

import { getValidAccessToken } from "./tokenManager";
import { loadTokens, saveTokens, clearTokens } from "./storage";
import { refreshTokens } from "./api";

describe("auth/tokenManager.getValidAccessToken", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.resetAllMocks();
  });

  it("returns null if no tokens in storage", async () => {
    (loadTokens as any).mockReturnValue(null);

    const token = await getValidAccessToken();

    expect(token).toBeNull();
    expect(refreshTokens).not.toHaveBeenCalled();
    expect(saveTokens).not.toHaveBeenCalled();
  });

  it("returns existing access token when not near expiry", async () => {
    // now = 1000
    vi.spyOn(Date, "now").mockReturnValue(1000 * 1000);

    (loadTokens as any).mockReturnValue({
      access_token: "access-ok",
      refresh_token: "refresh-x",
      // expires_at - 60 = 1940, now(1000) < 1940 => not refreshing
      expires_at: 2000,
    });

    const token = await getValidAccessToken();

    expect(token).toBe("access-ok");
    expect(refreshTokens).not.toHaveBeenCalled();
    expect(saveTokens).not.toHaveBeenCalled();
    expect(clearTokens).not.toHaveBeenCalled();
  });

  it("refreshes when within the 60s early-refresh window and saves new tokens", async () => {
    // now = 1950, expires_at - 60 = 1940 => now >= 1940 => refresh
    vi.spyOn(Date, "now").mockReturnValue(1950 * 1000);

    (loadTokens as any).mockReturnValue({
      access_token: "access-old",
      refresh_token: "refresh-123",
      expires_at: 2000,
    });

    (refreshTokens as any).mockResolvedValue({
      access_token: "access-new",
      refresh_token: "refresh-new",
      expires_at: 9999,
    });

    const token = await getValidAccessToken();

    expect(refreshTokens).toHaveBeenCalledTimes(1);
    expect(refreshTokens).toHaveBeenCalledWith("refresh-123");

    expect(saveTokens).toHaveBeenCalledTimes(1);
    expect(saveTokens).toHaveBeenCalledWith({
      access_token: "access-new",
      refresh_token: "refresh-new",
      expires_at: 9999,
    });

    expect(token).toBe("access-new");
    expect(clearTokens).not.toHaveBeenCalled();
  });

  it("clears tokens and returns null if refresh fails", async () => {
    vi.spyOn(Date, "now").mockReturnValue(1950 * 1000);

    (loadTokens as any).mockReturnValue({
      access_token: "access-old",
      refresh_token: "refresh-123",
      expires_at: 2000,
    });

    (refreshTokens as any).mockRejectedValue(new Error("boom"));

    const token = await getValidAccessToken();

    expect(refreshTokens).toHaveBeenCalledTimes(1);
    expect(saveTokens).not.toHaveBeenCalled();
    expect(clearTokens).toHaveBeenCalledTimes(1);
    expect(token).toBeNull();
  });

  it("deduplicates concurrent refreshes (single-flight): only one refreshTokens call", async () => {
    vi.spyOn(Date, "now").mockReturnValue(1950 * 1000);

    (loadTokens as any).mockReturnValue({
      access_token: "access-old",
      refresh_token: "refresh-123",
      expires_at: 2000,
    });

    // Create a refresh promise we can control
    let resolveRefresh: (v: any) => void;
    const refreshPromise = new Promise<any>((resolve) => {
      resolveRefresh = resolve;
    });

    (refreshTokens as any).mockReturnValue(refreshPromise);

    // Start two calls before the refresh resolves
    const p1 = getValidAccessToken();
    const p2 = getValidAccessToken();

    // Still only one refresh in progress
    expect(refreshTokens).toHaveBeenCalledTimes(1);

    // Resolve refresh
    resolveRefresh!({
      access_token: "access-new",
      refresh_token: "refresh-new",
      expires_at: 9999,
    });

    const [t1, t2] = await Promise.all([p1, p2]);

    expect(t1).toBe("access-new");
    expect(t2).toBe("access-new");
    expect(saveTokens).toHaveBeenCalledTimes(1);
  });
});
