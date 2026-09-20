import type { LucideIcon } from "lucide-react";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Settings2,
  Users,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
}

const items: { label: string; path: string; icon: LucideIcon }[] = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Personas", path: "/persons", icon: Users },
  { label: "Configuración", path: "/settings", icon: Settings2 },
];

export function Sidebar({
  collapsed,
  mobileOpen,
  onClose,
  onToggle,
}: SidebarProps): React.ReactElement {
  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-[#102f2b]/40 lg:hidden"
          aria-label="Cerrar navegación"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-[var(--sidebar)] text-[var(--sidebar-foreground)] transition-transform lg:translate-x-0",
          collapsed && "lg:w-[84px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div
          className="flex h-[76px] items-center justify-between border-b px-5"
          style={{ borderColor: "var(--sidebar-border)" }}
        >
          <NavLink
            to="/dashboard"
            className={cn("flex items-center gap-3", collapsed && "lg:mx-auto")}
            onClick={onClose}
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)] font-display text-sm font-bold text-[var(--accent-foreground)]">
              VM
            </span>
            <span
              className={cn(
                "font-display text-lg font-semibold tracking-[-0.04em]",
                collapsed && "lg:hidden",
              )}
            >
              vemas<span className="text-[#8ed4b7]">mas</span>
            </span>
          </NavLink>
          <Button
            variant="ghost"
            size="icon"
            className="text-[var(--sidebar-muted)] hover:bg-white/10 hover:text-white lg:hidden"
            onClick={onClose}
            aria-label="Cerrar navegación"
          >
            <X className="size-4" />
          </Button>
        </div>
        <div className="flex flex-1 flex-col px-3 py-6">
          <p
            className={cn(
              "mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--sidebar-muted)]",
              collapsed && "lg:hidden",
            )}
          >
            Espacio de trabajo
          </p>
          <nav className="space-y-1" aria-label="Navegación principal">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      "focus-ring group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--sidebar-muted)] transition-colors hover:bg-white/10 hover:text-white",
                      isActive &&
                        "bg-[var(--sidebar-active)] text-white shadow-sm",
                      collapsed && "lg:justify-center lg:px-0",
                    )
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="size-[18px] shrink-0" />
                  <span className={cn(collapsed && "lg:hidden")}>
                    {item.label}
                  </span>
                </NavLink>
              );
            })}
          </nav>
          <div
            className="mt-auto rounded-xl border p-3"
            style={{
              borderColor: "var(--sidebar-border)",
              background: "rgba(255,255,255,0.05)",
            }}
          >
            <p
              className={cn(
                "text-xs font-semibold text-white",
                collapsed && "lg:hidden",
              )}
            >
              Panel de RR. HH.
            </p>
            <p
              className={cn(
                "mt-1 text-[11px] leading-relaxed text-[var(--sidebar-muted)]",
                collapsed && "lg:hidden",
              )}
            >
              Mantén tus datos de equipo en un solo lugar.
            </p>
            {collapsed && (
              <Users className="mx-auto size-4 text-[var(--sidebar-muted)] lg:block" />
            )}
          </div>
        </div>
        <div
          className="hidden border-t p-3 lg:block"
          style={{ borderColor: "var(--sidebar-border)" }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="text-[var(--sidebar-muted)] hover:bg-white/10 hover:text-white"
            onClick={onToggle}
            aria-label={collapsed ? "Expandir menú" : "Contraer menú"}
          >
            {collapsed ? (
              <ChevronRight className="size-4" />
            ) : (
              <ChevronLeft className="size-4" />
            )}
          </Button>
        </div>
      </aside>
    </>
  );
}
