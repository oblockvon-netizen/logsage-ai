import type React from "react";
import { Activity } from "lucide-react";
import { PageTransition } from "@/components/animations/page-transition";

export function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <PageTransition>
      <main className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden border-r border-slate-800/80 bg-slate-950/40 p-10 lg:flex lg:flex-col lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-sky-400/30 bg-sky-400/10 text-sky-300">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-white">LogSage AI</p>
              <p className="text-sm text-slate-400">Transform Logs Into Security Intelligence</p>
            </div>
          </div>
          <div className="max-w-xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">AI security workspace</p>
            <h1 className="text-4xl font-black leading-tight text-white">Turn noisy logs into confident security decisions.</h1>
            <p className="mt-5 text-base leading-7 text-slate-300">
              Designed for analysts who need clear evidence, severity context, and polished incident reporting without losing the signal.
            </p>
          </div>
          <p className="text-sm text-slate-500">Phase 1 user-only experience</p>
        </section>
        <section className="flex items-center justify-center px-4 py-10">
          <div className="glass-panel glow-border w-full max-w-md rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">{title}</h2>
              <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
            </div>
            {children}
          </div>
        </section>
      </main>
    </PageTransition>
  );
}
