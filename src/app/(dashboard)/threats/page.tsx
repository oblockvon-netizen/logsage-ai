import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { recentThreats } from "@/data/mock-data";

export default function ThreatsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Threats</h1>
          <p className="mt-2 text-slate-400">Mock threat table and filter surface.</p>
        </div>
        <Input className="max-w-sm" placeholder="Search mock threats..." />
      </div>
      <div className="mt-6 overflow-hidden rounded-lg border border-slate-800 bg-slate-950/50">
        {recentThreats.map((threat) => (
          <div key={threat.name} className="grid gap-3 border-b border-slate-800 p-4 last:border-b-0 md:grid-cols-[1fr_auto_auto]">
            <p className="font-medium text-white">{threat.name}</p>
            <p className="text-sm text-slate-400">{threat.source}</p>
            <Badge variant={threat.severity === "critical" ? "critical" : threat.severity === "high" ? "danger" : "warning"}>{threat.severity}</Badge>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
