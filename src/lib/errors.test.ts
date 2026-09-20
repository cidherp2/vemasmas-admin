import { describe, expect, it } from "vitest";

import { AppError, mapServiceError, mapSupabaseError } from "@/lib/errors";

describe("service errors", () => {
  it("classifies duplicate email conflicts", () => {
    const error = mapSupabaseError({
      code: "23505",
      message: "duplicate key",
      status: 409,
    });
    expect(error).toBeInstanceOf(AppError);
    expect(error.code).toBe("DUPLICATE");
  });

  it("classifies permission errors", () => {
    expect(mapSupabaseError({ code: "42501", message: "denied" }).code).toBe(
      "FORBIDDEN",
    );
    expect(mapSupabaseError({ status: 403, message: "denied" }).code).toBe(
      "FORBIDDEN",
    );
  });

  it("classifies missing records and server failures", () => {
    expect(mapSupabaseError({ status: 404, message: "missing" }).code).toBe(
      "NOT_FOUND",
    );
    expect(mapSupabaseError({ status: 503, message: "unavailable" }).code).toBe(
      "NETWORK",
    );
  });

  it("classifies network failures", () => {
    expect(mapServiceError(new TypeError("Failed to fetch")).code).toBe(
      "NETWORK",
    );
  });
});
