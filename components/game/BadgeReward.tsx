"use client";

/**
 * BadgeReward — "Modül Bitir" akışında tetiklenen "Hayat Becerisi" rozeti.
 * Ders sonunda kazanılan hayat becerisini kutlayan tam ekran animasyon.
 */

import { motion, AnimatePresence } from "framer-motion";
import { Award, X } from "lucide-react";

export function BadgeReward({
  open,
  skill,
  onClose,
}: {
  open: boolean;
  skill: string;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative max-w-sm w-full text-center p-8 rounded-2xl bg-gradient-to-br from-ora-accent/40 to-ora-slate border border-ora-gold/40 shadow-2xl"
            initial={{ scale: 0.6, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              aria-label="Kapat"
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <motion.div
              className="mx-auto w-24 h-24 rounded-full bg-ora-gold/20 border-2 border-ora-gold flex items-center justify-center mb-4"
              initial={{ rotate: -20, scale: 0.5 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
            >
              <Award className="w-12 h-12 text-ora-gold" />
            </motion.div>

            <motion.p
              className="text-xs uppercase tracking-widest text-ora-gold/80 mb-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Hayat Becerisi Kazanıldı
            </motion.p>
            <motion.h2
              className="text-2xl font-bold text-white mb-2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              {skill}
            </motion.h2>
            <motion.p
              className="text-sm text-gray-300 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              Doğa Hoca seninle gurur duyuyor. Bu beceri, tahtada olduğu kadar
              hayatta da yanında olacak.
            </motion.p>

            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-ora-gold text-ora-dark font-semibold rounded-lg hover:opacity-90 transition"
            >
              Devam Et
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
