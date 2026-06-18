import { UploadCloud } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function UploadPage() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-black text-white">Upload logs</h1>
      <Card className="mt-6 flex min-h-96 flex-col items-center justify-center p-8 text-center">
        <UploadCloud className="h-12 w-12 text-sky-300" />
        <h2 className="mt-4 text-xl font-bold text-white">Drop log files here</h2>
        <p className="mt-2 max-w-md text-sm text-slate-400">Mock upload zone for .log, .txt, and .csv files. Backend connection comes later.</p>
        <Button className="mt-6">Choose files</Button>
      </Card>
    </DashboardLayout>
  );
}
