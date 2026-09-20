import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

const persons = vi.hoisted(() => [
  {
    id: "1",
    created_at: "2026-01-01T00:00:00.000Z",
    name: "Ana Martínez",
    email: "ana@empresa.com",
    phone: "5512345678",
    role: "Diseñadora",
    status: "active" as const,
  },
  {
    id: "2",
    created_at: "2026-01-02T00:00:00.000Z",
    name: "Luis García",
    email: "luis@empresa.com",
    phone: "5587654321",
    role: "Ingeniero",
    status: "inactive" as const,
  },
]);

vi.mock("@/hooks/usePersons", () => ({
  usePersons: () => ({
    data: persons,
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
    createPerson: vi.fn(),
    updatePerson: vi.fn(),
    deletePerson: vi.fn(),
    isMutating: false,
  }),
}));

import { PersonsPage } from "@/pages/PersonsPage";

describe("PersonsPage", () => {
  it("filters the directory by name or email without reloading", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <PersonsPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Ana Martínez")).toBeInTheDocument();
    expect(screen.getByText("Luis García")).toBeInTheDocument();
    await user.type(
      screen.getByRole("textbox", { name: "Buscar por nombre o correo" }),
      "luis",
    );

    expect(screen.getByText("Luis García")).toBeInTheDocument();
    expect(screen.queryByText("Ana Martínez")).not.toBeInTheDocument();
  });
});
