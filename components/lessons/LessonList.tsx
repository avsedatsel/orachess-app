"use client";

/**
 * LessonList — Bir seviyenin derslerini "başlatılabilir" olarak listeler.
 * Her ders açılıp okunabilir ve Doğa Hoca'nın sesiyle (ElevenLabs) dinlenebilir.
 * Sesli dinlemede dersin kendi tonlama parametreleri (stability/similarityBoost) kullanılır.
 */

import { useCallback, useState } from "react";
import { Volume2, Loader, ChevronDown } from "lucide-react";
import { LEVEL_0_LESSONS, type Lesson } from "@/lib/lessons-data";
import { synthesizeSpeech } from "@/lib/ai/voice-api";
import { getToneColor, toneKeyFromLabel } from "@/lib/ai/personality";

export function LessonList() {
  const [acikId, setAcikId] = useState<string | null>(null);
  const [seslenenId, setSeslenenId] = useState<string | null>(null);
  const [hata, setHata] = useState<{ id: string; mesaj: string } | null>(null);

  const dinle = useCallback(async (lesson: Lesson) => {
    setSeslenenId(lesson.id);
    setHata(null);
    try {
      const r = await synthesizeSpeech(lesson.content, {
        stability: lesson.stability,
        similarityBoost: lesson.similarityBoost,
      });
      if ("audio" in r) {
        await new Audio(r.audio).play();
      } else {
        setHata({ id: lesson.id, mesaj: r.error });
      }
    } catch (e) {
      setHata({ id: lesson.id, mesaj: e instanceof Error ? e.message : String(e) });
    } finally {
      setSeslenenId(null);
    }
  }, []);

  return (
    <div className="space-y-2">
      {LEVEL_0_LESSONS.map((lesson, i) => {
        const acik = acikId === lesson.id;
        const toneColor = getToneColor(toneKeyFromLabel(lesson.tone));
        return (
          <div
            key={lesson.id}
            className="bg-ora-slate/50 rounded-lg border border-gray-800 overflow-hidden"
          >
            <button
              onClick={() => setAcikId(acik ? null : lesson.id)}
              className="w-full flex items-center gap-4 p-4 text-left hover:bg-ora-slate/70 transition"
            >
              <div className="w-9 h-9 flex items-center justify-center bg-ora-gold text-ora-dark font-bold rounded-full shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{lesson.title}</p>
                <p className="text-xs text-gray-500 flex items-center gap-2">
                  <span>Ders {lesson.id}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <span
                      className="inline-block w-2 h-2 rounded-full"
                      style={{ backgroundColor: toneColor }}
                    />
                    {lesson.tone}
                  </span>
                </p>
              </div>
              <span className="text-xs font-semibold text-ora-gold shrink-0 flex items-center gap-1">
                {acik ? "Kapat" : "Başlat"}
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${acik ? "rotate-180" : ""}`}
                />
              </span>
            </button>

            {acik && (
              <div className="px-4 pb-4 border-t border-gray-800/50">
                <p className="text-sm text-gray-200 leading-relaxed my-3">
                  {lesson.content}
                </p>
                <div className="inline-block px-2 py-1 bg-ora-accent/20 rounded text-xs text-purple-300 mb-3">
                  📚 {lesson.lifeConcept}
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
                  {hata?.id === lesson.id && (
                    <span className="text-xs text-error">{hata.mesaj}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
