import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { AuthNav } from "@/components/auth/AuthNav";

export const metadata: Metadata = {
  title: "OraChess - AI Satranç Ustalık Platformu",
  description: "0'dan 3000 Elo'ya, Doğa Hoca ile kişisel satranç eğitimi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="bg-ora-dark text-white min-h-screen antialiased">
        <AuthProvider>
          <AuthNav />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
