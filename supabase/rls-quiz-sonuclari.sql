-- ============================================================
-- OraChess — quiz_sonuclari için RLS (Row Level Security) politikaları
-- ------------------------------------------------------------
-- Amaç: Her kullanıcı YALNIZCA kendi sınav sonuçlarını görebilsin.
-- (Önceki durum: "herkes okuyabilir" → gizlilik/KVKK açığı.)
--
-- Veri akışı (koddan doğrulandı — components/quiz/QuizEngine.tsx):
--   • Giriş yapan kullanıcı: satır user_id = auth.uid() ile kaydedilir.
--   • Anonim kullanıcı (giriş yok): user_id GÖNDERİLMEZ (NULL kalır).
-- Bu yüzden EKLEME politikası hem anonim hem kendi-kaydını destekler;
-- OKUMA politikası ise yalnızca kişinin kendi satırlarını açar.
--
-- Çalıştırma: Supabase Dashboard → SQL Editor → yapıştır → Run.
-- Tekrar çalıştırılabilir (idempotent): eski politikaları temizleyip yeniden kurar.
-- ============================================================

-- 1) RLS'in açık olduğundan emin ol
alter table public.quiz_sonuclari enable row level security;

-- 2) Bu tablodaki MEVCUT tüm politikaları kaldır (isimden bağımsız, güvenli temizlik)
do $$
declare pol record;
begin
  for pol in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'quiz_sonuclari'
  loop
    execute format('drop policy if exists %I on public.quiz_sonuclari', pol.policyname);
  end loop;
end $$;

-- 3) EKLEME: anonim (user_id boş) VEYA kendi user_id'siyle giren kaydedebilir.
--    Not: uuid/text tip farkını yutmak için iki taraf da ::text'e çevrildi.
create policy "quiz_insert_own_or_anon"
  on public.quiz_sonuclari
  for insert
  to anon, authenticated
  with check (
    user_id is null
    or auth.uid()::text = user_id::text
  );

-- 4) OKUMA: giriş yapan YALNIZCA kendi sonuçlarını görür.
--    (Anonim satırlar — user_id NULL — kimseye görünmez; zaten geri okunmuyor.)
create policy "quiz_select_own"
  on public.quiz_sonuclari
  for select
  to authenticated
  using (
    auth.uid()::text = user_id::text
  );

-- 5) (İsteğe bağlı) Kullanıcı kendi kaydını silebilsin — uygulama şu an kullanmıyor.
--    Gerekirse yorumdan çıkarın:
-- create policy "quiz_delete_own"
--   on public.quiz_sonuclari
--   for delete
--   to authenticated
--   using ( auth.uid()::text = user_id::text );

-- ============================================================
-- DOĞRULAMA (opsiyonel): kurulan politikaları listele
--   select policyname, cmd, roles
--   from pg_policies
--   where schemaname = 'public' and tablename = 'quiz_sonuclari';
-- ============================================================
