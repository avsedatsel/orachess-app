"use client";

/**
 * AnalysisPanel — Stockfish analiz kutusu
 * Verilen FEN pozisyonunu motorla değerlendirir; değerlendirme çubuğu,
 * sayısal skor ve önerilen en iyi hamleyi gösterir.
 */

import { useEffect, useMemo } from "react";
import { Chess } from "chess.js";
import { useStockfish, type StockfishEval } from "@/hooks/useStockfish";

interface AnalysisPanelProps {
  fen: string;
  depth?: number;
}

// UCI hamlesini ("e2e4") okunabilir SAN'a ("e4") çevir
function uciToSan(fen: string, uci: string | null): string | null {
  if (!uci || uci.length < 4) return null;
  try {
    const game = new Chess(fen);
    const move = game.move({
      from: uci.slice(0, 2),
      to: uci.slice(2, 4),
      promotion: uci.length > 4 ? uci.slice(4, 5) : undefined,
    });
    return move?.san ?? null;
  } catch {
    return null;
  }
}

// Skoru okunabilir metne çevir ("+1.35" veya "Mat #3")
function formatScore(evalData: StockfishEval | null): string {
  if (!evalData) return "—";
  if (evalData.mateIn !== null) {
    const n = Math.abs(evalData.mateIn);
    return evalData.mateIn > 0 ? `Mat #${n}` : `Mat #${n} (aleyhte)`;
  }
  if (evalData.scoreCp !== null) {
    const pawns = evalData.scoreCp / 100;
    return `${pawns >= 0 ? "+" : ""}${pawns.toFixed(2)}`;
  }
  return "—";
}

// Beyaz avantajını % olarak değerlendirme çubuğuna eşle (0-100)
function whitePercentage(evalData: StockfishEval | null): number {
  if (!evalData) return 50;
  if (evalData.mateIn !== null) return evalData.mateIn > 0 ? 100 : 0;
  if (evalData.scoreCp === null) return 50;
  // Yumuşak (sigmoid) eşleme
  const cp = Math.max(-1000, Math.min(1000, evalData.scoreCp));
  return 50 + 50 * (2 / (1 + Math.exp(-0.004 * cp)) - 1);
}

export function AnalysisPanel({ fen, depth = 15 }: AnalysisPanelProps) {
  const { ready, analyzing, evaluation, analyze } = useStockfish();

  // Pozisyon değiştiğinde otomatik analiz
  useEffect(() => {
    if (ready && fen) analyze(fen, depth);
  }, [ready, fen, depth, analyze]);

  const bestSan = useMemo(
    () => uciToSan(fen, evaluation?.bestMove ?? null),
    [fen, evaluation?.bestMove]
  );
  const scoreText = formatScore(evaluation);
  const whitePct = whitePercentage(evaluation);

  return (
    <div className="bg-ora-slate/50 rounded-lg p-4 border border-gray-800">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-ora-gold">
          ♟ Stockfish Analizi
        </h3>
        {ready && (
          <span className="text-xs text-gray-500">
            {analyzing ? "düşünüyor…" : `derinlik ${evaluation?.depth ?? 0}`}
          </span>
        )}
      </div>

      {!ready ? (
        <p className="text-sm text-gray-400 py-4 text-center">
          Motor yükleniyor… <span className="text-gray-600">(ilk seferde birkaç saniye)</span>
        </p>
      ) : (
        <>
          {/* Değerlendirme çubuğu (Beyaz = altın, Siyah = koyu) */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Değerlendirme</span>
              <span className="font-mono font-bold text-white">{scoreText}</span>
            </div>
            <div className="w-full h-4 rounded-full overflow-hidden bg-gray-900 border border-gray-700">
              <div
                className="h-full bg-gradient-to-r from-ora-gold to-yellow-200 transition-all duration-500"
                style={{ width: `${whitePct}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-gray-500 mt-1">
              <span>Beyaz</span>
              <span>Siyah</span>
            </div>
          </div>

          {/* En iyi hamle */}
          <div className="bg-gray-800/60 rounded p-3">
            <p className="text-xs text-gray-400 mb-1">Önerilen en iyi hamle</p>
            <p className="text-lg font-bold text-white font-mono">
              {bestSan ?? (analyzing ? "…" : "—")}
            </p>
          </div>

          <p className="text-[11px] text-gray-500 mt-3 leading-relaxed">
            Doğa Hoca&apos;nın notu: Motor sana en güçlü hamleyi gösterir, ama
            <em> neden</em> güçlü olduğunu anlamak asıl ustalıktır.
          </p>
        </>
      )}
    </div>
  );
}
