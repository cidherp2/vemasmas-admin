import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { DeletePersonDialog } from "@/components/persons/DeletePersonDialog";

const person = {
  id: "1",
  created_at: "2026-01-01T00:00:00.000Z",
  name: "Ana Martínez",
  email: "ana@empresa.com",
  phone: "5512345678",
  role: "Diseñadora",
  status: "active" as const,
};

describe("DeletePersonDialog", () => {
  it("does not call delete when cancellation is chosen", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <DeletePersonDialog
        person={person}
        open
        onOpenChange={vi.fn()}
        onConfirm={onConfirm}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("calls delete only after explicit confirmation", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    render(
      <DeletePersonDialog
        person={person}
        open
        onOpenChange={vi.fn()}
        onConfirm={onConfirm}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Eliminar persona" }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });
});
