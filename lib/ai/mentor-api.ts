"use server";

import { OpenAI } from "openai";
import {
  MENTOR_CONFIG,
  TONE_MAPPING,
  getLevelAdjustedPrompt,
  MentorResponse,
  FeedbackCategory,
} from "./personality";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    const mentorPrompt = buildMentorPrompt(params);
    const systemPrompt = getLevelAdjustedPrompt(params.userLevel);

    const response = await openai.chat.completions.create({
      model: MENTOR_CONFIG.model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: mentorPrompt },
      ],
      temperature: MENTOR_CONFIG.temperature,
      top_p: MENTOR_CONFIG.top_p,
      max_tokens: 500,
    });

    const mentorText = response.choices[0]?.message?.content || "";
    return parseAndStructureMentorResponse(mentorText, params);
  } catch (error) {
    console.error("Mentor API Error:", error);
    return { error: "Mentor konsultasyonu sırasında bir hata oluştu." };
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
    const jsonMatch = mentorText.match(/\{[\s\S]*\}/);
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
