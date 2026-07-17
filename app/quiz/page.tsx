"use client";

import { QuizEngine } from "@/components/quiz/QuizEngine";

export default function QuizPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="bg-gray-900 border-b border-gray-700 py-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white">
            🎯 OraChess Seviye Tespit Sınavı
          </h1>
          <p className="text-gray-400 mt-2">
            Başlamadan önce lütfen seni doğru seviyeye yerleştirmemize yardımcı ol.
          </p>
        </div>
      </div>

      <div className="py-12">
        <QuizEngine />
      </div>
    </div>
  );
}
