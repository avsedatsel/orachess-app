"use client";

/**
 * AUTH NAV — Sağ üstte giriş durumu (Faza 3)
 * Giriş yapılmışsa kullanıcı e-postası + "Çıkış", değilse "Giriş Yap".
 */

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export function AuthNav() {
  const { user, loading, signOut } = useAuth();

  // Oturum yüklenirken yer kaplamasın
  if (loading) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-3 text-sm">
      {user ? (
        <>
          <span className="text-gray-300 hidden md:inline">{user.email}</span>
          <Link
            href="/ilerleme"
            className="px-4 py-2 border border-ora-gold text-ora-gold rounded-lg hover:bg-ora-gold/10 transition"
          >
            İlerlemem
          </Link>
          <button
            onClick={() => signOut()}
            className="px-4 py-2 border border-gray-600 text-gray-200 rounded-lg hover:bg-gray-800 transition"
          >
            Çıkış
          </button>
        </>
      ) : (
        <Link
          href="/giris"
          className="px-4 py-2 border border-ora-gold text-ora-gold rounded-lg hover:bg-ora-gold/10 transition"
        >
          Giriş Yap
        </Link>
      )}
    </div>
  );
}
