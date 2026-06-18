"use client";

import type React from "react";
import {
  Activity,
  Brain,
  Clock3,
  Database,
  FileText,
  ShieldAlert,
  TrendingUp,
  UploadCloud
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { AnimatedCard } from "@/components/animations/animated-card";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  aiInsight,
  dashboardStats,
  logsAnalyzedOverTime,
  recentThreats,
  severityDistribution,
  threatTypeDistribution,
  threatsOverTime,
  uploads
} from "@/data/mock-data";

const statIcons = [UploadCloud, ShieldAlert, Activity, FileText];

const severityBadge = {
  critical: "critical",
  high: "danger",
  medium: "warning",
  low: "success"
} as const;

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">Protected dashboard</p>
          <h1 className="mt-2 text-3xl font-black text-white">SOC analyst command center</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Monitor uploaded logs, triage threats, and review AI-generated investigation context using mock security telemetry.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-3">
          <Clock3 className="h-4 w-4 text-emerald-300" />
          <div>
            <p className="text-xs text-slate-500">Last analysis run</p>
            <p className="text-sm font-semibold text-white">Today, 10:42 AM</p>
          </div>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat, index) => {
          const Icon = statIcons[index];
          return (
            <Card key={stat.label} className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                  <p className="mt-3 text-3xl font-black text-white">{stat.value}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-sky-400/20 bg-sky-400/10 text-sky-300">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-300">
                <TrendingUp className="h-3.5 w-3.5" />
                {stat.change} from previous window
              </div>
            </Card>
          );
        })}
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <ChartCard title="Threat severity chart" subtitle="Distribution by current triage level">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={severityDistribution} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={4}>
                {severityDistribution.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2">
            {severityDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-950/50 px-3 py-2">
                <span className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
                  {item.name}
                </span>
                <span className="text-sm font-bold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Threat type chart" subtitle="Top detection categories from mock analysis">
          <ResponsiveContainer width="100%" height={330}>
            <BarChart data={threatTypeDistribution}>
              <CartesianGrid stroke="#1F2937" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" stroke="#64748B" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis stroke="#64748B" tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(56, 189, 248, 0.08)" }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#38BDF8" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-2">
        <ChartCard title="Logs analyzed over time chart" subtitle="Volume processed during the current day">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={logsAnalyzedOverTime}>
              <defs>
                <linearGradient id="logsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1F2937" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="time" stroke="#64748B" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis stroke="#64748B" tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="logs" stroke="#38BDF8" strokeWidth={2} fill="url(#logsGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Threats over time chart" subtitle="Critical, high, and medium detections by day">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={threatsOverTime}>
              <CartesianGrid stroke="#1F2937" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" stroke="#64748B" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis stroke="#64748B" tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="critical" stroke="#DC2626" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="high" stroke="#EF4444" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="medium" stroke="#F59E0B" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <AnimatedCard className="p-0">
          <div className="flex items-center justify-between border-b border-slate-800 p-5">
            <div>
              <h2 className="text-lg font-bold text-white">Recent threats table</h2>
              <p className="mt-1 text-sm text-slate-500">Latest analyst queue from mock detections</p>
            </div>
            <Badge variant="danger">Live queue</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-slate-800 bg-slate-950/50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Threat</th>
                  <th className="px-5 py-3 font-semibold">Severity</th>
                  <th className="px-5 py-3 font-semibold">Source</th>
                  <th className="px-5 py-3 font-semibold">Target</th>
                  <th className="px-5 py-3 font-semibold">Confidence</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {recentThreats.map((threat) => (
                  <tr key={threat.id} className="transition hover:bg-slate-900/60">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-white">{threat.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{threat.id} · {threat.type} · {threat.detectedAt}</p>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={severityBadge[threat.severity as keyof typeof severityBadge]}>{threat.severity}</Badge>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-slate-300">{threat.source}</td>
                    <td className="px-5 py-4 text-slate-300">{threat.target}</td>
                    <td className="px-5 py-4 text-slate-300">{threat.confidence}%</td>
                    <td className="px-5 py-4 text-slate-300">{threat.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AnimatedCard>

        <AnimatedCard>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-sky-400/20 bg-sky-400/10 text-sky-300">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">AI insight card</h2>
              <p className="text-sm text-slate-500">{aiInsight.confidence}% confidence</p>
            </div>
          </div>
          <h3 className="text-xl font-black leading-tight text-white">{aiInsight.title}</h3>
          <p className="mt-4 text-sm leading-6 text-slate-400">{aiInsight.summary}</p>
          <div className="mt-5 space-y-3">
            {aiInsight.recommendations.map((recommendation) => (
              <div key={recommendation} className="rounded-md border border-slate-800 bg-slate-950/50 p-3 text-sm text-slate-300">
                {recommendation}
              </div>
            ))}
          </div>
        </AnimatedCard>
      </section>

      <section className="mt-4">
        <AnimatedCard className="p-0">
          <div className="flex items-center justify-between border-b border-slate-800 p-5">
            <div>
              <h2 className="text-lg font-bold text-white">Recent uploads</h2>
              <p className="mt-1 text-sm text-slate-500">Mock log ingestion history</p>
            </div>
            <Database className="h-5 w-5 text-sky-300" />
          </div>
          <div className="grid gap-3 p-5 md:grid-cols-2 xl:grid-cols-4">
            {uploads.map((upload) => (
              <div key={upload.file} className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
                <p className="truncate font-semibold text-white">{upload.file}</p>
                <p className="mt-2 text-xs text-slate-500">{upload.uploadedAt}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500">Events</p>
                    <p className="font-bold text-slate-200">{upload.events}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">{upload.size}</p>
                    <Badge className="mt-1" variant={upload.status === "Analyzed" ? "success" : "muted"}>{upload.status}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AnimatedCard>
      </section>
    </DashboardLayout>
  );
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <AnimatedCard>
      <div className="mb-5">
        <h2 className="text-lg font-bold text-white">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      {children}
    </AnimatedCard>
  );
}

const tooltipStyle = {
  background: "rgba(2, 6, 23, 0.94)",
  border: "1px solid rgba(51, 65, 85, 0.9)",
  borderRadius: "8px",
  color: "#F8FAFC"
};
