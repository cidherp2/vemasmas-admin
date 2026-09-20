import { ArrowLeft, Pencil, RotateCcw, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { DeletePersonDialog } from "@/components/persons/DeletePersonDialog";
import { PersonDetailCard } from "@/components/persons/PersonDetailCard";
import { PersonFormDialog } from "@/components/persons/PersonFormDialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePerson, usePersons } from "@/hooks/usePersons";
import { getErrorMessage } from "@/lib/errors";
import type { PersonPayload } from "@/types/person";

export function PersonDetailPage(): React.ReactElement {
  const { personId } = useParams<{ personId: string }>();
  const navigate = useNavigate();
  const {
    data: person,
    isLoading,
    isError,
    error,
    refetch,
  } = usePerson(personId);
  const { updatePerson, deletePerson, isMutating } = usePersons();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleUpdate = async (payload: PersonPayload): Promise<void> => {
    if (!person) return;
    try {
      await updatePerson({ id: person.id, input: payload });
      setEditOpen(false);
      setFormError(null);
      toast.success("Cambios guardados");
    } catch (caughtError) {
      setFormError(getErrorMessage(caughtError));
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!person) return;
    try {
      await deletePerson(person.id);
      toast.success("Persona eliminada");
      navigate("/persons", { replace: true });
    } catch (caughtError) {
      toast.error(getErrorMessage(caughtError));
    }
  };

  if (isLoading)
    return (
      <div className="space-y-5">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-[420px] w-full" />
      </div>
    );
  if (isError || !person)
    return (
      <div className="space-y-5">
        <Button asChild variant="ghost">
          <Link to="/persons">
            <ArrowLeft className="size-4" />
            Volver a personas
          </Link>
        </Button>
        <Alert className="border-destructive/30">
          <AlertTitle>
            {getErrorMessage(error, "Persona no encontrada")}
          </AlertTitle>
          <AlertDescription className="flex flex-wrap items-center gap-3">
            No pudimos mostrar este perfil.
            <Button variant="outline" size="sm" onClick={() => void refetch()}>
              <RotateCcw className="size-3.5" />
              Reintentar
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <Button asChild variant="ghost">
          <Link to="/persons">
            <ArrowLeft className="size-4" />
            Volver a personas
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setFormError(null);
              setEditOpen(true);
            }}
          >
            <Pencil className="size-4" />
            Editar
          </Button>
          <Button
            variant="outline"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="size-4" />
            Eliminar
          </Button>
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
          Ficha de persona
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-[-0.045em]">
          Detalle del perfil
        </h1>
      </div>
      <PersonDetailCard person={person} />
      <PersonFormDialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) setFormError(null);
        }}
        person={person}
        onSubmit={handleUpdate}
        submitting={isMutating}
        error={formError}
      />
      <DeletePersonDialog
        person={person}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        submitting={isMutating}
      />
    </div>
  );
}
