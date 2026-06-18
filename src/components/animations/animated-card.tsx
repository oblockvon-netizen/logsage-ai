"use client";

import { motion } from "framer-motion";
import type React from "react";
import { cn } from "@/lib/utils";

export function AnimatedCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className={cn("glass-panel glow-border surface-hover rounded-lg p-5", className)}
    >
      {children}
    </motion.div>
  );
}
