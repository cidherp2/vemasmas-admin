import { ArrowUpRight, BriefcaseBusiness, Clock3, UserCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePersons } from "@/hooks/usePersons";
import { getErrorMessage } from "@/lib/errors";

export function DashboardPage(): React.ReactElement {
  const { data: persons, isLoading, isError, error, refetch } = usePersons();
  const activeCount = persons?.filter((person) => person.status === "active").length ?? 0;
  const roleCount = new Set(persons?.map((person) => person.role).filter(Boolean)).size;
  const latestPersonDate = persons?.[0]?.created_at;
  const latestDate = latestPersonDate
    ? new Date(latestPersonDate).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
      })
    : "Hoy";

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Resumen operativo
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
            Buenos días, equipo.
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Una lectura rápida de cómo está creciendo y moviéndose tu organización.
          </p>
        </div>
      </div>

      {isError && (
        <Alert className="border-destructive/30">
          <AlertTitle>No pudimos cargar el resumen</AlertTitle>
          <AlertDescription className="flex flex-wrap items-center gap-3">
            {getErrorMessage(error)}
            <Button variant="outline" size="sm" onClick={() => void refetch()}>
              Reintentar
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-32" />
          ))
        ) : (
          <>
            <StatCard label="Personas registradas" value={persons?.length ?? 0} detail="En tu directorio" icon={Users} tone="green" />
            <StatCard label="Perfiles activos" value={activeCount} detail="Con acceso vigente" icon={UserCheck} tone="yellow" />
            <StatCard label="Roles representados" value={roleCount} detail="Diversidad de funciones" icon={BriefcaseBusiness} tone="blue" />
            <StatCard label="Última actualización" value={latestDate} detail="Datos sincronizados" icon={Clock3} tone="slate" />
          </>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
        <Card className="overflow-hidden">
          <CardHeader className="flex-row items-start justify-between border-b">
            <div>
              <CardTitle>Actividad del equipo</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Las personas incorporadas recientemente.
              </p>
            </div>
            <Link className="focus-ring inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline" to="/persons">
              Ver directorio <ArrowUpRight className="size-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {persons && persons.length > 0 ? (
              <div className="divide-y">
                {persons.slice(0, 5).map((person) => (
                  <Link key={person.id} to={`/persons/${person.id}`} className="focus-ring flex items-center gap-3 px-5 py-4 hover:bg-muted/60">
                    <span className="flex size-9 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                      {person.name.slice(0, 1).toUpperCase()}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{person.name}</span>
                      <span className="block truncate text-xs text-muted-foreground">{person.role || "Sin rol asignado"}</span>
                    </span>
                    <Badge variant={person.status === "active" ? "active" : "inactive"}>
                      {person.status === "active" ? "Activo" : "Inactivo"}
                    </Badge>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="px-5 py-10 text-center text-sm text-muted-foreground">
                Aún no hay personas en el directorio.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-[var(--sidebar)] text-white">
          <div className="absolute -right-16 -top-16 size-48 rounded-full border-[24px] border-[#3e9d79]/25" />
          <CardHeader className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9bd9c0]">Siguiente paso</p>
            <CardTitle className="mt-2 text-2xl text-white">Conoce a tu equipo con más contexto.</CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <p className="text-sm leading-6 text-[#b6d0c8]">Añade roles y estados para convertir datos sueltos en una lectura útil.</p>
            <Button asChild className="mt-6 bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[#e5aa3d]">
              <Link to="/persons">Abrir directorio <ArrowUpRight className="size-4" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: typeof Users;
  tone: "green" | "yellow" | "blue" | "slate";
}): React.ReactElement {
  const toneClasses = {
    green: "bg-secondary text-primary",
    yellow: "bg-[#fff0c8] text-[#9a6a0a] dark:bg-[#493817] dark:text-[#f4d77f]",
    blue: "bg-[#e2edf2] text-[#2c697f] dark:bg-[#1f3740] dark:text-[#96d2e5]",
    slate: "bg-muted text-muted-foreground",
  };

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground">{label}</p>
            <p className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em]">{value}</p>
          </div>
          <span className={`flex size-10 items-center justify-center rounded-xl ${toneClasses[tone]}`}>
            <Icon className="size-4" />
          </span>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}
