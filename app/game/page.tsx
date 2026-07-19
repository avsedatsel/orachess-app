"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { ChessBoard } from "@/components/chess/ChessBoard";
import { MentorEngine } from "@/components/mentor/MentorEngine";
import { AnalysisPanel } from "@/components/chess/AnalysisPanel";
import { ActionPanel } from "@/components/game/ActionPanel";
import { BadgeReward } from "@/components/game/BadgeReward";
import { PerformanceFeedback } from "@/components/game/PerformanceFeedback";
import { SmartRouter } from "@/components/game/SmartRouter";
import { CrisisRecovery } from "@/components/game/CrisisRecovery";
import { useStockfish, type StockfishEval } from "@/hooks/useStockfish";
import { useUserLevel } from "@/hooks/useUserLevel";
import { useSkillMastery } from "@/hooks/useSkillMastery";
import { STARTING_FEN, uciToSan, getTurn } from "@/lib/chess-utils";
import {
  triggerCrisisRecovery,
  isCrisis,
  type CrisisRecovery as CrisisData,
} from "@/lib/strategic-recovery";
import { getLevelLessons } from "@/lib/lessons-data";
import {
  orchestrateResponse,
  runSystemIntegrityCheck,
} from "@/lib/orchestrator";
import { levelToElo, type MentorResponse } from "@/lib/ai/personality";

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
  const { mastery, lastMetrics, recordMove } = useSkillMastery();

  // Etkileşim durumları
  const [askSignal, setAskSignal] = useState(0);
  const [asking, setAsking] = useState(false);
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [badgeOpen, setBadgeOpen] = useState(false);
  const [crisis, setCrisis] = useState<CrisisData | null>(null);

  const currentFen = lastMove?.fen ?? STARTING_FEN;

  // Bu seviyenin "hayat dersi" bağlamı (Action sütunu + rozet için)
  const lesson = useMemo(() => getLevelLessons(userLevel)[0], [userLevel]);
  const lifeSkill = lesson?.lifeConcept ?? "Odaklanma";
  const lifeNote =
    lesson?.content ??
    "Her hamle bir seçim, her seçim bir sorumluluk. Sabırlı ol, tahtayı oku.";
  const tasks = useMemo(
    () => [
      "Bir taş oyna, Doğa Hoca'nın yorumunu al",
      "Analiz Modu'nu açıp motorun değerlendirmesini incele",
      "Doğa Hoca'ya Sor ile bir soru daha sor",
      "Modülü bitirip hayat becerini kazan",
    ],
    []
  );

  // Hamle anında "o pozisyonun en iyi hamlesi"ni yakalamak için son analizi izle
  const latestEvalRef = useRef<StockfishEval | null>(null);
  const analyzedFenRef = useRef<string | null>(null);
  useEffect(() => {
    latestEvalRef.current = evaluation;
  }, [evaluation]);
  useEffect(() => {
    analyzedFenRef.current = analyzedFen;
  }, [analyzedFen]);

  // Düşünme süresi: pozisyon önüne konduğu andan hamleye kadar geçen saniye.
  const positionShownAtRef = useRef<number>(Date.now());
  useEffect(() => {
    positionShownAtRef.current = Date.now();
  }, [currentFen]);

  const handleMove = (from: string, to: string, san: string, fen: string) => {
    // Hamle yapılan pozisyon (currentFen), analizde bunun en iyi hamlesi hazırsa yakala
    const movedFrom = lastMove?.fen ?? STARTING_FEN;
    const ev = latestEvalRef.current;
    const bestUci =
      ev && analyzedFenRef.current === movedFrom ? ev.bestMove : null;
    const bestBefore = bestUci ? uciToSan(movedFrom, bestUci) : null;

    // Bilişsel geri bildirim: en iyi hamle biliniyorsa metrikleri kaydet.
    if (bestBefore) {
      const timeTaken = (Date.now() - positionShownAtRef.current) / 1000;
      // Kriz Yönetimi: oyuncunun ÇÖZDÜĞÜ pozisyon (movedFrom) kendi
      // perspektifinden -2.0 altındaysa "kriz altında oynadı" say.
      const facingCp =
        ev && analyzedFenRef.current === movedFrom ? ev.scoreCp : null;
      const mover = getTurn(movedFrom); // hamleyi yapan taraf
      const facingEval =
        facingCp != null ? (mover === "w" ? facingCp : -facingCp) / 100 : null;
      const inCrisis = facingEval != null && facingEval < -2.0;
      recordMove(san, bestBefore, timeTaken, levelToElo(userLevel), inCrisis);
    }

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
  const handleMentorResponse = useCallback(
    (response: MentorResponse) => {
      runSystemIntegrityCheck({
        mentorApi: response,
        personality: { currentTone: response.tone },
        dashboard: { insightCard: true },
        engine: { status: ready ? "ready" : "loading" },
      });
      const combined = orchestrateResponse(latestEvalRef.current, response);
      console.log("[OraChess Head Coach] Birleşik yanıt:", combined);
    },
    [ready]
  );

  // Analiz TAMAMLANINCA (skor kesinleşince) Doğa Hoca'ya gönderilecek girdiyi hazırla.
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

    // Kriz Yönetimi & Stratejik Toparlanma: tahtadaki mevcut pozisyonu
    // OYNAYACAK tarafın perspektifinden değerlendir; zorda ise sakinleştirici mod.
    if (evaluation.scoreCp != null) {
      const stm = getTurn(lastMove.fen);
      const evalForSideToMove =
        (stm === "w" ? evaluation.scoreCp : -evaluation.scoreCp) / 100;
      setCrisis(triggerCrisisRecovery(evalForSideToMove));
    }
  }, [lastMove, analyzing, evaluation, analyzedFen]);

  return (
    <main className="min-h-screen px-4 sm:px-6 pb-6 pt-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
            OraChess Ders Ekranı
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Doğa Hoca ile antrenman · Hayat becerisi: {lifeSkill}
          </p>
        </div>

        {/* 3 Sütun: Mentor (sol) · Tahta (merkez) · Aksiyon (sağ)
            Mobilde sıralama: Tahta → Mentor → Aksiyon */}
        <div className="flex flex-col lg:flex-row gap-6 lg:items-start">
          {/* SÜTUN 1 — Mentor (kaydırılabilir) */}
          <div className="order-2 lg:order-1 w-full lg:flex-1 lg:min-w-0 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto space-y-4">
            {/* Kriz Yönetimi: pozisyon zorlaştıysa sakinleştirici toparlanma kartı */}
            {crisis && isCrisis(crisis) && <CrisisRecovery data={crisis} />}

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
                askSignal={askSignal}
                onLoadingChange={setAsking}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">
                  {lastMove
                    ? "Doğa Hoca, motorun değerlendirmesini bekliyor…"
                    : "Bir taş oyna, Doğa Hoca yorumlasın 🎯"}
                </p>
              </div>
            )}
            </div>
          </div>

          {/* SÜTUN 2 — Tahta (merkez) */}
          <div className="order-1 lg:order-2 w-full lg:w-auto shrink-0 flex justify-center">
            <ChessBoard onMove={handleMove} />
          </div>

          {/* SÜTUN 3 — Aksiyon */}
          <div className="order-3 w-full lg:flex-1 lg:min-w-0 space-y-4">
            {/* Akıllı Yönlendirme (Smart-Router): derse başlarken pedagojik yön */}
            <SmartRouter
              currentElo={levelToElo(userLevel)}
              lifeStrategyScore={mastery.lifeStrategyScore}
            />

            {/* Hamle sonrası bilişsel geri bildirim */}
            <PerformanceFeedback metrics={lastMetrics} />

            <ActionPanel
              lifeSkill={lifeSkill}
              lifeNote={lifeNote}
              tasks={tasks}
              canAsk={!!mentorInput}
              asking={asking}
              onAsk={() => setAskSignal((n) => n + 1)}
              analysisOpen={analysisOpen}
              onToggleAnalysis={() => setAnalysisOpen((v) => !v)}
              onFinishModule={() => setBadgeOpen(true)}
            />

            {analysisOpen && (
              <AnalysisPanel
                fen={currentFen}
                evaluation={evaluation}
                ready={ready}
                analyzing={analyzing}
              />
            )}
          </div>
        </div>
      </div>

      {/* "Modül Bitir" → Hayat Becerisi rozeti */}
      <BadgeReward
        open={badgeOpen}
        skill={lifeSkill}
        onClose={() => setBadgeOpen(false)}
      />
    </main>
  );
}
