"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Activity, BarChart3, FileText, LayoutDashboard, Settings, ShieldAlert, UploadCloud, UserCircle } from "lucide-react";
import { navigationConfig } from "@/config/navigation-config";
import { cn } from "@/lib/utils";

const icons = {
  Dashboard: LayoutDashboard,
  Upload: UploadCloud,
  Threats: ShieldAlert,
  Reports: FileText,
  Settings
};

export function Sidebar() {
  return (
    <motion.aside
      initial={{ x: -22, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="hidden min-h-screen w-72 shrink-0 border-r border-slate-800/80 bg-slate-950/70 px-4 py-5 backdrop-blur-xl lg:block"
    >
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-sky-400/30 bg-sky-400/10 text-sky-300">
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-white">LogSage AI</p>
          <p className="text-xs text-slate-400">Security intelligence</p>
        </div>
      </div>

      <nav className="space-y-1">
        {navigationConfig.map((item) => {
          const Icon = icons[item.label as keyof typeof icons] ?? BarChart3;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-slate-400 transition",
                "hover:bg-slate-800/80 hover:text-slate-50"
              )}
            >
              <Icon className="h-4 w-4 text-slate-500 transition group-hover:text-sky-300" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 rounded-lg border border-slate-800 bg-slate-950/60 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-800 text-sky-300">
            <UserCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Alex Morgan</p>
            <p className="text-xs text-slate-500">Normal user</p>
          </div>
        </div>
        <div className="mt-4 rounded-md border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-200">
          Protected dashboard
        </div>
      </div>
    </motion.aside>
  );
}
