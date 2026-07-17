"use client";

import { useState, useCallback } from "react";
import { Chess } from "chess.js";
import { STARTING_FEN } from "@/lib/chess-utils";

export function useChessBoard(initialFen: string = STARTING_FEN) {
  const [game] = useState(() => new Chess(initialFen));
  const [fen, setFen] = useState(initialFen);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);

  const makeMove = useCallback(
    (from: string, to: string) => {
      try {
        const move = game.move({ from, to, promotion: "q" });
        if (move) {
          setFen(game.fen());
          return move;
        }
      } catch {
        return null;
      }
      return null;
    },
    [game]
  );

  const reset = useCallback(() => {
    game.reset();
    setFen(game.fen());
    setSelectedSquare(null);
  }, [game]);

  const undo = useCallback(() => {
    game.undo();
    setFen(game.fen());
  }, [game]);

  const getLegalMoves = useCallback(
    (square: string): string[] => {
      try {
        return game.moves({ square: square as any, verbose: true }).map((m: any) => m.to);
      } catch {
        return [];
      }
    },
    [game]
  );

  return {
    game,
    fen,
    selectedSquare,
    setSelectedSquare,
    makeMove,
    reset,
    undo,
    getLegalMoves,
    turn: game.turn(),
    isCheckmate: game.isCheckmate(),
    isDraw: game.isDraw(),
    inCheck: game.inCheck(),
  };
}
