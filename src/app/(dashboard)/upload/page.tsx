"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  Loader2,
  Play,
  ShieldCheck,
  UploadCloud,
  X
} from "lucide-react";
import { AnimatedCard } from "@/components/animations/animated-card";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { uploads } from "@/data/mock-data";

type MockUpload = {
  id: string;
  file: string;
  size: string;
  status: "Ready" | "Uploading" | "Uploaded" | "Analyzing" | "Analyzed";
  progress: number;
  uploadedAt: string;
  events: string;
};

const acceptedExtensions = [".log", ".txt", ".csv"];
const maxFileSize = 10 * 1024 * 1024;

export default function UploadPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUploads, setSelectedUploads] = useState<MockUpload[]>([]);

  const history = useMemo<MockUpload[]>(
    () =>
      uploads.map((upload, index) => ({
        id: `history-${index}`,
        file: upload.file,
        size: upload.size,
        status: upload.status === "Analyzed" ? "Analyzed" : "Ready",
        progress: upload.status === "Analyzed" ? 100 : 0,
        uploadedAt: upload.uploadedAt,
        events: upload.events
      })),
    []
  );

  const allUploads = [...selectedUploads, ...history];

  function handleFiles(files: FileList | File[]) {
    setError(null);
    const nextUploads: MockUpload[] = [];

    Array.from(files).forEach((file) => {
      const extension = getExtension(file.name);

      if (!acceptedExtensions.includes(extension)) {
        setError(`"${file.name}" is not supported. Upload .log, .txt, or .csv files only.`);
        return;
      }

      if (file.size > maxFileSize) {
        setError(`"${file.name}" is too large. Maximum file size is 10 MB.`);
        return;
      }

      nextUploads.push({
        id: `${file.name}-${file.lastModified}`,
        file: file.name,
        size: formatFileSize(file.size),
        status: "Ready",
        progress: 0,
        uploadedAt: "Just now",
        events: estimateEvents(file.size)
      });
    });

    if (nextUploads.length > 0) {
      setSelectedUploads((current) => [...nextUploads, ...current]);
    }
  }

  function simulateUpload(id: string) {
    setSelectedUploads((current) =>
      current.map((upload) => (upload.id === id ? { ...upload, status: "Uploading", progress: 18 } : upload))
    );

    [42, 68, 92, 100].forEach((progress, index) => {
      window.setTimeout(() => {
        setSelectedUploads((current) =>
          current.map((upload) =>
            upload.id === id
              ? {
                  ...upload,
                  progress,
                  status: progress === 100 ? "Uploaded" : "Uploading"
                }
              : upload
          )
        );
      }, (index + 1) * 350);
    });
  }

  function simulateAnalyze(id: string) {
    setSelectedUploads((current) =>
      current.map((upload) => (upload.id === id ? { ...upload, status: "Analyzing" } : upload))
    );

    window.setTimeout(() => {
      setSelectedUploads((current) =>
        current.map((upload) => (upload.id === id ? { ...upload, status: "Analyzed", progress: 100 } : upload))
      );
    }, 900);
  }

  function removeUpload(id: string) {
    setSelectedUploads((current) => current.filter((upload) => upload.id !== id));
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">Log ingestion</p>
          <h1 className="mt-2 text-3xl font-black text-white">Upload logs</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Validate, stage, upload, and analyze security logs with a polished mock workflow before backend integration.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 rounded-lg border border-slate-800 bg-slate-950/60 p-2 text-center">
          {acceptedExtensions.map((format) => (
            <Badge key={format} variant="muted" className="justify-center uppercase">
              {format}
            </Badge>
          ))}
        </div>
      </div>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Card
          className={cn(
            "relative flex min-h-[420px] flex-col items-center justify-center overflow-hidden p-8 text-center transition",
            isDragging && "border-sky-400 bg-sky-400/10"
          )}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            handleFiles(event.dataTransfer.files);
          }}
        >
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/70 to-transparent" />
          <motion.div
            animate={{ y: isDragging ? -6 : 0, scale: isDragging ? 1.04 : 1 }}
            className="flex h-20 w-20 items-center justify-center rounded-2xl border border-sky-400/30 bg-sky-400/10 text-sky-300"
          >
            <UploadCloud className="h-10 w-10" />
          </motion.div>
          <h2 className="mt-6 text-2xl font-black text-white">Drop log files here</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
            Supported formats are .log, .txt, and .csv. Files must be 10 MB or smaller.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button type="button" onClick={() => inputRef.current?.click()}>
              <UploadCloud className="h-4 w-4" />
              Choose files
            </Button>
            <Button type="button" variant="outline" onClick={() => setSelectedUploads([])} disabled={selectedUploads.length === 0}>
              Clear staged
            </Button>
          </div>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".log,.txt,.csv"
            className="hidden"
            onChange={(event) => {
              if (event.target.files) {
                handleFiles(event.target.files);
                event.target.value = "";
              }
            }}
          />
        </Card>

        <AnimatedCard>
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Validation rules</h2>
              <p className="text-sm text-slate-500">Applied before mock upload begins</p>
            </div>
          </div>
          <div className="space-y-3">
            {["Allowed formats: .log, .txt, .csv", "Maximum file size: 10 MB", "Files are staged locally before analysis", "Uploaded files are never executed"].map((rule) => (
              <div key={rule} className="flex gap-3 rounded-md border border-slate-800 bg-slate-950/50 p-3 text-sm text-slate-300">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                {rule}
              </div>
            ))}
          </div>

          {error ? (
            <div className="mt-5 flex gap-3 rounded-md border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <div className="flex-1">{error}</div>
              <button type="button" aria-label="Dismiss error" onClick={() => setError(null)}>
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="mt-5 rounded-md border border-slate-800 bg-slate-950/50 p-3 text-sm text-slate-400">
              Error state appears here when file type or size validation fails.
            </div>
          )}
        </AnimatedCard>
      </section>

      <section className="mt-4">
        <AnimatedCard className="p-0">
          <div className="flex flex-col gap-3 border-b border-slate-800 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Upload history</h2>
              <p className="mt-1 text-sm text-slate-500">Mock staged files and recent log ingestion activity</p>
            </div>
            <Badge variant={selectedUploads.length > 0 ? "success" : "muted"}>{selectedUploads.length} staged</Badge>
          </div>

          {allUploads.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center p-8 text-center">
              <FileText className="h-12 w-12 text-slate-600" />
              <h3 className="mt-4 text-xl font-bold text-white">No uploads yet</h3>
              <p className="mt-2 max-w-md text-sm text-slate-500">
                Select or drop a supported file to populate this empty state with upload progress and analysis actions.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-slate-800 bg-slate-950/50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">File</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Progress</th>
                    <th className="px-5 py-3 font-semibold">Events</th>
                    <th className="px-5 py-3 font-semibold">Uploaded</th>
                    <th className="px-5 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {allUploads.map((upload) => {
                    const isStaged = selectedUploads.some((item) => item.id === upload.id);
                    const canUpload = isStaged && upload.status === "Ready";
                    const canAnalyze = isStaged && upload.status === "Uploaded";
                    return (
                      <tr key={upload.id} className="transition hover:bg-slate-900/60">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-800 bg-slate-950 text-sky-300">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-semibold text-white">{upload.file}</p>
                              <p className="mt-1 text-xs text-slate-500">{upload.size}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={upload.status} />
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex min-w-44 items-center gap-3">
                            <div className="h-2 flex-1 rounded-full bg-slate-800">
                              <div className="h-2 rounded-full bg-sky-400 transition-all" style={{ width: `${upload.progress}%` }} />
                            </div>
                            <span className="w-10 text-xs font-semibold text-slate-400">{upload.progress}%</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-slate-300">{upload.events}</td>
                        <td className="px-5 py-4 text-slate-400">{upload.uploadedAt}</td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            {canUpload ? (
                              <Button size="sm" onClick={() => simulateUpload(upload.id)}>
                                <UploadCloud className="h-4 w-4" />
                                Upload
                              </Button>
                            ) : null}
                            {upload.status === "Uploading" || upload.status === "Analyzing" ? (
                              <Button size="sm" variant="outline" disabled>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                {upload.status}
                              </Button>
                            ) : null}
                            {canAnalyze ? (
                              <Button size="sm" variant="secondary" onClick={() => simulateAnalyze(upload.id)}>
                                <Play className="h-4 w-4" />
                                Analyze
                              </Button>
                            ) : null}
                            {isStaged ? (
                              <Button size="icon" variant="ghost" aria-label="Remove staged file" onClick={() => removeUpload(upload.id)}>
                                <X className="h-4 w-4" />
                              </Button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </AnimatedCard>
      </section>
    </DashboardLayout>
  );
}

function StatusBadge({ status }: { status: MockUpload["status"] }) {
  if (status === "Analyzed") {
    return <Badge variant="success">Analyzed</Badge>;
  }

  if (status === "Analyzing" || status === "Uploading") {
    return <Badge>Processing</Badge>;
  }

  if (status === "Uploaded") {
    return <Badge variant="warning">Ready to analyze</Badge>;
  }

  return <Badge variant="muted">Ready</Badge>;
}

function getExtension(fileName: string) {
  const index = fileName.lastIndexOf(".");
  return index === -1 ? "" : fileName.slice(index).toLowerCase();
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function estimateEvents(bytes: number) {
  return Math.max(120, Math.round(bytes / 180)).toLocaleString();
}
