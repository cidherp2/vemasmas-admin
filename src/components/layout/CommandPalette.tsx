import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, LayoutDashboard, Search, Users, X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

const commands = [
  {
    label: "Ir al dashboard",
    description: "Resumen de actividad",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Abrir personas",
    description: "Gestiona tu directorio",
    path: "/persons",
    icon: Users,
  },
];

export function CommandPalette({
  open,
  onClose,
}: CommandPaletteProps): React.ReactElement | null {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const filteredCommands = commands.filter((command) =>
    `${command.label} ${command.description}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const selectCommand = (path: string): void => {
    navigate(path);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-[#102f2b]/40 px-4 pt-[12vh] backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Comandos rápidos"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="w-full max-w-xl overflow-hidden rounded-[0.8rem] border bg-popover shadow-2xl">
        <div className="flex items-center gap-3 border-b px-4">
          <Search className="size-4 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => event.key === "Escape" && onClose()}
            placeholder="Busca una sección..."
            className="h-14 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            aria-label="Buscar comandos"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Cerrar comandos"
          >
            <X className="size-4" />
          </Button>
        </div>
        <div className="p-2">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((command) => {
              const Icon = command.icon;
              return (
                <button
                  key={command.path}
                  type="button"
                  className="focus-ring flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left hover:bg-muted"
                  onClick={() => selectCommand(command.path)}
                >
                  <span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                    <Icon className="size-4" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-semibold">
                      {command.label}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {command.description}
                    </span>
                  </span>
                  <ArrowRight className="size-4 text-muted-foreground" />
                </button>
              );
            })
          ) : (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              No encontramos comandos para esa búsqueda.
            </p>
          )}
        </div>
        <div className="flex items-center justify-between border-t px-4 py-3 text-xs text-muted-foreground">
          <span>Navega por el espacio de trabajo</span>
          <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono">
            ESC
          </kbd>
        </div>
      </div>
    </div>
  );
}
