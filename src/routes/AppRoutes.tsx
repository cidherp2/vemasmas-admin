import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AdminShell } from "@/components/layout/AdminShell";
import { DashboardPage } from "@/pages/DashboardPage";
import { LoginPage } from "@/pages/LoginPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { PersonDetailPage } from "@/pages/PersonDetailPage";
import { PersonsPage } from "@/pages/PersonsPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { RouteErrorFallback } from "@/routes/RouteErrorFallback";

export function AppRoutes(): React.ReactElement {
  return <BrowserRouter><Routes><Route path="/login" element={<LoginPage />} /><Route element={<ProtectedRoute />}><Route element={<ErrorBoundary FallbackComponent={RouteErrorFallback}><AdminShell /></ErrorBoundary>}><Route index element={<Navigate to="/dashboard" replace />} /><Route path="dashboard" element={<DashboardPage />} /><Route path="persons" element={<PersonsPage />} /><Route path="persons/:personId" element={<PersonDetailPage />} /><Route path="settings" element={<SettingsPage />} /><Route path="*" element={<NotFoundPage />} /></Route></Route></Routes></BrowserRouter>;
}
