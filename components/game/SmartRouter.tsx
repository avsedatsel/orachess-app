"use client";

/**
 * SmartRouter — kullanıcı derse başladığında devreye giren "akıllı yönlendirici".
 * Kullanıcının Elo'su + Stratejik Düşünme skoruna göre bir sonraki pedagojik
 * alanı önerir (getSmartRoute → getNextRecommendedLesson).
 */

import { Compass } from "lucide-react";
import { getSmartRoute } from "@/lib/curriculum-engine";
import { FOCUS_META } from "@/lib/curriculum-engine";

export function SmartRouter({
  currentElo,
  lifeStrategyScore,
}: {
  currentElo: number;
  lifeStrategyScore: number;
}) {
  const rec = getSmartRoute(currentElo, lifeStrategyScore);
  const meta = FOCUS_META[rec.focus];

  return (
    <div
      className="rounded-lg p-4 border"
      style={{
        borderColor: `${meta.color}66`,
        background: `${meta.color}14`,
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <Compass className="w-4 h-4" style={{ color: meta.color }} />
        <h3 className="font-semibold text-sm">Akıllı Yönlendirme</h3>
        <span
          className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: `${meta.color}22`, color: meta.color }}
        >
          {meta.emoji} {meta.label}
        </span>
      </div>
      <p className="text-sm font-semibold text-gray-100 mb-1">{rec.title}</p>
      <p className="text-xs text-gray-300 leading-relaxed">{rec.reason}</p>
      <p className="text-[11px] text-gray-400 mt-2">
        Bloğun kazanımı: <span className="text-gray-200">{rec.outcome}</span>
      </p>
    </div>
  );
}
