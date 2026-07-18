import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kullanım Şartları — OraChess",
};

export default function KullanimSartlariPage() {
  return (
    <main className="min-h-screen px-6 pt-20 pb-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold gradient-text mb-2">
          Kullanım Şartları
        </h1>
        <p className="text-xs text-gray-500 mb-2">
          Son güncelleme: [gg.aa.yyyy]
        </p>
        <div className="mb-8 p-3 rounded-lg bg-yellow-900/20 border border-yellow-700/40 text-yellow-200 text-xs">
          ⚠️ Bu metin bir <b>taslaktır</b> ve genel bilgilendirme amaçlıdır. Yayına
          almadan önce bir hukuk danışmanına inceletmeniz önerilir. Köşeli
          parantez içindeki alanları ([…]) kendi bilgilerinizle doldurun.
        </div>

        <div className="space-y-6 text-gray-200 leading-relaxed text-sm">
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">
              1. Taraflar ve Kapsam
            </h2>
            <p>
              Bu Kullanım Şartları, [İşletme/Şirket Adı] (&quot;OraChess&quot;,
              &quot;biz&quot;) tarafından işletilen OraChess platformunu
              (orachess-app.vercel.app ve bağlı alan adları) kullanan
              kişiler (&quot;Kullanıcı&quot;, &quot;siz&quot;) için geçerlidir.
              Platformu kullanarak bu şartları kabul etmiş sayılırsınız.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">
              2. Hizmetin Tanımı
            </h2>
            <p>
              OraChess; yapay zeka destekli satranç eğitimi, seviye tespit
              sınavı, oyun içi analiz (Stockfish) ve &quot;Doğa Hoca&quot; adlı AI
              mentor rehberliği sunan çevrim içi bir eğitim platformudur. İçerik
              eğitim ve bilgilendirme amaçlıdır.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">
              3. Hesap ve Kullanım Koşulları
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Kayıt sırasında doğru ve güncel bilgi vermeyi kabul edersiniz.</li>
              <li>Hesap güvenliğinizden (şifre vb.) siz sorumlusunuz.</li>
              <li>
                Platformu yasa dışı amaçlarla, başkalarının haklarını ihlal
                edecek ya da sistemi kötüye kullanacak şekilde kullanamazsınız.
              </li>
              <li>
                13 yaşından küçük kullanıcılar için veli/vasi onayı gerekebilir.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">
              4. Fikri Mülkiyet
            </h2>
            <p>
              Platformdaki yazılım, tasarım, metin ve &quot;Doğa Hoca&quot;
              persona içeriği OraChess&apos;e aittir. Satranç taşı görselleri
              üçüncü taraf açık lisanslıdır (bkz. ATTRIBUTIONS). İçerikler izinsiz
              çoğaltılamaz veya ticari olarak kullanılamaz.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">
              5. Sorumluluğun Sınırlandırılması
            </h2>
            <p>
              AI mentor ve analiz çıktıları eğitim amaçlıdır; kesin doğruluk veya
              belirli bir sonuç garanti edilmez. Platform &quot;olduğu gibi&quot;
              sunulur. Hizmet kesintileri veya üçüncü taraf servis (Google,
              ElevenLabs, Supabase, Vercel) kaynaklı aksaklıklardan doğabilecek
              dolaylı zararlardan OraChess sorumlu tutulamaz.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">
              6. Değişiklikler
            </h2>
            <p>
              Bu şartlar zaman zaman güncellenebilir. Güncel sürüm bu sayfada
              yayımlanır; önemli değişikliklerde makul bilgilendirme yapılır.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">
              7. İletişim
            </h2>
            <p>
              Sorularınız için: [iletisim@e-posta-adresiniz] · [İşletme Adı] ·
              [Adres]
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
