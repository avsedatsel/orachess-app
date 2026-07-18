"use client";

/**
 * InstallButton — "Uygulamayı İndir" (PWA kurulumu).
 * - Android/masaüstü Chrome: beforeinstallprompt yakalanır → tıklayınca yerel kurulum.
 * - iOS (tüm sürümler): beforeinstallprompt desteklemez → "Ana Ekrana Ekle" talimatı gösterilir.
 * - Zaten kuruluysa (standalone) buton gizlenir.
 */

import { useEffect, useState } from "react";
import { Download, X, Share } from "lucide-react";

interface BIPEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
}

export function InstallButton() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    const nav = navigator as Navigator & { standalone?: boolean };
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      nav.standalone === true;
    if (standalone) {
      setInstalled(true);
      return;
    }
    setIsIos(/iphone|ipad|ipod/i.test(navigator.userAgent));

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed) return null;

  const handleClick = async () => {
    if (deferred) {
      await deferred.prompt();
      await deferred.userChoice;
      setDeferred(null);
    } else {
      // iOS ya da henüz kurulum kriteri sağlanmamış tarayıcılar → talimat göster
      setShowHelp(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="inline-flex items-center gap-2 px-8 py-3 border border-ora-gold text-ora-gold font-semibold rounded-lg hover:bg-ora-gold/10 transition"
      >
        <Download className="w-5 h-5" />
        Uygulamayı İndir
      </button>

      {showHelp && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="bg-ora-slate border border-gray-700 rounded-xl p-6 max-w-sm w-full text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-ora-gold">
                Ana Ekrana Ekle
              </h3>
              <button
                onClick={() => setShowHelp(false)}
                aria-label="Kapat"
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {isIos ? (
              <ol className="text-sm text-gray-200 space-y-2 list-decimal list-inside">
                <li>
                  Safari&apos;de alttaki{" "}
                  <Share className="inline w-4 h-4 -mt-0.5" /> (Paylaş) simgesine
                  dokun.
                </li>
                <li>
                  Açılan menüden <b>&quot;Ana Ekrana Ekle&quot;</b> seç.
                </li>
                <li>
                  <b>Ekle</b>&apos;ye dokun — OraChess bir uygulama gibi ana
                  ekranında olur.
                </li>
              </ol>
            ) : (
              <ol className="text-sm text-gray-200 space-y-2 list-decimal list-inside">
                <li>Tarayıcının menüsünü (⋮) aç.</li>
                <li>
                  <b>&quot;Uygulamayı yükle&quot;</b> veya{" "}
                  <b>&quot;Ana ekrana ekle&quot;</b> seçeneğine dokun.
                </li>
                <li>Onayla — OraChess uygulama gibi eklenir.</li>
              </ol>
            )}
          </div>
        </div>
      )}
    </>
  );
}
