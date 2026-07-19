/**
 * STRATEGIC RECOVERY ENGINE (Kod Bloğu 7)
 * ------------------------------------------------------------
 * 800-1600 Elo bloğunun "Kriz Yönetimi ve Stratejik Toparlanma" mantığı.
 * Kullanıcı kötü bir pozisyona düştüğünde sistem sadece doğru hamleyi değil,
 * STRES YÖNETİMİNİ de öğretir. Doğa Hoca'nın sesi de sakinleştirici olur.
 *
 * Not: positionEval PİYON birimindedir ve OYNAYACAK tarafın perspektifindendir
 * (negatif = oynayacak taraf zorda). Çağıran taraf skoru bu perspektife çevirir.
 */

export interface CrisisRecovery {
  mentorTone: string;
  message: string;
  recommendedExercise: string | null;
}

/** Kullanıcı zorlandığında 'Stratejik Toparlanma' modunu tetikler. */
export const triggerCrisisRecovery = (positionEval: number): CrisisRecovery => {
  // Değerlendirme kötüye gitmişse (-2.0 ve altı) → kriz modu
  if (positionEval < -2.0) {
    return {
      mentorTone: "Sakinleştirici ve Analitik",
      message:
        "Pozisyon zorlaştı, ancak unutma; satranç bir kriz yönetimi oyunudur. Şimdi derin bir nefes al ve rakibin 'zayıf karesini' bul. Panik en büyük rakiptir.",
      recommendedExercise: "Güvenli Savunma Hattı Oluşturma",
    };
  }

  return {
    mentorTone: "Öğretici",
    message: "Oyun dengeli. Şimdi sakin kal ve stratejini uygulamaya devam et.",
    recommendedExercise: null,
  };
};

export interface CrisisVoiceSettings {
  stability: number;
  similarityBoost: number;
  style: string;
}

/**
 * Kriz tonuna göre ElevenLabs ses parametreleri.
 * Sakinleştirici ton → yüksek stability + yavaş/derin stil.
 */
export const getCrisisVoiceSettings = (tone: string): CrisisVoiceSettings => {
  if (tone === "Sakinleştirici ve Analitik") {
    return { stability: 0.9, similarityBoost: 0.9, style: "yavaş/derin" };
  }
  return { stability: 0.5, similarityBoost: 0.75, style: "normal" };
};

/** Kriz aktif mi? (recommendedExercise doluysa kriz modundayız.) */
export function isCrisis(rec: CrisisRecovery): boolean {
  return rec.recommendedExercise !== null;
}
