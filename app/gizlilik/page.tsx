import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gizlilik ve KVKK Aydınlatma Metni — OraChess",
};

export default function GizlilikPage() {
  return (
    <main className="min-h-screen px-6 pt-20 pb-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold gradient-text mb-2">
          Gizlilik Politikası ve KVKK Aydınlatma Metni
        </h1>
        <p className="text-xs text-gray-500 mb-2">Son güncelleme: [gg.aa.yyyy]</p>
        <div className="mb-8 p-3 rounded-lg bg-yellow-900/20 border border-yellow-700/40 text-yellow-200 text-xs">
          ⚠️ Bu metin bir <b>taslaktır</b>. KVKK gereklilikleri (ör. veri
          sorumlusu bilgileri, gerekiyorsa VERBİS kaydı, yurt dışı aktarım açık
          rızası) işletmenize göre değişir; yayına almadan önce bir hukuk/KVKK
          danışmanına inceletin. [Köşeli parantezleri] doldurun.
        </div>

        <div className="space-y-6 text-gray-200 leading-relaxed text-sm">
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">
              1. Veri Sorumlusu
            </h2>
            <p>
              6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;)
              kapsamında veri sorumlusu: [İşletme/Şirket Adı], [Adres], [E-posta].
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">
              2. İşlenen Kişisel Veriler
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <b>Kimlik/İletişim:</b> Kayıt olurken verdiğiniz e-posta adresi.
              </li>
              <li>
                <b>Eğitim/İşlem verileri:</b> Seviye tespit sınavı sonuçlarınız
                (tespit edilen seviye, doğru sayısı, yüzde, tarih) ve oyun/ders
                etkileşimleriniz.
              </li>
              <li>
                <b>Teknik veriler:</b> Oturum bilgileri ve tarayıcı yerel
                depolamasında tutulan tercihçe veriler (ör. tespit edilen
                seviye).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">
              3. İşleme Amaçları ve Hukuki Sebep
            </h2>
            <p>
              Verileriniz; hesabınızı oluşturmak ve yönetmek, kişiselleştirilmiş
              eğitim ve ilerleme takibi sunmak, hizmeti iyileştirmek ve yasal
              yükümlülükleri yerine getirmek amaçlarıyla işlenir. Hukuki sebepler:
              açık rızanız, sözleşmenin ifası ve meşru menfaat (KVKK m.5).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">
              4. Veri Aktarımı ve Yurt Dışı Aktarım
            </h2>
            <p>
              Hizmetin sağlanabilmesi için verileriniz, aşağıdaki üçüncü taraf
              hizmet sağlayıcıların altyapısında işlenebilir/saklanabilir. Bu
              sağlayıcıların bir kısmının sunucuları <b>yurt dışında</b>
              bulunmaktadır; bu nedenle KVKK m.9 kapsamında yurt dışı aktarım söz
              konusu olabilir ve gereken hallerde açık rızanız alınır:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>
                <b>Supabase</b> — kimlik doğrulama ve veritabanı (sunucu bölgesi:
                AB / Frankfurt).
              </li>
              <li>
                <b>Vercel</b> — web barındırma (yurt dışı).
              </li>
              <li>
                <b>Google (Gemini)</b> — AI mentor metin üretimi (yurt dışı).
              </li>
              <li>
                <b>ElevenLabs</b> — metin-ses (seslendirme) hizmeti (yurt dışı).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">
              5. Saklama Süresi
            </h2>
            <p>
              Kişisel verileriniz, işleme amaçları için gerekli olan süre ve ilgili
              mevzuatta öngörülen süreler boyunca saklanır; süre sonunda silinir,
              yok edilir veya anonim hale getirilir.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">
              6. KVKK Kapsamındaki Haklarınız (m.11)
            </h2>
            <p>
              Kişisel verilerinizin işlenip işlenmediğini öğrenme; işlenmişse buna
              ilişkin bilgi talep etme; amacına uygun kullanılıp kullanılmadığını
              öğrenme; eksik/yanlış işlenmişse düzeltilmesini, koşulları varsa
              silinmesini/yok edilmesini isteme; işlemenin aktarıldığı üçüncü
              kişilere bildirilmesini isteme; otomatik sistemlerle analiz sonucu
              aleyhinize bir sonucun ortaya çıkmasına itiraz etme; zararınızın
              giderilmesini talep etme haklarına sahipsiniz.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">
              7. Başvuru
            </h2>
            <p>
              Haklarınızı kullanmak için [iletisim@e-posta-adresiniz] adresine
              başvurabilirsiniz. Talepleriniz KVKK&apos;da öngörülen sürede
              sonuçlandırılır.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
