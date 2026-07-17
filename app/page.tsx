import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-3xl space-y-8">
        <h1 className="text-6xl font-bold gradient-text">OraChess</h1>
        <p className="text-2xl text-gray-300">
          Dijital Ustalık Ekosistemi
        </p>
        <p className="text-lg text-gray-400 max-w-xl mx-auto">
          0&apos;dan 3000 Elo&apos;ya kadar, yapay zeka destekli kişisel
          Büyükusta deneyimi. Doğa Hoca ile satrancın sanatını keşfet.
        </p>

        <div className="grid md:grid-cols-3 gap-4 mt-12 text-left">
          <div className="p-6 bg-ora-slate rounded-lg border border-gray-800">
            <div className="text-ora-gold text-3xl mb-2">♟️</div>
            <h3 className="font-semibold mb-1">İnteraktif Tahta</h3>
            <p className="text-sm text-gray-400">Gerçek zamanlı hamle analizi</p>
          </div>
          <div className="p-6 bg-ora-slate rounded-lg border border-gray-800">
            <div className="text-ora-gold text-3xl mb-2">🧠</div>
            <h3 className="font-semibold mb-1">AI Mentor</h3>
            <p className="text-sm text-gray-400">Doğa Hoca kişiliğiyle rehberlik</p>
          </div>
          <div className="p-6 bg-ora-slate rounded-lg border border-gray-800">
            <div className="text-ora-gold text-3xl mb-2">📈</div>
            <h3 className="font-semibold mb-1">12 Seviye</h3>
            <p className="text-sm text-gray-400">Adaptif ustalık piramidi</p>
          </div>
        </div>

        <div className="flex gap-4 justify-center mt-8">
          <Link
            href="/game"
            className="px-8 py-3 bg-ora-gold text-ora-dark font-semibold rounded-lg hover:opacity-90 transition"
          >
            Oyuna Başla
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-3 border border-ora-gold text-ora-gold font-semibold rounded-lg hover:bg-ora-gold/10 transition"
          >
            Kontrol Paneli
          </Link>
        </div>
      </div>
    </main>
  );
}
