import { Eye, Mail, User } from "lucide-react";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  return (
    <AuthLayout title="Create your account" subtitle="Set up a Phase 1 user workspace for log analysis.">
      <form className="space-y-4">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-300">Full name</span>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-500" />
            <Input className="pl-9" placeholder="Security Analyst" />
          </div>
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-300">Email</span>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-500" />
            <Input className="pl-9" placeholder="analyst@company.com" type="email" />
          </div>
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-300">Password</span>
          <div className="relative">
            <Input className="pr-10" placeholder="Create password" type="password" />
            <Eye className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-500" />
          </div>
        </label>
        <Button className="w-full" size="lg">Create account</Button>
      </form>
    </AuthLayout>
  );
}
