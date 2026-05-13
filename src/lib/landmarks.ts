// ──────────────────────────────────────────────
// MediaPipe Face Mesh Landmark Indices
// Reference: https://github.com/google-ai-edge/mediapipe
// ──────────────────────────────────────────────

/**
 * Eye landmark indices for EAR calculation.
 * Each eye uses 6 key points:
 *   p1 (outer corner), p2 (upper-outer), p3 (upper-inner),
 *   p4 (inner corner), p5 (lower-inner), p6 (lower-outer)
 *
 *       p2    p3
 *   p1 ──────── p4
 *       p6    p5
 */
export const LEFT_EYE_INDICES = {
  p1: 33,  // outer corner
  p2: 160, // upper-outer
  p3: 158, // upper-inner
  p4: 133, // inner corner
  p5: 153, // lower-inner
  p6: 144, // lower-outer
} as const;

export const RIGHT_EYE_INDICES = {
  p1: 362, // outer corner
  p2: 385, // upper-outer
  p3: 387, // upper-inner
  p4: 263, // inner corner
  p5: 373, // lower-inner
  p6: 380, // lower-outer
} as const;

/**
 * Mouth landmark indices for MAR calculation.
 * Uses vertical and horizontal reference points.
 */
export const MOUTH_INDICES = {
  // Horizontal (corners)
  leftCorner: 78,
  rightCorner: 308,
  // Upper lip (top edge, inner)
  upperOuter1: 82,
  upperCenter: 13,
  upperOuter2: 312,
  // Lower lip (bottom edge, inner)
  lowerOuter1: 87,
  lowerCenter: 14,
  lowerOuter2: 317,
} as const;

/** All eye contour indices for visualisation drawing */
export const LEFT_EYE_CONTOUR = [
  33, 7, 163, 144, 145, 153, 154, 155, 133,
  173, 157, 158, 159, 160, 161, 246,
];

export const RIGHT_EYE_CONTOUR = [
  362, 382, 381, 380, 374, 373, 390, 249, 263,
  466, 388, 387, 386, 385, 384, 398,
];

export const LIPS_CONTOUR = [
  61, 146, 91, 181, 84, 17, 314, 405, 321, 375,
  291, 409, 270, 269, 267, 0, 37, 39, 40, 185,
];
