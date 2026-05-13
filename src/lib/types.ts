// ──────────────────────────────────────────────
// Driver Alert AI — Shared TypeScript Types
// ──────────────────────────────────────────────

/** Current driver alertness classification */
export type DriverStatus = "awake" | "drowsy" | "yawning";

/** A single detected event with a timestamp */
export interface DetectionEvent {
  id: string;
  type: "drowsy" | "yawning";
  timestamp: number; // Date.now()
  ear: number;
  mar: number;
}

/** User-configurable detection thresholds */
export interface ThresholdSettings {
  /** EAR below this → eyes considered closed (default 0.22) */
  earThreshold: number;
  /** MAR above this → mouth considered open (default 0.6) */
  marThreshold: number;
  /** Seconds eyes must be closed to trigger drowsy alert */
  drowsyDuration: number;
  /** Seconds mouth must be open to trigger yawn alert */
  yawnDuration: number;
}

/** Real-time metrics exposed by the detection loop */
export interface DetectionMetrics {
  ear: number;
  mar: number;
  fps: number;
  faceDetected: boolean;
  status: DriverStatus;
}

/** Default threshold values */
export const DEFAULT_THRESHOLDS: ThresholdSettings = {
  earThreshold: 0.22,
  marThreshold: 0.6,
  drowsyDuration: 2.0,
  yawnDuration: 1.5,
};
