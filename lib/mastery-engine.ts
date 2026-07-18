/**
 * COGNITIVE FEEDBACK & MASTERY ENGINE (Kod Bloğu 5)
 * ------------------------------------------------------------
 * Öğrencinin gelişimini İKİ ayrı metrikle takip eder:
 *   1) Satranç Bilgisi (technicalAccuracy) — hamle doğru muydu (Stockfish'e göre)
 *   2) Stratejik Düşünme (strategicInsight) — düşünme derinliği (süre)
 * Her hamle/ders sonrası geri bildirim verir ve "Zihin Becerisi"ni biriktirir.
 */

/** Tek bir hamlenin anlık performans metrikleri. */
export interface PerformanceMetrics {
  technicalAccuracy: number; // 0 | 100 (teknik skor)
  strategicInsight: number; // 50 | 100 (düşünme derinliği)
  feedbackMessage: string;
}

/**
 * Kullanıcının her hamle/ders sonrası kazandığı 'Zihin Becerisi'ni ölçer.
 * userMove / bestMove: SAN gösterimi (ör. "Nf3"). timeTaken: saniye.
 */
export const calculatePerformanceMetrics = (
  userMove: string,
  bestMove: string,
  timeTaken: number
): PerformanceMetrics => {
  const isCorrect = userMove === bestMove;

  return {
    technicalAccuracy: isCorrect ? 100 : 0, // Teknik skor
    strategicInsight: timeTaken > 10 ? 100 : 50, // Yavaş düşünme = yüksek strateji
    feedbackMessage: isCorrect
      ? "Doğru hamle! Analizin, stratejik derinliğinin arttığını gösteriyor."
      : "Biraz acele ettin. Bu pozisyonda acele etmek yerine, rakibin planını bir kez daha düşünmeni öneririm.",
  };
};

/** Dashboard'daki 'Gelişim Çizelgesi'ni besleyen birikimli metrikler. */
export interface SkillMastery {
  chessElo: number;
  lifeStrategyScore: number; // 0-100 (Sabır, Planlama, Kriz Yönetimi)
  recentMistakes: string[]; // Sokratik analiz için tutulan hatalar listesi
  // Çizelge için ek birikimli alanlar:
  chessKnowledge: number; // 0-100 teknik doğruluk ortalaması ("Satranç Bilgisi")
  movesPlayed: number; // ortalama hesabı için hamle sayısı
}

export const INITIAL_MASTERY: SkillMastery = {
  chessElo: 0,
  lifeStrategyScore: 50,
  recentMistakes: [],
  chessKnowledge: 50,
  movesPlayed: 0,
};

const MAX_MISTAKES = 5;

/**
 * Bir hamlenin metriklerini birikimli SkillMastery'ye işler.
 * - chessKnowledge: teknik doğruluğun yürüyen ortalaması
 * - lifeStrategyScore: stratejik derinliğin yumuşatılmış (EMA) skoru
 * - recentMistakes: yanlış hamleler (Sokratik analiz için, son 5)
 */
export function updateMastery(
  prev: SkillMastery,
  metrics: PerformanceMetrics,
  ctx: { chessElo: number; mistakeNote?: string }
): SkillMastery {
  const n = prev.movesPlayed + 1;
  const chessKnowledge = Math.round(
    (prev.chessKnowledge * prev.movesPlayed + metrics.technicalAccuracy) / n
  );
  const lifeStrategyScore = Math.round(
    prev.lifeStrategyScore * 0.7 + metrics.strategicInsight * 0.3
  );
  const recentMistakes =
    metrics.technicalAccuracy < 100 && ctx.mistakeNote
      ? [ctx.mistakeNote, ...prev.recentMistakes].slice(0, MAX_MISTAKES)
      : prev.recentMistakes;

  return {
    chessElo: ctx.chessElo || prev.chessElo,
    lifeStrategyScore,
    chessKnowledge,
    recentMistakes,
    movesPlayed: n,
  };
}
