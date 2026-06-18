"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { LucideIcon } from "lucide-react";
import { Bell, KeyRound, Loader2, Palette, Save, Settings, ShieldCheck, SlidersHorizontal, UserCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { AnimatedCard } from "@/components/animations/animated-card";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { profileSettingsSchema, type ProfileSettingsFormValues } from "@/lib/validations";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const form = useForm<ProfileSettingsFormValues>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      fullName: "Alex Morgan",
      email: "analyst@logsage.ai",
      jobTitle: "SOC Analyst"
    }
  });

  async function onSubmit() {
    setSaved(false);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setSaved(true);
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">User settings</p>
        <h1 className="mt-2 text-3xl font-black text-white">Settings</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Phase 1 keeps settings focused on a single normal user workspace with simple placeholders for future preferences.
        </p>
      </div>

      <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <AnimatedCard>
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-sky-400/20 bg-sky-400/10 text-sky-300">
              <UserCircle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Profile settings</h2>
              <p className="text-sm text-slate-500">Mock profile details with validation</p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input placeholder="Security Analyst" autoComplete="name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="analyst@company.com" type="email" autoComplete="email" {...field} />
                    </FormControl>
                    <FormDescription>Used only for the mock Phase 1 user profile.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job title</FormLabel>
                    <FormControl>
                      <Input placeholder="SOC Analyst" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {saved ? (
                <div className="rounded-md border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">
                  Mock profile settings saved.
                </div>
              ) : null}

              <Button type="submit" className="w-full sm:w-auto" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {form.formState.isSubmitting ? "Saving..." : "Save profile"}
              </Button>
            </form>
          </Form>
        </AnimatedCard>

        <div className="grid gap-5 md:grid-cols-2">
          <PlaceholderPanel
            icon={SlidersHorizontal}
            title="App preferences placeholder"
            badge="Later"
            body="Workspace defaults, dashboard density, and notification preferences will live here after the core flow is connected."
          />
          <PlaceholderPanel
            icon={Palette}
            title="Theme placeholder"
            badge="Dark first"
            body="LogSage AI currently uses the premium dark cybersecurity theme. Light or custom themes can be added later."
          />
          <PlaceholderPanel
            icon={KeyRound}
            title="API key placeholder"
            badge="Not connected"
            body="OpenAI API key management is represented here only as a placeholder. Secrets should remain server-side."
          />
          <PlaceholderPanel
            icon={ShieldCheck}
            title="Security preferences placeholder"
            badge="Phase 1"
            body="Password, session, and MFA preferences can be introduced once authentication is connected."
          />
        </div>
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-3">
        <MiniSetting icon={Bell} title="Notifications" value="Mock alerts enabled" />
        <MiniSetting icon={Settings} title="Workspace mode" value="Single-user Phase 1" />
        <MiniSetting icon={ShieldCheck} title="Account type" value="Normal user" />
      </section>
    </DashboardLayout>
  );
}

function PlaceholderPanel({
  icon: Icon,
  title,
  badge,
  body
}: {
  icon: LucideIcon;
  title: string;
  badge: string;
  body: string;
}) {
  return (
    <AnimatedCard>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-sky-400/20 bg-sky-400/10 text-sky-300">
          <Icon className="h-5 w-5" />
        </div>
        <Badge variant="muted">{badge}</Badge>
      </div>
      <h3 className="font-bold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-400">{body}</p>
    </AnimatedCard>
  );
}

function MiniSetting({ icon: Icon, title, value }: { icon: LucideIcon; title: string; value: string }) {
  return (
    <AnimatedCard className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-950/70 text-sky-300">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-white">{title}</p>
        <p className="text-sm text-slate-500">{value}</p>
      </div>
    </AnimatedCard>
  );
}
