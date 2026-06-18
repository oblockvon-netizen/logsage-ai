"use client";

import type React from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PageTransition } from "@/components/animations/page-transition";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { useCurrentUser } from "@/hooks/use-auth";
import { getAccessToken } from "@/lib/token-storage";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isError, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!getAccessToken() || isError) {
      router.replace("/login");
    }
  }, [isError, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm font-semibold text-slate-400">
        Loading protected workspace...
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="flex min-h-screen bg-transparent">
        <Sidebar />
        <div className="min-w-0 flex-1">
          <Navbar />
          <main className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6">{children}</main>
        </div>
      </div>
    </PageTransition>
  );
}
