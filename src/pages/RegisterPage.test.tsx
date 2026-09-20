import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

const auth = vi.hoisted(() => ({
  signUp: vi.fn().mockResolvedValue({ requiresEmailConfirmation: false }),
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    status: "unauthenticated",
    isDevelopmentFallback: false,
    user: null,
    signIn: vi.fn(),
    signUp: auth.signUp,
    signOut: vi.fn(),
  }),
}));

import { RegisterPage } from "@/pages/RegisterPage";

describe("RegisterPage", () => {
  it("submits valid registration data", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterPage /></MemoryRouter>);

    await user.type(screen.getByLabelText("Correo electrónico"), "demo@empresa.com");
    await user.type(screen.getByLabelText("Contraseña"), "secreto");
    await user.type(screen.getByLabelText("Confirmar contraseña"), "secreto");
    await user.click(screen.getByRole("button", { name: "Crear cuenta" }));

    expect(auth.signUp).toHaveBeenCalledWith("demo@empresa.com", "secreto");
  });

  it("shows confirmation feedback when Auth requires email verification", async () => {
    const user = userEvent.setup();
    auth.signUp.mockResolvedValueOnce({ requiresEmailConfirmation: true });
    render(<MemoryRouter><RegisterPage /></MemoryRouter>);

    await user.type(screen.getByLabelText("Correo electrónico"), "confirm@empresa.com");
    await user.type(screen.getByLabelText("Contraseña"), "secreto");
    await user.type(screen.getByLabelText("Confirmar contraseña"), "secreto");
    await user.click(screen.getByRole("button", { name: "Crear cuenta" }));

    expect(await screen.findByText(/revisa tu correo/i)).toBeInTheDocument();
  });

  it("blocks mismatched passwords before calling Auth", async () => {
    const user = userEvent.setup();
    auth.signUp.mockClear();
    render(<MemoryRouter><RegisterPage /></MemoryRouter>);

    await user.type(screen.getByLabelText("Correo electrónico"), "mismatch@empresa.com");
    await user.type(screen.getByLabelText("Contraseña"), "secreto");
    await user.type(screen.getByLabelText("Confirmar contraseña"), "distinta");
    await user.click(screen.getByRole("button", { name: "Crear cuenta" }));

    expect(await screen.findByText("Las contraseñas no coinciden.")).toBeInTheDocument();
    expect(auth.signUp).not.toHaveBeenCalled();
  });
});
