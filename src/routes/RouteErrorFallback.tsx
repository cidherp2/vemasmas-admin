import type { FallbackProps } from "react-error-boundary";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

export function RouteErrorFallback({
  resetErrorBoundary,
}: FallbackProps): React.ReactElement {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-[#fff0c8] text-[#8d6208] dark:bg-[#493817] dark:text-[#f4d77f]">
        <AlertTriangle className="size-6" />
      </span>
      <h1 className="font-display text-2xl font-semibold">
        Algo salió mal en esta vista.
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Puedes intentar cargarla de nuevo sin perder tu sesión.
      </p>
      <Button className="mt-5" onClick={resetErrorBoundary}>
        Intentar de nuevo
      </Button>
    </div>
  );
}
