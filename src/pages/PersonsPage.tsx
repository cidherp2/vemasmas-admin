import { Plus, RotateCcw, Search, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { DeletePersonDialog } from "@/components/persons/DeletePersonDialog";
import { PersonFormDialog } from "@/components/persons/PersonFormDialog";
import { PersonsTable } from "@/components/persons/PersonsTable";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePersons } from "@/hooks/usePersons";
import { getErrorMessage } from "@/lib/errors";
import type { Person, PersonPayload } from "@/types/person";

type StatusFilter = "all" | "active" | "inactive";

export function PersonsPage(): React.ReactElement {
  const { data: persons, isLoading, isError, error, refetch, createPerson, updatePerson, deletePerson, isMutating } = usePersons();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [deletingPerson, setDeletingPerson] = useState<Person | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredPersons = persons?.filter((person) => {
    const matchesQuery = !normalizedQuery || person.name.toLowerCase().includes(normalizedQuery) || person.email.toLowerCase().includes(normalizedQuery);
    const matchesStatus = statusFilter === "all" || person.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const resetFormState = (): void => setFormError(null);
  const openCreate = (): void => { resetFormState(); setCreateOpen(true); };
  const openEdit = (person: Person): void => { resetFormState(); setEditingPerson(person); };

  const handleCreate = async (payload: PersonPayload): Promise<void> => {
    try {
      await createPerson(payload);
      setCreateOpen(false);
      toast.success("Persona añadida al directorio");
    } catch (caughtError) {
      setFormError(getErrorMessage(caughtError));
    }
  };

  const handleUpdate = async (payload: PersonPayload): Promise<void> => {
    if (!editingPerson) return;
    try {
      await updatePerson({ id: editingPerson.id, input: payload });
      setEditingPerson(null);
      toast.success("Cambios guardados");
    } catch (caughtError) {
      setFormError(getErrorMessage(caughtError));
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!deletingPerson) return;
    try {
      await deletePerson(deletingPerson.id);
      setDeletingPerson(null);
      toast.success("Persona eliminada");
    } catch (caughtError) {
      toast.error(getErrorMessage(caughtError));
    }
  };

  const clearFilters = (): void => { setQuery(""); setStatusFilter("all"); };
  const hasFilters = Boolean(query || statusFilter !== "all");

  return <div className="space-y-7"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">Directorio</p><div className="flex items-center gap-3"><h1 className="font-display text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">Personas</h1><Badge variant="default">{persons?.length ?? 0}</Badge></div><p className="mt-2 max-w-xl text-sm text-muted-foreground">Una vista viva de las personas que hacen avanzar tu organización.</p></div><Button onClick={openCreate}><Plus className="size-4" />Añadir persona</Button></div>{isError && <Alert className="border-destructive/30"><AlertTitle>No pudimos cargar el directorio</AlertTitle><AlertDescription className="flex flex-wrap items-center gap-3">{getErrorMessage(error)}<Button variant="outline" size="sm" onClick={() => void refetch()}><RotateCcw className="size-3.5" />Reintentar</Button></AlertDescription></Alert>}<Card><CardHeader className="gap-4 border-b sm:flex-row sm:items-center sm:justify-between"><div><CardTitle>Directorio de equipo</CardTitle><p className="mt-1 text-sm text-muted-foreground">Busca por nombre o correo y filtra por estado.</p></div><div className="flex flex-col gap-2 sm:flex-row"><div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9 sm:w-56" placeholder="Buscar persona..." aria-label="Buscar por nombre o correo" /></div><Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}><SelectTrigger className="sm:w-36" aria-label="Filtrar por estado"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Todos los estados</SelectItem><SelectItem value="active">Activos</SelectItem><SelectItem value="inactive">Inactivos</SelectItem></SelectContent></Select></div></CardHeader>{!isLoading && !isError && filteredPersons?.length === 0 ? <CardContent className="flex min-h-64 flex-col items-center justify-center px-5 text-center"><span className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground"><Users className="size-5" /></span><h2 className="font-display text-lg font-semibold">{hasFilters ? "No hay coincidencias" : "Tu directorio está vacío"}</h2><p className="mt-1 max-w-sm text-sm text-muted-foreground">{hasFilters ? "Prueba con otra búsqueda o limpia los filtros activos." : "Añade a la primera persona para empezar a construir tu vista de equipo."}</p><div className="mt-5 flex gap-2">{hasFilters && <Button variant="outline" onClick={clearFilters}>Limpiar filtros</Button>}{!hasFilters && <Button onClick={openCreate}><Plus className="size-4" />Añadir persona</Button>}</div></CardContent> : <PersonsTable persons={filteredPersons} loading={isLoading} onEdit={openEdit} onDelete={setDeletingPerson} />}</Card><PersonFormDialog open={createOpen} onOpenChange={(open) => { setCreateOpen(open); if (!open) resetFormState(); }} onSubmit={handleCreate} submitting={isMutating} error={formError} /><PersonFormDialog open={Boolean(editingPerson)} onOpenChange={(open) => { if (!open) { setEditingPerson(null); resetFormState(); } }} person={editingPerson} onSubmit={handleUpdate} submitting={isMutating} error={formError} /><DeletePersonDialog person={deletingPerson} open={Boolean(deletingPerson)} onOpenChange={(open) => { if (!open) setDeletingPerson(null); }} onConfirm={handleDelete} submitting={isMutating} /></div>;
}
