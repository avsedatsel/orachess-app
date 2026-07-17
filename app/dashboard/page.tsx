import Link from "next/link";
import { LEVEL_DEFINITIONS } from "@/lib/chess-utils";

export default function DashboardPage() {
  return (
    <main className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold gradient-text">Kontrol Paneli</h1>
          <Link href="/" className="text-ora-gold hover:underline text-sm">
            ← Ana Sayfa
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="p-6 bg-ora-slate rounded-lg border border-gray-800">
            <p className="text-sm text-gray-400">Mevcut Seviye</p>
            <p className="text-3xl font-bold text-ora-gold">Seviye 2</p>
          </div>
          <div className="p-6 bg-ora-slate rounded-lg border border-gray-800">
            <p className="text-sm text-gray-400">Tahmini Elo</p>
            <p className="text-3xl font-bold text-ora-gold">~950</p>
          </div>
          <div className="p-6 bg-ora-slate rounded-lg border border-gray-800">
            <p className="text-sm text-gray-400">Tamamlanan Ders</p>
            <p className="text-3xl font-bold text-ora-gold">12</p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">12 Seviyeli Ustalık Piramidi</h2>
        <div className="space-y-2">
          {LEVEL_DEFINITIONS.map((level) => (
            <div
              key={level.level}
              className="flex items-center gap-4 p-4 bg-ora-slate/50 rounded-lg border border-gray-800"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-ora-gold text-ora-dark font-bold rounded-full">
                {level.level}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{level.title}</p>
                <p className="text-sm text-gray-400">{level.description}</p>
              </div>
              <div className="text-sm text-gray-500">
                {level.eloMin}-{level.eloMax} Elo
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
