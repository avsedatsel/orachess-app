"use client";

/**
 * useSkillMastery — "Zihin Becerisi" birikimini localStorage'da tutar.
 * Oyun ekranı hamle sonrası recordMove ile besler; dashboard çizelgesi okur.
 */

import { useCallback, useEffect, useState } from "react";
import {
  calculatePerformanceMetrics,
  updateMastery,
  INITIAL_MASTERY,
  type SkillMastery,
  type PerformanceMetrics,
} from "@/lib/mastery-engine";

const KEY = "orachess_mastery";

function read(): SkillMastery {
  if (typeof window === "undefined") return INITIAL_MASTERY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return INITIAL_MASTERY;
    return { ...INITIAL_MASTERY, ...(JSON.parse(raw) as Partial<SkillMastery>) };
  } catch {
    return INITIAL_MASTERY;
  }
}

function write(m: SkillMastery) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(m));
  } catch {
    /* sessizce yut */
  }
}

export function useSkillMastery() {
  const [mastery, setMastery] = useState<SkillMastery>(INITIAL_MASTERY);
  const [lastMetrics, setLastMetrics] = useState<PerformanceMetrics | null>(
    null
  );

  useEffect(() => {
    setMastery(read());
  }, []);

  /**
   * Bir hamleyi kaydeder ve o hamlenin anlık metriklerini döndürür.
   * @param userMove oynanan hamle (SAN)
   * @param bestMove motorun en iyisi (SAN)
   * @param timeTaken düşünme süresi (saniye)
   * @param chessElo mevcut seviyeden türetilen Elo
   */
  const recordMove = useCallback(
    (
      userMove: string,
      bestMove: string,
      timeTaken: number,
      chessElo: number,
      inCrisis = false
    ): PerformanceMetrics => {
      const metrics = calculatePerformanceMetrics(
        userMove,
        bestMove,
        timeTaken
      );
      setLastMetrics(metrics);
      setMastery((prev) => {
        const next = updateMastery(prev, metrics, {
          chessElo,
          inCrisis,
          mistakeNote:
            metrics.technicalAccuracy < 100
              ? `${userMove} — daha iyisi: ${bestMove}`
              : undefined,
        });
        write(next);
        return next;
      });
      return metrics;
    },
    []
  );

  return { mastery, lastMetrics, recordMove };
}
