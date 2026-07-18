# ORACHESS — PROJE DURUMU (Faza 1 & 2 Tamamlandı)

## PROJE ÖZETİ
OraChess: 0-3000 Elo arası, AI destekli, sesli/interaktif satranç eğitim platformu.
Pedagoji: "Doğa Cihan Göksel" personası — disiplinli, bilge, nazik, hikayeci bir Büyükusta.
12 seviyeli ustalık piramidi. "Sıfır Temaslı" (Zero-Touch) otomatize eğitim hedefi.

## GELİŞTİRİCİ NOTU (ÇOK ÖNEMLİ)
Proje sahibi teknik detaylara HAKİM DEĞİL. Adımlar SADE, TEK TEK ve NET olmalı.
Kullanıcı LAPTOP'ta çalışıyor (Windows). Terminal = PowerShell.
Bir adım tamamlanmadan diğerine geçilmemeli.

## TEKNOLOJİ STACK
- Framework: Next.js 14.2.35 (App Router), TypeScript
- Stil: TailwindCSS
- Animasyon: framer-motion
- Satranç: chess.js (mantık) + stockfish.js (WASM analiz — henüz eklenmedi)
- Veritabanı: Supabase (PostgreSQL) — KURULDU ve BAĞLANDI
- AI Mentor: OpenAI GPT-4o (personality.ts'de tanımlı)
- Deploy: GitHub + Vercel (otomatik CI/CD kurulu)
- Ses/Avatar (Faz 4, henüz yok): ElevenLabs + HeyGen

## REPO & DEPLOY BİLGİLERİ
- GitHub repo: github.com/avsedatsel/orachess-app
- Canlı site: orachess-app.vercel.app (her git push otomatik deploy olur)
- LOKAL ÇALIŞMA KLASÖRÜ: C:\Users\Acer\Downloads\orachess-TEMIZ\orachess-clean
  (DİKKAT: VS Code bir ara yanlışlıkla "app" alt klasörünü açmıştı, bu karışıklık
   yaşatmıştı. Doğru kök klasör "orachess-clean"dir. Dosyalar buraya konmalı.)
- ESKİ REPOLAR SİLİNDİ: "orachess-complete-2-" ve "orachess" artık YOK. Kullanma.

## MEVCUT KLASÖR YAPISI (orachess-clean/)

```
orachess-clean/
├── app/
│   ├── layout.tsx, page.tsx, globals.css
│   ├── game/page.tsx          (chess + mentor)
│   ├── dashboard/page.tsx     (12 seviye)
│   └── quiz/page.tsx          (seviye tespit sınavı sayfası)   ← FAZA 1
├── components/
│   ├── chess/ChessBoard.tsx   (Unicode taşlar, chess.js)
│   ├── mentor/MentorEngine.tsx
│   └── quiz/QuizEngine.tsx    (260 satır, Supabase kayıt dahil) ← FAZA 1+2
├── lib/
│   ├── ai/personality.ts      (Doğa Hoca persona + helper fonksiyonlar)
│   ├── ai/mentor-api.ts       (SADECE async server action)
│   ├── chess-utils.ts
│   ├── quiz-data.ts           (36 soru, 12 seviye)              ← FAZA 1
│   ├── level-calculator.ts    (seviye hesaplama + Doğa Hoca mesajları) ← FAZA 1
│   └── supabase.ts            (Supabase client bağlantısı)      ← FAZA 2
├── hooks/useChessBoard.ts
├── .env.local                 (Supabase anahtarları — GİT'E GİTMEZ, gitignore'da)
└── config: package.json, tsconfig, tailwind, next.config
```

## KRİTİK DERSLER (TEKRARLANMAMASI GEREKEN HATALAR)
1. `"use server"` dosyalarında SADECE async fonksiyon olur (helper'lar personality.ts'de).
2. package.json'da radix-ui paketleri sorun çıkarmıştı — kaldırıldı, ekleme.
3. Proje DÜZ yapıda, Vercel Root Directory boş.
4. Her değişiklikten sonra LOKAL `npm run build` test edilmeli.
5. PowerShell'de bash komutları (`cat <<EOF`, `&&`) ÇALIŞMAZ. `Set-Content` / `Add-Content` kullan.
6. VS Code'da Ctrl+S bazen kaydetmiyordu. Uzun dosyalar için en güvenli yöntem: dosyayı
   indirilebilir üretip `Copy-Item $HOME\Downloads\DOSYA lib\DOSYA -Force` ile kopyalamak.
   (NOT: Claude Code kullanıldığında bu sorunların hiçbiri yaşanmaz — dosyalar doğrudan
   doğru klasöre yazılır.)
7. Klasör/dosya diskte gerçekten var mı diye `Test-Path` ve `Get-ChildItem` ile doğrula.
8. TÜRKÇE KARAKTER: Terminal (Add-Content) Türkçe karakterleri bozabiliyor. Türkçe içerikli
   dosyalar indirilip `Copy-Item` ile konmalı (imla korunur).

---

## FAZA 1 — SEVİYE TESPİT SINAVI (TAMAMLANDI ✅)

### lib/quiz-data.ts
- 36 soru (12 seviye × 3 soru). Her soru: `id, level(0-11), levelName, eloRange, question, options[4], correctAnswer, explanation`.
- `LEVELS_DEFINITION` dizisi: 12 seviyenin adı ve Elo aralığı.
- 12 SEVİYE: 0=Satranç Okuryazarlığı(0-600), 1=Görsel Taktikler(600-850), 2=Taş Gelişimi&Açılış(850-1100), 3=Oyun Ortası Planlama(1100-1300), 4=Profilaksi(1300-1500), 5=Derin Hesaplama&Kombinasyon(1500-1750), 6=Konumsal Satranç&Piyon Yapısı(1750-2000), 7=Ustalık Psikolojisi&Zaman Yönetimi(2000-2250), 8=Profesyonel Hazırlık/Novelty(2250-2500), 9=Büyükusta Sezgi Yönetimi(2500-2700), 10=Stockfish Analitik Sentezi(2700-2900), 11=Elite Satranç Bilim İnsanlığı(2900-3000+).

### lib/level-calculator.ts
- `calculateLevel(result)`: doğru sayısına göre seviye atar (adaptif eşikler: 0-2 doğru→lvl0, 3-4→lvl2, 5-6→lvl4, 7-8→lvl7, 9-10→lvl9, 11+→lvl11).
- `generateMentorMessage()`: her seviye için Doğa Hoca personasıyla motivasyon mesajı.
- `generateLevelSummary()`: önerilen ders sayısı + tahmini süre hesabı.

### components/quiz/QuizEngine.tsx (260 satır)
- 3 seviye grubundan random 3'er soru = 9 soruluk adaptif sınav.
- Progress bar, animasyonlu soru geçişleri (framer-motion).
- Sonuç ekranı: yüzde, tespit edilen seviye, Doğa Hoca mesajı, önerilen ders/süre.
- FAZA 2 EKLEMESİ: sınav bitince sonucu Supabase'e kaydeder, "kaydediliyor / kaydedildi / hata" durum bildirimi gösterir.
- "Sınavı Tekrar Yap" ve "Eğitime Başla" butonları (Eğitime Başla şu an sadece alert).

### app/quiz/page.tsx
- QuizEngine'i render eden sayfa. Başlık: "OraChess Seviye Tespit Sınavı". URL: `/quiz`

DURUM: Build başarılı, localhost'ta test edildi, canlıda yayında, Türkçe imla düzeltildi.

---

## FAZA 2 — SUPABASE VERİTABANI (TAMAMLANDI ✅)

### Supabase Proje Bilgileri
- Kullanıcı/org: orachesskids hesabı, "avsedatsel's Org" (Free plan)
- Proje adı: orachess
- Region: Central EU (Frankfurt)
- Project URL: https://fweuhhpgcnfnklhfduse.supabase.co
- Anahtar tipi: Publishable key (`sb_publishable_...`), `.env.local`'de.

### .env.local içeriği (2 satır — GİT'E GİTMEZ)
```
NEXT_PUBLIC_SUPABASE_URL=https://fweuhhpgcnfnklhfduse.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_... (gerçek anahtar kullanıcıda kayıtlı)
```

### Veritabanı Tablosu: quiz_sonuclari
Kolonlar:
- `id` (uuid, primary key, otomatik)
- `seviye` (integer)
- `seviye_adi` (text)
- `elo_araligi` (text)
- `dogru_sayisi` (integer)
- `toplam_soru` (integer)
- `yuzde` (integer)
- `olusturulma_tarihi` (timestamptz, default now())

### Güvenlik (RLS)
- RLS AÇIK.
- İki policy (anon rolü için): "Herkes ekleyebilir" (insert, with check true), "Herkes okuyabilir" (select, using true).

### lib/supabase.ts
- `createClient` ile Supabase bağlantısı. `NEXT_PUBLIC_` env değişkenlerini kullanır.
- Kurulu paket: `@supabase/supabase-js`

DOĞRULANDI: Quiz çözüldü → sonuç tabloya yazıldı (1 record: seviye 7, yüzde 89, doğru 8).

---

## SONRAKİ ADIMLAR (YAPILACAKLAR)
- [x] Ana sayfaya (app/page.tsx) `/quiz` linki/butonu ekle ✅ (PR #1)
- [x] FAZA 3: Kullanıcı girişi (auth) — Supabase Auth ile ✅ (PR #1)
- [x] Quiz sonucunu kullanıcıya bağla (`user_id`) ✅ (PR #1 + Supabase'de kolon eklendi)
- [x] Seviye sonucundan sonra doğru dashboard'a yönlendir ✅ (PR #1)
- [x] Stockfish (WASM) entegrasyonu — Web Worker'da, ana thread'i bloklamıyor ✅ (PR #2)
- [x] Kullanıcının kendi quiz geçmişini gördüğü "ilerleme" sayfası (`/ilerleme`) ✅ (PR #2)
- [x] Sağ üstteki giriş çubuğu / iç sayfa "← Ana Sayfa" çakışması düzeltildi ✅ (PR #2)
- [x] Profesyonel satranç tahtası: Unicode harfler yerine SVG taşları (Wikimedia cburnett, CC BY-SA 3.0) ✅
- [ ] FAZA 4: ElevenLabs (ses) + HeyGen (avatar) — canlı ders deneyimi
- [ ] Müfredat içeriği (her seviye için dersler) — Gemini stratejisine bağlı

## SATRANÇ TAHTASI GÖRSEL İYİLEŞTİRME (TAMAMLANDI ✅)
- Eski: Unicode harf-taşları (♟) — "acemi" görünüm.
- Yeni: gerçek SVG taşları (Wikimedia "Standard"/cburnett seti, CC BY-SA 3.0).
  - `public/pieces/standard.svg`: 12 taşlık SVG sprite (lisans başlığı korundu).
  - `components/chess/PieceSprite.tsx`: sprite'ı sayfaya gizli gömer (Safari dahil çalışır).
  - `components/chess/ChessBoard.tsx`: her kare `<use href="#wp" />` ile taşı çizer.
  - Tahta rengi: Ahşap/kahve (açık #EDD9B8, koyu #A97A54) — koyu kare siyah taşlarla karışmıyor.
  - Renkler `ChessBoard.tsx` üstünde sabit (BOARD_LIGHT/BOARD_DARK) — kolayca değiştirilebilir.
- ATIF: `ATTRIBUTIONS.md` (CC BY-SA 3.0 gereği). Taşlar chess.com'dan DEĞİL; ücretsiz açık set.
- DOĞRULANDI: Chromium'da 32 taşın hepsi render edildi.

## STOCKFISH ENTEGRASYONU (Faza 3.5 — TAMAMLANDI ✅)
- Motor: Stockfish 18 **lite single-threaded WASM** (nmrugg/stockfish.js).
  - Tek-thread → özel CORS/COEP header GEREKTİRMEZ, Vercel'de sorunsuz.
  - Dosyalar repoda: `public/stockfish/stockfish-18-lite-single.{js,wasm}` (~7 MB).
  - NOT: `stockfish` npm paketi build'i şişirdiği için (~240 MB) bağımlılık olarak
    TUTULMADI; sadece iki dosya `public/`'e kondu.
- `hooks/useStockfish.ts`: Worker + UCI protokolü, `analyze(fen, depth)` / `stop()`,
  `evaluation` (skor + en iyi hamle) döner. Ana thread bloklanmaz.
- `components/chess/AnalysisPanel.tsx`: değerlendirme çubuğu + skor + en iyi hamle (SAN).
- `app/game/page.tsx`: analiz paneli, oynanan pozisyonu otomatik değerlendirir.
- DOĞRULANDI: Chromium'da test edildi — başlangıç pozisyonunda "e4" (+0.37) döndü.
- MENTOR BAĞLANTISI: Stockfish değerlendirmesi artık Doğa Hoca'ya besleniyor.
  - `hooks/useStockfish.ts` `analyzedFen` döner (skorun hangi pozisyona ait olduğunu bilmek için).
  - `app/game/page.tsx` tek worker'ı yönetir; analiz TAMAMLANINCA (analyzedFen === currentFen)
    skoru `MentorEngine`'e `stockfishEvaluation` olarak geçirir → hamle başına tek OpenAI çağrısı.
  - `components/chess/AnalysisPanel.tsx` artık sunum bileşeni (değerlendirmeyi prop alır).
  - `mentor-api.ts` zaten `stockfishEvaluation` parametresini prompt'a ekliyordu.
  - DOĞRULANDI: e2-e4 sonrası mentor tetiklendi (tek POST); Stockfish yeni pozisyonu
    "e5" (+0.32) olarak değerlendirdi. NOT: Doğa Hoca'nın metin üretmesi için Vercel'de
    `OPENAI_API_KEY` env değişkeni TANIMLI OLMALI; yoksa mentor hata verir (Stockfish etkilenmez).

## KRİTİK DEPLOY DÜZELTMESİ (ÇÖZÜLDÜ ✅)
- SORUN: Vercel'deki TÜM deploy'lar "Error" idi. Sebep: `lib/supabase.ts` modül
  yüklenirken `createClient(url!, key!)` çağırıyordu; env yoksa "supabaseUrl is required"
  fırlatıp prerender/build'i çökertiyordu. AuthProvider kök layout'ta olduğundan TÜM
  sayfalar etkileniyordu.
- ÇÖZÜM: `lib/supabase.ts` env yoksa güvenli placeholder kullanıyor (+`isSupabaseConfigured`).
  `lib/ai/mentor-api.ts` OpenAI istemcisini modül yüklenirken değil, fonksiyon içinde
  anahtar kontrolüyle oluşturuyor. Artık anahtarsız da build GEÇİYOR → deploy yeşil.
- SIRADAKİ (kullanıcı — Vercel Environment Variables): gerçek çalışması için eklenmeli:
  `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Supabase için),
  `OPENAI_API_KEY` (Doğa Hoca metni için). Eklendikten sonra yeniden deploy şart.

## SON GİT DURUMU
- `c22a14c OraChess Faza 1` ✅
- `144a4d7 Faza 2: Supabase veritabani baglantisi` ✅
- `0d9d7c7 PR #1` (main'e merge edildi): ana sayfa butonu + Faza 3 giriş + yönlendirme ✅
- Stockfish: yeni dalda, ayrı PR ile gelecek.
