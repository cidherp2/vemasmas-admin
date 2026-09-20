import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  data: undefined as
    | undefined
    | Array<{
        id: string;
        created_at: string;
        name: string;
        email: string;
        phone: string;
        role: string | null;
        status: "active" | "inactive";
      }>,
  isLoading: false,
  isError: false,
  error: null as Error | null,
}));

vi.mock("@/hooks/usePersons", () => ({
  usePersons: () => ({
    ...state,
    refetch: vi.fn(),
    createPerson: vi.fn(),
    updatePerson: vi.fn(),
    deletePerson: vi.fn(),
    isMutating: false,
  }),
}));

import { PersonsPage } from "@/pages/PersonsPage";

function renderPage(): void {
  render(
    <MemoryRouter>
      <PersonsPage />
    </MemoryRouter>,
  );
}

describe("PersonsPage states", () => {
  beforeEach(() => {
    state.data = undefined;
    state.isLoading = false;
    state.isError = false;
    state.error = null;
  });

  it("shows an explicit empty state", () => {
    state.data = [];
    renderPage();
    expect(screen.getByText("Tu directorio está vacío")).toBeInTheDocument();
  });

  it("shows stable loading placeholders", () => {
    state.isLoading = true;
    renderPage();
    expect(document.querySelectorAll(".animate-pulse").length).toBeGreaterThan(
      0,
    );
  });

  it("shows a recoverable read error", () => {
    state.isError = true;
    state.error = new Error("Servicio no disponible");
    renderPage();
    expect(
      screen.getByText("No pudimos cargar el directorio"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /reintentar/i }),
    ).toBeInTheDocument();
  });
});
