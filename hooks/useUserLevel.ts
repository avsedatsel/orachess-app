"use client";

/**
 * useUserLevel — Kullanıcının tespit edilen seviyesini (0-11) okur.
 * Seviye, quiz tamamlandığında localStorage'a yazılır ("orachess_level").
 * Henüz sınav çözülmediyse varsayılan döner.
 */

import { useEffect, useState } from "react";

export const USER_LEVEL_KEY = "orachess_level";

export function useUserLevel(defaultLevel = 0): number {
  const [level, setLevel] = useState<number>(defaultLevel);

  useEffect(() => {
    try {
      const v = localStorage.getItem(USER_LEVEL_KEY);
      if (v !== null) {
        const n = parseInt(v, 10);
        if (!Number.isNaN(n) && n >= 0 && n <= 11) setLevel(n);
      }
    } catch {
      // localStorage erişilemezse varsayılan kalır
    }
  }, []);

  return level;
}
