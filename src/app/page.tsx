import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  FileSearch,
  FileText,
  Lock,
  Radar,
  ShieldAlert,
  Sparkles,
  UploadCloud,
  Zap
} from "lucide-react";
import { AnimatedCard } from "@/components/animations/animated-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Logs analyzed", value: "128K", tone: "text-sky-300" },
  { label: "Threats flagged", value: "3,420", tone: "text-emerald-300" },
  { label: "Critical alerts", value: "184", tone: "text-red-300" },
  { label: "Reports drafted", value: "920", tone: "text-amber-300" }
];

const steps = [
  { icon: UploadCloud, title: "Upload logs", copy: "Drop .log, .txt, or .csv files into a focused analysis workspace." },
  { icon: Radar, title: "Detect patterns", copy: "Surface suspicious authentication, access, network, and application events." },
  { icon: FileText, title: "Generate reports", copy: "Turn findings into readable summaries, evidence, impact, and next steps." }
];

const features = [
  { icon: Brain, title: "AI explanations", copy: "Analyst-style summaries explain what happened, why it matters, and how confident the signal is." },
  { icon: BarChart3, title: "Security analytics", copy: "Severity distribution, threat categories, and log trends are shaped for fast review." },
  { icon: Lock, title: "User-only scope", copy: "Phase 1 stays focused on personal security workflows without teams, roles, or payments." },
  { icon: Sparkles, title: "Fallback insight", copy: "Rule-based explanations keep the product useful even when AI credentials are not configured." }
];

const threats = [
  { name: "Credential stuffing", severity: "critical", evidence: "52 failed logins from 203.0.113.42 in 8 minutes" },
  { name: "Privilege escalation", severity: "high", evidence: "Unexpected sudo command after abnormal shell access" },
  { name: "Suspicious API activity", severity: "medium", evidence: "Token used from a new network with elevated request volume" }
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden text-foreground">
      <Navbar />
      <Hero />
      <DashboardPreview />
      <HowItWorks />
      <SecurityFeatures />
      <ThreatExamples />
      <IncidentReportPreview />
      <CTASection />
      <Footer />
    </main>
  );
}

function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/75 px-4 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-sky-400/30 bg-sky-400/10 text-sky-300">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-black text-white">LogSage AI</p>
            <p className="hidden text-xs text-slate-500 sm:block">Security intelligence</p>
          </div>
        </Link>
        <div className="hidden items-center gap-6 text-sm font-medium text-slate-400 md:flex">
          <a href="#how-it-works" className="transition hover:text-white">How it works</a>
          <a href="#features" className="transition hover:text-white">Features</a>
          <a href="#threats" className="transition hover:text-white">Threats</a>
          <a href="#reports" className="transition hover:text-white">Reports</a>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <a href="#dashboard-preview">View Demo</a>
          </Button>
          <Button asChild>
            <Link href="/register">Start Analyzing Logs</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-12 pt-14 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:pb-16 lg:pt-20">
      <div>
        <Badge>AI-powered log intelligence</Badge>
        <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
          Turn raw security logs into clear, actionable intelligence with AI-powered threat analysis.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
          LogSage AI gives security learners, analysts, and builders a polished workspace for uploading logs, spotting threats, and drafting incident reports from mock-ready intelligence.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/register">
              Start Analyzing Logs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="#dashboard-preview">View Demo</a>
          </Button>
        </div>
        <div className="mt-8 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-lg border border-slate-800 bg-slate-950/45 p-3">
              <p className={`text-xl font-black ${stat.tone}`}>{stat.value}</p>
              <p className="mt-1 text-xs text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
      <HeroDashboard />
    </section>
  );
}

