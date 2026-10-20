import { afterEach, describe, expect, it, vi } from "vitest";
import { createId } from "@/lib/id";

const UUID_V4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe("createId", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns unique UUID v4 strings", () => {
    const ids = new Set(Array.from({ length: 1000 }, createId));
    expect(ids.size).toBe(1000);
    for (const id of ids) expect(id).toMatch(UUID_V4);
  });

  it("falls back to getRandomValues when randomUUID is unavailable", () => {
    const { getRandomValues } = crypto;
    vi.stubGlobal("crypto", {
      getRandomValues: getRandomValues.bind(crypto),
    });

    const ids = new Set(Array.from({ length: 100 }, createId));
    expect(ids.size).toBe(100);
    for (const id of ids) expect(id).toMatch(UUID_V4);
  });
});
