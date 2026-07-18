"use client";

/**
 * PyramidPath — "Ustalık Piramidi" ilerleme haritası (Progressive Map).
 * 12 seviyeyi, tırmanılan bir yol/piramit olarak gösterir (Seviye 0 en altta).
 * Her seviye açıldığında 30'lu küçük ADIMLARDAN oluşan bir ders bloğu belirir.
 * İçeriği hazır adımlar tıklanabilir; henüz eklenmemiş adımlar kilitlidir.
 */

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import {
  Lock,
  Check,
  Play,
  Volume2,
  Loader,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { LEVEL_DEFINITIONS } from "@/lib/chess-utils";
import { getLevelLessons, type Lesson } from "@/lib/lessons-data";
import { synthesizeSpeech } from "@/lib/ai/voice-api";
import { useUserLevel } from "@/hooks/useUserLevel";
import { useCompletedLessons } from "@/hooks/useCompletedLessons";

const STEPS_PER_LEVEL = 30;

export function PyramidPath({ detectedLevel }: { detectedLevel?: number | null }) {
  const userLevel = useUserLevel();
  const currentLevel = detectedLevel ?? userLevel ?? 0;
  const { completed, toggle } = useCompletedLessons();

  const [acikSeviye, setAcikSeviye] = useState<number | null>(currentLevel);
  const [acikAdim, setAcikAdim] = useState<string | null>(null);
  const [seslenenId, setSeslenenId] = useState<string | null>(null);
  const [sesHata, setSesHata] = useState<string | null>(null);

  const dinle = useCallback(async (lesson: Lesson) => {
    setSeslenenId(lesson.id);
    setSesHata(null);
    try {
      const r = await synthesizeSpeech(lesson.content, {
        stability: lesson.stability,
        similarityBoost: lesson.similarityBoost,
      });
      if ("audio" in r) {
        await new Audio(r.audio).play();
      } else {
        setSesHata(r.error);
      }
    } catch (e) {
      setSesHata(e instanceof Error ? e.message : String(e));
    } finally {
      setSeslenenId(null);
    }
  }, []);

  // En üstte Seviye 11, en altta Seviye 0 → "tırmanış" hissi.
  const rows = useMemo(() => [...LEVEL_DEFINITIONS].reverse(), []);

  return (
    <div className="relative">
      {/* Dikey yol çizgisi */}
      <div
        className="absolute left-1/2 top-4 bottom-4 w-0.5 -translate-x-1/2 bg-gradient-to-b from-ora-gold/10 via-ora-gold/40 to-ora-gold/10 pointer-events-none"
        aria-hidden
      />

      <div className="space-y-3">
        {rows.map((level) => {
          const lessons = getLevelLessons(level.level);
          const acik = acikSeviye === level.level;
          const isCurrent = level.level === currentLevel;
          const isLocked = level.level > currentLevel;
          // Piramit hissi: üst seviyeler biraz daha dar.
          const width = 100 - (11 - level.level) * 3.2;
          const doneInLevel = lessons.filter((l) => completed.has(l.id)).length;

          return (
            <div
              key={level.level}
              className="relative mx-auto"
              style={{ maxWidth: `${Math.max(width, 62)}%` }}
            >
              <button
                onClick={() => {
                  setAcikSeviye(acik ? null : level.level);
                  setAcikAdim(null);
                }}
                className={`w-full flex items-center gap-3 p-3 sm:p-4 rounded-xl border text-left transition ${
                  isCurrent
                    ? "bg-ora-gold/15 border-ora-gold shadow-lg shadow-ora-gold/10"
                    : isLocked
                    ? "bg-ora-slate/40 border-gray-800 opacity-70"
                    : "bg-ora-slate/70 border-gray-700 hover:border-ora-gold/50"
                }`}
              >
                <div
                  className={`w-10 h-10 sm:w-11 sm:h-11 shrink-0 flex items-center justify-center font-bold rounded-full ${
                    isLocked
                      ? "bg-gray-700 text-gray-400"
                      : "bg-ora-gold text-ora-dark"
                  }`}
                >
                  {isLocked ? <Lock className="w-4 h-4" /> : level.level}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate flex items-center gap-2">
                    {level.title}
                    {isCurrent && (
                      <span className="text-[10px] font-semibold text-ora-gold whitespace-nowrap">
                        ● Senin seviyen
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {level.eloMin}-{level.eloMax} Elo · {level.description}
                  </p>
                </div>
                {lessons.length > 0 && (
                  <span className="text-[10px] text-gray-400 shrink-0 hidden sm:block">
                    {doneInLevel}/{lessons.length}
                  </span>
                )}
                <ChevronDown
                  className={`w-4 h-4 shrink-0 text-gray-400 transition-transform ${
                    acik ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* 30'lu adım bloğu */}
              {acik && (
                <div className="mt-2 mb-1 p-3 sm:p-4 rounded-xl bg-ora-dark/40 border border-gray-800">
                  {lessons.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-2">
                      Bu seviyenin dersleri yakında Doğa Hoca tarafından
                      ekleniyor. 🛠️
                    </p>
                  )}

                  <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5 sm:gap-2">
                    {Array.from({ length: STEPS_PER_LEVEL }).map((_, i) => {
                      const lesson = lessons[i];
                      const hasLesson = !!lesson;
                      const isDone = hasLesson && completed.has(lesson.id);
                      const isActiveStep = hasLesson && acikAdim === lesson.id;
                      return (
                        <button
                          key={i}
                          disabled={!hasLesson}
                          onClick={() =>
                            hasLesson &&
                            setAcikAdim(isActiveStep ? null : lesson.id)
                          }
                          title={
                            hasLesson ? lesson.title : `Adım ${i + 1} · yakında`
                          }
                          className={`aspect-square rounded-md text-[10px] font-semibold flex items-center justify-center transition ${
                            isActiveStep
                              ? "bg-ora-gold text-ora-dark ring-2 ring-ora-gold"
                              : isDone
                              ? "bg-green-500/80 text-white"
                              : hasLesson
                              ? "bg-ora-accent/50 text-white hover:bg-ora-accent"
                              : "bg-gray-800/60 text-gray-600 cursor-not-allowed"
                          }`}
                        >
                          {isDone ? (
                            <Check className="w-3 h-3" />
                          ) : hasLesson ? (
                            i + 1
                          ) : (
                            <Lock className="w-2.5 h-2.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Seçilen adımın ders detayı */}
                  {acikAdim &&
                    (() => {
                      const lesson = lessons.find((l) => l.id === acikAdim);
                      if (!lesson) return null;
                      const isDone = completed.has(lesson.id);
                      return (
                        <div className="mt-3 p-3 rounded-lg bg-ora-slate/70 border border-gray-700">
                          <p className="font-semibold text-sm mb-1">
                            {lesson.title}
                          </p>
                          <p className="text-xs text-gray-200 leading-relaxed mb-3">
                            {lesson.content}
                          </p>
                          <div className="inline-block px-2 py-1 bg-ora-accent/20 rounded text-[11px] text-purple-200 mb-3">
                            📚 Hayat Dersi: {lesson.lifeConcept}
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              onClick={() => dinle(lesson)}
                              disabled={seslenenId === lesson.id}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-ora-gold border border-ora-gold/50 rounded-lg hover:bg-ora-gold/10 transition disabled:opacity-50"
                            >
                              {seslenenId === lesson.id ? (
                                <>
                                  <Loader className="w-3.5 h-3.5 animate-spin" />
                                  Ses hazırlanıyor…
                                </>
                              ) : (
                                <>
                                  <Volume2 className="w-3.5 h-3.5" />
                                  Doğa Hoca&apos;dan dinle
                                </>
                              )}
                            </button>
                            <Link
                              href="/game"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-ora-gold text-ora-dark rounded-lg hover:opacity-90 transition"
                            >
                              <Play className="w-3.5 h-3.5" />
                              Alıştırmaya git
                            </Link>
                            <button
                              onClick={() => toggle(lesson.id)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                                isDone
                                  ? "border-green-500/60 text-green-300 hover:bg-green-500/10"
                                  : "border-gray-600 text-gray-200 hover:bg-gray-800"
                              }`}
                            >
                              {isDone ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  Tamamlandı
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-3.5 h-3.5" />
                                  Tamamlandı işaretle
                                </>
                              )}
                            </button>
                          </div>
                          {sesHata && seslenenId === null && (
                            <p className="text-xs text-error mt-2">{sesHata}</p>
                          )}
                        </div>
                      );
                    })()}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
