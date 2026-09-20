import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Introduce un correo válido."),
  password: z.string().min(1, "Introduce tu contraseña."),
});

export const registerSchema = z
  .object({
    email: z.string().trim().email("Introduce un correo válido."),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres."),
    confirmPassword: z.string().min(1, "Confirma tu contraseña."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden.",
  });

export const personSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio."),
  email: z.string().trim().email("Introduce un correo válido."),
  phone: z
    .string()
    .regex(/^\d{10}$/, "El teléfono debe tener exactamente 10 dígitos."),
  role: z.string().trim().optional(),
  status: z.enum(["active", "inactive"]),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type PersonValues = z.infer<typeof personSchema>;
