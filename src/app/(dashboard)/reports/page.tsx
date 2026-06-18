import { FileText } from "lucide-react";
import { AnimatedCard } from "@/components/animations/animated-card";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-black text-white">Reports</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {["Executive incident summary", "Technical findings brief"].map((report) => (
          <AnimatedCard key={report}>
            <FileText className="h-6 w-6 text-sky-300" />
            <h2 className="mt-4 text-xl font-bold text-white">{report}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">Mock AI report card with download placeholder for the future backend phase.</p>
            <Button className="mt-5" variant="outline">Preview</Button>
          </AnimatedCard>
        ))}
      </div>
    </DashboardLayout>
  );
}
