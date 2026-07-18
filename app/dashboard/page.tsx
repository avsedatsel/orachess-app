import Link from "next/link";
import { LEVEL_DEFINITIONS } from "@/lib/chess-utils";
import { LessonList } from "@/components/lessons/LessonList";

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
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold gradient-text">Kontrol Paneli</h1>
          <Link href="/" className="text-ora-gold hover:underline text-sm">
            ← Ana Sayfa
          </Link>
        </div>

        {/* Sınavdan yeni gelindiyse karşılama mesajı */}
        {current && (
          <div className="mb-8 p-5 bg-ora-gold/10 border border-ora-gold/40 rounded-lg">
            <p className="text-ora-gold font-semibold mb-1">
              Seviye tespitin tamamlandı! 🎯
            </p>
            <p className="text-gray-300 text-sm">
              Önerilen başlangıç seviyen{" "}
              <span className="font-semibold text-white">
                {current.title}
              </span>{" "}
              olarak belirlendi. Aşağıda vurgulandı — buradan eğitimine
              başlayabilirsin.
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="p-6 bg-ora-slate rounded-lg border border-gray-800">
            <p className="text-sm text-gray-400">Mevcut Seviye</p>
            <p className="text-3xl font-bold text-ora-gold">
              {current ? `Seviye ${current.level}` : "Seviye 2"}
            </p>
          </div>
          <div className="p-6 bg-ora-slate rounded-lg border border-gray-800">
            <p className="text-sm text-gray-400">Tahmini Elo</p>
            <p className="text-3xl font-bold text-ora-gold">
              {current ? `${current.eloMin}-${current.eloMax}` : "~950"}
            </p>
          </div>
          <div className="p-6 bg-ora-slate rounded-lg border border-gray-800">
            <p className="text-sm text-gray-400">Tamamlanan Ders</p>
            <p className="text-3xl font-bold text-ora-gold">
              {current ? "0" : "12"}
            </p>
          </div>
        </div>

        {/* Level 0 Müfredat Dersleri */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-1">
            📚 Level 0 — Satranç Okuryazarlığı
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            Satranç Dünyasına İlk Adım · Doğa Hoca ile ilk 5 ders
          </p>
          <LessonList />
        </div>

        <h2 className="text-xl font-semibold mb-4">
          12 Seviyeli Ustalık Piramidi
        </h2>
        <div className="space-y-2">
          {LEVEL_DEFINITIONS.map((level) => {
            const isCurrent = level.level === detectedLevel;
            return (
              <div
                key={level.level}
                className={`flex items-center gap-4 p-4 rounded-lg border ${
                  isCurrent
                    ? "bg-ora-gold/10 border-ora-gold"
                    : "bg-ora-slate/50 border-gray-800"
                }`}
              >
                <div className="w-10 h-10 flex items-center justify-center bg-ora-gold text-ora-dark font-bold rounded-full">
                  {level.level}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">
                    {level.title}
                    {isCurrent && (
                      <span className="ml-2 text-xs font-semibold text-ora-gold">
                        ● Senin seviyen
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-400">{level.description}</p>
                </div>
                <div className="text-sm text-gray-500">
                  {level.eloMin}-{level.eloMax} Elo
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
