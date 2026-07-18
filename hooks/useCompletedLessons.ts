"use client";

/**
 * useCompletedLessons — tamamlanan ders adımlarını localStorage'da tutar.
 * Piramit Yolu ilerleme rozetlerini ve "Modül Bitir" akışını besler.
 */

import { useCallback, useEffect, useState } from "react";

const KEY = "orachess_completed_lessons";

function read(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function write(set: Set<string>) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify([...set]));
  } catch {
    /* sessizce yut */
  }
}

export function useCompletedLessons() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    setCompleted(read());
  }, []);

  const toggle = useCallback((id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      write(next);
      return next;
    });
  }, []);

  const markDone = useCallback((id: string) => {
    setCompleted((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      write(next);
      return next;
    });
  }, []);

  return { completed, toggle, markDone };
}
