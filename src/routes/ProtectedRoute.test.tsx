import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

const auth = vi.hoisted(() => ({ status: "unauthenticated" as "authenticated" | "unauthenticated" | "loading", user: null }));

vi.mock("@/hooks/useAuth", () => ({ useAuth: () => ({ ...auth, isDevelopmentFallback: true, signIn: vi.fn(), signOut: vi.fn() }) }));

import { ProtectedRoute } from "@/routes/ProtectedRoute";

describe("ProtectedRoute", () => {
  it("redirects an unauthenticated visitor to login", () => {
    render(<MemoryRouter initialEntries={["/persons"]}><Routes><Route element={<ProtectedRoute />}><Route path="/persons" element={<p>privado</p>} /></Route><Route path="/login" element={<p>login</p>} /></Routes></MemoryRouter>);
    expect(screen.getByText("login")).toBeInTheDocument();
    expect(screen.queryByText("privado")).not.toBeInTheDocument();
  });

  it("renders the private outlet for an authenticated visitor", () => {
    auth.status = "authenticated";
    render(<MemoryRouter initialEntries={["/persons"]}><Routes><Route element={<ProtectedRoute />}><Route path="/persons" element={<p>privado</p>} /></Route></Routes></MemoryRouter>);
    expect(screen.getByText("privado")).toBeInTheDocument();
    auth.status = "unauthenticated";
  });
});
