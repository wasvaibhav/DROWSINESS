"use client";

import React from "react";
import type { DriverStatus } from "@/lib/types";

interface StatusIndicatorProps {
  status: DriverStatus;
  ear: number;
  mar: number;
}

const STATUS_CONFIG: Record<
  DriverStatus,
  { label: string; emoji: string; colorClass: string; glowClass: string }
> = {
  awake: {
    label: "Awake",
    emoji: "😊",
    colorClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    glowClass: "",
  },
  drowsy: {
    label: "Drowsy!",
    emoji: "😴",
    colorClass: "bg-red-500/20 text-red-300 border-red-500/50",
    glowClass: "animate-alert-pulse shadow-[0_0_40px_rgba(239,68,68,0.4)]",
  },
  yawning: {
    label: "Yawning!",
    emoji: "🥱",
    colorClass: "bg-amber-500/20 text-amber-300 border-amber-500/50",
    glowClass: "animate-alert-pulse shadow-[0_0_40px_rgba(245,158,11,0.4)]",
  },
};

export function StatusIndicator({ status, ear, mar }: StatusIndicatorProps) {
  const config = STATUS_CONFIG[status];

  return (
    <div
      className={`rounded-2xl border p-5 backdrop-blur-xl transition-all duration-500 ${config.colorClass} ${config.glowClass}`}
    >
      {/* Status label */}
      <div className="mb-4 flex items-center gap-3">
        <span className="text-3xl">{config.emoji}</span>
        <div>
          <p className="text-xs font-medium uppercase tracking-widest opacity-60">
            Driver Status
          </p>
          <p className="text-2xl font-bold tracking-tight">{config.label}</p>
        </div>
      </div>

      {/* EAR / MAR gauges */}
      <div className="space-y-3">
        <GaugeBar
          label="Eye Openness (EAR)"
          value={ear}
          max={0.4}
          color="emerald"
          inverted
        />
        <GaugeBar
          label="Mouth Openness (MAR)"
          value={mar}
          max={1.0}
          color="amber"
          inverted={false}
        />
      </div>
    </div>
  );
}

function GaugeBar({
  label,
  value,
  max,
  color,
  inverted,
}: {
  label: string;
  value: number;
  max: number;
  color: "emerald" | "amber";
  inverted: boolean;
}) {
  const pct = Math.min((value / max) * 100, 100);
  // For EAR, low value = danger. For MAR, high value = danger.
  const isDanger = inverted ? pct < 55 : pct > 60;
  const barColor = isDanger
    ? "bg-red-400"
    : color === "emerald"
    ? "bg-emerald-400"
    : "bg-amber-400";

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs opacity-70">
        <span>{label}</span>
        <span className="font-mono">{value.toFixed(3)}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full transition-all duration-200 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
