"use client";

/**
 * DailyInsightCard — "Günün Odak Noktası" kartı (dashboard).
 * Kullanıcının Supabase'deki son sınav verilerini (Gelişim Çizelgesi ile AYNI kaynak)
 * analiz edip dinamik bir tavsiye gösterir. "Hemen Başla" ilgili yere yönlendirir.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import {
  generateDailyInsight,
  type DailyInsight,
  type QuizHistoryItem,
} from "@/lib/daily-insight";
import { levelToElo } from "@/lib/ai/personality";

export function DailyInsightCard() {
  const { user, loading } = useAuth();
  const [insight, setInsight] = useState<DailyInsight | null>(null);

  useEffect(() => {
    if (loading) return;
    let iptal = false;
    (async () => {
      let history: QuizHistoryItem[] = [];
      if (user) {
        // Gelişim Çizelgesi ile aynı veri: quiz_sonuclari (eskiden yeniye)
        const { data } = await supabase
          .from("quiz_sonuclari")
          .select("yuzde, seviye, seviye_adi, olusturulma_tarihi")
          .eq("user_id", user.id)
          .order("olusturulma_tarihi", { ascending: true });
        if (data) history = data as QuizHistoryItem[];
      }
      if (iptal) return;
      const sonSeviye = history.length
        ? history[history.length - 1].seviye
        : 0;
      setInsight(generateDailyInsight(history, levelToElo(sonSeviye)));
    })();
    return () => {
      iptal = true;
    };
  }, [user, loading]);

  if (!insight) return null;

  const isQuiz = insight.lessonRef === "quiz";

  return (
    <div className="mb-8 p-5 rounded-xl bg-gradient-to-br from-ora-accent/25 to-ora-gold/10 border border-ora-gold/30">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-ora-gold" />
        <h2 className="font-semibold text-ora-gold">{insight.title}</h2>
      </div>
      <p className="text-sm text-gray-100 leading-relaxed mb-4">
        {insight.message}
      </p>
      <div className="flex items-center gap-3 flex-wrap">
        {isQuiz ? (
          <Link
            href="/quiz"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-ora-gold text-ora-dark font-semibold rounded-lg hover:opacity-90 transition text-sm"
          >
            Hemen Başla <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          // İlgili ders henüz eklenmemiş olabilir (şu an L0-D1..D5 mevcut) →
          // güvenli şekilde ders bölümüne kaydır.
          <a
            href="#level0-dersler"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-ora-gold text-ora-dark font-semibold rounded-lg hover:opacity-90 transition text-sm"
          >
            Hemen Başla <ArrowRight className="w-4 h-4" />
          </a>
        )}
        {!isQuiz && (
          <span className="text-xs text-gray-400">
            Önerilen: {insight.recommendedLesson}
          </span>
        )}
      </div>
    </div>
  );
}
