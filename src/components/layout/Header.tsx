import { useEffect, useState } from "react";
import { LogOut, Menu, Moon, Search, Sun } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { CommandPalette } from "@/components/layout/CommandPalette";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";

interface HeaderProps {
  onMenuClick: () => void;
}

const pageNames: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/persons": "Personas",
  "/settings": "Configuración",
};

export function Header({ onMenuClick }: HeaderProps): React.ReactElement {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const title = location.pathname.startsWith("/persons/")
    ? "Detalle de persona"
    : (pageNames[location.pathname] ?? "Dashboard");

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent): void => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const handleLogout = async (): Promise<void> => {
    try {
      await signOut();
      navigate("/login", { replace: true });
      toast.success("Sesión cerrada");
    } catch {
      toast.error("No se pudo cerrar la sesión");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b bg-background/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
            aria-label="Abrir navegación"
          >
            <Menu className="size-5" />
          </Button>
          <div>
            <p className="font-display text-lg font-semibold tracking-[-0.025em]">
              {title}
            </p>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Administra lo importante con claridad.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-3">
          <Button
            variant="outline"
            className="hidden h-10 w-52 justify-between gap-3 px-3 text-muted-foreground sm:flex"
            onClick={() => setPaletteOpen(true)}
            aria-label="Abrir comandos rápidos"
          >
            <span className="flex items-center gap-2">
              <Search className="size-4" />
              Buscar...
            </span>
            <kbd className="rounded border bg-muted px-1.5 py-0.5 text-[10px]">
              ⌘ K
            </kbd>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            onClick={() => setPaletteOpen(true)}
            aria-label="Buscar"
          >
            <Search className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={
              theme === "light" ? "Activar modo oscuro" : "Activar modo claro"
            }
          >
            {theme === "light" ? (
              <Moon className="size-4" />
            ) : (
              <Sun className="size-4" />
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="focus-ring flex items-center gap-2 rounded-full pl-1.5 text-left"
                aria-label="Abrir menú de perfil"
              >
                <span className="flex size-9 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">
                  {user?.displayName.slice(0, 1).toUpperCase() ?? "U"}
                </span>
                <span className="hidden max-w-28 truncate text-sm font-semibold lg:block">
                  {user?.displayName ?? "Usuario"}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="px-3 py-2">
                <p className="text-sm font-semibold">{user?.displayName}</p>
                <p className="max-w-48 truncate text-xs text-muted-foreground">
                  {user?.email}
                </p>
                {user?.simulated && (
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#a16c0a]">
                    Modo local
                  </p>
                )}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => void handleLogout()}>
                <LogOut className="mr-2 size-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
      />
    </>
  );
}
