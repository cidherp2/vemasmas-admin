import { describe, expect, it } from "vitest";

import { personSchema } from "@/lib/validation";

const validPerson = {
  name: "Ana Martínez",
  email: "ana@empresa.com",
  phone: "5512345678",
  role: "Diseñadora",
  status: "active" as const,
};

describe("personSchema", () => {
  it("accepts valid required data", () => {
    expect(personSchema.safeParse(validPerson).success).toBe(true);
  });

  it("rejects missing fields and malformed contact data", () => {
    const result = personSchema.safeParse({ ...validPerson, name: "", email: "invalid", phone: "123" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues.map((issue) => issue.path[0])).toEqual(expect.arrayContaining(["name", "email", "phone"]));
  });
});
