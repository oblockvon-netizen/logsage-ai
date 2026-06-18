import { Bell, ChevronDown, Search, ShieldCheck, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-slate-950/70 px-4 py-3 backdrop-blur-xl lg:px-6">
      <div className="flex items-center gap-3">
        <div className="hidden flex-1 items-center gap-2 rounded-md border border-slate-800 bg-slate-950/60 px-3 md:flex">
          <Search className="h-4 w-4 text-slate-500" />
          <Input className="h-9 border-0 bg-transparent px-0 focus-visible:ring-0" placeholder="Search threats, logs, reports..." />
        </div>
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2 rounded-md border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-200">
          <ShieldCheck className="h-4 w-4" />
          Protected
        </div>
        <div className="hidden items-center gap-3 rounded-md border border-slate-800 bg-slate-950/60 px-3 py-2 sm:flex">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sky-400/10 text-sky-300">
            <UserCircle className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-white">Alex Morgan</p>
            <p className="text-xs text-slate-500">SOC Analyst</p>
          </div>
          <ChevronDown className="h-4 w-4 text-slate-500" />
        </div>
      </div>
    </header>
  );
}
