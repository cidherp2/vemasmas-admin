import {
  CalendarDays,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Person } from "@/types/person";

interface PersonDetailCardProps {
  person: Person;
}

export function PersonDetailCard({
  person,
}: PersonDetailCardProps): React.ReactElement {
  const createdAt = new Date(person.created_at).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  return (
    <Card className="overflow-hidden">
      <div className="h-24 bg-[var(--sidebar)]" />
      <div className="relative px-5 pb-5 sm:px-7">
        <span className="-mt-10 flex size-20 items-center justify-center rounded-2xl border-4 border-card bg-secondary font-display text-2xl font-semibold text-secondary-foreground shadow-lg">
          {person.name.slice(0, 1).toUpperCase()}
        </span>
        <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-[-0.04em]">
              {person.name}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {person.role || "Sin rol asignado"}
            </p>
          </div>
          <Badge variant={person.status === "active" ? "active" : "inactive"}>
            {person.status === "active" ? "Activo" : "Inactivo"}
          </Badge>
        </div>
        <CardContent className="mt-7 grid gap-4 p-0 sm:grid-cols-2">
          <DetailItem
            icon={Mail}
            label="Correo electrónico"
            value={person.email}
          />
          <DetailItem icon={Phone} label="Teléfono" value={person.phone} />
          <DetailItem
            icon={UserRound}
            label="Identificador"
            value={person.id}
            mono
          />
          <DetailItem
            icon={CalendarDays}
            label="Fecha de alta"
            value={createdAt}
          />
          <DetailItem
            icon={ShieldCheck}
            label="Estado del registro"
            value={
              person.status === "active" ? "Perfil activo" : "Perfil inactivo"
            }
          />
        </CardContent>
      </div>
    </Card>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
  mono = false,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  mono?: boolean;
}): React.ReactElement {
  return (
    <div className="rounded-xl border bg-muted/30 p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
        <Icon className="size-3.5 text-primary" />
        {label}
      </div>
      <p
        className={
          mono
            ? "break-all font-mono text-xs text-foreground"
            : "text-sm font-medium text-foreground"
        }
      >
        {value}
      </p>
    </div>
  );
}
