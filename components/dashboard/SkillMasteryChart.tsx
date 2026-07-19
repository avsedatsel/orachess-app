"use client";

/**
 * SkillMasteryChart — Dashboard "Gelişim Çizelgesi".
 * Öğrenciyi İKİ metrikle gösterir: Satranç Bilgisi + Stratejik Düşünme.
 * Ayrıca Sokratik analiz için tutulan son hataları listeler.
 */

import { TrendingUp, Gauge, Brain, AlertCircle, LifeBuoy } from "lucide-react";
import { useSkillMastery } from "@/hooks/useSkillMastery";

function Cizgi({
  label,
  value,
  icon,
  hint,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  hint: string;
}) {
  const renk =
    value >= 75 ? "bg-green-500" : value >= 45 ? "bg-ora-gold" : "bg-error";
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="flex items-center gap-2 text-sm text-gray-200">
          {icon}
          {label}
        </span>
        <span className="text-sm font-bold text-ora-gold">%{value}</span>
      </div>
      <div className="h-2 rounded-full bg-gray-700 overflow-hidden">
        <div
          className={`h-full ${renk} transition-all duration-700`}
          style={{ width: `${value}%` }}
        />
      </div>
      <p className="text-[11px] text-gray-500 mt-1">{hint}</p>
    </div>
  );
}

export function SkillMasteryChart() {
  const { mastery } = useSkillMastery();

  // Henüz hiç hamle oynanmadıysa çizelgeyi gösterme (boş kart olmasın).
  if (mastery.movesPlayed === 0) return null;

  return (
    <div className="mb-6 p-5 rounded-xl bg-ora-slate/60 border border-gray-800">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-ora-gold" />
        <h2 className="font-semibold">Gelişim Çizelgesi</h2>
        {mastery.chessElo > 0 && (
          <span className="ml-auto text-xs text-gray-400">
            ~{mastery.chessElo} Elo
          </span>
        )}
      </div>

      <div className="space-y-4">
        <Cizgi
          label="Satranç Bilgisi"
          value={mastery.chessKnowledge}
          icon={<Gauge className="w-4 h-4 text-gray-400" />}
          hint="Hamlelerin motorun en iyi hamlesiyle ne kadar örtüşüyor"
        />
        <Cizgi
          label="Stratejik Düşünme"
          value={mastery.lifeStrategyScore}
          icon={<Brain className="w-4 h-4 text-gray-400" />}
          hint="Düşünme derinliğin — sabır, planlama, kriz yönetimi"
        />
        {mastery.crisesFaced > 0 && (
          <Cizgi
            label="Kriz Yönetimi"
            value={mastery.crisisManagementScore}
            icon={<LifeBuoy className="w-4 h-4 text-gray-400" />}
            hint={`Baskı altında soğukkanlılık — ${mastery.crisesFaced} kriz anı yaşandı`}
          />
        )}
      </div>

      {mastery.recentMistakes.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-800">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 mb-2">
            <AlertCircle className="w-3.5 h-3.5 text-ora-gold" />
            Üzerine çalışılacak hamleler (Sokratik analiz)
          </p>
          <ul className="space-y-1">
            {mastery.recentMistakes.map((m, i) => (
              <li key={i} className="text-xs text-gray-400 flex gap-2">
                <span className="text-ora-gold">▸</span>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
