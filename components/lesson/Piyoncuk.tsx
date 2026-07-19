"use client";

/**
 * Piyoncuk — çocuğun yol arkadaşı maskotu (ANAYASA §1, §6).
 * Sevimli bir piyon yüzü + konuşma balonu. Asla düşmez, hep sevinir.
 */

import { motion, AnimatePresence } from "framer-motion";

export function Piyoncuk({
  mesaj,
  mood = "mutlu",
}: {
  mesaj?: string;
  mood?: "mutlu" | "heyecanli" | "dusunuyor";
}) {
  const yuz = mood === "heyecanli" ? "◕‿◕" : mood === "dusunuyor" ? "•ᴗ•" : "◕‿◕";
  return (
    <div className="flex items-end gap-3">
      {/* Maskot */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        className="shrink-0 flex flex-col items-center"
      >
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 border-4 border-white shadow-lg flex items-center justify-center">
          <span className="text-lg font-bold text-amber-900 leading-none">
            {yuz}
          </span>
        </div>
        <span className="mt-1 text-[11px] font-bold text-amber-200">
          Piyoncuk
        </span>
      </motion.div>

      {/* Konuşma balonu */}
      <AnimatePresence mode="wait">
        {mesaj && (
          <motion.div
            key={mesaj}
            initial={{ opacity: 0, scale: 0.9, x: -8 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="relative bg-white text-gray-800 rounded-2xl rounded-bl-sm px-4 py-3 max-w-xs text-sm leading-relaxed shadow-lg"
          >
            {mesaj}
            <span className="absolute -left-1.5 bottom-2 w-3 h-3 bg-white rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
