"use client";

import { useRef, useState, useCallback } from "react";
import type { FaceLandmarker } from "@mediapipe/tasks-vision";
import { calculateAvgEAR, calculateMAR } from "@/lib/detection";
import type {
  DriverStatus,
  DetectionEvent,
  ThresholdSettings,
  DetectionMetrics,
} from "@/lib/types";
import { DEFAULT_THRESHOLDS } from "@/lib/types";

export interface UseDetectionReturn {
  metrics: DetectionMetrics;
  events: DetectionEvent[];
  isRunning: boolean;
  start: (
    video: HTMLVideoElement,
    landmarker: FaceLandmarker,
    thresholds?: ThresholdSettings
  ) => void;
  stop: () => void;
  clearEvents: () => void;
  updateThresholds: (t: ThresholdSettings) => void;
}

/**
 * Main detection loop.
 * Uses requestAnimationFrame to process video frames through FaceLandmarker,
 * calculates EAR/MAR, tracks durations, and emits status + events.
 */
export function useDetection(): UseDetectionReturn {
  const [metrics, setMetrics] = useState<DetectionMetrics>({
    ear: 0,
    mar: 0,
    fps: 0,
    faceDetected: false,
    status: "awake",
  });
  const [events, setEvents] = useState<DetectionEvent[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const rafRef = useRef<number | null>(null);
  const thresholdsRef = useRef<ThresholdSettings>(DEFAULT_THRESHOLDS);
  const eyesClosedSinceRef = useRef<number | null>(null);
  const mouthOpenSinceRef = useRef<number | null>(null);
  const lastStatusRef = useRef<DriverStatus>("awake");
  const fpsFramesRef = useRef<number[]>([]);
  const lastTimestampRef = useRef<number>(0);

  const clearEvents = useCallback(() => setEvents([]), []);

  const updateThresholds = useCallback((t: ThresholdSettings) => {
    thresholdsRef.current = t;
  }, []);

  const stop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setIsRunning(false);
    eyesClosedSinceRef.current = null;
    mouthOpenSinceRef.current = null;
    lastStatusRef.current = "awake";
    setMetrics({
      ear: 0,
      mar: 0,
      fps: 0,
      faceDetected: false,
      status: "awake",
    });
  }, []);

  const start = useCallback(
    (
      video: HTMLVideoElement,
      landmarker: FaceLandmarker,
      thresholds?: ThresholdSettings
    ) => {
      if (thresholds) thresholdsRef.current = thresholds;
      setIsRunning(true);
      lastTimestampRef.current = 0;

      const loop = () => {
        if (!video || video.readyState < 2) {
          rafRef.current = requestAnimationFrame(loop);
          return;
        }

        const now = performance.now();

        // FPS calculation (rolling window)
        fpsFramesRef.current.push(now);
        const oneSecAgo = now - 1000;
        fpsFramesRef.current = fpsFramesRef.current.filter(
          (t) => t > oneSecAgo
        );
        const fps = fpsFramesRef.current.length;

        // Ensure monotonically increasing timestamps for MediaPipe
        const timestamp = Math.max(now, lastTimestampRef.current + 1);
        lastTimestampRef.current = timestamp;

        try {
          const result = landmarker.detectForVideo(video, timestamp);

          if (result.faceLandmarks && result.faceLandmarks.length > 0) {
            const landmarks = result.faceLandmarks[0];
            const ear = calculateAvgEAR(landmarks);
            const mar = calculateMAR(landmarks);
            const t = thresholdsRef.current;
            const nowMs = Date.now();

            // ── Drowsiness tracking ──
            let status: DriverStatus = "awake";

            if (ear < t.earThreshold) {
              if (eyesClosedSinceRef.current === null) {
                eyesClosedSinceRef.current = nowMs;
              }
              const closedDuration =
                (nowMs - eyesClosedSinceRef.current) / 1000;
              if (closedDuration >= t.drowsyDuration) {
                status = "drowsy";
              }
            } else {
              eyesClosedSinceRef.current = null;
            }

            // ── Yawn tracking (only if not already drowsy) ──
            if (status === "awake" && mar > t.marThreshold) {
              if (mouthOpenSinceRef.current === null) {
                mouthOpenSinceRef.current = nowMs;
              }
              const openDuration =
                (nowMs - mouthOpenSinceRef.current) / 1000;
              if (openDuration >= t.yawnDuration) {
                status = "yawning";
              }
            } else if (mar <= t.marThreshold) {
              mouthOpenSinceRef.current = null;
            }

            // ── Log new events ──
            if (
              status !== "awake" &&
              status !== lastStatusRef.current
            ) {
              const event: DetectionEvent = {
                id: `${status}-${nowMs}`,
                type: status,
                timestamp: nowMs,
                ear: Math.round(ear * 1000) / 1000,
                mar: Math.round(mar * 1000) / 1000,
              };
              setEvents((prev) => [...prev.slice(-99), event]);
            }

            lastStatusRef.current = status;

            setMetrics({
              ear: Math.round(ear * 1000) / 1000,
              mar: Math.round(mar * 1000) / 1000,
              fps,
              faceDetected: true,
              status,
            });
          } else {
            // No face detected
            eyesClosedSinceRef.current = null;
            mouthOpenSinceRef.current = null;
            lastStatusRef.current = "awake";
            setMetrics((prev) => ({
              ...prev,
              fps,
              faceDetected: false,
              status: "awake",
            }));
          }
        } catch {
          // Silently skip frames that fail (e.g. timestamp issues)
        }

        rafRef.current = requestAnimationFrame(loop);
      };

      rafRef.current = requestAnimationFrame(loop);
    },
    []
  );

  return {
    metrics,
    events,
    isRunning,
    start,
    stop,
    clearEvents,
    updateThresholds,
  };
}
