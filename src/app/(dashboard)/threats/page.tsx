"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Brain,
  Eye,
  FileSearch,
  Filter,
  Lightbulb,
  Search,
  ShieldAlert,
  Target,
  X
} from "lucide-react";
import { AnimatedCard } from "@/components/animations/animated-card";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { recentThreats } from "@/data/mock-data";

type Threat = (typeof recentThreats)[number];

const severityOptions = ["all", "critical", "high", "medium", "low"];
const severityBadge = {
  critical: "critical",
  high: "danger",
  medium: "warning",
  low: "success"
} as const;

export default function ThreatsPage() {
  const [query, setQuery] = useState("");
  const [severity, setSeverity] = useState("all");
  const [type, setType] = useState("all");
  const [selectedThreat, setSelectedThreat] = useState<Threat | null>(null);

  const threatTypes = useMemo(() => ["all", ...Array.from(new Set(recentThreats.map((threat) => threat.type)))], []);

  const filteredThreats = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return recentThreats.filter((threat) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [threat.name, threat.id, threat.type, threat.source, threat.target, threat.evidence, threat.aiPreview]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesSeverity = severity === "all" || threat.severity === severity;
      const matchesType = type === "all" || threat.type === type;

      return matchesQuery && matchesSeverity && matchesType;
    });
  }, [query, severity, type]);

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">Threat triage</p>
          <h1 className="mt-2 text-3xl font-black text-white">Threats</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Search, filter, and inspect mock detections with evidence and AI explanation previews.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-red-400/20 bg-red-500/10 px-4 py-3 text-red-100">
          <ShieldAlert className="h-5 w-5" />
          <div>
            <p className="text-xs text-red-200/70">Open critical alerts</p>
            <p className="text-sm font-bold">{recentThreats.filter((threat) => threat.severity === "critical").length} needs review</p>
          </div>
        </div>
      </div>

      <AnimatedCard className="mb-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-500" />
            <Input
              className="pl-9"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title, source IP, target, evidence, or AI preview..."
            />
          </div>
          <FilterSelect label="Severity" value={severity} onChange={setSeverity} options={severityOptions} />
          <FilterSelect label="Threat type" value={type} onChange={setType} options={threatTypes} />
        </div>
      </AnimatedCard>

      <AnimatedCard className="p-0">
        <div className="flex flex-col gap-3 border-b border-slate-800 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Threat table</h2>
            <p className="mt-1 text-sm text-slate-500">{filteredThreats.length} detections match the current filters</p>
          </div>
          <Badge variant="muted">Mock data</Badge>
        </div>

        {filteredThreats.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center p-8 text-center">
            <FileSearch className="h-12 w-12 text-slate-600" />
            <h3 className="mt-4 text-xl font-bold text-white">No threats found</h3>
            <p className="mt-2 max-w-md text-sm text-slate-500">Adjust the search text or filters to return mock detections.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="border-b border-slate-800 bg-slate-950/50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Threat</th>
                  <th className="px-5 py-3 font-semibold">Severity</th>
                  <th className="px-5 py-3 font-semibold">Source IP</th>
                  <th className="px-5 py-3 font-semibold">Evidence preview</th>
                  <th className="px-5 py-3 font-semibold">AI explanation preview</th>
                  <th className="px-5 py-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredThreats.map((threat) => (
                  <tr key={threat.id} className="transition hover:bg-slate-900/60">
                    <td className="px-5 py-4 align-top">
                      <p className="font-semibold text-white">{threat.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{threat.id} · {threat.type} · {threat.detectedAt}</p>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <Badge variant={severityBadge[threat.severity as keyof typeof severityBadge]}>{threat.severity}</Badge>
                    </td>
                    <td className="px-5 py-4 align-top font-mono text-xs text-slate-300">{threat.source}</td>
                    <td className="max-w-xs px-5 py-4 align-top text-slate-300">
                      <p className="line-clamp-2 leading-6">{threat.evidence}</p>
                    </td>
                    <td className="max-w-xs px-5 py-4 align-top text-slate-400">
                      <p className="line-clamp-2 leading-6">{threat.aiPreview}</p>
                    </td>
                    <td className="px-5 py-4 text-right align-top">
                      <Button size="sm" variant="outline" onClick={() => setSelectedThreat(threat)}>
                        <Eye className="h-4 w-4" />
                        View details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AnimatedCard>

      {selectedThreat ? <ThreatDetailModal threat={selectedThreat} onClose={() => setSelectedThreat(null)} /> : null}
    </DashboardLayout>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="grid gap-1">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 min-w-44 rounded-md border border-slate-700 bg-slate-950/70 px-3 text-sm font-medium text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option === "all" ? "All" : option}
          </option>
        ))}
      </select>
    </label>
  );
}

function ThreatDetailModal({ threat, onClose }: { threat: Threat; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.22 }}
        className="glass-panel glow-border max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-lg"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 p-5">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={severityBadge[threat.severity as keyof typeof severityBadge]}>{threat.severity}</Badge>
              <Badge variant="muted">{threat.type}</Badge>
              <Badge>{threat.confidence}% confidence</Badge>
            </div>
            <h2 className="mt-4 text-2xl font-black text-white">{threat.name}</h2>
            <p className="mt-2 text-sm text-slate-500">
              {threat.id} · Source {threat.source} · Target {threat.target}
            </p>
          </div>
          <Button size="icon" variant="ghost" aria-label="Close threat details" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="max-h-[calc(90vh-132px)] overflow-y-auto p-5">
          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <DetailCard icon={Brain} title="Summary" content={threat.summary} />
            <DetailCard icon={FileSearch} title="Evidence" content={threat.evidence} />
            <DetailCard icon={Target} title="Impact" content={threat.impact} />
            <DetailCard icon={ShieldAlert} title="Possible attacker behavior" content={threat.attackerBehavior} />
            <DetailCard icon={ShieldAlert} title="Severity reasoning" content={threat.severityReasoning} />
            <DetailCard icon={Lightbulb} title="Analyst notes" content={threat.analystNotes} />
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
            <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Confidence score</p>
              <p className="mt-4 text-5xl font-black text-white">{threat.confidence}%</p>
              <div className="mt-4 h-2 rounded-full bg-slate-800">
                <div className="h-2 rounded-full bg-sky-400" style={{ width: `${threat.confidence}%` }} />
              </div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Recommended next steps</p>
              <div className="mt-4 space-y-3">
                {threat.recommendedNextSteps.map((step) => (
                  <div key={step} className="rounded-md border border-slate-800 bg-slate-900/60 p-3 text-sm text-slate-300">
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function DetailCard({ icon: Icon, title, content }: { icon: LucideIcon; title: string; content: string }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-5 w-5 text-sky-300" />
        <h3 className="font-bold text-white">{title}</h3>
      </div>
      <p className="text-sm leading-6 text-slate-400">{content}</p>
    </div>
  );
}
