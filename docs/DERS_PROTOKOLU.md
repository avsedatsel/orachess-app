# OraChess — "45 Dakikalık Derin Eğitim" Protokolü

Bu belge, 360 derslik müfredatın **tek bir tutarlı kalıptan** üretilmesi için
pedagojik sözleşmedir. Teknik karşılığı: `lib/lesson-schema.ts` (tipler) +
`lib/deep-lessons/l0-d1.ts` (referans şablon).

---

## 1) 5 Aşamalı Ders Akışı (≈45 dk)

Her ders, öğrenmeyi kalıcı kılan bilişsel bir ritim izler:

| # | Aşama | Süre | Amaç | İçerik alanı |
|---|-------|------|------|--------------|
| 1 | **Isınma** | ~5 dk | Önceki bilgiyi uyandır, merak kancası at, bir önceki derse köprü kur | `narration` |
| 2 | **Kavram** | ~10 dk | Çekirdek kavramı öğret + **Vaka Dosyası** ile hayata bağla | `narration`, `caseStudy` |
| 3 | **İnteraktif Uygulama** | ~15 dk | Tahtada yaparak öğren; Sokratik ipuçlarıyla yönlendir | `tasks[]` (FEN + en iyi hamle + kademeli ipuçları) |
| 4 | **Analiz** | ~10 dk | Usta oyunlarıyla derinleştir, "neden" sorusunu cevapla | `exampleGames[]` |
| 5 | **Bilişsel Kapanış** | ~5 dk | Özet, hayat dersi, refleksiyon sorusu, sonraki derse tohum | `reflection`, `cognitiveLink.nextSeed` |

**Neden bu sıra?** Isınma dikkati toplar; Kavram anlam yükler; Uygulama kası
çalıştırır; Analiz soyutlar; Kapanış pekiştirir ve merakı canlı tutar. Bu,
"anlat-geç" değil, "yaşat-pekiştir" modelidir.

---

## 2) Etkileşim Protokolü (Engagement Triggers)

45 dakika uzun bir süredir; kullanıcı **pasif dinleyici** olursa kopar. Bu yüzden
her derse, zamanlanmış "aktif tutma" anları gömülür (`engagement[]`):

| Tür | Ne yapar | Örnek |
|-----|----------|-------|
| `predict` | Tahmin ettirir (sahiplenme) | "Sence rakip ne oynar?" |
| `pause-think` | Panik/aceleyi keser | "Hamleden önce 10 saniye dur." |
| `socratic` | Açık uçlu düşündürür | "Neden kenar değil de merkez?" |
| `micro-reward` | Küçük kutlama, dopamin | "Odak rozetinin ilk parçası senin!" |
| `recall` | Aktif hatırlama | "Bugün öğrendiğin karenin adı neydi?" |

**Kural:** Her derste en az bir `predict`, bir `socratic` ve bir `pause-think`
bulunur; ortalama **her 4-6 dakikada bir** tetikleyici devreye girer. Doğa Hoca
asla cevabı doğrudan söylemez — önce sorar (Sokratik ilke).

---

## 3) 360 Dersi Tutarlı Tutmak ve "Bilişsel Bağ"

### a) Tutarlılık — tek kalıp, tek ses
- **Tek şema:** Tüm dersler `DeepLesson` tipini kullanır; eksik aşama/yanlış sıra
  `validateStages()` ile yakalanır. Süre denetimi `totalDurationMinutes()`.
- **Tek ses kimliği:** Her dersin `tone` + `stability` + `similarityBoost` alanları,
  Doğa Hoca'nın seviyeye göre değişen ama tanınabilir kalan sesini garanti eder
  (Level 0'da sıcak/teşvik edici → Level 8+'de sakin/otoriter).
- **Fokus mirası:** Ders hangi seviyedeyse, `curriculum-engine.ts`'teki pedagojik
  fokusu (Yaşam Stratejisi / Teknik Ustalık / Performans Psikolojisi) devralır;
  içerik o fokusa hizmet eder.

### b) Bilişsel Bağ — dersler zinciri (`cognitiveLink`)
Her ders bir öncekiyle ve bir sonrakiyle **bilinçli** bağ kurar:
- `prevConcept` + `bridge`: "Geçen ders kareleri tanıdık; **o adresler olmadan**
  bugün taşların nereye gittiğini konuşamazdık."
- `nextSeed`: dersi bir **soru/merakla** kapatır: "Peki bu karelerde yaşayan ilk
  askerimiz kim? Sonraki derste piyonla tanışacağız."

Böylece 360 ders bağımsız 360 parça değil, **tek bir tırmanış** olur. Isınma
aşaması `recall` tetikleyicisiyle bu bağı her seferinde tazeler.

### c) Ölçeklenebilir üretim (360 dersi üretme stratejisi)
1. **Şablondan çoğaltma:** `l0-d1.ts` referans alınır; her ders aynı 5-aşama
   iskeletini doldurur — boş sayfa yok, tutarsızlık yok.
2. **Fokus bloklarıyla toplu üretim:** `curriculumMap`'teki 4 blok (120+120+60+60)
   bazında üretilir; her blok kendi psikolojik kazanımına (Sabır, Risk Yönetimi,
   Analitik Disiplin, Stres Altında İrade) hizmet eder.
3. **İnsan + AI iş bölümü:** İskelet ve Sokratik kalıplar sabittir; Doğa Hoca'nın
   anlatım metni ve Vaka Dosyaları AI-destekli üretilip **insan editör** onayından
   geçer (pedagojik tutarlılık kontrolü).
4. **Zincir doğrulaması:** Yeni ders eklenince `cognitiveLink.prevLessonId` bir
   önceki derse bağlanır; kopuk halka üretimde yakalanır.

---

## 4) Dinamik Vaka Dosyaları (Case Studies)

Amacımız: öğrenci satranç oynarken aslında bir **"Strateji Simülasyonu"** yaptığını
iliklerine kadar hissetsin. Bu yüzden her dersin Kavram aşaması bir `caseStudy`
taşır:

- **domain** — gerçek hayat alanı (İş Dünyası, Tarih, Kriz Yönetimi, Sporda İrade…)
- **scenario** — gerçek bir senaryo (ör. Büyük Buhran'da ayakta kalan şirketler)
- **chessParallel** — bunun tahtadaki birebir karşılığı (merkez piyon yapısı)
- **lifeLesson** — çıkarılan hayat dersi

**Örnek (L0-D1):** "Büyük Buhran'da ayakta kalan şirketler, her yöne saldıran değil,
çekirdeğine (merkezine) tutunanlardı" → tahtada merkeze sahip çıkmak → *"Belirsizlikte
merkezini sağlam tut."*

Bu, OraChess'i bir satranç sitesinden bir **"yaşam stratejisi akademisi"ne** dönüştüren
farktır.

---

## 5) Sonraki teknik adım (bu belgenin dışında)
Şema ve içerik sözleşmesi hazır. Uygulama tarafında sıradaki iş, bu `DeepLesson`
formatını oynatan **5 aşamalı ders oynatıcısı (Lesson Player)** arayüzüdür:
aşama aşama ilerleyen, `engagement` tetikleyicilerini zamanında gösteren,
`tasks` için tahtayı açan ve `masteryCheck` ile dersi kapatan bir akış.
