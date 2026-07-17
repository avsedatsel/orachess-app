"use client";

import React, { useState } from "react";
import { Chess } from "chess.js";

const PIECE_SYMBOLS: Record<string, string> = {
  wp: "♙", wn: "♘", wb: "♗", wr: "♖", wq: "♕", wk: "♔",
  bp: "♟", bn: "♞", bb: "♝", br: "♜", bq: "♛", bk: "♚",
};

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
    <div className="inline-block border-4 border-ora-gold rounded-lg overflow-hidden shadow-2xl">
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
                onClick={() => handleSquareClick(square)}
                className="w-14 h-14 flex items-center justify-center cursor-pointer relative text-4xl select-none"
                style={{
                  backgroundColor: isSelected
                    ? "#D4AF37"
                    : isLight
                    ? "#E8D5B7"
                    : "#6B4423",
                }}
              >
                {piece && (
                  <span style={{ color: piece.color === "w" ? "#fff" : "#000", textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}>
                    {PIECE_SYMBOLS[`${piece.color}${piece.type}`]}
                  </span>
                )}
                {isTarget && !piece && (
                  <div className="absolute w-4 h-4 rounded-full bg-ora-gold opacity-60" />
                )}
                {isTarget && piece && (
                  <div className="absolute inset-0 border-4 border-ora-gold opacity-70" />
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
