/**
 * ORCHESTRATOR — "Head Coach" bütünlük katmanı
 * ------------------------------------------------------------
 * OraChess'te iki ayrı zekâ birlikte çalışır:
 *   1) Stockfish  → TEKNİK değerlendirme (skor, en iyi hamle)
 *   2) Doğa Hoca  → PEDAGOJİK geri bildirim (metin, ton, ses stili)
 *
 * Bu dosya, bu iki çıktının kopuk kalmadığını doğrular (integrity check)
 * ve tek bir pakette birleştirir (orchestrateResponse). Alan adları,
 * projedeki gerçek veri modeliyle (StockfishEval / MentorResponse) hizalıdır.
 */

import type { StockfishEval } from "@/hooks/useStockfish";
import type { MentorResponse } from "@/lib/ai/personality";
import { getVoiceParameters, TONE_MAPPING } from "@/lib/ai/personality";

/** Sistem durumunun "Head Coach" tarafından kontrol edilen özeti. */
export interface SystemState {
  mentorApi?: unknown; // mentor yanıtı/servisi mevcut mu
  personality: { currentTone?: string }; // adaptif ton belirlendi mi
  dashboard: { insightCard?: unknown }; // Günün Odak Noktası aktif mi
  engine: { status?: string }; // Stockfish durumu ("ready" bekleriz)
}

/**
 * Entegrasyonların bütünlüğünü kontrol eden doğrulama katmanı.
 * Pedagojik akışın (mentor + ton + insight) ve teknik motorun (Stockfish)
 * eşzamanlı hazır olduğunu doğrular.
 */
export const runSystemIntegrityCheck = (systemState: SystemState): boolean => {
  const checks = {
    isMentorResponsive: !!systemState.mentorApi,
    isToneAdaptive: systemState.personality.currentTone !== undefined,
    isDailyInsightActive: !!systemState.dashboard.insightCard,
    isStockfishReady: systemState.engine.status === "ready",
  };

  if (!Object.values(checks).every(Boolean)) {
    console.error(
      "OraChess Stratejik Hata: Pedagojik akışta kopukluk var!",
      checks
    );
    return false;
  }
  return true;
};

/** Teknik + pedagojik veriyi birleştiren tek paket. */
export interface OrchestratedResponse {
  technicalScore: number | null; // Stockfish skoru (santipiyon, Beyaz perspektifi)
  technicalMateIn: number | null; // N hamlede mat (varsa)
  technicalBestMove: string | null; // motorun önerdiği en iyi hamle (UCI)
  pedagogicalFeedback: string; // Doğa Hoca'nın yorum metni
  tone: string; // adaptif ton etiketi (ör. "Teşvik Edici")
  voiceStyle: string; // ElevenLabs ses stili (ör. "yavaş/pes")
  confidence: number; // mentor güven skoru (0–1)
  timestamp: string; // ISO zaman damgası
}

/**
 * Analiz sonrası pedagojik çıktıyı (Doğa Hoca) ve teknik veriyi (Stockfish)
 * tek pakette birleştirir. Alanlar gerçek veri modeliyle eşlenir.
 */
export const orchestrateResponse = (
  stockfishData: StockfishEval | null,
  mentorResponse: MentorResponse
): OrchestratedResponse => {
  const toneLabel = TONE_MAPPING[mentorResponse.tone]?.label ?? "Standart";
  const voice = getVoiceParameters(toneLabel);

  return {
    technicalScore: stockfishData?.scoreCp ?? null,
    technicalMateIn: stockfishData?.mateIn ?? null,
    technicalBestMove: stockfishData?.bestMove ?? null,
    pedagogicalFeedback: mentorResponse.text,
    tone: toneLabel,
    voiceStyle: voice.style,
    confidence: mentorResponse.confidence,
    timestamp: new Date().toISOString(),
  };
};