function HeroDashboard() {
  return (
    <AnimatedCard className="relative min-h-[430px] p-0">
      <div className="border-b border-slate-800 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-400">Live dashboard preview</p>
            <h2 className="mt-1 text-xl font-bold text-white">Threat command center</h2>
          </div>
          <Badge variant="success">Mock data</Badge>
        </div>
      </div>
      <div className="grid gap-4 p-5 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="space-y-3">
          {["Critical", "High", "Medium", "Low"].map((label, index) => (
            <div key={label} className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-200">{label}</p>
                <p className="text-sm text-slate-500">{[6, 12, 19, 27][index]}</p>
              </div>
              <div className="mt-3 h-2 rounded-full bg-slate-800">
                <div className="h-2 rounded-full bg-sky-400" style={{ width: `${[72, 58, 44, 32][index]}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Logs analyzed over time</p>
              <p className="text-2xl font-black text-white">18,420 events</p>
            </div>
            <ShieldAlert className="h-6 w-6 text-red-300" />
          </div>
          <div className="flex h-48 items-end gap-2">
            {[36, 52, 44, 70, 62, 86, 74, 92, 66, 78, 88, 58].map((height, index) => (
              <div key={`${height}-${index}`} className="flex flex-1 items-end rounded-md bg-slate-900">
                <div
                  className="w-full rounded-md bg-gradient-to-t from-emerald-400 to-sky-300"
                  style={{ height: `${height}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
}

function DashboardPreview() {
  return (
    <section id="dashboard-preview" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-14">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <Badge variant="muted">Dashboard preview</Badge>
          <h2 className="mt-4 text-3xl font-black text-white">Built for fast security review</h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-slate-400">
          A dark, focused interface for scanning severity, source IPs, evidence, upload status, and AI-generated context.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <AnimatedCard key={stat.label}>
            <p className="text-sm text-slate-400">{stat.label}</p>
            <p className={`mt-3 text-3xl font-black ${stat.tone}`}>{stat.value}</p>
          </AnimatedCard>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-14">
      <Badge>How it works</Badge>
      <h2 className="mt-4 max-w-2xl text-3xl font-black text-white">From raw logs to readable intelligence in three steps</h2>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <AnimatedCard key={step.title}>
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-sky-400/30 bg-sky-400/10 text-sky-300">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-bold text-slate-600">0{index + 1}</span>
              </div>
              <h3 className="text-xl font-bold text-white">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{step.copy}</p>
            </AnimatedCard>
          );
        })}
      </div>
    </section>
  );
}

function SecurityFeatures() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-14">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div>
          <Badge variant="success">AI security features</Badge>
          <h2 className="mt-4 text-3xl font-black text-white">Explanations that feel like an analyst wrote them</h2>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            The design system supports rich threat summaries, confidence scoring, evidence previews, impact notes, and next-step recommendations.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <AnimatedCard key={feature.title}>
                <Icon className="h-6 w-6 text-sky-300" />
                <h3 className="mt-4 text-lg font-bold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{feature.copy}</p>
              </AnimatedCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ThreatExamples() {
  return (
    <section id="threats" className="mx-auto max-w-7xl px-4 py-14">
      <div className="mb-8">
        <Badge variant="danger">Threat detection examples</Badge>
        <h2 className="mt-4 text-3xl font-black text-white">Signals designed for quick triage</h2>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {threats.map((threat) => (
          <AnimatedCard key={threat.name}>
            <div className="flex items-start justify-between gap-4">
              <ShieldAlert className="h-6 w-6 text-red-300" />
              <Badge variant={threat.severity === "critical" ? "critical" : threat.severity === "high" ? "danger" : "warning"}>
                {threat.severity}
              </Badge>
            </div>
            <h3 className="mt-5 text-xl font-bold text-white">{threat.name}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">{threat.evidence}</p>
          </AnimatedCard>
        ))}
      </div>
    </section>
  );
}

function IncidentReportPreview() {
  return (
    <section id="reports" className="mx-auto max-w-7xl px-4 py-14">
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <Badge variant="warning">Incident report preview</Badge>
          <h2 className="mt-4 text-3xl font-black text-white">Report-ready structure for every investigation</h2>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            Executive summaries, timelines, indicators, severity breakdowns, recommendations, and analyst conclusions are presented in a professional report shell.
          </p>
        </div>
        <AnimatedCard className="p-0">
          <div className="border-b border-slate-800 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">AI-generated incident report</p>
                <h3 className="mt-1 text-xl font-bold text-white">Authentication anomaly investigation</h3>
              </div>
              <FileSearch className="h-6 w-6 text-sky-300" />
            </div>
          </div>
          <div className="space-y-4 p-5">
            {["Executive summary", "Timeline of suspicious activity", "Indicators of compromise", "Recommended remediation"].map((item) => (
              <div key={item} className="flex gap-3 rounded-lg border border-slate-800 bg-slate-950/50 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                <div>
                  <p className="font-semibold text-white">{item}</p>
                  <p className="mt-1 text-sm text-slate-500">Structured placeholder content ready for backend-generated analysis.</p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedCard>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14">
      <div className="glass-panel glow-border rounded-lg p-8 text-center sm:p-10">
        <Zap className="mx-auto h-8 w-8 text-sky-300" />
        <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-black text-white">Ready to turn log noise into security clarity?</h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-400">
          Start with mock data today, then connect authentication, uploads, AI analysis, and reporting in the next build phase.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/register">Start Analyzing Logs</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="#dashboard-preview">View Demo</a>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-800/80 px-4 py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <p className="font-semibold text-slate-300">LogSage AI</p>
        <p>Transform Logs Into Security Intelligence</p>
      </div>
    </footer>
  );
}
