"use client";

/** Service worker'ı kaydeder (PWA kurulabilirliği + çevrimdışı destek). */

import { useEffect } from "react";

export function RegisterSW() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // kayıt başarısız olursa sessizce geç
      });
    }
  }, []);
  return null;
}
