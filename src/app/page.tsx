import { AnimatedCard } from "@/components/animations/animated-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <main className="min-h-screen px-4 py-6 text-foreground">
      <nav className="mx-auto flex max-w-7xl items-center justify-between py-3">
        <div className="text-lg font-black text-white">LogSage AI</div>
        <div className="flex items-center gap-2">
          <Button variant="ghost">View Demo</Button>
          <Button>Start Analyzing Logs</Button>
        </div>
      </nav>
      <section className="mx-auto grid max-w-7xl gap-8 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <Badge>AI security intelligence</Badge>
          <h1 className="mt-6 max-w-3xl text-5xl font-black leading-tight text-white">
            Turn raw security logs into clear, actionable intelligence with AI-powered threat analysis.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            A premium dark cybersecurity workspace for uploads, threat context, analytics, and analyst-ready reports.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg">Start Analyzing Logs</Button>
            <Button variant="outline" size="lg">View Demo</Button>
          </div>
        </div>
        <AnimatedCard className="min-h-96">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Live dashboard preview</p>
              <h2 className="text-xl font-bold text-white">Threat overview</h2>
            </div>
            <Badge variant="success">Mock data</Badge>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {["Critical alerts", "Logs analyzed", "Reports", "AI confidence"].map((item, index) => (
              <div key={item} className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
                <p className="text-sm text-slate-400">{item}</p>
                <p className="mt-3 text-3xl font-black text-white">{[6, 128, 12, "94%"][index]}</p>
              </div>
            ))}
          </div>
        </AnimatedCard>
      </section>
    </main>
  );
}
