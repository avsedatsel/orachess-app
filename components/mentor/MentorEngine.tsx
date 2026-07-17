"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Loader, AlertCircle } from "lucide-react";
import { analyzeMoveWithMentor } from "@/lib/ai/mentor-api";
import {
  getToneColor,
  TONE_MAPPING,
  type MentorResponse,
} from "@/lib/ai/personality";

interface MentorEngineProps {
  userLevel: number;
  previousFen: string;
  currentFen: string;
  move: string;
  moveNotation: string;
  alternativeMoves?: string[];
  isOpen?: boolean;
}

export const MentorEngine: React.FC<MentorEngineProps> = ({
  userLevel,
  previousFen,
  currentFen,
  move,
  moveNotation,
  alternativeMoves,
  isOpen = true,
}) => {
  const [response, setResponse] = useState<MentorResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMentorResponse = useCallback(async () => {
    if (!isOpen || !move) return;
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await analyzeMoveWithMentor({
        userLevel,
        previousFen,
        currentFen,
        move,
        moveNotation,
        alternativeMoves,
      });

      if ("error" in result) {
        setError(result.error);
      } else {
        setResponse(result);
      }
    } catch {
      setError("Mentor'la iletişim kurulamadı.");
    } finally {
      setIsLoading(false);
    }
  }, [userLevel, previousFen, currentFen, move, moveNotation, alternativeMoves, isOpen]);

  useEffect(() => {
    if (isOpen && move) {
      fetchMentorResponse();
    }
  }, [move, isOpen, fetchMentorResponse]);

  if (!isOpen) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-2">
        <Lightbulb className="w-5 h-5 text-ora-gold" />
        <span className="font-semibold text-sm">Doğa Hoca&apos;nın Analizi</span>
        {moveNotation && (
          <span className="text-xs text-gray-400 ml-auto">Hamle: {moveNotation}</span>
        )}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center gap-3 py-6 bg-ora-slate/30 rounded-lg">
          <Loader className="w-5 h-5 animate-spin text-ora-gold" />
          <span className="text-sm text-gray-300">Doğa Hoca düşünüyor...</span>
        </div>
      )}

      {error && !isLoading && (
        <div className="p-4 border-l-4 border-error bg-error/10 rounded flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-error">Hata</p>
            <p className="text-xs text-gray-300 mt-1">{error}</p>
            <button
              onClick={fetchMentorResponse}
              className="text-xs text-ora-gold hover:underline mt-2"
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {response && !isLoading && (
          <motion.div
            key="response"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 border-l-4 rounded bg-ora-slate/30"
            style={{ borderLeftColor: getToneColor(response.tone) }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getToneColor(response.tone) }}
              />
              <span className="text-xs font-semibold text-gray-300">
                {TONE_MAPPING[response.tone]?.label || "Standart"}
              </span>
              <span className="text-xs text-gray-500 ml-auto">
                Güven: {Math.round(response.confidence * 100)}%
              </span>
            </div>

            <p className="text-sm leading-relaxed text-gray-100 mb-3">
              {response.text}
            </p>

            {response.hidden_concept && (
              <div className="inline-block px-2 py-1 bg-ora-accent/20 rounded text-xs text-ora-accent mb-2">
                📚 {response.hidden_concept}
              </div>
            )}

            {response.follow_up_question && (
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded mt-2">
                <p className="text-xs text-blue-200">💭 {response.follow_up_question}</p>
              </div>
            )}

            {response.suggestions.length > 0 && (
              <ul className="mt-3 space-y-1">
                {response.suggestions.map((s, i) => (
                  <li key={i} className="text-xs text-gray-300 flex gap-2">
                    <span className="text-ora-gold">▸</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!response && !isLoading && !error && (
        <div className="text-center py-4 bg-ora-slate/20 rounded-lg">
          <p className="text-xs text-gray-400">Bir hamle yapın, Doğa Hoca yorumlasın...</p>
        </div>
      )}
    </div>
  );
};

export default MentorEngine;
