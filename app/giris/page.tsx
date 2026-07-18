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
