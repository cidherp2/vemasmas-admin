import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, CheckCircle2, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/errors";
import { registerSchema, type RegisterValues } from "@/lib/validation";

export function RegisterPage(): React.ReactElement {
  const { status, isDevelopmentFallback, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });
  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname ?? "/dashboard";

  const onSubmit = async (values: RegisterValues): Promise<void> => {
    setSubmitError(null);
    setSuccessMessage(null);
    try {
      const result = await signUp(values.email.toLowerCase(), values.password);
      if (result.requiresEmailConfirmation) {
        setSuccessMessage(
          "Cuenta creada. Revisa tu correo para confirmar la cuenta y después inicia sesión.",
        );
        return;
      }
      navigate(from, { replace: true });
    } catch (error) {
      setSubmitError(getErrorMessage(error, "No pudimos crear la cuenta."));
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-10 sm:px-8">
      <section className="w-full max-w-md">
        <Link className="focus-ring mb-8 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground" to="/login">
          <ArrowLeft className="size-4" />Volver a iniciar sesión
        </Link>
        <div className="mb-8">
          <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
            <UserPlus className="size-5" />
          </div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">Demo de vemasmas</p>
          <h1 className="font-display text-3xl font-semibold tracking-[-0.045em]">Crea tu cuenta</h1>
          <p className="mt-2 text-sm text-muted-foreground">Regístrate para explorar el panel de administración.</p>
        </div>
        {isDevelopmentFallback && <Alert className="mb-5 border-[#efd48d] bg-[#fff8e5] text-[#74500a] dark:bg-[#352a12] dark:text-[#f4d77f]"><AlertTitle>Modo local simulado</AlertTitle><AlertDescription className="text-current/75">La cuenta se guardará solo en este navegador.</AlertDescription></Alert>}
        {status === "configuration-error" && <Alert className="mb-5 border-destructive/30"><AlertTitle>Configuración pendiente</AlertTitle><AlertDescription>Configura Supabase para habilitar el registro.</AlertDescription></Alert>}
        {successMessage && <Alert className="mb-5 border-primary/30 bg-secondary"><CheckCircle2 className="mb-2 size-5 text-primary" /><AlertTitle>Registro recibido</AlertTitle><AlertDescription>{successMessage}</AlertDescription></Alert>}
        {submitError && <Alert className="mb-5 border-destructive/30"><AlertTitle>No pudimos crear la cuenta</AlertTitle><AlertDescription>{submitError}</AlertDescription></Alert>}
        <form className="space-y-5" onSubmit={(event) => void handleSubmit(onSubmit)(event)} noValidate>
          <div className="space-y-2"><Label htmlFor="register-email">Correo electrónico</Label><Input id="register-email" type="email" autoComplete="email" placeholder="tu@empresa.com" aria-invalid={Boolean(errors.email)} {...register("email")} />{errors.email && <p className="text-xs font-medium text-destructive">{errors.email.message}</p>}</div>
          <div className="space-y-2"><Label htmlFor="register-password">Contraseña</Label><Input id="register-password" type="password" autoComplete="new-password" placeholder="Mínimo 6 caracteres" aria-invalid={Boolean(errors.password)} {...register("password")} />{errors.password && <p className="text-xs font-medium text-destructive">{errors.password.message}</p>}</div>
          <div className="space-y-2"><Label htmlFor="register-confirm-password">Confirmar contraseña</Label><Input id="register-confirm-password" type="password" autoComplete="new-password" placeholder="Repite tu contraseña" aria-invalid={Boolean(errors.confirmPassword)} {...register("confirmPassword")} />{errors.confirmPassword && <p className="text-xs font-medium text-destructive">{errors.confirmPassword.message}</p>}</div>
          <Button className="w-full" size="lg" type="submit" disabled={isSubmitting || status === "configuration-error" || Boolean(successMessage)}>{isSubmitting ? "Creando cuenta..." : "Crear cuenta"}{!isSubmitting && <ArrowRight className="size-4" />}</Button>
        </form>
        <p className="mt-8 text-center text-xs leading-5 text-muted-foreground">Al registrarte aceptas usar este entorno como demo. Los datos pueden ser visibles para otros usuarios autenticados.</p>
      </section>
    </main>
  );
}
