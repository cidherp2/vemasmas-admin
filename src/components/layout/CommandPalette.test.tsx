import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { CommandPalette } from "@/components/layout/CommandPalette";

function LocationText(): React.ReactElement {
  const location = useLocation();
  return <span data-testid="location">{location.pathname}</span>;
}

describe("CommandPalette", () => {
  it("navigates to a command and closes after selection", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <CommandPalette open onClose={() => undefined} />
        <LocationText />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: /abrir personas/i }));
    expect(screen.getByTestId("location")).toHaveTextContent("/persons");
  });
});
