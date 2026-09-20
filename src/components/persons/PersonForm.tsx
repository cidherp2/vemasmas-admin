import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { personSchema, type PersonValues } from "@/lib/validation";
import type { Person, PersonPayload } from "@/types/person";

interface PersonFormProps {
  person?: Person | null | undefined;
  onSubmit: (payload: PersonPayload) => Promise<void>;
  onCancel?: () => void;
  submitting?: boolean;
  error?: string | null | undefined;
  submitLabel?: string;
}

export function PersonForm({
  person,
  onSubmit,
  onCancel,
  submitting = false,
  error,
  submitLabel = "Guardar persona",
}: PersonFormProps): React.ReactElement {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PersonValues>({
    resolver: zodResolver(personSchema),
    defaultValues: {
      name: person?.name ?? "",
      email: person?.email ?? "",
      phone: person?.phone ?? "",
      role: person?.role ?? "",
      status: person?.status ?? "active",
    },
  });

  const submit = async (values: PersonValues): Promise<void> => {
    await onSubmit({ ...values, role: values.role?.trim() || null });
  };

  return (
    <form className="space-y-5" onSubmit={(event) => void handleSubmit(submit)(event)} noValidate>
      {error && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">{error}</p>}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="person-name">Nombre completo</Label>
          <Input id="person-name" placeholder="Ej. Ana Martínez" aria-invalid={Boolean(errors.name)} {...register("name")} />
          {errors.name && <p className="text-xs font-medium text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="person-email">Correo electrónico</Label>
          <Input id="person-email" type="email" placeholder="ana@empresa.com" aria-invalid={Boolean(errors.email)} {...register("email")} />
          {errors.email && <p className="text-xs font-medium text-destructive">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="person-phone">Teléfono</Label>
          <Input id="person-phone" inputMode="numeric" maxLength={10} placeholder="5512345678" aria-invalid={Boolean(errors.phone)} {...register("phone")} />
          {errors.phone && <p className="text-xs font-medium text-destructive">{errors.phone.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="person-role">Rol o puesto <span className="font-normal text-muted-foreground">(opcional)</span></Label>
          <Input id="person-role" placeholder="Ej. Diseñadora de producto" {...register("role")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="person-status">Estado</Label>
          <Select defaultValue={person?.status ?? "active"} onValueChange={(value) => setValue("status", value as PersonValues["status"], { shouldValidate: true })}>
            <SelectTrigger id="person-status"><SelectValue placeholder="Selecciona un estado" /></SelectTrigger>
            <SelectContent><SelectItem value="active">Activo</SelectItem><SelectItem value="inactive">Inactivo</SelectItem></SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-col-reverse gap-2 border-t pt-5 sm:flex-row sm:justify-end">
        {onCancel && <Button variant="outline" onClick={onCancel} disabled={submitting}>Cancelar</Button>}
        <Button type="submit" disabled={submitting}>{submitting ? "Guardando..." : submitLabel}</Button>
      </div>
    </form>
  );
}
