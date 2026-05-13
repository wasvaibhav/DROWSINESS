"use client";

import React, { useEffect, useRef } from "react";
import type { DetectionEvent } from "@/lib/types";

interface EventLogProps {
  events: DetectionEvent[];
  onClear: () => void;
}

export function EventLog({ events, onClear }: EventLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new events
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events.length]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-white/50">
          Event Log
        </h2>
        <button
          id="clear-events"
          onClick={onClear}
          className="rounded-lg border border-white/10 px-3 py-1 text-xs font-medium text-white/50 transition-colors hover:bg-white/10 hover:text-white/80"
        >
          Clear
        </button>
      </div>

      <div
        ref={scrollRef}
        className="max-h-48 space-y-1.5 overflow-y-auto pr-1 scrollbar-thin"
      >
        {events.length === 0 ? (
          <p className="py-6 text-center text-xs text-white/30">
            No events detected yet. Start monitoring to begin.
          </p>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs ${
                event.type === "drowsy"
                  ? "bg-red-500/10 text-red-300"
                  : "bg-amber-500/10 text-amber-300"
              }`}
            >
              <span className="text-base">
                {event.type === "drowsy" ? "😴" : "🥱"}
              </span>
              <span className="flex-1 font-medium capitalize">
                {event.type} detected
              </span>
              <span className="font-mono text-white/40">
                EAR {event.ear} · MAR {event.mar}
              </span>
              <span className="font-mono text-white/40">
                {new Date(event.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
