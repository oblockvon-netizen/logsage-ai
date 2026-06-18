import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-black text-white">Settings</h1>
      <Card className="mt-6 max-w-2xl p-6">
        <form className="space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-300">Full name</span>
            <Input placeholder="Security Analyst" />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-300">Email</span>
            <Input placeholder="analyst@company.com" type="email" />
          </label>
          <Button>Save mock settings</Button>
        </form>
      </Card>
    </DashboardLayout>
  );
}
