"use client";

import React from "react";
import type { ThresholdSettings } from "@/lib/types";

interface ControlPanelProps {
  isMonitoring: boolean;
  isModelLoading: boolean;
  isModelReady: boolean;
  isMuted: boolean;
  thresholds: ThresholdSettings;
  onToggleMonitoring: () => void;
  onToggleMute: () => void;
  onThresholdChange: (t: ThresholdSettings) => void;
}

export function ControlPanel({
  isMonitoring,
  isModelLoading,
  isModelReady,
  isMuted,
  thresholds,
  onToggleMonitoring,
  onToggleMute,
  onThresholdChange,
}: ControlPanelProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/50">
        Controls
      </h2>

      {/* Start / Stop button */}
      <button
        id="toggle-monitoring"
        onClick={onToggleMonitoring}
        disabled={isModelLoading}
        className={`mb-5 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold uppercase tracking-wider transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40 ${
          isMonitoring
            ? "bg-red-500/80 text-white shadow-lg shadow-red-500/25 hover:bg-red-500"
            : "bg-emerald-500/80 text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-500"
        }`}
      >
        {isModelLoading ? (
          <>
            <Spinner /> Loading Model…
          </>
        ) : isMonitoring ? (
          <>
            <StopIcon /> Stop Monitoring
          </>
        ) : (
          <>
            <PlayIcon /> Start Monitoring
          </>
        )}
      </button>

      {/* Model status */}
      <div className="mb-5 flex items-center gap-2 text-xs text-white/50">
        <span
          className={`inline-block h-2 w-2 rounded-full ${
            isModelReady ? "bg-emerald-400" : "bg-white/30"
          }`}
        />
        {isModelReady ? "Model loaded" : "Model not loaded"}
      </div>

      {/* Mute toggle */}
      <button
        id="toggle-mute"
        onClick={onToggleMute}
        className="mb-6 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10"
      >
        {isMuted ? "🔇 Unmute Alarm" : "🔊 Mute Alarm"}
      </button>

      {/* Sensitivity sliders */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40">
          Sensitivity
        </h3>

        <SliderControl
          id="ear-threshold"
          label="Eye Threshold (EAR)"
          value={thresholds.earThreshold}
          min={0.1}
          max={0.35}
          step={0.01}
          displayValue={thresholds.earThreshold.toFixed(2)}
          onChange={(v) =>
            onThresholdChange({ ...thresholds, earThreshold: v })
          }
        />

        <SliderControl
          id="mar-threshold"
          label="Mouth Threshold (MAR)"
          value={thresholds.marThreshold}
          min={0.3}
          max={0.9}
          step={0.05}
          displayValue={thresholds.marThreshold.toFixed(2)}
          onChange={(v) =>
            onThresholdChange({ ...thresholds, marThreshold: v })
          }
        />

        <SliderControl
          id="drowsy-duration"
          label="Drowsy Delay (sec)"
          value={thresholds.drowsyDuration}
          min={0.5}
          max={5}
          step={0.5}
          displayValue={`${thresholds.drowsyDuration}s`}
          onChange={(v) =>
            onThresholdChange({ ...thresholds, drowsyDuration: v })
          }
        />

        <SliderControl
          id="yawn-duration"
          label="Yawn Delay (sec)"
          value={thresholds.yawnDuration}
          min={0.5}
          max={5}
          step={0.5}
          displayValue={`${thresholds.yawnDuration}s`}
          onChange={(v) =>
            onThresholdChange({ ...thresholds, yawnDuration: v })
          }
        />
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function SliderControl({
  id,
  label,
  value,
  min,
  max,
  step,
  displayValue,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  displayValue: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs text-white/60">
        <label htmlFor={id}>{label}</label>
        <span className="font-mono text-white/80">{displayValue}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="slider-custom w-full"
      />
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
      <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
      <path d="M5.75 3A2.75 2.75 0 003 5.75v8.5A2.75 2.75 0 005.75 17h8.5A2.75 2.75 0 0017 14.25v-8.5A2.75 2.75 0 0014.25 3h-8.5z" />
    </svg>
  );
}
