"use client";

/**
 * ActionPanel — Ders ekranının 3. sütunu (Aksiyon).
 * İçerir: Görevler (checklist), Hayat Dersi Notları, "Analiz Modu" anahtarı,
 * "Doğa Hoca'ya Sor" (Gemini beynini tetikler) ve "Modül Bitir" akışı.
 */

import { useState } from "react";
import {
  Target,
  BookOpen,
  Microscope,
  Brain,
  Flag,
  Check,
} from "lucide-react";

interface ActionPanelProps {
  lifeSkill: string;
  lifeNote: string;
  tasks: string[];
  canAsk: boolean;
  asking: boolean;
  onAsk: () => void;
  analysisOpen: boolean;
  onToggleAnalysis: () => void;
  onFinishModule: () => void;
}

export function ActionPanel({
  lifeSkill,
  lifeNote,
  tasks,
  canAsk,
  asking,
  onAsk,
  analysisOpen,
  onToggleAnalysis,
  onFinishModule,
}: ActionPanelProps) {
  const [done, setDone] = useState<Set<number>>(new Set());

  const toggle = (i: number) =>
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <div className="space-y-4">
      {/* Doğa Hoca'ya Sor — Gemini beynini tetikler */}
      <button
        onClick={onAsk}
        disabled={!canAsk || asking}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-ora-gold text-ora-dark font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-40"
      >
        <Brain className="w-4 h-4" />
        {asking ? "Doğa Hoca düşünüyor…" : "Doğa Hoca'ya Sor"}
      </button>

      {/* Görevler */}
      <div className="bg-ora-slate/50 rounded-lg p-4 border border-gray-800">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-4 h-4 text-ora-gold" />
          <h3 className="font-semibold text-sm">Görevler</h3>
        </div>
        <ul className="space-y-2">
          {tasks.map((task, i) => {
            const isDone = done.has(i);
            return (
              <li key={i}>
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-start gap-2 text-left group"
                >
                  <span
                    className={`mt-0.5 w-4 h-4 shrink-0 rounded border flex items-center justify-center transition ${
                      isDone
                        ? "bg-green-500 border-green-500"
                        : "border-gray-600 group-hover:border-ora-gold"
                    }`}
                  >
                    {isDone && <Check className="w-3 h-3 text-white" />}
                  </span>
                  <span
                    className={`text-xs leading-relaxed ${
                      isDone ? "text-gray-500 line-through" : "text-gray-200"
                    }`}
                  >
                    {task}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Hayat Dersi Notları */}
      <div className="bg-ora-accent/10 rounded-lg p-4 border border-ora-accent/30">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-4 h-4 text-purple-300" />
          <h3 className="font-semibold text-sm text-purple-200">
            Hayat Dersi Notu
          </h3>
        </div>
        <p className="text-xs font-semibold text-ora-gold mb-1">{lifeSkill}</p>
        <p className="text-xs text-gray-200 leading-relaxed">{lifeNote}</p>
      </div>

      {/* Analiz Modu */}
      <button
        onClick={onToggleAnalysis}
        className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border font-semibold text-sm transition ${
          analysisOpen
            ? "bg-ora-accent/20 border-ora-accent text-purple-100"
            : "border-gray-600 text-gray-200 hover:bg-gray-800"
        }`}
      >
        <Microscope className="w-4 h-4" />
        Analiz Modu {analysisOpen ? "Açık" : "Kapalı"}
      </button>

      {/* Modül Bitir */}
      <button
        onClick={onFinishModule}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-ora-gold/50 text-ora-gold font-semibold text-sm hover:bg-ora-gold/10 transition"
      >
        <Flag className="w-4 h-4" />
        Modül Bitir
      </button>
    </div>
  );
}
