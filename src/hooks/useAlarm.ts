"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import type { DriverStatus } from "@/lib/types";

/**
 * Generates alarm audio using Web Audio API oscillators.
 * No external audio files needed.
 */
export function useAlarm() {
  const ctxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const prevStatusRef = useRef<DriverStatus>("awake");

  const ensureContext = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const startAlarm = useCallback(() => {
    if (isPlaying || isMuted) return;
    const ctx = ensureContext();

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.connect(ctx.destination);

    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(440, ctx.currentTime);

    // Siren-like oscillation: 440Hz → 880Hz → 440Hz, repeating
    const cycleDuration = 0.5;
    for (let i = 0; i < 60; i++) {
      const t = ctx.currentTime + i * cycleDuration;
      osc.frequency.linearRampToValueAtTime(880, t + cycleDuration / 2);
      osc.frequency.linearRampToValueAtTime(440, t + cycleDuration);
    }

    osc.connect(gain);
    osc.start();

    oscRef.current = osc;
    gainRef.current = gain;
    setIsPlaying(true);
  }, [isPlaying, isMuted, ensureContext]);

  const stopAlarm = useCallback(() => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch {
        // already stopped
      }
      oscRef.current = null;
    }
    if (gainRef.current) {
      gainRef.current.disconnect();
      gainRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      if (!prev) {
        // Muting — stop any active alarm
        stopAlarm();
      }
      return !prev;
    });
  }, [stopAlarm]);

  /** Call this with the current detection status each frame */
  const updateStatus = useCallback(
    (status: DriverStatus) => {
      if (status !== "awake" && prevStatusRef.current === "awake") {
        startAlarm();
      } else if (status === "awake" && prevStatusRef.current !== "awake") {
        stopAlarm();
      }
      prevStatusRef.current = status;
    },
    [startAlarm, stopAlarm]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAlarm();
      if (ctxRef.current) {
        ctxRef.current.close();
      }
    };
  }, [stopAlarm]);

  return { isMuted, isPlaying, toggleMute, updateStatus, stopAlarm };
}
