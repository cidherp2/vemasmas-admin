import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PersonForm } from "@/components/persons/PersonForm";
import type { Person, PersonPayload } from "@/types/person";

interface PersonFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  person?: Person | null | undefined;
  onSubmit: (payload: PersonPayload) => Promise<void>;
  submitting?: boolean;
  error?: string | null | undefined;
}

export function PersonFormDialog({ open, onOpenChange, person, onSubmit, submitting = false, error }: PersonFormDialogProps): React.ReactElement {
  const isEditing = Boolean(person);
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>{isEditing ? "Editar persona" : "Añadir persona"}</DialogTitle><DialogDescription>{isEditing ? "Actualiza la información de este perfil." : "Completa los datos para añadir una persona al directorio."}</DialogDescription></DialogHeader><PersonForm key={person?.id ?? "new"} person={person} onSubmit={onSubmit} onCancel={() => onOpenChange(false)} submitting={submitting} error={error} submitLabel={isEditing ? "Guardar cambios" : "Crear persona"} /></DialogContent></Dialog>;
}
