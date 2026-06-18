"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  Flag,
  Lightbulb,
  ListChecks,
  ShieldAlert,
  TerminalSquare
} from "lucide-react";
import { AnimatedCard } from "@/components/animations/animated-card";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { incidentReports } from "@/data/mock-data";

type IncidentReport = (typeof incidentReports)[number];

const severityBadge = {
  critical: "critical",
  high: "danger",
  medium: "warning",
  low: "success"
} as const;

export default function ReportsPage() {
  const [selectedReportId, setSelectedReportId] = useState(incidentReports[0]?.id);
  const selectedReport = incidentReports.find((report) => report.id === selectedReportId) ?? incidentReports[0];

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">Incident reporting</p>
          <h1 className="mt-2 text-3xl font-black text-white">Reports</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Review AI-generated mock incident reports with executive summaries, technical findings, and remediation guidance.
          </p>
        </div>
        <Button variant="outline" onClick={() => window.alert("PDF export placeholder. Backend generation will be connected later.")}>
          <Download className="h-4 w-4" />
          Download PDF placeholder
        </Button>
      </div>

      <section className="grid gap-4 lg:grid-cols-3">
        {incidentReports.map((report) => (
          <ReportCard
            key={report.id}
            report={report}
            selected={report.id === selectedReport.id}
            onSelect={() => setSelectedReportId(report.id)}
          />
        ))}
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[0.72fr_1.28fr]">
        <AnimatedCard className="h-fit">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">{selectedReport.id}</p>
              <h2 className="mt-2 text-2xl font-black leading-tight text-white">{selectedReport.title}</h2>
            </div>
            <Badge variant={severityBadge[selectedReport.severity as keyof typeof severityBadge]}>{selectedReport.severity}</Badge>
          </div>

          <div className="mt-5 grid gap-3">
            <MetaRow icon={FileText} label="Source file" value={selectedReport.sourceFile} />
            <MetaRow icon={Clock3} label="Generated" value={selectedReport.generatedAt} />
            <MetaRow icon={ShieldAlert} label="Confidence" value={`${selectedReport.confidence}%`} />
            <MetaRow icon={CheckCircle2} label="Status" value={selectedReport.status} />
          </div>

          <div className="mt-6 rounded-lg border border-slate-800 bg-slate-950/50 p-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Download PDF placeholder</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              This button previews the future export action. No file is generated until backend reporting is connected.
            </p>
            <Button className="mt-4 w-full" variant="outline" onClick={() => window.alert(`PDF placeholder for ${selectedReport.id}`)}>
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </AnimatedCard>

        <div className="space-y-4">
          <ReportSection icon={FileText} title="Executive summary">
            <p className="text-sm leading-7 text-slate-300">{selectedReport.summary}</p>
          </ReportSection>

          <ReportSection icon={Clock3} title="Timeline of suspicious activity">
            <div className="space-y-3">
              {selectedReport.timeline.map((item) => (
                <div key={`${item.time}-${item.event}`} className="grid gap-3 rounded-lg border border-slate-800 bg-slate-950/50 p-4 sm:grid-cols-[80px_1fr]">
                  <p className="font-mono text-sm font-bold text-sky-300">{item.time}</p>
                  <p className="text-sm leading-6 text-slate-300">{item.event}</p>
                </div>
              ))}
            </div>
          </ReportSection>

          <div className="grid gap-4 lg:grid-cols-2">
            <ReportSection icon={Flag} title="Key indicators of compromise">
              <div className="flex flex-wrap gap-2">
                {selectedReport.indicators.map((indicator) => (
                  <Badge key={indicator} variant="muted" className="font-mono">
                    {indicator}
                  </Badge>
                ))}
              </div>
            </ReportSection>

            <ReportSection icon={BarChart3} title="Severity breakdown">
              <div className="space-y-3">
                {selectedReport.severityBreakdown.map((item) => (
                  <div key={item.label}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-slate-300">{item.label}</span>
                      <span className="font-bold text-white">{item.value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800">
                      <div
                        className="h-2 rounded-full"
                        style={{ width: `${Math.max(8, item.value * 10)}%`, background: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </ReportSection>
          </div>

          <ReportSection icon={TerminalSquare} title="Technical findings">
            <BulletList items={selectedReport.technicalFindings} />
          </ReportSection>

          <ReportSection icon={Lightbulb} title="Recommendations">
            <BulletList items={selectedReport.recommendations} />
          </ReportSection>

          <ReportSection icon={ListChecks} title="Final analyst conclusion">
            <p className="text-sm leading-7 text-slate-300">{selectedReport.conclusion}</p>
          </ReportSection>
        </div>
      </section>
    </DashboardLayout>
  );
}

function ReportCard({ report, selected, onSelect }: { report: IncidentReport; selected: boolean; onSelect: () => void }) {
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          onSelect();
        }
      }}
      className={cn("cursor-pointer p-5 transition hover:border-sky-400/50", selected && "border-sky-400/70 bg-sky-400/10")}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-sky-400/20 bg-sky-400/10 text-sky-300">
          <FileText className="h-5 w-5" />
        </div>
        <Badge variant={report.status === "Ready" ? "success" : "warning"}>{report.status}</Badge>
      </div>
      <h2 className="mt-5 text-lg font-bold leading-tight text-white">{report.title}</h2>
      <p className="mt-2 text-sm text-slate-500">{report.id} · {report.generatedAt}</p>
      <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-400">{report.summary}</p>
      <div className="mt-5 flex items-center justify-between">
        <Badge variant={severityBadge[report.severity as keyof typeof severityBadge]}>{report.severity}</Badge>
        <span className="text-sm font-semibold text-sky-300">{report.confidence}% confidence</span>
      </div>
    </Card>
  );
}

function ReportSection({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: React.ReactNode }) {
  return (
    <AnimatedCard>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-sky-400/20 bg-sky-400/10 text-sky-300">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>
      {children}
    </AnimatedCard>
  );
}

function MetaRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/50 p-3">
      <Icon className="h-4 w-4 text-sky-300" />
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item} className="flex gap-3 rounded-lg border border-slate-800 bg-slate-950/50 p-3 text-sm leading-6 text-slate-300">
          <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-300" />
          {item}
        </div>
      ))}
    </div>
  );
}
