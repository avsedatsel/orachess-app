import type { Metadata } from "next";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
