import { ArrowUpRight, Mail, Pencil, Phone, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Person } from "@/types/person";

interface PersonsTableProps {
  persons?: Person[] | undefined;
  loading?: boolean;
  onEdit: (person: Person) => void;
  onDelete: (person: Person) => void;
}

export function PersonsTable({ persons = [], loading = false, onEdit, onDelete }: PersonsTableProps): React.ReactElement {
  if (loading) return <div className="space-y-3 p-5">{Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className="h-14 w-full" />)}</div>;
  return <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="border-b bg-muted/40 text-xs uppercase tracking-[0.12em] text-muted-foreground"><tr><th className="px-5 py-3 font-semibold">Persona</th><th className="px-4 py-3 font-semibold">Contacto</th><th className="px-4 py-3 font-semibold">Rol / puesto</th><th className="px-4 py-3 font-semibold">Estado</th><th className="px-5 py-3 text-right font-semibold">Acciones</th></tr></thead><tbody className="divide-y">{persons.map((person) => <tr key={person.id} className="group hover:bg-muted/40"><td className="px-5 py-4"><Link to={`/persons/${person.id}`} className="focus-ring flex items-center gap-3 rounded-md"><span className="flex size-9 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">{person.name.slice(0, 1).toUpperCase()}</span><span><span className="block font-semibold">{person.name}</span><span className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><Mail className="size-3" />{person.email}</span></span></Link></td><td className="px-4 py-4 text-muted-foreground"><span className="flex items-center gap-1.5"><Phone className="size-3.5" />{person.phone}</span></td><td className="px-4 py-4 text-muted-foreground">{person.role || "Sin rol asignado"}</td><td className="px-4 py-4"><Badge variant={person.status === "active" ? "active" : "inactive"}>{person.status === "active" ? "Activo" : "Inactivo"}</Badge></td><td className="px-5 py-4"><div className="flex justify-end gap-1"><Button variant="ghost" size="icon" onClick={() => onEdit(person)} aria-label={`Editar a ${person.name}`}><Pencil className="size-4" /></Button><Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => onDelete(person)} aria-label={`Eliminar a ${person.name}`}><Trash2 className="size-4" /></Button><Button asChild variant="ghost" size="icon" aria-label={`Ver detalle de ${person.name}`}><Link to={`/persons/${person.id}`}><ArrowUpRight className="size-4" /></Link></Button></div></td></tr>)}</tbody></table></div>;
}
