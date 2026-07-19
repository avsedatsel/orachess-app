/**
 * CURRICULUM ENGINE & PEDAGOGICAL MATRIX (Kod Bloğu 6)
 * ------------------------------------------------------------
 * 360 derslik müfredatı "Zihin Gelişimi" odaklı bloklara ayırır.
 * Her Elo aralığı bir pedagojik FOKUS ve beklenen psikolojik kazanım taşır.
 * Dashboard piramidi bu fokusu görselleştirir; Smart-Router öğrenciyi
 * zayıf olduğu pedagojik alana yönlendirir.
 */

import { levelToElo } from "@/lib/ai/personality";

/** Müfredatın pedagojik ağırlıklarını belirleyen blok. */
export interface CurriculumBlock {
  eloRange: [number, number];
  focus: "Life-Strategy" | "Technical-Mastery" | "Performance-Psychology";
  lessonCount: number;
  expectedPsychologicalOutcome: string;
}

export const curriculumMap: CurriculumBlock[] = [
  {
    eloRange: [0, 800],
    focus: "Life-Strategy",
    lessonCount: 120,
    expectedPsychologicalOutcome: "Sabır ve Odaklanma",
  },
  {
    eloRange: [801, 1600],
    focus: "Life-Strategy",
    lessonCount: 120,
    expectedPsychologicalOutcome: "Risk Yönetimi ve Kriz Çözme",
  },
  {
    eloRange: [1601, 2000],
    focus: "Technical-Mastery",
    lessonCount: 60,
    expectedPsychologicalOutcome: "Analitik Disiplin",
  },
  {
    eloRange: [2001, 3000],
    focus: "Performance-Psychology",
    lessonCount: 60,
    expectedPsychologicalOutcome: "Stres Altında İrade",
  },
];

/** Fokus türünün görsel meta bilgisi (piramit ve rozetler için). */
export const FOCUS_META: Record<
  CurriculumBlock["focus"],
  { label: string; color: string; emoji: string }
> = {
  "Life-Strategy": { label: "Yaşam Stratejisi", color: "#A855F7", emoji: "🧭" },
  "Technical-Mastery": {
    label: "Teknik Ustalık",
    color: "#D4AF37",
    emoji: "⚙️",
  },
  "Performance-Psychology": {
    label: "Performans Psikolojisi",
    color: "#EC4899",
    emoji: "🔥",
  },
};

/** Verilen Elo'nun düştüğü müfredat bloğunu döndürür. */
export function getCurriculumBlock(elo: number): CurriculumBlock {
  const found = curriculumMap.find(
    (b) => elo >= b.eloRange[0] && elo <= b.eloRange[1]
  );
  // Aralık dışında (ör. >3000) ise en yakın uçtaki bloğa düş.
  return found ?? curriculumMap[curriculumMap.length - 1];
}

/** 12 seviyeden birini (levelToElo ile) müfredat bloğuna eşler. */
export function getBlockForLevel(level: number): CurriculumBlock {
  return getCurriculumBlock(levelToElo(level));
}

/**
 * İLERLEME ANALİZİ (Smart-Router çekirdeği).
 * 'Senior Trainer' vizyonuyla kullanıcıyı zayıf olduğu pedagojik alana yönlendirir.
 */
export const getNextRecommendedLesson = (
  currentElo: number,
  lifeStrategyScore: number
): string => {
  if (lifeStrategyScore < 60) return "SokratikAnaliz: Karar Süreçleri Üzerine";
  return "TeknikModül: İleri Oyunsonu Teknikleri";
};

/** Smart-Router için zengin (görüntülenebilir) öneri paketi. */
export interface RouterRecommendation {
  title: string; // getNextRecommendedLesson çıktısı
  reason: string; // neden bu öneri (kullanıcıya açıklama)
  focus: CurriculumBlock["focus"];
  outcome: string; // bloğun beklenen psikolojik kazanımı
}

export function getSmartRoute(
  currentElo: number,
  lifeStrategyScore: number
): RouterRecommendation {
  const block = getCurriculumBlock(currentElo);
  const title = getNextRecommendedLesson(currentElo, lifeStrategyScore);
  const reason =
    lifeStrategyScore < 60
      ? "Stratejik düşünme skorun gelişmeye açık — Doğa Hoca seni önce karar süreçleri üzerine bir Sokratik analize yönlendiriyor."
      : "Stratejik temelin sağlam — Doğa Hoca seni teknik ustalığı derinleştiren bir modüle yönlendiriyor.";
  return {
    title,
    reason,
    focus: block.focus,
    outcome: block.expectedPsychologicalOutcome,
  };
}
