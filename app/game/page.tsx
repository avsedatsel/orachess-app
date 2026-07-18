"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChessBoard } from "@/components/chess/ChessBoard";
import { MentorEngine } from "@/components/mentor/MentorEngine";
import { AnalysisPanel } from "@/components/chess/AnalysisPanel";
import { useStockfish } from "@/hooks/useStockfish";
import { STARTING_FEN } from "@/lib/chess-utils";

interface LastMove {
  from: string;
  to: string;
  san: string;
  fen: string;
  prevFen: string;
}

interface MentorInput {
  previousFen: string;
  currentFen: string;
  move: string;
  moveNotation: string;
  stockfishEvaluation?: number;
}

export default function GamePage() {
  const [lastMove, setLastMove] = useState<LastMove | null>(null);
  const [mentorInput, setMentorInput] = useState<MentorInput | null>(null);
  const { ready, analyzing, evaluation, analyzedFen, analyze } = useStockfish();

  const currentFen = lastMove?.fen ?? STARTING_FEN;

  const handleMove = (from: string, to: string, san: string, fen: string) => {
    setLastMove((prev) => ({
      from,
      to,
      san,
      fen,
      prevFen: prev?.fen || "start",
    }));
  };

  // Pozisyon değiştikçe Stockfish otomatik analiz etsin (ana thread bloklanmaz)
  useEffect(() => {
    if (ready) analyze(currentFen);
  }, [ready, currentFen, analyze]);

  // Analiz TAMAMLANINCA (skor kesinleşince) Doğa Hoca'ya gönderilecek girdiyi hazırla.
  // analyzedFen === currentFen kontrolü, skorun bu hamleye ait olmasını garantiler.
  useEffect(() => {
    if (!lastMove) return;
    if (analyzing) return;
    if (!evaluation || evaluation.bestMove == null) return;
    if (analyzedFen !== lastMove.fen) return;
    setMentorInput({
      previousFen: lastMove.prevFen,
      currentFen: lastMove.fen,
      move: `${lastMove.from}${lastMove.to}`,
      moveNotation: lastMove.san,
      stockfishEvaluation: evaluation.scoreCp ?? undefined,
    });
  }, [lastMove, analyzing, evaluation, analyzedFen]);

  return (
    <main className="min-h-screen p-6 pt-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold gradient-text">OraChess Oyun</h1>
          <Link href="/" className="text-ora-gold hover:underline text-sm">
            ← Ana Sayfa
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex justify-center">
            <ChessBoard onMove={handleMove} />
          </div>

          <div className="lg:col-span-1 space-y-6">
            <AnalysisPanel
              fen={currentFen}
              evaluation={evaluation}
              ready={ready}
              analyzing={analyzing}
            />

            <div className="bg-ora-slate/50 rounded-lg p-4 border border-gray-800">
              {mentorInput ? (
                <MentorEngine
                  userLevel={2}
                  previousFen={mentorInput.previousFen}
                  currentFen={mentorInput.currentFen}
                  move={mentorInput.move}
                  moveNotation={mentorInput.moveNotation}
                  stockfishEvaluation={mentorInput.stockfishEvaluation}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm">
                    {lastMove
                      ? "Doğa Hoca, motorun değerlendirmesini bekliyor…"
                      : "Bir taş oynayın, Doğa Hoca yorumlasın 🎯"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
