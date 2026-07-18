/**
 * DAILY INSIGHT ENGINE — "Günün Odak Noktası"
 * Kullanıcının son oyun/sınav performansını analiz edip bugün için bir tavsiye üretir.
 * (Retention: her gün girişi teşvik eder, "Senior Trainer" vizyonunu pekiştirir.)
 *
 * Not: Bizim veri modelimizde "accuracy" karşılığı `yuzde` alanıdır (quiz_sonuclari).
 * userHistory: kullanıcının geçmiş sınav sonuçları (Gelişim Çizelgesi ile AYNI kaynak).
 */

export interface QuizHistoryItem {
  yuzde: number;
  seviye: number;
  seviye_adi?: string;
  olusturulma_tarihi?: string;
}

export interface DailyInsight {
  title: string;
  message: string;
  recommendedLesson: string;
  lessonRef: string; // "quiz" | ders id (ör. "L0-D12")
}

export function generateDailyInsight(
  userHistory: QuizHistoryItem[],
  userElo: number
): DailyInsight {
  const lastSession = userHistory[userHistory.length - 1];

  // Henüz veri yoksa: kullanıcıyı sınava yönlendir (çökme yok).
  if (!lastSession) {
    return {
      title: "Günün Odak Noktası",
      message:
        "Yolculuğa hoş geldin! Bugün seviye tespit sınavını çözerek başlayalım — Doğa Hoca sana özel bir yol çizsin.",
      recommendedLesson: "Seviye Tespit Sınavı",
      lessonRef: "quiz",
    };
  }

  // Dünkü/son oyunda çok hata yaptıysa (accuracy = yuzde):
  if (lastSession.yuzde < 50) {
    return {
      title: "Günün Odak Noktası",
      message:
        "Son oyunlarında savunma prensiplerinde biraz aceleci davrandın. Bugün 'Piyon Yapısı ve Sabır' üzerine bir ders yapmaya ne dersin?",
      recommendedLesson: "Piyon Yapısı ve Sabır",
      lessonRef: "L0-D12",
    };
  }

  // Başarılı bir gelişim gösterdiyse:
  return {
    title: "Günün Odak Noktası",
    message:
      "Son dönemdeki gelişimin harika! Bugün 'Ustalık Psikolojisi' modülünden bir dersle sezgilerini keskinleştirelim.",
    recommendedLesson: "Ustalık Psikolojisi",
    lessonRef: "L0-D25",
  };
}
