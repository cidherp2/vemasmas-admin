import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, KeyRound, ShieldCheck, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/errors";
import { loginSchema, type LoginValues } from "@/lib/validation";

export function LoginPage(): React.ReactElement {
  const { status, isDevelopmentFallback, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname ?? "/dashboard";

  const onSubmit = async (values: LoginValues): Promise<void> => {
    setSubmitError(null);
    try {
      await signIn(values.email.toLowerCase(), values.password);
      navigate(from, { replace: true });
    } catch (error) {
      setSubmitError(
        getErrorMessage(error, "El correo o la contraseña no son correctos."),
      );
    }
  };

  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)]">
      <section className="relative hidden overflow-hidden bg-[var(--sidebar)] px-12 py-12 text-white lg:flex lg:flex-col lg:justify-between xl:px-20">
        <div className="absolute -right-32 -top-32 size-96 rounded-full border-[42px] border-[#3e9d79]/20" />
        <div className="absolute bottom-20 left-[-120px] size-80 rounded-full border-[34px] border-[#f2b84b]/15" />
        <div className="relative">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-[var(--accent)] font-display text-sm font-bold text-[var(--accent-foreground)]">
              VM
            </span>
            <span className="font-display text-xl font-semibold">
              vemas<span className="text-[#8ed4b7]">mas</span>
            </span>
          </div>
          <div className="mt-28 max-w-xl">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-[#9bd9c0]">
              People operations, with intent
            </p>
            <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-[-0.055em] xl:text-7xl">
              Tu equipo merece un sistema que respire.
            </h1>
            <p className="mt-7 max-w-md text-base leading-7 text-[#b6d0c8]">
              Una vista serena para las decisiones que mantienen a las personas
              en el centro del trabajo.
            </p>
          </div>
        </div>
        <div className="relative flex items-center gap-8 text-xs text-[#9abdb2]">
          <span className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-[#9bd9c0]" />
            Acceso seguro
          </span>
          <span className="flex items-center gap-2">
            <Sparkles className="size-4 text-[var(--accent)]" />
            Hecho para equipos humanos
          </span>
        </div>
      </section>
      <section className="flex items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary font-display text-sm font-bold text-primary-foreground">
                VM
              </span>
              <span className="font-display text-xl font-semibold">
                vemas<span className="text-primary">mas</span>
              </span>
            </div>
          </div>
          <div className="mb-8">
            <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
              <KeyRound className="size-5" />
            </div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Área privada
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-[-0.045em]">
              Bienvenido de vuelta
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Accede al centro de administración de tu equipo.
            </p>
          </div>
          {isDevelopmentFallback && (
            <Alert className="mb-5 border-[#efd48d] bg-[#fff8e5] text-[#74500a] dark:bg-[#352a12] dark:text-[#f4d77f]">
              <AlertTitle>Modo local simulado</AlertTitle>
              <AlertDescription className="text-current/75">
                Supabase no está configurado. Usa cualquier correo y una
                contraseña de 6 caracteres o más.
              </AlertDescription>
            </Alert>
          )}
          {status === "configuration-error" && (
            <Alert className="mb-5 border-destructive/30">
              <AlertTitle>Configuración pendiente</AlertTitle>
              <AlertDescription>
                Configura las variables públicas de Supabase para iniciar sesión
                en producción.
              </AlertDescription>
            </Alert>
          )}
          {submitError && (
            <Alert className="mb-5 border-destructive/30">
              <AlertTitle>No pudimos iniciar sesión</AlertTitle>
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}
          <form
            className="space-y-5"
            onSubmit={(event) => void handleSubmit(onSubmit)(event)}
            noValidate
          >
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="tu@empresa.com"
                aria-invalid={Boolean(errors.email)}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs font-medium text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <span className="text-xs text-muted-foreground">
                  Acceso protegido
                </span>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                aria-invalid={Boolean(errors.password)}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs font-medium text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button
              className="w-full"
              size="lg"
              type="submit"
              disabled={isSubmitting || status === "configuration-error"}
            >
              {isSubmitting ? "Comprobando acceso..." : "Entrar al panel"}
              {!isSubmitting && <ArrowRight className="size-4" />}
            </Button>
          </form>
          <p className="mt-8 text-center text-xs leading-5 text-muted-foreground">
            Al entrar confirmas que tienes autorización para gestionar la
            información de tu organización.
          </p>
        </div>
      </section>
    </main>
  );
}
