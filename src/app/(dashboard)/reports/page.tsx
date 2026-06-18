"use client";

import type React from "react";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { LucideIcon } from "lucide-react";
import { BarChart3, CheckCircle2, Clock3, Download, FileText, Flag, Lightbulb, ListChecks, Loader2, TerminalSquare } from "lucide-react";
import { AnimatedCard } from "@/components/animations/animated-card";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { api, type ApiReport } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function ReportsPage() {
  const [selectedReportId, setSelectedReportId] = useState<string | undefined>();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const reportsQuery = useQuery({ queryKey: ["reports"], queryFn: api.getReports });
  const logsQuery = useQuery({ queryKey: ["logs"], queryFn: api.getLogs });
  const generateMutation = useMutation({
    mutationFn: api.generateReport,
    onSuccess: async (data) => {
      setSelectedReportId(data.report.id);
      await queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast({ title: "Report generated", description: data.report.title });
    },
    onError: (err) => toast({ title: "Report generation failed", description: err instanceof Error ? err.message : "Try again.", variant: "error" })
  });
  const reports = reportsQuery.data?.reports ?? [];
  const selectedReport = useMemo(() => reports.find((report) => report.id === selectedReportId) ?? reports[0], [reports, selectedReportId]);
  const latestLog = logsQuery.data?.logFiles[0];

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">Incident reporting</p>
          <h1 className="mt-2 text-3xl font-black text-white">Reports</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Generate and review backend incident reports from analyzed logs.</p>
        </div>
        <Button disabled={!latestLog || generateMutation.isPending} onClick={() => latestLog && generateMutation.mutate(latestLog.id)}>
          {generateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
          Generate from latest log
        </Button>
      </div>

      {reportsQuery.isLoading ? <State text="Loading reports..." /> : null}
      {reportsQuery.isError ? <State text="Could not load reports." error /> : null}
      {!reportsQuery.isLoading && reports.length === 0 ? <State text="No reports yet. Analyze a log, then generate a report." /> : null}

      {reports.length ? (
        <>
          <section className="grid gap-4 lg:grid-cols-3">
            {reports.map((report) => <ReportCard key={report.id} report={report} selected={report.id === selectedReport?.id} onSelect={() => setSelectedReportId(report.id)} />)}
          </section>
          {selectedReport ? <ReportDetail report={selectedReport} /> : null}
        </>
      ) : null}
    </DashboardLayout>
  );
}

function ReportCard({ report, selected, onSelect }: { report: ApiReport; selected: boolean; onSelect: () => void }) {
  return (
    <Card role="button" tabIndex={0} onClick={onSelect} className={cn("cursor-pointer p-5 transition hover:border-sky-400/50", selected && "border-sky-400/70 bg-sky-400/10")}>
      <FileText className="h-6 w-6 text-sky-300" />
      <h2 className="mt-4 text-lg font-bold text-white">{report.title}</h2>
      <p className="mt-2 text-sm text-slate-500">{new Date(report.createdAt).toLocaleString()}</p>
      <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-400">{report.executiveSummary}</p>
    </Card>
  );
}

function ReportDetail({ report }: { report: ApiReport }) {
  const timeline = Array.isArray(report.timelineOfSuspiciousActivity) ? report.timelineOfSuspiciousActivity as Array<{ time: string; event: string }> : [];
  const severity = report.severityBreakdown && typeof report.severityBreakdown === "object" ? report.severityBreakdown as Record<string, number> : {};
  return (
    <section className="mt-4 grid gap-4 xl:grid-cols-[0.72fr_1.28fr]">
      <AnimatedCard className="h-fit">
        <h2 className="text-2xl font-black text-white">{report.title}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-400">{report.executiveSummary}</p>
        <Button className="mt-6 w-full" variant="outline" onClick={() => window.alert("PDF export placeholder. Backend PDF generation can be added later.")}>
          <Download className="h-4 w-4" />Download PDF placeholder
        </Button>
      </AnimatedCard>
      <div className="space-y-4">
        <Section icon={Clock3} title="Timeline of suspicious activity">{timeline.map((item) => <p key={`${item.time}-${item.event}`} className="rounded-md border border-slate-800 bg-slate-950/50 p-3 text-sm text-slate-300">{item.time}: {item.event}</p>)}</Section>
        <div className="grid gap-4 lg:grid-cols-2">
          <Section icon={Flag} title="Key indicators of compromise"><Pills items={report.keyIndicatorsOfCompromise} /></Section>
          <Section icon={BarChart3} title="Severity breakdown">{Object.entries(severity).map(([key, value]) => <p key={key} className="flex justify-between text-sm text-slate-300"><span>{key}</span><span className="font-bold text-white">{value}</span></p>)}</Section>
        </div>
        <Section icon={TerminalSquare} title="Technical findings"><Bullets items={report.technicalFindings} /></Section>
        <Section icon={Lightbulb} title="Recommended remediation"><Bullets items={report.recommendedRemediation} /></Section>
        <Section icon={Lightbulb} title="Prevention tips"><Bullets items={report.preventionTips} /></Section>
        <Section icon={ListChecks} title="Final analyst conclusion"><p className="text-sm leading-7 text-slate-300">{report.finalAnalystConclusion}</p></Section>
      </div>
    </section>
  );
}

function Section({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: React.ReactNode }) {
  return <AnimatedCard><div className="mb-4 flex items-center gap-3"><Icon className="h-5 w-5 text-sky-300" /><h3 className="text-lg font-bold text-white">{title}</h3></div><div className="space-y-3">{children}</div></AnimatedCard>;
}

function Pills({ items }: { items: string[] }) {
  return <div className="flex flex-wrap gap-2">{items.map((item) => <Badge key={item} variant="muted">{item}</Badge>)}</div>;
}

function Bullets({ items }: { items: string[] }) {
  return <>{items.map((item) => <div key={item} className="flex gap-3 rounded-lg border border-slate-800 bg-slate-950/50 p-3 text-sm text-slate-300"><CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" />{item}</div>)}</>;
}

function State({ text, error }: { text: string; error?: boolean }) {
  return <div className={`glass-panel rounded-lg p-8 text-center text-sm ${error ? "text-red-300" : "text-slate-400"}`}>{text}</div>;
}
