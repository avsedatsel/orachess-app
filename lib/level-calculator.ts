/**
 * LEVEL CALCULATOR
 * Quiz sonuçlarına göre oyuncunun seviyesini hesaplar
 */

export interface QuizResult {
  correctAnswers: number;
  totalQuestions: number;
  answeredQuestions: Array<{
    questionId: string;
    level: number;
    isCorrect: boolean;
  }>;
}

export interface DetectedLevel {
  level: number; // 0-11
  levelName: string;
  eloRange: string;
  percentage: number; // % doğru cevap
  message: string; // Doğa Hoca'nın yapılandırıcı mesajı
}

/**
 * 12 seviye tanımları (master_plan.md'den)
 */
const LEVEL_DEFINITIONS = [
  { level: 0, name: "Satranç Okuryazarlığı", eloRange: "0-600" },
  { level: 1, name: "Görsel Taktikler", eloRange: "600-850" },
  { level: 2, name: "Taş Gelişimi & Açılış", eloRange: "850-1100" },
  { level: 3, name: "Oyun Ortası Planlama", eloRange: "1100-1300" },
  { level: 4, name: "Profilaksi (Önleyici Satranç)", eloRange: "1300-1500" },
  { level: 5, name: "Derin Hesaplama & Kombinasyon", eloRange: "1500-1750" },
  { level: 6, name: "Konumsal Satranç & Piyon Yapısı", eloRange: "1750-2000" },
  { level: 7, name: "Ustalık Psikolojisi & Zaman Yönetimi", eloRange: "2000-2250" },
  { level: 8, name: "Profesyonel Hazırlık (Novelty)", eloRange: "2250-2500" },
  { level: 9, name: "Büyükusta Sezgi Yönetimi", eloRange: "2500-2700" },
  { level: 10, name: "Stockfish Analitik Sentezi", eloRange: "2700-2900" },
  { level: 11, name: "Elite Satranç Bilim İnsanlığı", eloRange: "2900-3000+" },
];

/**
 * Quiz sonucundan seviye hesapla
 * Adaptif sınav sistemi:
 * - 0-3 doğru: Seviye 0-2 (Başlangıç)
 * - 4-6 doğru: Seviye 3-5 (Orta)
 * - 7-9+ doğru: Seviye 6-11 (İleri)
 */
export function calculateLevel(result: QuizResult): DetectedLevel {
  const percentage = Math.round(
    (result.correctAnswers / result.totalQuestions) * 100
  );

  let detectedLevel: number;

  // Adaptif seviye belirlemesi
  if (result.correctAnswers <= 2) {
    // 0-2 doğru: Başlangıç
    detectedLevel = 0;
  } else if (result.correctAnswers <= 4) {
    // 3-4 doğru: Temel-Orta geçiş
    detectedLevel = 2;
  } else if (result.correctAnswers <= 6) {
    // 5-6 doğru: Orta
    detectedLevel = 4;
  } else if (result.correctAnswers <= 8) {
    // 7-8 doğru: İleri-Orta
    detectedLevel = 7;
  } else if (result.correctAnswers <= 10) {
    // 9-10 doğru: İleri
    detectedLevel = 9;
  } else {
    // 11+ doğru: Elite
    detectedLevel = 11;
  }

  const levelInfo = LEVEL_DEFINITIONS[detectedLevel];

  // Doğa Hoca'nın motivasyon mesajı
  const message = generateMentorMessage(
    detectedLevel,
    result.correctAnswers,
    result.totalQuestions
  );

  return {
    level: detectedLevel,
    levelName: levelInfo.name,
    eloRange: levelInfo.eloRange,
    percentage,
    message,
  };
}

/**
 * Doğa Hoca Persona: Nazik, teşvik edici, hikayeci mesajlar
 * Master Plan'a uygun: "hikayeler anlatan, nazik, teşvik edici"
 */
