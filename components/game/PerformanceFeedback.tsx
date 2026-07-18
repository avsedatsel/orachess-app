"use client";

/**
 * PerformanceFeedback — hamle sonrası bilişsel geri bildirim kartı.
 * Satranç Bilgisi (teknik) + Stratejik Düşünme (derinlik) + Doğa Hoca mesajı.
 */

import { motion } from "framer-motion";
import { Brain, Gauge } from "lucide-react";
import type { PerformanceMetrics } from "@/lib/mastery-engine";

function MetrikBar({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  const renk =
    value >= 100 ? "bg-green-500" : value >= 50 ? "bg-ora-gold" : "bg-error";
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="flex items-center gap-1.5 text-gray-300">
          {icon}
          {label}
        </span>
        <span className="font-semibold text-gray-100">%{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-700 overflow-hidden">
        <motion.div
          className={`h-full ${renk}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}

export function PerformanceFeedback({
  metrics,
}: {
  metrics: PerformanceMetrics | null;
}) {
  if (!metrics) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-ora-slate/60 rounded-lg p-4 border border-gray-800 space-y-3"
    >
      <div className="flex items-center gap-2">
        <Gauge className="w-4 h-4 text-ora-gold" />
        <h3 className="font-semibold text-sm">Bilişsel Geri Bildirim</h3>
      </div>
      <MetrikBar
        label="Satranç Bilgisi"
        value={metrics.technicalAccuracy}
        icon={<Gauge className="w-3.5 h-3.5 text-gray-400" />}
      />
      <MetrikBar
        label="Stratejik Düşünme"
        value={metrics.strategicInsight}
        icon={<Brain className="w-3.5 h-3.5 text-gray-400" />}
      />
      <p className="text-xs text-gray-200 leading-relaxed pt-1">
        {metrics.feedbackMessage}
      </p>
    </motion.div>
  );
}
