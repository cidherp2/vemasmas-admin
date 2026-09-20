import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

const auth = vi.hoisted(() => ({ signIn: vi.fn().mockResolvedValue(undefined), status: "unauthenticated" as "unauthenticated" | "configuration-error" }));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ status: auth.status, isDevelopmentFallback: auth.status !== "configuration-error", user: null, signIn: auth.signIn, signOut: vi.fn() }),
}));

import { LoginPage } from "@/pages/LoginPage";

describe("LoginPage", () => {
  it("identifies simulated local mode and signs in with valid credentials", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><LoginPage /></MemoryRouter>);

    expect(screen.getByText("Modo local simulado")).toBeInTheDocument();
    await user.type(screen.getByLabelText("Correo electrónico"), "admin@empresa.com");
    await user.type(screen.getByLabelText("Contraseña"), "secreto");
    await user.click(screen.getByRole("button", { name: /entrar al panel/i }));

    expect(auth.signIn).toHaveBeenCalledWith("admin@empresa.com", "secreto");
  });

  it("fails closed when production configuration is unavailable", () => {
    auth.status = "configuration-error";
    render(<MemoryRouter><LoginPage /></MemoryRouter>);

    expect(screen.getByText("Configuración pendiente")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /entrar al panel/i })).toBeDisabled();
    auth.status = "unauthenticated";
  });
});
