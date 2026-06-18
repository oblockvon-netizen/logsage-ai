import { Activity, FileText, ShieldAlert, UploadCloud } from "lucide-react";
import { AnimatedCard } from "@/components/animations/animated-card";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { recentThreats, stats, uploads } from "@/data/mock-data";

const icons = [UploadCloud, ShieldAlert, Activity, FileText];

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">Dashboard</p>
        <h1 className="mt-2 text-3xl font-black text-white">Security intelligence overview</h1>
      </div>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = icons[index];
          return (
            <Card key={stat.label} className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">{stat.label}</p>
                <Icon className="h-5 w-5 text-sky-300" />
              </div>
              <p className="mt-4 text-3xl font-black text-white">{stat.value}</p>
            </Card>
          );
        })}
      </section>
      <section className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <AnimatedCard>
          <h2 className="text-lg font-bold text-white">Threat severity chart</h2>
          <div className="mt-5 grid h-64 grid-cols-4 items-end gap-3">
            {[42, 68, 36, 84].map((height, index) => (
              <div key={height} className="flex h-full items-end rounded-md bg-slate-950/60 p-2">
                <div className="w-full rounded bg-sky-400/80" style={{ height: `${height}%` }} />
              </div>
            ))}
          </div>
        </AnimatedCard>
        <AnimatedCard>
          <h2 className="text-lg font-bold text-white">Recent threats</h2>
          <div className="mt-4 space-y-3">
            {recentThreats.map((threat) => (
              <div key={threat.name} className="rounded-md border border-slate-800 bg-slate-950/45 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-slate-100">{threat.name}</p>
                  <Badge variant={threat.severity === "critical" ? "critical" : threat.severity === "high" ? "danger" : "warning"}>
                    {threat.severity}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-slate-500">{threat.source}</p>
              </div>
            ))}
          </div>
        </AnimatedCard>
      </section>
      <section className="mt-4 grid gap-4 lg:grid-cols-3">
        {uploads.map((upload) => (
          <AnimatedCard key={upload.file}>
            <p className="font-semibold text-white">{upload.file}</p>
            <p className="mt-2 text-sm text-slate-400">{upload.size}</p>
            <Badge className="mt-4" variant="muted">{upload.status}</Badge>
          </AnimatedCard>
        ))}
      </section>
    </DashboardLayout>
  );
}
