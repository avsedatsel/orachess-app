import { createClient } from "@supabase/supabase-js";

/**
 * Supabase istemcisi.
 *
 * ÖNEMLİ: Env değişkenleri (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)
 * tanımlı DEĞİLSE, build/prerender aşamasında createClient hata fırlatıp TÜM deploy'u
 * çökertiyordu. Bunu önlemek için anahtar yoksa güvenli bir placeholder kullanıyoruz;
 * böylece site en azından AYAKTA kalır. Gerçek veritabanı/oturum işlemlerinin çalışması
 * için Vercel'de bu iki değişken TANIMLI OLMALIDIR.
 */

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

/** Supabase gerçekten yapılandırıldı mı? (placeholder değil mi?) */
export const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
