"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Eye, FileSearch, Search, ShieldAlert, X } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api, type ApiThreat } from "@/lib/api";
import { threatFilterSchema } from "@/lib/validations";

const severityBadge = { critical: "critical", high: "danger", medium: "warning", low: "success" } as const;

export default function ThreatsPage() {
  const [query, setQuery] = useState("");
  const [severity, setSeverity] = useState("all");
  const [type, setType] = useState("all");
  const [selectedThreat, setSelectedThreat] = useState<ApiThreat | null>(null);
  const threatsQuery = useQuery({ queryKey: ["threats"], queryFn: api.getThreats });
  const threats = threatsQuery.data?.threats ?? [];
  const threatTypes = useMemo(() => ["all", ...Array.from(new Set(threats.map((threat) => threat.threatType)))], [threats]);
  const filteredThreats = useMemo(() => {
    const validation = threatFilterSchema.safeParse({ query, severity, type });
    if (!validation.success) {
      return [];
    }
    const q = validation.data.query.toLowerCase();
    return threats.filter((threat) => {
      const matchesQuery = !q || [threat.threatType, threat.description, threat.sourceIp ?? "", threat.evidence, threat.aiExplanation?.simpleSummary ?? ""].join(" ").toLowerCase().includes(q);
      return matchesQuery && (validation.data.severity === "all" || threat.severity === validation.data.severity) && (validation.data.type === "all" || threat.threatType === validation.data.type);
    });
  }, [query, severity, threats, type]);

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">Threat triage</p>
          <h1 className="mt-2 text-3xl font-black text-white">Threats</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Backend detections from analyzed logs.</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-red-400/20 bg-red-500/10 px-4 py-3 text-red-100">
          <ShieldAlert className="h-5 w-5" /><p className="text-sm font-bold">{threats.filter((threat) => threat.severity === "critical").length} critical</p>
        </div>
      </div>

      <div className="glass-panel mb-4 rounded-lg p-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-500" />
            <Input className="pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search threats..." />
            {query.length > 120 ? <p className="mt-2 text-xs text-red-300">Search must be 120 characters or less.</p> : null}
          </div>
          <Select label="Severity" value={severity} onChange={setSeverity} options={["all", "critical", "high", "medium", "low"]} />
          <Select label="Threat type" value={type} onChange={setType} options={threatTypes} />
        </div>
      </div>

      <div className="glass-panel overflow-hidden rounded-lg">
        <div className="border-b border-slate-800 p-5">
          <h2 className="text-lg font-bold text-white">Threat table</h2>
          <p className="mt-1 text-sm text-slate-500">{filteredThreats.length} backend detections match the current filters</p>
        </div>
        {threatsQuery.isLoading ? <State text="Loading threats..." /> : null}
        {threatsQuery.isError ? <State text="Could not load threats." error /> : null}
        {!threatsQuery.isLoading && filteredThreats.length === 0 ? <State text="No threats yet. Upload and analyze a log first." /> : null}
        {filteredThreats.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="border-b border-slate-800 bg-slate-950/50 text-xs uppercase tracking-wide text-slate-500">
                <tr><th className="px-5 py-3">Threat</th><th className="px-5 py-3">Severity</th><th className="px-5 py-3">Source IP</th><th className="px-5 py-3">Evidence</th><th className="px-5 py-3">AI preview</th><th className="px-5 py-3 text-right">Action</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredThreats.map((threat) => (
                  <tr key={threat.id} className="hover:bg-slate-900/60">
                    <td className="px-5 py-4"><p className="font-semibold text-white">{threat.threatType}</p><p className="mt-1 text-xs text-slate-500">{threat.score}/100 score</p></td>
                    <td className="px-5 py-4"><Badge variant={severityBadge[threat.severity as keyof typeof severityBadge] ?? "muted"}>{threat.severity}</Badge></td>
                    <td className="px-5 py-4 font-mono text-xs text-slate-300">{threat.sourceIp ?? "unknown"}</td>
                    <td className="max-w-xs px-5 py-4 text-slate-300"><p className="line-clamp-2">{threat.evidence}</p></td>
                    <td className="max-w-xs px-5 py-4 text-slate-400"><p className="line-clamp-2">{threat.aiExplanation?.simpleSummary ?? threat.description}</p></td>
                    <td className="px-5 py-4 text-right"><Button size="sm" variant="outline" onClick={() => setSelectedThreat(threat)}><Eye className="h-4 w-4" />View details</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
      {selectedThreat ? <ThreatModal threat={selectedThreat} onClose={() => setSelectedThreat(null)} /> : null}
    </DashboardLayout>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return <label className="grid gap-1"><span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span><select value={value} onChange={(e) => onChange(e.target.value)} className="h-10 min-w-44 rounded-md border border-slate-700 bg-slate-950/70 px-3 text-sm text-slate-100">{options.map((option) => <option key={option} value={option}>{option === "all" ? "All" : option}</option>)}</select></label>;
}

function State({ text, error }: { text: string; error?: boolean }) {
  return <div className={`flex min-h-56 flex-col items-center justify-center p-8 text-center text-sm ${error ? "text-red-300" : "text-slate-500"}`}><FileSearch className="mb-3 h-10 w-10" />{text}</div>;
}

function ThreatModal({ threat, onClose }: { threat: ApiThreat; onClose: () => void }) {
  const explanation = threat.aiExplanation ?? {};
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-sm">
      <div className="glass-panel max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-lg p-5">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div><Badge variant={severityBadge[threat.severity as keyof typeof severityBadge] ?? "muted"}>{threat.severity}</Badge><h2 className="mt-3 text-2xl font-black text-white">{threat.threatType}</h2></div>
          <Button size="icon" variant="ghost" onClick={onClose}><X className="h-5 w-5" /></Button>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {[
            ["Summary", explanation.simpleSummary ?? threat.description],
            ["Evidence", explanation.evidenceFound ?? threat.evidence],
            ["Impact", explanation.businessImpact ?? "Review impact during triage."],
            ["Possible attacker behavior", explanation.possibleAttackerBehavior ?? "Suspicious behavior detected by rules."],
            ["Severity reasoning", explanation.severityReasoning ?? `${threat.score}/100 score.`],
            ["Analyst notes", explanation.analystNotes ?? "No analyst notes available."]
          ].map(([title, content]) => <div key={title} className="rounded-lg border border-slate-800 bg-slate-950/50 p-4"><h3 className="font-bold text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{content}</p></div>)}
        </div>
        <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950/50 p-4">
          <h3 className="font-bold text-white">Recommended next steps</h3>
          <div className="mt-3 space-y-2">{(explanation.recommendedNextSteps ?? []).map((step) => <p key={step} className="rounded-md bg-slate-900 p-3 text-sm text-slate-300">{step}</p>)}</div>
        </div>
      </div>
    </div>
  );
}
