import { Chess } from "chess.js";

export const STARTING_FEN =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export const LEVEL_DEFINITIONS = [
  { level: 0, eloMin: 0, eloMax: 600, title: "Satranç Okuryazarlığı", description: "Taşlar, kurallar" },
  { level: 1, eloMin: 600, eloMax: 850, title: "Görsel Taktikler", description: "Tek hamlelik kazançlar" },
  { level: 2, eloMin: 850, eloMax: 1100, title: "Taş Gelişimi", description: "Açılış prensipleri" },
  { level: 3, eloMin: 1100, eloMax: 1300, title: "Oyun Ortası Planlama", description: "Stratejik planlama" },
  { level: 4, eloMin: 1300, eloMax: 1500, title: "Profilaksi", description: "Önleyici satranç" },
  { level: 5, eloMin: 1500, eloMax: 1750, title: "Derin Hesaplama", description: "Kombinasyonlar" },
  { level: 6, eloMin: 1750, eloMax: 2000, title: "Konumsal Satranç", description: "Piyon yapısı" },
  { level: 7, eloMin: 2000, eloMax: 2250, title: "Ustalık Psikolojisi", description: "Zaman yönetimi" },
  { level: 8, eloMin: 2250, eloMax: 2500, title: "Profesyonel Hazırlık", description: "Yeni fikirler" },
  { level: 9, eloMin: 2500, eloMax: 2700, title: "Büyükusta Sezgisi", description: "Sezgi" },
  { level: 10, eloMin: 2700, eloMax: 2900, title: "Analitik Sentez", description: "Sistem kurmak" },
  { level: 11, eloMin: 2900, eloMax: 3000, title: "Elite Satranç Bilimi", description: "Yenilik" },
];

export function isLegalMove(
  fen: string,
  from: string,
  to: string
): { legal: boolean; move?: unknown } {
  try {
    const game = new Chess(fen);
    const move = game.move({ from, to });
    return move ? { legal: true, move } : { legal: false };
  } catch {
    return { legal: false };
  }
}

export function getMoveNotation(fen: string, from: string, to: string): string | null {
  try {
    const game = new Chess(fen);
    const move = game.move({ from, to });
    return move?.san || null;
  } catch {
    return null;
  }
}

export function getLegalMoves(fen: string): string[] {
  try {
    const game = new Chess(fen);
    return game.moves();
  } catch {
    return [];
  }
}

/** UCI hamlesini ("g1f3") verilen pozisyona göre SAN'a ("Nf3") çevirir. */
export function uciToSan(fen: string, uci: string | null | undefined): string | null {
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

export function getTurn(fen: string): "w" | "b" {
  const parts = fen.split(" ");
  return (parts[1] as "w" | "b") || "w";
}

export function getLevelFromElo(elo: number): number {
  for (let i = LEVEL_DEFINITIONS.length - 1; i >= 0; i--) {
    if (elo >= LEVEL_DEFINITIONS[i].eloMin) return i;
  }
  return 0;
}
