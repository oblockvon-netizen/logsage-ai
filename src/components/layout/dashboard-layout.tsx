"use client";

import type React from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PageTransition } from "@/components/animations/page-transition";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/use-auth";
import { getAccessToken } from "@/lib/token-storage";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  const { isError, isLoading } = useCurrentUser();

  useEffect(() => {
    setHasToken(Boolean(getAccessToken()));
  }, []);

  useEffect(() => {
    if (hasToken === false || isError) {
      router.replace("/login");
    }
  }, [hasToken, isError, router]);

  if (hasToken !== true || isLoading) {
    return (
      <div className="flex min-h-screen bg-transparent">
        <div className="hidden min-h-screen w-72 border-r border-slate-800/80 bg-slate-950/70 p-5 lg:block">
          <Skeleton className="h-11 w-40" />
          <div className="mt-8 space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div className="flex-1 p-5 lg:p-7">
          <Skeleton className="h-12 w-full" />
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="flex min-h-screen bg-transparent">
        <Sidebar />
        {sidebarOpen ? <Sidebar mobile onClose={() => setSidebarOpen(false)} /> : null}
        <div className="min-w-0 flex-1">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-5 lg:px-6 lg:py-7">{children}</main>
        </div>
      </div>
    </PageTransition>
  );
}
