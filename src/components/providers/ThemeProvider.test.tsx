import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, beforeEach } from "vitest";

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { useTheme } from "@/hooks/useTheme";

function ThemeControl(): React.ReactElement {
  const { theme, toggleTheme } = useTheme();
  return (
    <button type="button" onClick={toggleTheme}>
      {theme}
    </button>
  );
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem("vemasmas-admin-theme", "light");
    document.documentElement.classList.remove("dark");
  });

  it("toggles the root theme and persists the selection", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeControl />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole("button", { name: "light" }));
    expect(document.documentElement).toHaveClass("dark");
    expect(window.localStorage.getItem("vemasmas-admin-theme")).toBe("dark");
  });
});
