"use client";

import React from "react";

interface WebcamViewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isAlert: boolean;
  fps: number;
  faceDetected: boolean;
}

export function WebcamView({
  videoRef,
  isAlert,
  fps,
  faceDetected,
}: WebcamViewProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-2xl backdrop-blur-xl">
      {/* Alert overlay — pulsing red border */}
      {isAlert && (
        <div className="pointer-events-none absolute inset-0 z-20 animate-alert-pulse rounded-2xl border-4 border-red-500/80 shadow-[inset_0_0_80px_rgba(239,68,68,0.25)]" />
      )}

      {/* Video element */}
      <video
        ref={videoRef}
        id="webcam-video"
        className="block aspect-video w-full object-cover [-webkit-transform:scaleX(-1)] [transform:scaleX(-1)]"
        playsInline
        muted
        autoPlay
      />

      {/* FPS badge */}
      <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-lg bg-black/60 px-2.5 py-1 text-xs font-medium text-white/80 backdrop-blur-md">
        <span
          className={`inline-block h-2 w-2 rounded-full ${
            fps >= 15
              ? "bg-emerald-400"
              : fps >= 8
              ? "bg-amber-400"
              : "bg-red-400"
          }`}
        />
        {fps} FPS
      </div>

      {/* Face detection badge */}
      <div
        className={`absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium backdrop-blur-md ${
          faceDetected
            ? "bg-emerald-500/20 text-emerald-300"
            : "bg-red-500/20 text-red-300"
        }`}
      >
        <span
          className={`inline-block h-2 w-2 rounded-full ${
            faceDetected ? "bg-emerald-400" : "bg-red-400 animate-pulse"
          }`}
        />
        {faceDetected ? "Face Detected" : "No Face"}
      </div>
    </div>
  );
}
