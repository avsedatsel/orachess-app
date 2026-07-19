"use client";

/**
 * LessonPlayer — 45 dakikalık çocuk dersini 6 "macera durağı" olarak oynatır.
 * ANAYASA'ya sadık: keşif pedagojisi (hata=merak, ceza yok), Piyoncuk, protégé,
 * baskısız mola. Görev türleri: dokun (hedefKare), oynat (fen+hamle), seç (buton).
 */

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Home, RotateCcw, PartyPopper } from "lucide-react";
import type { ChildLesson, Durak } from "@/lib/child-lesson-schema";
import { LessonBoard } from "@/components/lesson/LessonBoard";
import { Piyoncuk } from "@/components/lesson/Piyoncuk";
import { useCompletedLessons } from "@/hooks/useCompletedLessons";

type Faz = "durak" | "olcum" | "mola";

function DogaBubble({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-ora-accent to-purple-600 border-2 border-white/70 flex items-center justify-center shadow-lg">
        <span className="text-white font-bold">Doğa</span>
      </div>
      <div className="bg-white/95 text-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 text-sm sm:text-base leading-relaxed shadow-lg">
        {text}
      </div>
    </div>
  );
}

function gorevModu(d: Durak): "tap" | "move" | "buton" {
  const g = d.gorev;
  if (g.hedefKare) return "tap";
  if (g.fen && g.dogruHamleSan) return "move";
  return "buton";
}

