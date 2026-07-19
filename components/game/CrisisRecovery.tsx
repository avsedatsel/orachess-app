"use client";

/**
 * CrisisRecovery — pozisyon zorlaştığında (eval < -2.0) beliren
 * "Stratejik Toparlanma" kartı. Sakinleştirici mesaj + önerilen alıştırma.
 * Doğa Hoca'nın sesi getCrisisVoiceSettings ile YAVAŞ/DERİN sentezlenir.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { LifeBuoy, Volume2, Loader, Wind } from "lucide-react";
import type { CrisisRecovery as CrisisData } from "@/lib/strategic-recovery";
import { getCrisisVoiceSettings } from "@/lib/strategic-recovery";
import { synthesizeSpeech } from "@/lib/ai/voice-api";

export function CrisisRecovery({ data }: { data: CrisisData }) {
  const [ses, setSes] = useState<"bekliyor" | "yukleniyor" | "hata">("bekliyor");
  const [hata, setHata] = useState<string | null>(null);

  const seslendir = async () => {
    setSes("yukleniyor");
    setHata(null);
    try {
      // getCrisisVoiceSettings → ElevenLabs voice_settings (yavaş/derin, sakin)
      const vs = getCrisisVoiceSettings(data.mentorTone);
      const r = await synthesizeSpeech(data.message, {
        stability: vs.stability,
        similarityBoost: vs.similarityBoost,
      });
      if ("audio" in r) {
        await new Audio(r.audio).play();
        setSes("bekliyor");
      } else {
        setHata(r.error);
        setSes("hata");
      }
    } catch (e) {
      setHata(e instanceof Error ? e.message : String(e));
      setSes("hata");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-lg p-4 border border-sky-500/40 bg-sky-500/10"
    >
      <div className="flex items-center gap-2 mb-2">
        <LifeBuoy className="w-4 h-4 text-sky-300" />
        <h3 className="font-semibold text-sm text-sky-100">
          Stratejik Toparlanma
        </h3>
        <span className="ml-auto flex items-center gap-1 text-[10px] font-semibold text-sky-300">
          <Wind className="w-3 h-3" />
          {data.mentorTone}
        </span>
      </div>

      <p className="text-sm text-gray-100 leading-relaxed mb-3">
        {data.message}
      </p>

      {data.recommendedExercise && (
        <div className="inline-block px-2 py-1 mb-3 rounded bg-sky-500/20 text-xs text-sky-200">
          🛡️ Önerilen: {data.recommendedExercise}
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={seslendir}
          disabled={ses === "yukleniyor"}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-200 border border-sky-400/50 rounded-lg hover:bg-sky-500/10 transition disabled:opacity-50"
        >
          {ses === "yukleniyor" ? (
            <>
              <Loader className="w-3.5 h-3.5 animate-spin" />
              Ses hazırlanıyor…
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5" />
              Sakin sesle dinle
            </>
          )}
        </button>
        {ses === "hata" && (
          <span className="text-xs text-error">{hata || "Ses üretilemedi"}</span>
        )}
      </div>
    </motion.div>
  );
}
