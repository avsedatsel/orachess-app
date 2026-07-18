"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChessBoard } from "@/components/chess/ChessBoard";
import { MentorEngine } from "@/components/mentor/MentorEngine";
import { AnalysisPanel } from "@/components/chess/AnalysisPanel";
import { STARTING_FEN } from "@/lib/chess-utils";

export default function GamePage() {
  const [lastMove, setLastMove] = useState<{
    from: string;
    to: string;
    san: string;
    fen: string;
    prevFen: string;
  } | null>(null);

  const handleMove = (from: string, to: string, san: string, fen: string) => {
    setLastMove((prev) => ({
      from,
      to,
      san,
      fen,
      prevFen: prev?.fen || "start",
    }));
  };

  return (
    <main className="min-h-screen p-6">
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
            <AnalysisPanel fen={lastMove?.fen ?? STARTING_FEN} />

            <div className="bg-ora-slate/50 rounded-lg p-4 border border-gray-800">
              {lastMove ? (
                <MentorEngine
                  userLevel={2}
                  previousFen={lastMove.prevFen}
                  currentFen={lastMove.fen}
                  move={`${lastMove.from}${lastMove.to}`}
                  moveNotation={lastMove.san}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm">
                    Bir taş oynayın, Doğa Hoca yorumlasın 🎯
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
