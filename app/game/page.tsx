"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChessBoard } from "@/components/chess/ChessBoard";
import { MentorEngine } from "@/components/mentor/MentorEngine";
import { AnalysisPanel } from "@/components/chess/AnalysisPanel";
import { useStockfish, type StockfishEval } from "@/hooks/useStockfish";
import { useUserLevel } from "@/hooks/useUserLevel";
import { STARTING_FEN, uciToSan } from "@/lib/chess-utils";
import {
  orchestrateResponse,
  runSystemIntegrityCheck,
} from "@/lib/orchestrator";
import type { MentorResponse } from "@/lib/ai/personality";

interface LastMove {
  from: string;
  to: string;
  san: string;
  fen: string;
  prevFen: string;
  bestBefore: string | null; // hamleden ÖNCEki pozisyonun en iyi hamlesi (SAN)
}

interface MentorInput {
  previousFen: string;
  currentFen: string;
  move: string;
  moveNotation: string;
  stockfishEvaluation?: number;
  bestMove?: string;
}

export default function GamePage() {
  const [lastMove, setLastMove] = useState<LastMove | null>(null);
  const [mentorInput, setMentorInput] = useState<MentorInput | null>(null);
  const { ready, analyzing, evaluation, analyzedFen, analyze } = useStockfish();
  const userLevel = useUserLevel(); // kullanıcının tespit edilen seviyesi (yoksa 0)

  const currentFen = lastMove?.fen ?? STARTING_FEN;

  // Hamle anında "o pozisyonun en iyi hamlesi"ni yakalamak için son analizi izle
  const latestEvalRef = useRef<StockfishEval | null>(null);
  const analyzedFenRef = useRef<string | null>(null);
  useEffect(() => {
    latestEvalRef.current = evaluation;
  }, [evaluation]);
  useEffect(() => {
    analyzedFenRef.current = analyzedFen;
  }, [analyzedFen]);

  const handleMove = (from: string, to: string, san: string, fen: string) => {
    // Hamle yapılan pozisyon (currentFen), analizde bunun en iyi hamlesi hazırsa yakala
    const movedFrom = lastMove?.fen ?? STARTING_FEN;
    const ev = latestEvalRef.current;
    const bestUci =
      ev && analyzedFenRef.current === movedFrom ? ev.bestMove : null;
    const bestBefore = bestUci ? uciToSan(movedFrom, bestUci) : null;

    setLastMove((prev) => ({
      from,
      to,
      san,
      fen,
      prevFen: prev?.fen || "start",
      bestBefore,
    }));
  };

  // Pozisyon değiştikçe Stockfish otomatik analiz etsin (ana thread bloklanmaz)
  useEffect(() => {
    if (ready) analyze(currentFen);
  }, [ready, currentFen, analyze]);

  // "Head Coach" birleştirme katmanı: Doğa Hoca'nın pedagojik yanıtı hazır
  // olduğunda, Stockfish'in son teknik değerlendirmesiyle TEK pakette birleştir.
  const handleMentorResponse = useCallback((response: MentorResponse) => {
    // Bütünlük kontrolü: pedagojik + teknik akış eşzamanlı hazır mı?
    runSystemIntegrityCheck({
      mentorApi: response,
      personality: { currentTone: response.tone },
      dashboard: { insightCard: true },
      engine: { status: ready ? "ready" : "loading" },
    });

    const combined = orchestrateResponse(latestEvalRef.current, response);
    console.log("[OraChess Head Coach] Birleşik yanıt:", combined);
  }, [ready]);

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
      bestMove: lastMove.bestBefore ?? undefined,
    });
  }, [lastMove, analyzing, evaluation, analyzedFen]);

  return (
    <main className="min-h-screen p-6 pt-20">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold gradient-text">OraChess Oyun</h1>
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
                  userLevel={userLevel}
                  previousFen={mentorInput.previousFen}
                  currentFen={mentorInput.currentFen}
                  move={mentorInput.move}
                  moveNotation={mentorInput.moveNotation}
                  stockfishEvaluation={mentorInput.stockfishEvaluation}
                  bestMove={mentorInput.bestMove}
                  onResponse={handleMentorResponse}
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
