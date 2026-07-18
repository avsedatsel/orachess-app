"use client";

import React, { useState } from "react";
import { Chess } from "chess.js";
import { PieceSprite } from "./PieceSprite";

// Tahta kare renkleri (koyu kare siyah taşlarla karışmayacak tonda)
const BOARD_LIGHT = "#EDD9B8"; // açık kare
const BOARD_DARK = "#A97A54"; // koyu kare (sıcak ahşap tonu)
const SELECTED = "#D4AF37"; // seçili kare (ora-gold)

interface ChessBoardProps {
  onMove?: (from: string, to: string, san: string, fen: string) => void;
}

export const ChessBoard: React.FC<ChessBoardProps> = ({ onMove }) => {
  const [game] = useState(() => new Chess());
  const [, forceUpdate] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [legalTargets, setLegalTargets] = useState<string[]>([]);

  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const ranks = [8, 7, 6, 5, 4, 3, 2, 1];

  const handleSquareClick = (square: string) => {
    if (selected) {
      try {
        const move = game.move({ from: selected, to: square, promotion: "q" });
        if (move) {
          onMove?.(selected, square, move.san, game.fen());
          forceUpdate((n) => n + 1);
        }
      } catch {
        // invalid move
      }
      setSelected(null);
      setLegalTargets([]);
    } else {
      const piece = game.get(square as any);
      if (piece) {
        setSelected(square);
        const moves = game.moves({ square: square as any, verbose: true });
        setLegalTargets(moves.map((m: any) => m.to));
      }
    }
  };

  return (
    <div className="inline-block border-[6px] border-ora-gold rounded-lg overflow-hidden shadow-2xl">
      {/* Taş sprite'ı (gizli, bir kez) */}
      <PieceSprite />

      {ranks.map((rank) => (
        <div key={rank} className="flex">
          {files.map((file, fileIdx) => {
            const square = `${file}${rank}`;
            const piece = game.get(square as any);
            const isLight = (ranks.indexOf(rank) + fileIdx) % 2 === 0;
            const isSelected = selected === square;
            const isTarget = legalTargets.includes(square);

            return (
              <div
                key={square}
                data-sq={isLight ? "light" : "dark"}
                onClick={() => handleSquareClick(square)}
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
                {isTarget && piece && (
                  <div className="absolute inset-0 ring-4 ring-inset ring-black/30" />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default ChessBoard;
