import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Çerez Politikası — OraChess",
};

export default function CerezPolitikasiPage() {
  return (
    <main className="min-h-screen px-6 pt-20 pb-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold gradient-text mb-2">
          Çerez Politikası
        </h1>
        <p className="text-xs text-gray-500 mb-2">Son güncelleme: [gg.aa.yyyy]</p>
        <div className="mb-8 p-3 rounded-lg bg-yellow-900/20 border border-yellow-700/40 text-yellow-200 text-xs">
          ⚠️ Bu metin bir <b>taslaktır</b>; yayına almadan önce hukuki inceleme
          önerilir.
        </div>

        <div className="space-y-6 text-gray-200 leading-relaxed text-sm">
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">
              1. Çerezler ve Benzeri Teknolojiler
            </h2>
            <p>
              OraChess, temel işlevlerin çalışması için çerezler ve tarayıcı yerel
              depolaması (localStorage) gibi benzeri teknolojileri kullanır.
              Reklam veya üçüncü taraf takip amaçlı çerez kullanılmamaktadır.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">
              2. Kullandığımız Türler
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <b>Zorunlu / oturum:</b> Giriş yaptığınızda oturumunuzu sürdürmek
                için kimlik doğrulama sağlayıcısı (Supabase) tarafından tarayıcıda
                oturum bilgisi saklanır.
              </li>
              <li>
                <b>Tercih (localStorage):</b> Deneyiminizi kişiselleştirmek için
                tespit edilen seviyeniz gibi tercih verileri tarayıcınızda
                saklanır (ör. <code>orachess_level</code>).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">
              3. Yönetim
            </h2>
            <p>
              Tarayıcı ayarlarınızdan çerezleri ve site verilerini silebilir veya
              engelleyebilirsiniz. Ancak zorunlu oturum verileri engellenirse giriş
              ve kişiselleştirme özellikleri düzgün çalışmayabilir.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">
              4. İletişim
            </h2>
            <p>
              Sorularınız için: [iletisim@e-posta-adresiniz]
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
