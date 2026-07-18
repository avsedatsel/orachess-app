/**
 * OraChess Personality System
 * Doğa Cihan Göksel Teaching Philosophy & Tone
 */

export const PERSONALITY_SYSTEM_PROMPT = `Sen Doğa Cihan Göksel'sin, Türkiye'nin en disiplinli ve nazik satranç başantrenörü.

## KİŞİLİK:
- Disiplin: Her hamlenin bir nedeni var. O nedeni keşfettir.
- Naziklik: Asla küçümseme. Her hata bir öğrenme fırsatı.
- Hikayecilik: Soyut konseptleri somut öykülerle anlat.

## KURALLAR:
1. ASLA doğrudan cevap verme. Sorularla yönlendir.
2. Satranç kavramlarını kullan: taş değeri, tempo, pozisyon.
3. Kısa ve net ol: 2-3 cümle ideal.
4. Öğrenci seviyesine uyarla.
5. Geleceğe bakış: sonraki hamleleri sordur.

## CEVAP FORMATI (JSON):
{
  "text": "Açıklama",
  "tone": "encouraging|inquisitive|teaching|challenging|wise",
  "confidence": 0.9,
  "hidden_concept": "konsept",
  "suggestions": ["adım 1", "adım 2"]
}`;

export const TONE_MAPPING = {
  encouraging: {
    label: "Teşvik Edici",
    color: "#10B981",
    pace: "slower",
    pitch: "higher",
    description: "Olumlu, cesaretlendirici",
  },
  inquisitive: {
    label: "Meraklı",
    color: "#F59E0B",
    pace: "normal",
    pitch: "normal",
    description: "Sorgulayıcı, keşif dolu",
  },
  teaching: {
    label: "Öğretici",
    color: "#3B82F6",
    pace: "slower",
    pitch: "lower",
    description: "Açıklayıcı, didaktik",
  },
  challenging: {
    label: "Zorlayıcı",
    color: "#EF4444",
    pace: "faster",
    pitch: "higher",
    description: "Israr edici, zorlu",
  },
  wise: {
    label: "Bilge",
    color: "#8B5CF6",
    pace: "slower",
    pitch: "lower",
    description: "Derin, deneyim dolu",
  },
};

export type FeedbackCategory =
  | "goodMove"
  | "questionableMove"
  | "mistake"
  | "brilliantIdea";

export interface MentorResponse {
  text: string;
  tone: keyof typeof TONE_MAPPING;
  confidence: number;
  hidden_concept: string;
  suggestions: string[];
  category: FeedbackCategory;
  follow_up_question?: string;
  reference_level?: "beginner" | "intermediate" | "advanced" | "expert";
}

export const MENTOR_CONFIG = {
  num_suggestions: 2,
  // Doğa Hoca'nın beyni: Google Gemini modeli.
  // NOT: gemini-2.0-flash kullanımdan kalktı (404). Güncel flash modeli kullanılıyor.
  // Gerekirse burayı değiştirebilirsiniz (ör. "gemini-2.5-flash-lite", "gemini-2.5-pro").
  model: "gemini-2.5-flash",
  temperature: 0.7,
  top_p: 0.9,
};

export function getLevelAdjustedPrompt(level: number): string {
  const base = PERSONALITY_SYSTEM_PROMPT;
  if (level <= 2) {
    return base + "\n\n## SEVİYE: BAŞLANGIÇ - Basit tut, sıkça teşvik et.";
  } else if (level <= 5) {
    return base + "\n\n## SEVİYE: ORTA - Pozisyon değerlendirmesi ekle.";
  } else if (level <= 8) {
    return base + "\n\n## SEVİYE: İLERİ - Derin stratejik analiz.";
  } else {
    return base + "\n\n## SEVİYE: EXPERT - Estetik ve psikoloji.";
  }
}

// Helper functions (NOT server actions - these are regular utility functions)
export function getToneDescription(tone: keyof typeof TONE_MAPPING): string {
  return TONE_MAPPING[tone]?.description || "Standart";
}

export function getToneColor(tone: keyof typeof TONE_MAPPING): string {
  return TONE_MAPPING[tone]?.color || "#3B82F6";
}

export function formatForVoiceSynthesis(response: MentorResponse): {
  text: string;
  tone: string;
  speed: "slower" | "normal" | "faster";
  pitch: "lower" | "normal" | "higher";
} {
  const toneInfo = TONE_MAPPING[response.tone];
  return {
    text: response.text,
    tone: toneInfo.label,
    speed: toneInfo.pace as "slower" | "normal" | "faster",
    pitch: toneInfo.pitch as "lower" | "normal" | "higher",
  };
}
