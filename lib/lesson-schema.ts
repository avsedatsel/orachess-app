/**
 * DERİN DERS ŞEMASI — "45 Dakikalık Derin Eğitim" protokolü
 * ============================================================
 * OraChess'in 360 derslik müfredatı bu sözleşmeye göre üretilir.
 * Her ders 5 aşamalıdır (Isınma → Kavram → İnteraktif Uygulama → Analiz →
 * Bilişsel Kapanış), bir "Vaka Dosyası" (Case Study) ile hayat stratejisine
 * bağlanır, etkileşim tetikleyicileriyle kullanıcıyı aktif tutar ve bir önceki
 * dersle "bilişsel bağ" kurar.
 *
 * Geriye dönük uyum: mevcut basit `Lesson` (lessons-data.ts) korunur;
 * `toSimpleLesson()` bir DeepLesson'ı eski formata indirger (eski UI çalışsın).
 */

import type { Lesson } from "@/lib/lessons-data";

/** 5 aşamalı derin ders akışının aşama türleri. */
export type LessonStageKind =
  | "warmup" // Isınma — önceki bilgiyi uyandır, kancala, köprü kur
  | "concept" // Kavram — çekirdek kavramı öğret (+ Vaka Dosyası)
  | "interactive" // İnteraktif Uygulama — tahtada alıştırma
  | "analysis" // Analiz — usta oyunları, derin inceleme
  | "closure"; // Bilişsel Kapanış — özet, hayat dersi, refleksiyon

/** Tahtada yapılacak tek bir alıştırma (İnteraktif aşama). */
export interface BoardTask {
  fen: string; // başlangıç pozisyonu
  prompt: string; // kullanıcıya soru/görev
  bestMoveSan?: string; // beklenen en iyi hamle (SAN, ör. "Nf3")
  acceptableMovesSan?: string[]; // kabul edilebilir alternatifler
  socraticHints: string[]; // yanlışta KADEMELİ ipuçları (Doğa Hoca sormadan söylemez)
  successMessage: string; // doğru hamlede geri bildirim
}

/** Kavramı pekiştiren usta oyunu / örnek pozisyon. */
export interface ExampleGame {
  title: string; // ör. "Capablanca – Tartakower, 1924"
  pgn?: string; // varsa tam oyun
  keyFens?: string[]; // vurgulanacak kilit pozisyonlar
  takeaway: string; // bu oyundan çıkarılacak ders
}

/**
 * Etkileşim tetikleyicisi (Engagement Trigger) — 45 dakikayı verimli
 * kullanmak için Doğa Hoca'nın kullanıcıyı aktif tuttuğu anlar.
 */
export interface EngagementTrigger {
  atSecond: number; // dersin kaçıncı saniyesinde devreye girer
  type:
    | "predict" // "Sence rakip ne oynar?" — tahmin ettir
    | "pause-think" // "Dur ve 10 saniye düşün" — panik yönetimi
    | "socratic" // açık uçlu Sokratik soru
    | "micro-reward" // küçük kutlama / rozet kırıntısı
    | "recall"; // "Geçen ders ne öğrenmiştik?" — hatırlatma
  prompt: string;
}

/**
 * Dinamik Vaka Dosyası (Case Study) — satrancı hayat stratejisiyle eşler.
 * Öğrenci satranç oynarken bir "Strateji Simülasyonu" yaptığını hisseder.
 */
export interface CaseStudy {
  domain: string; // ör. "İş Dünyası — Büyük Buhran"
  scenario: string; // gerçek hayat senaryosu
  chessParallel: string; // satrançtaki birebir karşılığı
  lifeLesson: string; // çıkarılan hayat dersi
}

/** Tek bir ders aşaması. */
export interface LessonStage {
  kind: LessonStageKind;
  title: string;
  durationSec: number; // hedef süre (5 aşama toplamı ≈ 45 dk)
  narration: string; // Doğa Hoca anlatımı (ElevenLabs ile seslendirilir)
  tasks?: BoardTask[]; // yalnızca "interactive" aşamada
  exampleGames?: ExampleGame[]; // yalnızca "analysis" aşamada
  reflection?: string; // yalnızca "closure" aşamasında kapanış sorusu
}

/** Dersler arası "bilişsel bağ" — süreklilik ve merak zinciri. */
export interface CognitiveLink {
  prevLessonId: string | null;
  prevConcept: string | null; // önceki dersin çekirdek kavramı
  bridge: string; // iki kavram arasındaki köprü cümlesi
  nextSeed: string; // sonraki derse "merak tohumu"
}

/** Ders çıkışı ustalık ölçümü (Bilişsel Kapanış). */
export interface MasteryCheck {
  question: string;
  options: string[];
  correctIndex: number;
  lifeSkillTag: string; // ör. "Odaklanma"
}

/** 45 dakikalık DERİN DERS — tam sözleşme. */
export interface DeepLesson {
  id: string; // "L0-D1"
  level: number; // 0..11
  order: number; // seviye içi sıra (1..30)
  title: string;
  lifeConcept: string;
  tone: string; // TONE_MAPPING etiketi (ör. "Teşvik Edici")
  stability: number; // ElevenLabs voice_settings.stability
  similarityBoost: number; // ElevenLabs voice_settings.similarity_boost
  targetMinutes: number; // 45
  stages: LessonStage[]; // 5 aşama (sırayla)
  caseStudy: CaseStudy;
  engagement: EngagementTrigger[];
  cognitiveLink: CognitiveLink;
  masteryCheck: MasteryCheck;
}

// ---------------------------------------------------------------------------
// Yardımcılar
// ---------------------------------------------------------------------------

/** Aşama sürelerini toplayıp dakikaya çevirir (içerik denetimi için). */
export function totalDurationMinutes(lesson: DeepLesson): number {
  const sec = lesson.stages.reduce((t, s) => t + s.durationSec, 0);
  return Math.round(sec / 60);
}

/** 5 aşamanın da beklenen türde ve doğru sırada olduğunu doğrular. */
const STAGE_ORDER: LessonStageKind[] = [
  "warmup",
  "concept",
  "interactive",
  "analysis",
  "closure",
];
export function validateStages(lesson: DeepLesson): boolean {
  if (lesson.stages.length !== STAGE_ORDER.length) return false;
  return lesson.stages.every((s, i) => s.kind === STAGE_ORDER[i]);
}

/**
 * Geriye dönük uyum: DeepLesson → mevcut basit Lesson.
 * content = Kavram aşamasının anlatımı (eski UI ve sesli dinleme için).
 */
export function toSimpleLesson(deep: DeepLesson): Lesson {
  const concept =
    deep.stages.find((s) => s.kind === "concept") ?? deep.stages[0];
  return {
    id: deep.id,
    title: deep.title,
    content: concept?.narration ?? "",
    lifeConcept: deep.lifeConcept,
    tone: deep.tone,
    stability: deep.stability,
    similarityBoost: deep.similarityBoost,
  };
}
