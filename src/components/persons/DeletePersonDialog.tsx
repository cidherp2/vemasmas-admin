import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import type { Person } from "@/types/person";

interface DeletePersonDialogProps {
  person: Person | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  submitting?: boolean;
}

export function DeletePersonDialog({ person, open, onOpenChange, onConfirm, submitting = false }: DeletePersonDialogProps): React.ReactElement {
  return <AlertDialog open={open} onOpenChange={onOpenChange}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>¿Eliminar a {person?.name}?</AlertDialogTitle><AlertDialogDescription>Esta acción eliminará el registro del directorio. No podrás deshacerla desde la aplicación.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel disabled={submitting}>Cancelar</AlertDialogCancel><AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={submitting} onClick={(event) => { event.preventDefault(); void onConfirm(); }}>{submitting ? "Eliminando..." : "Eliminar persona"}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>;
}
