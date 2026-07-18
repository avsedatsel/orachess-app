"use server";

import {
  MENTOR_CONFIG,
  TONE_MAPPING,
  getLevelAdjustedPrompt,
  MentorResponse,
  FeedbackCategory,
} from "./personality";

/**
 * Doğa Hoca'nın "beyni": Google Gemini (metin üretimi).
 * Ses (ElevenLabs) ayrı bir katmandır (Faz 4) ve burayı etkilemez.
 *
 * Çalışması için Vercel'de `GEMINI_API_KEY` tanımlı olmalıdır
 * (Google AI Studio'dan ücretsiz alınır). Anahtar yoksa build/çalışma zamanı
 * ÇÖKMEZ; net bir hata döner.
 */
export async function analyzeMoveWithMentor(params: {
  userLevel: number;
  previousFen: string;
  currentFen: string;
  move: string;
  moveNotation: string;
  alternativeMoves?: string[];
  stockfishEvaluation?: number;
  context?: string;
}): Promise<MentorResponse | { error: string }> {
  try {
    if (!params.move || !params.moveNotation) {
      return { error: "Invalid move data" };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        error:
          "Doğa Hoca şu an yapılandırılmadı (GEMINI_API_KEY eksik). Vercel ayarlarından eklenmeli.",
      };
    }

    const mentorPrompt = buildMentorPrompt(params);
    const systemPrompt = getLevelAdjustedPrompt(params.userLevel);

    // Gemini REST API (SDK bağımlılığı yok).
    // Anahtar, URL yerine `x-goog-api-key` başlığında gönderilir — hem eski (AIza...)
    // hem yeni (AQ...) anahtar formatlarıyla uyumlu ve daha güvenli (anahtar URL/loglara sızmaz).
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MENTOR_CONFIG.model}:generateContent`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: "user", parts: [{ text: mentorPrompt }] }],
        generationConfig: {
          temperature: MENTOR_CONFIG.temperature,
          topP: MENTOR_CONFIG.top_p,
          maxOutputTokens: 2048,
          // Temiz JSON döndür (markdown kod bloğu olmadan)
          responseMimeType: "application/json",
        },
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("Gemini API Error:", res.status, detail);
      // GEÇİCİ TEŞHİS: gerçek hatayı arayüzde göster (sorun çözülünce sadeleştirilecek)
      return { error: `Gemini hatası (${res.status}): ${detail.slice(0, 300)}` };
    }

    const data = await res.json();
    const mentorText: string =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return parseAndStructureMentorResponse(mentorText, params);
  } catch (error) {
    console.error("Mentor API Error:", error);
    // GEÇİCİ TEŞHİS: gerçek hatayı arayüzde göster
    return {
      error: `Mentor bağlantı hatası: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

function buildMentorPrompt(params: {
  userLevel: number;
  move: string;
  moveNotation: string;
  alternativeMoves?: string[];
  stockfishEvaluation?: number;
  context?: string;
}): string {
  const { userLevel, move, moveNotation, alternativeMoves, stockfishEvaluation, context } = params;
  return `## HAMLE ANALIZ İSTEĞİ

Seviye: ${userLevel}/11
Hamle: ${moveNotation} (${move})
${alternativeMoves && alternativeMoves.length > 0 ? `Alternatifler: ${alternativeMoves.join(", ")}` : ""}
${stockfishEvaluation !== undefined ? `Stockfish: ${(stockfishEvaluation / 100).toFixed(2)}` : ""}
${context ? `Bağlam: ${context}` : ""}

Bu hamleyi analiz et ve JSON formatında cevap ver:
{
  "text": "Açıklama (max 150 kelime)",
  "tone": "encouraging|inquisitive|teaching|challenging|wise",
  "confidence": 0.9,
  "hidden_concept": "satranç konsepti",
  "suggestions": ["adım 1", "adım 2"],
  "category": "goodMove|questionableMove|mistake|brilliantIdea",
  "follow_up_question": "soru"
}`;
}

function parseAndStructureMentorResponse(
  mentorText: string,
  params: { userLevel: number }
): MentorResponse | { error: string } {
  try {
    // Olası markdown kod bloğu işaretlerini temizle (```json ... ```）
    const cleaned = mentorText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return createFallbackResponse(mentorText, params);
    }

    const parsed = JSON.parse(jsonMatch[0]);
    if (!parsed.text || !parsed.tone || parsed.confidence === undefined) {
      return createFallbackResponse(mentorText, params);
    }

    const validTones = Object.keys(TONE_MAPPING);
    const tone = validTones.includes(parsed.tone) ? parsed.tone : "teaching";
    const suggestions = Array.isArray(parsed.suggestions)
      ? parsed.suggestions.slice(0, MENTOR_CONFIG.num_suggestions)
      : [];

    return {
      text: parsed.text,
      tone: tone as keyof typeof TONE_MAPPING,
      confidence: Math.min(Math.max(parsed.confidence, 0), 1),
      hidden_concept: parsed.hidden_concept || "Satranç Sanatı",
      suggestions,
      category: (parsed.category as FeedbackCategory) || "questionableMove",
      follow_up_question: parsed.follow_up_question,
      reference_level: getReferenceLevel(params.userLevel),
    };
  } catch {
    return createFallbackResponse(mentorText, params);
  }
}

function createFallbackResponse(
  mentorText: string,
  params: { userLevel: number }
): MentorResponse {
  return {
    text: mentorText.substring(0, 300) || "Hamlen üzerine düşün ve tekrar deneyelim.",
    tone: "teaching",
    confidence: 0.5,
    hidden_concept: "Satranç Sanatı",
    suggestions: ["Alternatif hamleler deneyin", "Pozisyonu değerlendirin"],
    category: "questionableMove",
    reference_level: getReferenceLevel(params.userLevel),
  };
}

function getReferenceLevel(
  level: number
): "beginner" | "intermediate" | "advanced" | "expert" {
  if (level <= 2) return "beginner";
  if (level <= 5) return "intermediate";
  if (level <= 8) return "advanced";
  return "expert";
}
