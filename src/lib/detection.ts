// ──────────────────────────────────────────────
// Pure detection utility functions
// ──────────────────────────────────────────────

import {
  LEFT_EYE_INDICES,
  RIGHT_EYE_INDICES,
  MOUTH_INDICES,
} from "./landmarks";

/** A 3D point from MediaPipe landmarks */
interface Point {
  x: number;
  y: number;
  z: number;
}

export function euclideanDistance(a: Point, b: Point): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

/**
 * Eye Aspect Ratio (EAR)
 *
 *       p2    p3
 *   p1 ──────── p4
 *       p6    p5
 *
 * EAR = (‖p2−p6‖ + ‖p3−p5‖) / (2 × ‖p1−p4‖)
 */
export function calculateEAR(
  landmarks: Point[],
  eye: typeof LEFT_EYE_INDICES | typeof RIGHT_EYE_INDICES
): number {
  const p1 = landmarks[eye.p1];
  const p2 = landmarks[eye.p2];
  const p3 = landmarks[eye.p3];
  const p4 = landmarks[eye.p4];
  const p5 = landmarks[eye.p5];
  const p6 = landmarks[eye.p6];

  const vertical1 = euclideanDistance(p2, p6);
  const vertical2 = euclideanDistance(p3, p5);
  const horizontal = euclideanDistance(p1, p4);

  if (horizontal === 0) return 0;
  return (vertical1 + vertical2) / (2 * horizontal);
}

/** Average EAR across both eyes */
export function calculateAvgEAR(landmarks: Point[]): number {
  const leftEAR = calculateEAR(landmarks, LEFT_EYE_INDICES);
  const rightEAR = calculateEAR(landmarks, RIGHT_EYE_INDICES);
  return (leftEAR + rightEAR) / 2;
}

/**
 * Mouth Aspect Ratio (MAR)
 *
 * MAR = (‖upper1−lower1‖ + ‖upperC−lowerC‖ + ‖upper2−lower2‖)
 *       / (2 × ‖leftCorner−rightCorner‖)
 */
export function calculateMAR(landmarks: Point[]): number {
  const m = MOUTH_INDICES;

  const vertical1 = euclideanDistance(
    landmarks[m.upperOuter1],
    landmarks[m.lowerOuter1]
  );
  const vertical2 = euclideanDistance(
    landmarks[m.upperCenter],
    landmarks[m.lowerCenter]
  );
  const vertical3 = euclideanDistance(
    landmarks[m.upperOuter2],
    landmarks[m.lowerOuter2]
  );
  const horizontal = euclideanDistance(
    landmarks[m.leftCorner],
    landmarks[m.rightCorner]
  );

  if (horizontal === 0) return 0;
  return (vertical1 + vertical2 + vertical3) / (2 * horizontal);
}