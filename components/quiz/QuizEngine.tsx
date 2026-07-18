"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { quizQuestions } from "@/lib/quiz-data";
import { supabase } from "@/lib/supabase";
import {
  calculateLevel,
  generateLevelSummary,
  type QuizResult,
  type DetectedLevel,
} from "@/lib/level-calculator";

interface QuizState {
  currentQuestionIndex: number;
  answers: Array<{
    questionId: string;
    level: number;
    selectedAnswer: number;
    isCorrect: boolean;
  }>;
  isComplete: boolean;
  result: QuizResult | null;
  detectedLevel: DetectedLevel | null;
}

export function QuizEngine() {
  const [state, setState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: [],
    isComplete: false,
    result: null,
    detectedLevel: null,
  });

  // Supabase kayit durumu
  const [kayitDurumu, setKayitDurumu] = useState<"bekliyor" | "kaydediliyor" | "basarili" | "hata">("bekliyor");

  const selectedQuestions = React.useMemo(() => {
    const groups = [
      quizQuestions.filter((q) => q.level <= 2),
      quizQuestions.filter((q) => q.level >= 3 && q.level <= 5),
      quizQuestions.filter((q) => q.level >= 6),
    ];
    return groups.flatMap((group) =>
      group.sort(() => Math.random() - 0.5).slice(0, 3)
    );
  }, []);

  // Sonucu Supabase'e kaydet
  const sonucuKaydet = async (result: QuizResult, detected: DetectedLevel) => {
    setKayitDurumu("kaydediliyor");
    try {
      const { error } = await supabase.from("quiz_sonuclari").insert({
        seviye: detected.level,
        seviye_adi: detected.levelName,
        elo_araligi: detected.eloRange,
        dogru_sayisi: result.correctAnswers,
        toplam_soru: result.totalQuestions,
        yuzde: detected.percentage,
      });
      if (error) {
        console.error("Kayit hatasi:", error);
        setKayitDurumu("hata");
      } else {
        setKayitDurumu("basarili");
      }
    } catch (e) {
      console.error("Baglanti hatasi:", e);
      setKayitDurumu("hata");
    }
  };

  const handleAnswer = (selectedIndex: number) => {
    const currentQuestion = selectedQuestions[state.currentQuestionIndex];
    const isCorrect = selectedIndex === currentQuestion.correctAnswer;
    const newAnswer = {
      questionId: currentQuestion.id,
      level: currentQuestion.level,
      selectedAnswer: selectedIndex,
      isCorrect,
    };
    const updatedAnswers = [...state.answers, newAnswer];

    if (state.currentQuestionIndex === selectedQuestions.length - 1) {
      const quizResult: QuizResult = {
        correctAnswers: updatedAnswers.filter((a) => a.isCorrect).length,
        totalQuestions: updatedAnswers.length,
        answeredQuestions: updatedAnswers,
      };
      const detected = calculateLevel(quizResult);
      setState({
        ...state,
        answers: updatedAnswers,
        isComplete: true,
        result: quizResult,
        detectedLevel: detected,
      });
      // Sonucu veritabanina kaydet
      sonucuKaydet(quizResult, detected);
    } else {
      setState({
        ...state,
        answers: updatedAnswers,
        currentQuestionIndex: state.currentQuestionIndex + 1,
      });
    }
  };

  const handleRestart = () => {
    setState({
      currentQuestionIndex: 0,
      answers: [],
      isComplete: false,
      result: null,
      detectedLevel: null,
    });
    setKayitDurumu("bekliyor");
  };

  if (!state.isComplete) {
    const currentQuestion = selectedQuestions[state.currentQuestionIndex];
    const progress = Math.round(
      ((state.currentQuestionIndex + 1) / selectedQuestions.length) * 100
    );

    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold text-white">Seviye Tespit Sınavı</h2>
            <span className="text-sm text-gray-400">
              Soru {state.currentQuestionIndex + 1} / {selectedQuestions.length}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8"
        >
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-400 mb-2">
              {currentQuestion.levelName} - {currentQuestion.eloRange} Elo
            </p>
            <h3 className="text-2xl font-bold text-white">
              {currentQuestion.question}
            </h3>
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleAnswer(index)}
                whileHover={{ scale: 1.02 }}
                className="w-full text-left p-4 bg-gray-700 hover:bg-gray-600 border-2 border-gray-600 hover:border-blue-500 rounded-lg text-white font-medium"
              >
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mr-3 text-sm font-bold">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span>{option}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <div className="bg-blue-900 bg-opacity-30 border-l-4 border-blue-500 p-4 rounded text-blue-200 text-sm">
          <p className="font-semibold mb-1">İpucu:</p>
          <p>Lütfen dikkatle düşün. Doğru cevap sana doğru seviyeyi belirlemede yardımcı olacak.</p>
        </div>
      </div>
    );
  }

  if (state.detectedLevel) {
    const summary = generateLevelSummary(state.result!);

    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Tebrikler!</h2>
          <p className="text-gray-400 text-lg">Seviye tespit sınavı tamamlandı</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-gray-700 rounded-lg p-8 mb-8">
          <div className="text-center mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl font-bold text-white">{state.detectedLevel.percentage}%</span>
            </div>
            <p className="text-gray-400 text-sm">
              {state.result!.correctAnswers} / {state.result!.totalQuestions} Doğru Cevap
            </p>
          </div>

          <div className="bg-gray-700 bg-opacity-50 rounded-lg p-6 mb-6">
            <h3 className="text-gray-400 text-sm font-semibold mb-2">TESPİT EDİLEN SEVİYE</h3>
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
              {state.detectedLevel.levelName}
            </p>
            <p className="text-gray-300 text-lg">
              Elo Aralığı: <span className="font-bold">{state.detectedLevel.eloRange}</span>
            </p>
          </div>

          <div className="bg-yellow-900 bg-opacity-20 border-l-4 border-yellow-500 p-4 rounded mb-6">
            <p className="text-yellow-200 text-sm leading-relaxed">
              {state.detectedLevel.message}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-700 bg-opacity-50 p-4 rounded text-center">
              <p className="text-gray-400 text-xs font-semibold mb-2">ÖNERİLEN DERS</p>
              <p className="text-2xl font-bold text-blue-400">{summary.recommendedLessonCount}</p>
            </div>
            <div className="bg-gray-700 bg-opacity-50 p-4 rounded text-center">
              <p className="text-gray-400 text-xs font-semibold mb-2">TAHMİNİ SÜRE</p>
              <p className="text-2xl font-bold text-emerald-400">{summary.estimatedCompletionTime}</p>
            </div>
          </div>

          {/* Kayit durumu bildirimi */}
          {kayitDurumu === "kaydediliyor" && (
            <p className="text-center text-gray-400 text-sm mb-4">Sonucun kaydediliyor...</p>
          )}
          {kayitDurumu === "basarili" && (
            <p className="text-center text-green-400 text-sm mb-4">✓ Sonucun kaydedildi</p>
          )}
          {kayitDurumu === "hata" && (
            <p className="text-center text-red-400 text-sm mb-4">Sonuc kaydedilemedi (baglanti sorunu)</p>
          )}

          <div className="flex gap-4">
            <button onClick={handleRestart} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg">
              Sınavı Tekrar Yap
            </button>
            <button onClick={() => alert("Eğitime başlıyorsun!")} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg">
              Eğitime Başla
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return null;
}
