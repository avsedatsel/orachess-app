"use client";

/**
 * GİRİŞ / KAYIT SAYFASI (Faza 3)
 * Supabase Auth (e-posta + şifre) ile kullanıcı girişi ve kaydı.
 */

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";

// Supabase İngilizce hata mesajlarını Türkçeye çevir
function ceviriHata(mesaj: string): string {
  const m = mesaj.toLowerCase();
  if (m.includes("invalid login credentials"))
    return "E-posta veya şifre hatalı.";
  if (m.includes("email not confirmed"))
    return "E-postan henüz onaylanmadı. Lütfen e-postandaki onay bağlantısına tıkla.";
  if (m.includes("user already registered"))
    return "Bu e-posta zaten kayıtlı. Giriş yapmayı dene.";
  if (m.includes("password should be at least"))
    return "Şifre en az 6 karakter olmalı.";
  if (m.includes("unable to validate email"))
    return "Geçerli bir e-posta adresi gir.";
  return mesaj;
}

export default function GirisPage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  const [mode, setMode] = useState<"giris" | "kayit">("giris");
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [mesaj, setMesaj] = useState<
    { tip: "hata" | "basari"; metin: string } | null
  >(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMesaj(null);
    setYukleniyor(true);
    try {
      if (mode === "kayit") {
        const { error } = await supabase.auth.signUp({
          email,
          password: sifre,
        });
        if (error) throw error;
        setMesaj({
          tip: "basari",
          metin:
            "Kayıt alındı! E-posta onayı açıksa, gelen kutunu kontrol edip onay bağlantısına tıkla. Sonra giriş yapabilirsin.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: sifre,
        });
        if (error) throw error;
        router.push("/");
      }
    } catch (err) {
      const metin = err instanceof Error ? ceviriHata(err.message) : String(err);
      setMesaj({ tip: "hata", metin });
    } finally {
      setYukleniyor(false);
    }
  };

  // Google ile giriş (Supabase OAuth). Google onay ekranından sonra
  // ana sayfaya döner.
  const handleGoogle = async () => {
    setMesaj(null);
    setYukleniyor(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo:
            typeof window !== "undefined" ? window.location.origin : undefined,
        },
      });
      if (error) throw error;
      // Başarılıysa tarayıcı Google'a yönlenir; burada bir şey yapmaya gerek yok.
    } catch (err) {
      const metin = err instanceof Error ? ceviriHata(err.message) : String(err);
      setMesaj({ tip: "hata", metin });
      setYukleniyor(false);
    }
  };

  // Zaten giriş yapılmışsa
  if (!loading && user) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-md w-full space-y-6">
          <h1 className="text-4xl font-bold gradient-text">OraChess</h1>
          <p className="text-gray-300">
            Zaten giriş yaptın:{" "}
            <span className="font-semibold text-white">{user.email}</span>
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-ora-gold text-ora-dark font-semibold rounded-lg hover:opacity-90 transition"
            >
              Ana Sayfa
            </Link>
            <button
              onClick={() => signOut()}
              className="px-6 py-3 border border-gray-600 text-gray-200 rounded-lg hover:bg-gray-800 transition"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold gradient-text">OraChess</h1>
          <p className="text-gray-400">
            {mode === "giris"
              ? "Hesabına giriş yap"
              : "Yeni bir hesap oluştur"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">E-posta</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-ora-slate border border-gray-700 rounded-lg text-white focus:border-ora-gold focus:outline-none"
              placeholder="ornek@eposta.com"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Şifre</label>
            <input
              type="password"
              required
              minLength={6}
              value={sifre}
              onChange={(e) => setSifre(e.target.value)}
              className="w-full px-4 py-3 bg-ora-slate border border-gray-700 rounded-lg text-white focus:border-ora-gold focus:outline-none"
              placeholder="En az 6 karakter"
            />
          </div>

          {mesaj && (
            <p
              className={`text-sm ${
                mesaj.tip === "hata" ? "text-red-400" : "text-green-400"
              }`}
            >
              {mesaj.metin}
            </p>
          )}

          <button
            type="submit"
            disabled={yukleniyor}
            className="w-full px-8 py-3 bg-ora-gold text-ora-dark font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {yukleniyor
              ? "Lütfen bekle..."
              : mode === "giris"
              ? "Giriş Yap"
              : "Kayıt Ol"}
          </button>
        </form>

        {/* Ayırıcı */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-700" />
          <span className="text-xs text-gray-500">veya</span>
          <div className="flex-1 h-px bg-gray-700" />
        </div>

        {/* Google ile giriş */}
        <button
          type="button"
          onClick={handleGoogle}
          disabled={yukleniyor}
          className="w-full flex items-center justify-center gap-3 px-8 py-3 bg-white text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google ile giriş
        </button>

        <div className="text-center text-sm text-gray-400">
          {mode === "giris" ? (
            <p>
              Hesabın yok mu?{" "}
              <button
                onClick={() => {
                  setMode("kayit");
                  setMesaj(null);
                }}
                className="text-ora-gold hover:underline font-semibold"
              >
                Kayıt ol
              </button>
            </p>
          ) : (
            <p>
              Zaten hesabın var mı?{" "}
              <button
                onClick={() => {
                  setMode("giris");
                  setMesaj(null);
                }}
                className="text-ora-gold hover:underline font-semibold"
              >
                Giriş yap
              </button>
            </p>
          )}
        </div>

        <div className="text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-300">
            ← Ana sayfaya dön
          </Link>
        </div>
      </div>
    </main>
  );
}
