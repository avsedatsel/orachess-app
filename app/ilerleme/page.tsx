"use client";

/**
 * İLERLEME SAYFASI (/ilerleme)
 * Giriş yapan kullanıcının kendi geçmiş sınav sonuçlarını Supabase'den çeker.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";

interface QuizSonuc {
  id: string;
  seviye: number;
  seviye_adi: string;
  elo_araligi: string;
  dogru_sayisi: number;
  toplam_soru: number;
  yuzde: number;
  olusturulma_tarihi: string;
}

function tarihFormat(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function IlerlemePage() {
  const { user, loading: authLoading } = useAuth();
  const [sonuclar, setSonuclar] = useState<QuizSonuc[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setYukleniyor(false);
      return;
    }
    let iptal = false;
    (async () => {
      setYukleniyor(true);
      setHata(false);
      const { data, error } = await supabase
        .from("quiz_sonuclari")
        .select("*")
        .eq("user_id", user.id)
        .order("olusturulma_tarihi", { ascending: false });
      if (iptal) return;
      if (error) {
        console.error("İlerleme çekilemedi:", error);
        setHata(true);
      } else {
        setSonuclar((data as QuizSonuc[]) ?? []);
      }
      setYukleniyor(false);
    })();
    return () => {
      iptal = true;
    };
  }, [user, authLoading]);

  // Özet istatistikler
  const enIyiYuzde = sonuclar.length
    ? Math.max(...sonuclar.map((s) => s.yuzde))
    : 0;
  const sonSeviye = sonuclar[0]; // en yeni (desc sıralı)

  return (
    <main className="min-h-screen p-6 pt-20">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text">İlerlemem</h1>
        </div>

        {/* Giriş kontrolü */}
        {authLoading || yukleniyor ? (
          <p className="text-gray-400 text-center py-12">Yükleniyor…</p>
        ) : !user ? (
          <div className="text-center py-12 space-y-4">
            <p className="text-gray-300">
              İlerlemeni görmek için giriş yapmalısın.
            </p>
            <Link
              href="/giris"
              className="inline-block px-8 py-3 bg-ora-gold text-ora-dark font-semibold rounded-lg hover:opacity-90 transition"
            >
              Giriş Yap
            </Link>
          </div>
        ) : hata ? (
          <p className="text-red-400 text-center py-12">
            Sonuçlar yüklenirken bir sorun oluştu. Lütfen tekrar dene.
          </p>
        ) : sonuclar.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <p className="text-gray-300">Henüz bir sınav sonucun yok.</p>
            <Link
              href="/quiz"
              className="inline-block px-8 py-3 bg-ora-gold text-ora-dark font-semibold rounded-lg hover:opacity-90 transition"
            >
              Seviye Tespit Sınavına Gir
            </Link>
          </div>
        ) : (
          <>
            {/* Özet kartları */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-5 bg-ora-slate rounded-lg border border-gray-800">
                <p className="text-xs text-gray-400 mb-1">Güncel Seviye</p>
                <p className="text-xl font-bold text-ora-gold">
                  Seviye {sonSeviye.seviye}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {sonSeviye.seviye_adi}
                </p>
              </div>
              <div className="p-5 bg-ora-slate rounded-lg border border-gray-800">
                <p className="text-xs text-gray-400 mb-1">En İyi Skor</p>
                <p className="text-xl font-bold text-ora-gold">%{enIyiYuzde}</p>
              </div>
              <div className="p-5 bg-ora-slate rounded-lg border border-gray-800">
                <p className="text-xs text-gray-400 mb-1">Sınav Sayısı</p>
                <p className="text-xl font-bold text-ora-gold">
                  {sonuclar.length}
                </p>
              </div>
            </div>

            {/* Geçmiş listesi */}
            <h2 className="text-lg font-semibold mb-3 text-gray-200">
              Sınav Geçmişi
            </h2>
            <div className="space-y-2">
              {sonuclar.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-4 p-4 bg-ora-slate/50 rounded-lg border border-gray-800"
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-ora-gold text-ora-dark font-bold rounded-full shrink-0">
                    {s.seviye}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{s.seviye_adi}</p>
                    <p className="text-xs text-gray-500">
                      {tarihFormat(s.olusturulma_tarihi)} · {s.elo_araligi} Elo
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-ora-gold">%{s.yuzde}</p>
                    <p className="text-xs text-gray-500">
                      {s.dogru_sayisi}/{s.toplam_soru} doğru
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
