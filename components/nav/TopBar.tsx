"use client";

/**
 * TopBar — Her sayfada sabit duran üst çubuk.
 * Sol: Geri / İleri / Ana Sayfa (home). Sağ: giriş durumu.
 * İçerik daima bu çubuğun altından başlar; hiçbir materyalle iç içe geçmez.
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Home } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const btn =
  "w-9 h-9 flex items-center justify-center rounded-lg border border-white/15 text-gray-100 hover:bg-white/10 active:bg-white/20 transition shrink-0";

export function TopBar() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-14 flex items-center justify-between gap-2 px-3 sm:px-4 bg-ora-dark/75 backdrop-blur border-b border-white/10">
      {/* Sol: geri / ileri / home */}
      <div className="flex items-center gap-1.5">
        <button onClick={() => router.back()} aria-label="Geri" className={btn}>
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => router.forward()}
          aria-label="İleri"
          className={btn}
        >
          <ArrowRight className="w-4 h-4" />
        </button>
        <Link href="/" aria-label="Ana Sayfa" className={btn}>
          <Home className="w-4 h-4" />
        </Link>
      </div>

      {/* Sağ: giriş durumu */}
      <div className="flex items-center gap-2">
        {!loading &&
          (user ? (
            <>
              <span className="text-gray-300 text-sm hidden md:inline max-w-[150px] truncate">
                {user.email}
              </span>
              <Link
                href="/ilerleme"
                className="px-3 py-1.5 text-xs sm:text-sm border border-ora-gold text-ora-gold rounded-lg hover:bg-ora-gold/10 transition"
              >
                İlerlemem
              </Link>
              <button
                onClick={() => signOut()}
                className="px-3 py-1.5 text-xs sm:text-sm border border-gray-600 text-gray-200 rounded-lg hover:bg-gray-800 transition"
              >
                Çıkış
              </button>
            </>
          ) : (
            <Link
              href="/giris"
              className="px-3 py-1.5 text-xs sm:text-sm border border-ora-gold text-ora-gold rounded-lg hover:bg-ora-gold/10 transition"
            >
              Giriş Yap
            </Link>
          ))}
      </div>
    </header>
  );
}
