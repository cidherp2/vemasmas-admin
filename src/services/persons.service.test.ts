import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/services/supabase", () => ({ supabase: null }));

import {
  createPerson,
  deletePerson,
  listPersons,
  updatePerson,
} from "@/services/persons.service";

const input = {
  name: "Ana Martínez",
  email: "ana@empresa.com",
  phone: "5512345678",
  role: null,
  status: "active" as const,
};

describe("persons.service local fallback", () => {
  beforeEach(() => window.localStorage.clear());

  it("supports create, duplicate protection, update and delete", async () => {
    const created = await createPerson(input);
    expect(created.email).toBe(input.email);
    await expect(createPerson(input)).rejects.toMatchObject({
      code: "DUPLICATE",
    });

    const updated = await updatePerson(created.id, {
      ...input,
      name: "Ana Actualizada",
      status: "inactive",
    });
    expect(updated.name).toBe("Ana Actualizada");
    expect(updated.status).toBe("inactive");

    await deletePerson(created.id);
    await expect(listPersons()).resolves.toEqual([]);
  });
});
