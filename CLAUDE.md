# CLAUDE.md — OraChess çalışma kuralları

Bu dosya, bu repoda çalışan Claude Code oturumları için kalıcı tercihleri içerir.

## Proje sahibi hakkında
- Proje sahibi teknik detaylara hâkim DEĞİL. Açıklamalar SADE, adım adım ve Türkçe olmalı.
- Geri dönüşü zor işlemler veya tasarım/pedagoji **tercihleri** (ör. renk, hangi AI modeli)
  için yine sorulmalı — bunlar onay değil, tercih kararıdır.

## Git / dağıtım tercihi (KALICI — proje sahibinin talimatı)
- Commit, push, PR açma ve **`main`'e merge** işlemleri için **ONAY SORMA**; otomatik yap.
- Akış: işi bitir → `npm run build` / gerekli testle **doğrula** → commit → push →
  PR aç → `main`'e squash-merge. Vercel otomatik deploy eder.
- Sonra sadece **ne yapıldığını kısaca raporla** (izin isteme).
- Geliştirme dalı: `claude/orachess-project-status-xyqpp1`. Bir PR merge edilince
  dalı `origin/main`'den tazele (`git checkout -B <dal> origin/main`), yeni işi üstüne kur.

## Doğrulama alışkanlığı
- Kullanıcıya görünen (UI/akış) değişiklikleri, mümkünse gerçek tarayıcıda (Chromium)
  çalıştırıp doğrula. Test için `playwright-core` geçici kurulup **iş bitince kaldırılmalı**
  (proje bağımlılıklarını kirletme).
- Build testlerinde `.env.local`'e geçici placeholder Supabase anahtarları konabilir,
  ama **commit edilmemeli** (gitignore'da).

## Proje durumu
- Ayrıntılı, güncel durum için: `PROJE_DURUMU.md`.
- Taş görselleri atıfı: `ATTRIBUTIONS.md` (CC BY-SA 3.0).