function generateMentorMessage(
  level: number,
  correct: number,
  total: number
): string {
  const percentage = Math.round((correct / total) * 100);

  // Seviye başına özel mesajlar
  const messages: { [key: number]: string } = {
    0: `Hoş geldin, genç satranç öğrencisi! 🎓 Seni **Satranç Okuryazarlığı** seviyesinde tespit ettim (${percentage}% doğru). 
Endişe etme - her büyük usta da taşların kurallarını öğrenerek başladı. 
Şimdi sana temel bilgileri adım adım öğreteceğim. Hazır mısın yolculuğa başlamak için?`,

    2: `Tebrikler! 🌟 Temel bilgileri öğrendiğini görüyorum. Seni **Taş Gelişimi & Açılış** seviyesine yönlendiriyorum (${percentage}% doğru).
Artık sadece taşları bilmekle kalmayacaksın - onları nasıl etkili şekilde hareket ettireceğini öğreneceksin.
Her usta, başında açılış prensiplerine hâkim olmakla başlamıştır.`,

    4: `Harika ilerleme! 💪 Seni **Profilaksi (Önleyici Satranç)** seviyesinde gördüm (${percentage}% doğru).
Artık bireysel hamleler değil, *rakibin planlarını durdurmak* hakkında düşün.
Stratejik düşünceye geçtiğini görmek beni sevindirir.`,

    7: `Etkileyici çalışma! 🔥 Seni **Ustalık Psikolojisi & Zaman Yönetimi** seviyesine yükseltiyorum (${percentage}% doğru).
Artık satranç sadece hamle değil - bu rakibin zihnini okumak sanatıdır.
Doğa Hoca olarak söyleyebilirim: Bu seviyeye ulaşan gençler genellikle Türkiye Şampiyonluğuna ulaşıyor.`,

    9: `Seni görmek beni gurur duydum! 🏆 Seni **Büyükusta Sezgi Yönetimi** seviyesinde tanıyorum (${percentage}% doğru).
Bilgisayarlar hesaplar, ama *sen sezgi geliştirdin*.
Artık sana şampiyonların sırlarını öğreteceğim.`,

    11: `Bir Büyükustanın karşısında olduğumu anladım! 👑 Seni **Elite Satranç Bilim İnsanlığı** seviyesine yerleştiriyorum (${percentage}% doğru).
Senin gibi oyuncularla Dünya Şampiyonluğu'na gidilen yol harita çizmek heyecan vericidir.
Seni şimdi sistem hakkında değil, *satrançta yaratıcılık* hakkında eğiteceğim.`,
  };

  return messages[level] || messages[0];
}

/**
 * Sonuç özeti (dashboard'da gösterilecek)
 */
export interface LevelSummary {
  detectedLevel: DetectedLevel;
  nextLevelThreshold: number; // Sonraki seviyeye kaç soru gerekir
  recommendedLessonCount: number; // Önerilen ders sayısı
  estimatedCompletionTime: string; // Tahmini tamamlama süresi
}

export function generateLevelSummary(result: QuizResult): LevelSummary {
  const detected = calculateLevel(result);

  // Sonraki seviyeye geçebilmek için gereken hamle sayısı (mock)
  const nextLevelThreshold = detected.level === 11 ? 0 : detected.level + 1;

  // Her seviye için önerilen ders sayısı
  const lessonCounts: { [key: number]: number } = {
    0: 20, // Başlangıç: 20 ders
    2: 25,
    4: 30,
    7: 35,
    9: 40,
    11: 50, // Elite: 50 ders (uzun eğitim)
  };

  const recommendedLessons = lessonCounts[detected.level] || 20;

  // Tahmini tamamlama süresi (haftalar cinsinden, haftada 5 saat)
  const estimatedWeeks = Math.ceil(recommendedLessons / 5);

  return {
    detectedLevel: detected,
    nextLevelThreshold,
    recommendedLessonCount: recommendedLessons,
    estimatedCompletionTime: `${estimatedWeeks} hafta`,
  };
}