export function LessonPlayer({ lesson }: { lesson: ChildLesson }) {
  const { markDone } = useCompletedLessons();
  const [faz, setFaz] = useState<Faz>("durak");
  const [durakIdx, setDurakIdx] = useState(0);

  // Durak içi durum
  const [cozuldu, setCozuldu] = useState(false);
  const [deneme, setDeneme] = useState(0);
  const [geriBildirim, setGeriBildirim] = useState<string | null>(null);
  const [pulse, setPulse] = useState<string | null>(null);

  // Ölçüm durumu
  const [olcumDogru, setOlcumDogru] = useState(false);

  const durak = lesson.duraklar[durakIdx];
  const mod = useMemo(() => gorevModu(durak), [durak]);

  const durakSifirla = () => {
    setCozuldu(false);
    setDeneme(0);
    setGeriBildirim(null);
    setPulse(null);
  };

  const basar = () => {
    setCozuldu(true);
    setGeriBildirim(null);
    setPulse(null);
  };

  // Yanlış denemede NAZİK yönlendirme (ANAYASA §5) — asla ceza yok.
  const yanlisDeneme = () => {
    const ip = durak.gorev.kesifIpuclari;
    const idx = Math.min(deneme, ip.length - 1);
    setGeriBildirim(
      deneme === 0 ? "Hımm, ilginç! Bakalım… " + ip[idx] : ip[idx]
    );
    // İpuçları bitince hedefi hafifçe parlat (dokun görevinde)
    if (deneme >= ip.length - 1 && durak.gorev.hedefKare) {
      setPulse(durak.gorev.hedefKare);
    }
    setDeneme((n) => n + 1);
  };

  const dogruMuTap = (kare: string) => kare === durak.gorev.hedefKare;
  const dogruMuHamle = (san: string) =>
    san === durak.gorev.dogruHamleSan ||
    (durak.gorev.kabulEdilen ?? []).includes(san);

  const ilerle = () => {
    if (durakIdx < lesson.duraklar.length - 1) {
      setDurakIdx((i) => i + 1);
      durakSifirla();
    } else {
      setFaz("olcum");
    }
  };

  // İlerleme noktaları
  const noktalar = lesson.duraklar.map((_, i) => i);

  return (
    <main className="min-h-screen px-4 sm:px-6 pt-20 pb-10">
      <div className="max-w-3xl mx-auto">
        {/* Başlık + ilerleme */}
        <div className="mb-4 text-center">
          <p className="text-xs text-gray-300">
            {lesson.id} · Hayat becerisi: {lesson.yasBecerisi}
          </p>
          <h1 className="text-2xl font-bold gradient-text">{lesson.baslik}</h1>
          <div className="mt-2 flex items-center justify-center gap-1.5">
            {noktalar.map((i) => (
              <span
                key={i}
                className={`h-2 rounded-full transition-all ${
                  faz !== "durak" || i < durakIdx
                    ? "w-6 bg-green-400"
                    : i === durakIdx
                    ? "w-6 bg-ora-gold"
                    : "w-2 bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ---- DURAK FAZI ---- */}
        {faz === "durak" && (
          <motion.div
            key={durakIdx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="rounded-2xl bg-ora-slate/60 border border-gray-700 p-4 sm:p-5 space-y-4">
              <p className="text-xs font-semibold text-ora-gold">
                Durak {durak.no}/6 · {durak.baslik}
              </p>
              <DogaBubble text={durak.kesif} />
              {durak.piyoncuk && (
                <Piyoncuk mesaj={durak.piyoncuk} mood="mutlu" />
              )}
            </div>

            {/* Görev */}
            <div className="rounded-2xl bg-ora-dark/50 border border-gray-800 p-4 sm:p-5">
              <p className="text-sm sm:text-base text-gray-100 mb-4 font-semibold">
                🎯 {durak.gorev.yonerge}
              </p>

              {!cozuldu && (mod === "tap" || mod === "move") && (
                <div className="flex justify-center">
                  <LessonBoard
                    fen={durak.gorev.fen}
                    mode={mod}
                    pulseSquare={pulse}
                    onTap={(kare) =>
                      dogruMuTap(kare) ? basar() : yanlisDeneme()
                    }
                    onMove={(san) =>
                      dogruMuHamle(san) ? basar() : yanlisDeneme()
                    }
                  />
                </div>
              )}

              {!cozuldu && mod === "buton" && (
                <div className="flex justify-center">
                  <button
                    onClick={basar}
                    className="px-6 py-3 bg-ora-gold text-ora-dark font-bold rounded-xl hover:opacity-90 transition text-lg"
                  >
                    Seçtim! ✨
                  </button>
                </div>
              )}

              {/* Nazik yönlendirme */}
              {geriBildirim && !cozuldu && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 text-center text-sm text-sky-200 bg-sky-500/10 border border-sky-500/30 rounded-xl px-4 py-3"
                >
                  {geriBildirim}
                  {deneme >= 2 && (
                    <button
                      onClick={basar}
                      className="block mx-auto mt-2 text-xs text-ora-gold underline"
                    >
                      Piyoncuk'la birlikte yapalım →
                    </button>
                  )}
                </motion.div>
              )}

              {/* Kutlama */}
              <AnimatePresence>
                {cozuldu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 text-center space-y-3"
                  >
                    <div className="flex items-center justify-center gap-2 text-green-300 font-bold text-lg">
                      <PartyPopper className="w-5 h-5" />
                      {durak.gorev.kutlama}
                    </div>
                    <button
                      onClick={ilerle}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-ora-gold text-ora-dark font-bold rounded-xl hover:opacity-90 transition"
                    >
                      Devam <ArrowRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ---- ÖLÇÜM FAZI (sınav değil, sürpriz soru) ---- */}
        {faz === "olcum" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-ora-slate/60 border border-gray-700 p-5 space-y-4"
          >
            <p className="flex items-center gap-2 font-semibold text-ora-gold">
              <Sparkles className="w-5 h-5" /> Sürpriz Soru!
            </p>
            <p className="text-gray-100">{lesson.ustalikOlcumu.soru}</p>
            <div className="space-y-2">
              {lesson.ustalikOlcumu.secenekler.map((s, i) => {
                const dogru = i === lesson.ustalikOlcumu.dogruIndex;
                return (
                  <button
                    key={i}
                    onClick={() => setOlcumDogru(dogru)}
                    disabled={olcumDogru}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition ${
                      olcumDogru && dogru
                        ? "bg-green-500/20 border-green-400 text-green-100"
                        : "bg-ora-dark/40 border-gray-700 hover:border-ora-gold text-gray-100"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
            {olcumDogru && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-3"
              >
                <p className="text-green-300 font-bold">
                  Vaaay, bildin! 🎉 Bugün bir güç kazandın:{" "}
                  {lesson.ustalikOlcumu.yasBecerisiEtiketi}
                </p>
                <button
                  onClick={() => {
                    markDone(lesson.id);
                    setFaz("mola");
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-ora-gold text-ora-dark font-bold rounded-xl hover:opacity-90 transition"
                >
                  Devam <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ---- MOLA / KAPANIŞ FAZI ---- */}
        {faz === "mola" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl bg-gradient-to-br from-ora-accent/30 to-ora-gold/10 border border-ora-gold/40 p-6 space-y-5 text-center"
          >
            <div className="text-4xl">🏰</div>
            <h2 className="text-xl font-bold text-ora-gold">
              Dersi bitirdin, kâhraman!
            </h2>

            {/* Hayat dersi */}
            <div className="bg-white/10 rounded-xl p-4 text-left">
              <p className="text-xs font-semibold text-purple-200 mb-1">
                Bugünün hayat dersi
              </p>
              <p className="text-sm text-gray-100">{lesson.vakaDosyasi.ders}</p>
            </div>

            {/* Piyoncuk mola daveti */}
            <div className="flex justify-center">
              <Piyoncuk mesaj={lesson.moladavet} mood="mutlu" />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-ora-gold text-ora-dark font-bold rounded-xl hover:opacity-90 transition"
              >
                <Home className="w-4 h-4" /> Yoluma dön
              </Link>
              <button
                onClick={() => {
                  setFaz("durak");
                  setDurakIdx(0);
                  durakSifirla();
                  setOlcumDogru(false);
                }}
                className="inline-flex items-center gap-2 px-5 py-3 border border-gray-600 text-gray-200 rounded-xl hover:bg-gray-800 transition"
              >
                <RotateCcw className="w-4 h-4" /> Baştan oyna
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
