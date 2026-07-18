import Link from "next/link";

/** Sayfa altı — yasal linkler + telif. */
export function Footer() {
  const yil = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-white/10 bg-ora-dark/40 backdrop-blur">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
        <p>© {yil} OraChess. Tüm hakları saklıdır.</p>
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <Link
            href="/kullanim-sartlari"
            className="hover:text-ora-gold transition"
          >
            Kullanım Şartları
          </Link>
          <Link href="/gizlilik" className="hover:text-ora-gold transition">
            Gizlilik &amp; KVKK
          </Link>
          <Link href="/cerez-politikasi" className="hover:text-ora-gold transition">
            Çerez Politikası
          </Link>
        </nav>
      </div>
    </footer>
  );
}
