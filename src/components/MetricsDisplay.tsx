"use client";

import React from "react";
import type { DetectionMetrics } from "@/lib/types";

interface MetricsDisplayProps {
  metrics: DetectionMetrics;
}

export function MetricsDisplay({ metrics }: MetricsDisplayProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/50">
        Real-Time Metrics
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          label="EAR"
          value={metrics.ear.toFixed(3)}
          subtitle="Eye Aspect Ratio"
          color={metrics.ear < 0.22 ? "red" : "emerald"}
        />
        <MetricCard
          label="MAR"
          value={metrics.mar.toFixed(3)}
          subtitle="Mouth Aspect Ratio"
          color={metrics.mar > 0.6 ? "amber" : "emerald"}
        />
        <MetricCard
          label="FPS"
          value={String(metrics.fps)}
          subtitle="Frames / sec"
          color={metrics.fps >= 15 ? "emerald" : metrics.fps >= 8 ? "amber" : "red"}
        />
        <MetricCard
          label="Face"
          value={metrics.faceDetected ? "Yes" : "No"}
          subtitle="Detected"
          color={metrics.faceDetected ? "emerald" : "red"}
        />
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  subtitle,
  color,
}: {
  label: string;
  value: string;
  subtitle: string;
  color: "emerald" | "amber" | "red";
}) {
  const colorMap = {
    emerald: "text-emerald-400",
    amber: "text-amber-400",
    red: "text-red-400",
  };

  return (
    <div className="rounded-xl border border-white/5 bg-white/5 p-3 text-center">
      <p className="text-xs font-medium uppercase tracking-wider text-white/40">
        {label}
      </p>
      <p className={`mt-1 text-xl font-bold font-mono ${colorMap[color]}`}>
        {value}
      </p>
      <p className="mt-0.5 text-[10px] text-white/30">{subtitle}</p>
    </div>
  );
}
