import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";

export function ProtectedRoute(): React.ReactElement {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <Skeleton className="h-24 w-full max-w-md" />
      </div>
    );
  }
  if (status === "configuration-error")
    return <Navigate to="/login" replace state={{ from: location }} />;
  if (status !== "authenticated")
    return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}
