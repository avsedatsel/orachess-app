import { LEVEL_DEFINITIONS } from "@/lib/chess-utils";
import { DailyInsightCard } from "@/components/insight/DailyInsightCard";
import { PyramidPath } from "@/components/dashboard/PyramidPath";
import { SkillMasteryChart } from "@/components/dashboard/SkillMasteryChart";

export default function DashboardPage({
  searchParams,
}: {
  searchParams?: { seviye?: string };
}) {
  // Sınavdan gelen tespit edilen seviye (?seviye=X)
  const seviyeParam = searchParams?.seviye;
  const parsed = seviyeParam !== undefined ? parseInt(seviyeParam, 10) : NaN;
  const detectedLevel =
    !Number.isNaN(parsed) && parsed >= 0 && parsed <= 11 ? parsed : null;
  const current =
    detectedLevel !== null ? LEVEL_DEFINITIONS[detectedLevel] : null;

  return (
    <main className="min-h-screen p-6 pt-20">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold gradient-text">Gelişim Yolun</h1>
          <p className="text-sm text-gray-400 mt-1">
            Doğa Hoca ile 12 seviyelik ustalık tırmanışı
          </p>
        </div>

        {/* Günün Odak Noktası (Daily Insight) — sayfanın üstünde */}
        <DailyInsightCard />

        {/* Gelişim Çizelgesi — Satranç Bilgisi + Stratejik Düşünme */}
        <SkillMasteryChart />

        {/* Sınavdan yeni gelindiyse karşılama mesajı */}
        {current && (
          <div className="mb-6 p-5 bg-ora-gold/10 border border-ora-gold/40 rounded-lg">
            <p className="text-ora-gold font-semibold mb-1">
              Seviye tespitin tamamlandı! 🎯
            </p>
            <p className="text-gray-300 text-sm">
              Önerilen başlangıç seviyen{" "}
              <span className="font-semibold text-white">{current.title}</span>{" "}
              olarak belirlendi. Piramitte vurgulandı — buradan başlayabilirsin.
            </p>
          </div>
        )}

        {/* Piramit Yolu — sayfanın merkezindeki interaktif harita */}
        <div className="mb-6 flex items-center justify-center gap-2 flex-wrap">
          <h2 className="text-lg font-semibold">🏔️ Ustalık Piramidi</h2>
          <span className="text-xs text-gray-400">
            Bir seviyeye dokun · 30 adımı keşfet
          </span>
        </div>

        <PyramidPath detectedLevel={detectedLevel} />
      </div>
    </main>
  );
}
