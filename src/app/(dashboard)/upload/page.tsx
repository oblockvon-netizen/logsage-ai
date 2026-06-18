"use client";

import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, FileText, Loader2, Play, ShieldCheck, UploadCloud, X } from "lucide-react";
import { AnimatedCard } from "@/components/animations/animated-card";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { api, type ApiLogFile } from "@/lib/api";
import { cn } from "@/lib/utils";

const acceptedExtensions = [".log", ".txt", ".csv"];
const maxFileSize = 10 * 1024 * 1024;

export default function UploadPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const logsQuery = useQuery({ queryKey: ["logs"], queryFn: api.getLogs });
  const uploadMutation = useMutation({
    mutationFn: api.uploadLog,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["logs"] });
      toast({ title: "Log uploaded", description: "Raw content was stored securely." });
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : "Upload failed.";
      setError(message);
      toast({ title: "Upload failed", description: message, variant: "error" });
    }
  });
  const analyzeMutation = useMutation({
    mutationFn: api.analyzeLog,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["threats"] });
      toast({ title: "Analysis complete", description: data.message });
    },
    onError: (err) => toast({ title: "Analysis failed", description: err instanceof Error ? err.message : "Try again.", variant: "error" })
  });

  function handleFiles(files: FileList | File[]) {
    setError(null);
    const file = Array.from(files)[0];
    if (!file) return;
    const extension = getExtension(file.name);
    if (!acceptedExtensions.includes(extension)) {
      setError(`"${file.name}" is not supported. Upload .log, .txt, or .csv files only.`);
      return;
    }
    if (file.size > maxFileSize) {
      setError(`"${file.name}" is too large. Maximum file size is 10 MB.`);
      return;
    }
    uploadMutation.mutate(file);
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">Log ingestion</p>
          <h1 className="mt-2 text-3xl font-black text-white">Upload logs</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Upload logs to the NestJS backend, then trigger rule-based and AI-assisted analysis.</p>
        </div>
        <div className="grid grid-cols-3 gap-2 rounded-lg border border-slate-800 bg-slate-950/60 p-2 text-center">
          {acceptedExtensions.map((format) => <Badge key={format} variant="muted" className="justify-center uppercase">{format}</Badge>)}
        </div>
      </div>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Card
          className={cn("relative flex min-h-[380px] flex-col items-center justify-center overflow-hidden p-8 text-center transition", isDragging && "border-sky-400 bg-sky-400/10")}
          onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => { event.preventDefault(); setIsDragging(false); handleFiles(event.dataTransfer.files); }}
        >
          <motion.div animate={{ y: isDragging ? -6 : 0, scale: isDragging ? 1.04 : 1 }} className="flex h-20 w-20 items-center justify-center rounded-2xl border border-sky-400/30 bg-sky-400/10 text-sky-300">
            {uploadMutation.isPending ? <Loader2 className="h-10 w-10 animate-spin" /> : <UploadCloud className="h-10 w-10" />}
          </motion.div>
          <h2 className="mt-6 text-2xl font-black text-white">Drop log files here</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">Supported formats are .log, .txt, and .csv. Files must be 10 MB or smaller.</p>
          <Button type="button" className="mt-6" onClick={() => inputRef.current?.click()} disabled={uploadMutation.isPending}>
            <UploadCloud className="h-4 w-4" />
            {uploadMutation.isPending ? "Uploading..." : "Choose file"}
          </Button>
          <input ref={inputRef} type="file" accept=".log,.txt,.csv" className="hidden" onChange={(event) => event.target.files && handleFiles(event.target.files)} />
        </Card>

        <AnimatedCard>
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Validation rules</h2>
              <p className="text-sm text-slate-500">Frontend checks mirror backend Multer validation</p>
            </div>
          </div>
          <div className="space-y-3">
            {["Allowed formats: .log, .txt, .csv", "Maximum file size: 10 MB", "Uploaded content is stored as raw text", "Private routes require JWT"].map((rule) => (
              <div key={rule} className="flex gap-3 rounded-md border border-slate-800 bg-slate-950/50 p-3 text-sm text-slate-300">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />{rule}
              </div>
            ))}
          </div>
          {error ? (
            <div className="mt-5 flex gap-3 rounded-md border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /><div className="flex-1">{error}</div>
              <button type="button" aria-label="Dismiss error" onClick={() => setError(null)}><X className="h-4 w-4" /></button>
            </div>
          ) : null}
        </AnimatedCard>
      </section>

      <section className="mt-4">
        <AnimatedCard className="p-0">
          <div className="flex items-center justify-between border-b border-slate-800 p-5">
            <div>
              <h2 className="text-lg font-bold text-white">Upload history</h2>
              <p className="mt-1 text-sm text-slate-500">Backend log files for your account</p>
            </div>
            <Badge variant="muted">{logsQuery.data?.logFiles.length ?? 0} files</Badge>
          </div>
          {logsQuery.isLoading ? <StateBlock text="Loading uploads..." /> : null}
          {logsQuery.isError ? <StateBlock text="Could not load uploads." error /> : null}
          {!logsQuery.isLoading && logsQuery.data?.logFiles.length === 0 ? <StateBlock text="No uploads yet. Choose a file to begin." /> : null}
          {logsQuery.data?.logFiles.length ? <LogTable logs={logsQuery.data.logFiles} analyzingId={analyzeMutation.variables} onAnalyze={(id) => analyzeMutation.mutate(id)} /> : null}
        </AnimatedCard>
      </section>
    </DashboardLayout>
  );
}

function LogTable({ logs, analyzingId, onAnalyze }: { logs: ApiLogFile[]; analyzingId?: string; onAnalyze: (id: string) => void }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-slate-800 bg-slate-950/50 text-xs uppercase tracking-wide text-slate-500">
          <tr><th className="px-5 py-3">File</th><th className="px-5 py-3">Type</th><th className="px-5 py-3">Uploaded</th><th className="px-5 py-3 text-right">Actions</th></tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {logs.map((log) => (
            <tr key={log.id}>
              <td className="px-5 py-4 font-semibold text-white"><FileText className="mr-2 inline h-4 w-4 text-sky-300" />{log.filename}</td>
              <td className="px-5 py-4"><Badge variant="muted">{log.fileType}</Badge></td>
              <td className="px-5 py-4 text-slate-400">{new Date(log.uploadedAt).toLocaleString()}</td>
              <td className="px-5 py-4 text-right">
                <Button size="sm" variant="secondary" onClick={() => onAnalyze(log.id)} disabled={analyzingId === log.id}>
                  {analyzingId === log.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                  Analyze
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StateBlock({ text, error }: { text: string; error?: boolean }) {
  return <div className={cn("p-8 text-center text-sm text-slate-400", error && "text-red-300")}>{text}</div>;
}

function getExtension(fileName: string) {
  const index = fileName.lastIndexOf(".");
  return index === -1 ? "" : fileName.slice(index).toLowerCase();
}
