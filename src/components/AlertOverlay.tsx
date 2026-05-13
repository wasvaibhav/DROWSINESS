"use client";

import React from "react";
import type { DriverStatus } from "@/lib/types";

interface AlertOverlayProps {
  status: DriverStatus;
}

export function AlertOverlay({ status }: AlertOverlayProps) {
  if (status === "awake") return null;

  const isDrowsy = status === "drowsy";

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        isDrowsy ? "bg-red-900/30" : "bg-amber-900/20"
      } pointer-events-none animate-alert-pulse backdrop-blur-sm`}
    >
      <div
        className={`flex flex-col items-center gap-4 rounded-3xl border-2 px-12 py-8 backdrop-blur-xl ${
          isDrowsy
            ? "border-red-500/50 bg-red-950/60 shadow-[0_0_100px_rgba(239,68,68,0.3)]"
            : "border-amber-500/50 bg-amber-950/60 shadow-[0_0_100px_rgba(245,158,11,0.3)]"
        }`}
      >
        <span className="text-6xl">{isDrowsy ? "⚠️" : "🥱"}</span>
        <h2
          className={`text-3xl font-black uppercase tracking-wider ${
            isDrowsy ? "text-red-300" : "text-amber-300"
          }`}
        >
          {isDrowsy ? "Wake Up!" : "Yawning Detected"}
        </h2>
        <p
          className={`text-sm ${
            isDrowsy ? "text-red-300/70" : "text-amber-300/70"
          }`}
        >
          {isDrowsy
            ? "Drowsiness detected — pull over and rest!"
            : "Frequent yawning — consider taking a break"}
        </p>
      </div>
    </div>
  );
}
