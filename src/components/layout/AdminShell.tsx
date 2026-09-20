import { Suspense, useState } from "react";
import { Outlet } from "react-router-dom";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

export function AdminShell(): React.ReactElement {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return <div className="min-h-screen bg-background text-foreground"><Sidebar collapsed={collapsed} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} onToggle={() => setCollapsed((current) => !current)} /><div className={collapsed ? "min-h-screen transition-[padding] lg:pl-[84px]" : "min-h-screen transition-[padding] lg:pl-64"}><Header onMenuClick={() => setMobileOpen(true)} /><main className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10"><Suspense fallback={<div className="space-y-4"><div className="h-8 w-48 animate-pulse rounded bg-muted" /><div className="h-48 animate-pulse rounded-xl bg-muted" /></div>}><Outlet /></Suspense></main></div></div>;
}
