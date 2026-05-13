"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  FaceLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

const WASM_CDN =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm";
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

export interface UseFaceLandmarkerReturn {
  landmarkerRef: React.RefObject<FaceLandmarker | null>;
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
  initialize: () => Promise<void>;
}

/**
 * Initializes MediaPipe FaceLandmarker with WASM from CDN.
 * Model is loaded once and cached by the browser.
 */
export function useFaceLandmarker(): UseFaceLandmarkerReturn {
  const landmarkerRef = useRef<FaceLandmarker | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialize = useCallback(async () => {
    if (landmarkerRef.current) return; // already initialized
    setIsLoading(true);
    setError(null);

    try {
      const vision = await FilesetResolver.forVisionTasks(WASM_CDN);

      const landmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: MODEL_URL,
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numFaces: 1,
        outputFaceBlendshapes: false,
        outputFacialTransformationMatrixes: false,
      });

      landmarkerRef.current = landmarker;
      setIsReady(true);
    } catch (err) {
      console.error("FaceLandmarker init error:", err);
      setError(
        "Failed to load face detection model. Please check your internet connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (landmarkerRef.current) {
        landmarkerRef.current.close();
        landmarkerRef.current = null;
      }
    };
  }, []);

  return { landmarkerRef, isLoading, isReady, error, initialize };
}
