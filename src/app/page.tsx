"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useWebcam } from "@/hooks/useWebcam";
import { useFaceLandmarker } from "@/hooks/useFaceLandmarker";
import { useDetection } from "@/hooks/useDetection";
import { useAlarm } from "@/hooks/useAlarm";
import { WebcamView } from "@/components/WebcamView";
import { StatusIndicator } from "@/components/StatusIndicator";
import { ControlPanel } from "@/components/ControlPanel";
import { EventLog } from "@/components/EventLog";
import { AlertOverlay } from "@/components/AlertOverlay";
import { MetricsDisplay } from "@/components/MetricsDisplay";
import { DEFAULT_THRESHOLDS } from "@/lib/types";
import type { ThresholdSettings } from "@/lib/types";

export default function Home() {
  const { videoRef, isStreaming, error: camError, startCamera, stopCamera } = useWebcam();
  const { landmarkerRef, isLoading: modelLoading, isReady: modelReady, error: modelError, initialize } = useFaceLandmarker();
  const { metrics, events, isRunning, start, stop, clearEvents, updateThresholds } = useDetection();
  const { isMuted, toggleMute, updateStatus, stopAlarm } = useAlarm();

  const [thresholds, setThresholds] = useState<ThresholdSettings>(DEFAULT_THRESHOLDS);

  // Sync alarm with detection status
  useEffect(() => {
    updateStatus(metrics.status);
  }, [metrics.status, updateStatus]);

  // Handle threshold changes
  const handleThresholdChange = useCallback(
    (t: ThresholdSettings) => {
      setThresholds(t);
      updateThresholds(t);
    },
    [updateThresholds]
  );

  // Toggle monitoring on/off
  const toggleMonitoring = useCallback(async () => {
    if (isRunning) {
      stop();
      stopCamera();
      stopAlarm();
      return;
    }

    // Start camera first
    await startCamera();
    // Initialize model if not ready
    if (!landmarkerRef.current) {
      await initialize();
    }

    // Wait a tick for refs to settle
    requestAnimationFrame(() => {
      if (videoRef.current && landmarkerRef.current) {
        start(videoRef.current, landmarkerRef.current, thresholds);
      }
    });
  }, [
    isRunning,
    stop,
    stopCamera,
    stopAlarm,
    startCamera,
    landmarkerRef,
    initialize,
    videoRef,
    start,
    thresholds,
  ]);

  const error = camError || modelError;

  return (
    <>
      {/* Full-screen alert overlay */}
      <AlertOverlay status={metrics.status} />

      <div className="flex flex-1 flex-col">
        {/* ── Header ── */}
        <header className="border-b border-white/5 bg-white/[0.02] px-6 py-4 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-lg shadow-lg shadow-emerald-500/20">
                🧠
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-white">
                  Driver Alert AI
                </h1>
                <p className="text-xs text-white/40">
                  Real-time drowsiness detection
                </p>
              </div>
            </div>

            {/* Status pill in header */}
            <div
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider ${
                metrics.status === "awake"
                  ? "bg-emerald-500/15 text-emerald-400"
                  : metrics.status === "drowsy"
                  ? "bg-red-500/15 text-red-400 animate-pulse"
                  : "bg-amber-500/15 text-amber-400 animate-pulse"
              }`}
            >
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  metrics.status === "awake"
                    ? "bg-emerald-400"
                    : metrics.status === "drowsy"
                    ? "bg-red-400"
                    : "bg-amber-400"
                }`}
              />
              {metrics.status}
            </div>
          </div>
        </header>

        {/* ── Main Content ── */}
        <main className="flex-1 px-6 py-6">
          <div className="mx-auto max-w-7xl">
            {/* Error banner */}
            {error && (
              <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm text-red-300">
                ⚠️ {error}
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
              {/* Left column: webcam + event log */}
              <div className="space-y-6">
                <WebcamView
                  videoRef={videoRef}
                  isAlert={metrics.status !== "awake"}
                  fps={metrics.fps}
                  faceDetected={metrics.faceDetected}
                />

                {/* Instruction card when not monitoring */}
                {!isRunning && !isStreaming && (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
                    <div className="mb-4 text-5xl">🚗</div>
                    <h2 className="mb-2 text-xl font-bold text-white">
                      Stay Safe on the Road
                    </h2>
                    <p className="mx-auto max-w-md text-sm text-white/50">
                      Click{" "}
                      <span className="font-semibold text-emerald-400">
                        Start Monitoring
                      </span>{" "}
                      to activate real-time drowsiness and yawning detection.
                      All processing happens locally in your browser — your
                      video never leaves your device.
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-6 text-xs text-white/30">
                      <span>🔒 100% Private</span>
                      <span>⚡ Real-time AI</span>
                      <span>🔊 Audio Alerts</span>
                    </div>
                  </div>
                )}

                <EventLog events={events} onClear={clearEvents} />
              </div>

              {/* Right column: status + metrics + controls */}
              <div className="space-y-6">
                <StatusIndicator
                  status={metrics.status}
                  ear={metrics.ear}
                  mar={metrics.mar}
                />

                <MetricsDisplay metrics={metrics} />

                <ControlPanel
                  isMonitoring={isRunning}
                  isModelLoading={modelLoading}
                  isModelReady={modelReady}
                  isMuted={isMuted}
                  thresholds={thresholds}
                  onToggleMonitoring={toggleMonitoring}
                  onToggleMute={toggleMute}
                  onThresholdChange={handleThresholdChange}
                />
              </div>
            </div>
          </div>
        </main>

        {/* ── Footer ── */}
        <footer className="border-t border-white/5 px-6 py-4 text-center text-xs text-white/25">
          Driver Alert AI — All processing runs locally in your browser. No data
          is sent to any server.
        </footer>
      </div>
    </>
  );
}
