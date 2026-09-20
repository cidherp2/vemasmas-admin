export type AppErrorCode =
  | "AUTHENTICATION"
  | "CONFIGURATION"
  | "DUPLICATE"
  | "FORBIDDEN"
  | "NETWORK"
  | "NOT_FOUND"
  | "RATE_LIMIT"
  | "UNKNOWN"
  | "VALIDATION";

interface AppErrorOptions {
  cause?: unknown | undefined;
  status?: number | undefined;
}

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly status: number | undefined;

  constructor(
    code: AppErrorCode,
    message: string,
    options: AppErrorOptions = {},
  ) {
    super(message, { cause: options.cause });
    this.name = "AppError";
    this.code = code;
    this.status = options.status;
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function mapServiceError(error: unknown): AppError {
  if (error instanceof AppError) return error;
  if (error instanceof TypeError) {
    return new AppError("NETWORK", "No se pudo conectar con el servicio.", {
      cause: error,
    });
  }
  return new AppError("UNKNOWN", "Ha ocurrido un error inesperado.", {
    cause: error,
  });
}

export function mapSupabaseError(error: unknown): AppError {
  if (!error || typeof error !== "object") return mapServiceError(error);

  const candidate = error as {
    code?: unknown;
    message?: unknown;
    status?: unknown;
  };
  const code = typeof candidate.code === "string" ? candidate.code : "";
  const message =
    typeof candidate.message === "string"
      ? candidate.message
      : "Error de Supabase.";
  const status =
    typeof candidate.status === "number" ? candidate.status : undefined;

  if (status === 429 || code === "over_email_send_rate_limit")
    return new AppError(
      "RATE_LIMIT",
      "Supabase ha limitado temporalmente el envío de correos. Espera unos minutos o configura SMTP personalizado para el demo.",
      { cause: error, status },
    );
  if (code === "23505")
    return new AppError("DUPLICATE", "El correo ya está registrado.", {
      cause: error,
      status,
    });
  if (status === 401 || status === 403 || code === "42501") {
    return new AppError(
      "FORBIDDEN",
      "No tienes permisos para realizar esta acción.",
      { cause: error, status },
    );
  }
  if (status === 404)
    return new AppError("NOT_FOUND", "No se encontró el registro solicitado.", {
      cause: error,
      status,
    });
  if (status && status >= 500)
    return new AppError(
      "NETWORK",
      "El servicio no está disponible. Inténtalo de nuevo.",
      { cause: error, status },
    );
  return new AppError("UNKNOWN", message, { cause: error, status });
}

export function getErrorMessage(
  error: unknown,
  fallback = "No se pudo completar la operación.",
): string {
  if (isAppError(error)) return error.message;
  if (error instanceof Error) return error.message;
  return fallback;
}
