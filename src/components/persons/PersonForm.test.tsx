import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { PersonForm } from "@/components/persons/PersonForm";

describe("PersonForm", () => {
  it("shows inline validation and does not submit invalid data", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<PersonForm onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: "Guardar persona" }));

    expect(await screen.findByText("El nombre es obligatorio.")).toBeInTheDocument();
    expect(screen.getByText("Introduce un correo válido.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("normalizes an omitted role to null on valid submission", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<PersonForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Nombre completo"), "Ana Martínez");
    await user.type(screen.getByLabelText("Correo electrónico"), "ANA@EMPRESA.COM");
    await user.type(screen.getByLabelText("Teléfono"), "5512345678");
    await user.click(screen.getByRole("button", { name: "Guardar persona" }));

    expect(onSubmit).toHaveBeenCalledWith({ name: "Ana Martínez", email: "ANA@EMPRESA.COM", phone: "5512345678", role: null, status: "active" });
  });
});
