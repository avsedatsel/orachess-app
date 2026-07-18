import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { TopBar } from "@/components/nav/TopBar";
import { RegisterSW } from "@/components/pwa/RegisterSW";

export const metadata: Metadata = {
  title: "OraChess - AI Satranç Ustalık Platformu",
  description: "0'dan 3000 Elo'ya, Doğa Hoca ile kişisel satranç eğitimi",
  manifest: "/manifest.json",
  applicationName: "OraChess",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "OraChess",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0F0E1A",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="text-white min-h-screen antialiased">
        <RegisterSW />
        <AuthProvider>
          <TopBar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
