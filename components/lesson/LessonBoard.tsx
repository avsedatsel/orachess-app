"use client";

/**
 * LessonBoard — çocuk dersleri için sade, dokunmatik tahta.
 * İki mod: "tap" (bir odaya dokun) ve "move" (bir taşı oynat).
 * ChessBoard ile aynı taş görsellerini ve renkleri kullanır.
 */

import React, { useEffect, useState } from "react";
import { Chess } from "chess.js";
import { PieceSprite } from "@/components/chess/PieceSprite";

const BOARD_LIGHT = "#EDD9B8";
const BOARD_DARK = "#A97A54";
const SELECTED = "#D4AF37";
const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];
const RANKS = [8, 7, 6, 5, 4, 3, 2, 1];

interface LessonBoardProps {
  fen?: string;
  mode: "tap" | "move";
  onTap?: (square: string) => void;
  onMove?: (san: string, from: string, to: string) => void;
  /** Nazik ipucu: bu kareyi hafifçe parlat (çok denemeden sonra). */
  pulseSquare?: string | null;
}

export function LessonBoard({
  fen = START,
  mode,
  onTap,
  onMove,
  pulseSquare,
}: LessonBoardProps) {
  const [game, setGame] = useState(() => new Chess(fen));
  const [selected, setSelected] = useState<string | null>(null);
  const [legalTargets, setLegalTargets] = useState<string[]>([]);

  useEffect(() => {
    setGame(new Chess(fen));
    setSelected(null);
    setLegalTargets([]);
  }, [fen]);

  const handleClick = (square: string) => {
    if (mode === "tap") {
      onTap?.(square);
      return;
    }
    // move modu
    if (!selected) {
      const piece = game.get(square as never) as
        | { color: string; type: string }
        | undefined;
      if (piece && piece.color === game.turn()) {
        setSelected(square);
        const moves = game.moves({ square: square as never, verbose: true });
        setLegalTargets((moves as { to: string }[]).map((m) => m.to));
      }
      return;
    }
    // hedef seçildi — SAN'ı geçici bir tahtayla hesapla (asıl tahta değişmez)
    const tmp = new Chess(fen);
    let san: string | null = null;
    try {
      const m = tmp.move({ from: selected, to: square, promotion: "q" });
      san = m?.san ?? null;
    } catch {
      san = null;
    }
    setSelected(null);
    setLegalTargets([]);
    if (san) onMove?.(san, selected, square);
  };

  return (
    <div className="inline-block border-[6px] border-ora-gold rounded-xl overflow-hidden shadow-2xl">
      <PieceSprite />
      {RANKS.map((rank) => (
        <div key={rank} className="flex">
          {FILES.map((file, fileIdx) => {
            const square = `${file}${rank}`;
            const piece = game.get(square as never) as
              | { color: string; type: string }
              | undefined;
            const isLight = (RANKS.indexOf(rank) + fileIdx) % 2 === 0;
            const isSelected = selected === square;
            const isTarget = legalTargets.includes(square);
            const isPulse = pulseSquare === square;

            return (
              <div
                key={square}
                data-square={square}
                onClick={() => handleClick(square)}
                className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center cursor-pointer relative select-none"
                style={{
                  backgroundColor: isSelected
                    ? SELECTED
                    : isLight
                    ? BOARD_LIGHT
                    : BOARD_DARK,
                }}
              >
                {piece && (
                  <svg
                    viewBox="0 0 40 40"
                    className="w-[86%] h-[86%] pointer-events-none drop-shadow-sm"
                  >
                    <use href={`#${piece.color}${piece.type}`} />
                  </svg>
                )}
                {isTarget && !piece && (
                  <div className="absolute w-4 h-4 rounded-full bg-black/30" />
                )}
                {isPulse && (
                  <div className="absolute inset-0 ring-4 ring-inset ring-sky-400 animate-pulse rounded-sm" />
                )}
                {file === "a" && (
                  <span
                    className="absolute top-0.5 left-0.5 text-[9px] sm:text-[11px] font-bold leading-none pointer-events-none"
                    style={{ color: isLight ? BOARD_DARK : BOARD_LIGHT }}
                  >
                    {rank}
                  </span>
                )}
                {rank === 1 && (
                  <span
                    className="absolute bottom-0.5 right-1 text-[9px] sm:text-[11px] font-bold leading-none pointer-events-none"
                    style={{ color: isLight ? BOARD_DARK : BOARD_LIGHT }}
                  >
                    {file}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
