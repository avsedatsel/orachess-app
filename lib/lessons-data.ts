/**
 * MÜFREDAT VERİSİ — "Ustalık Piramidi" dersleri (360 ders hedefi).
 *
 * Not: Müfredat içeriği (statik) bu kod dosyasında tutulur — tıpkı quiz-data.ts gibi.
 * Her ders, Doğa Hoca'nın ElevenLabs seslendirmesi için TONLAMA parametrelerini
 * (stability, similarityBoost) ve PEDAGOJİK metadata'yı (tone, lifeConcept) taşır.
 * Bu alanlar korunmalıdır; ses üretiminde doğrudan ElevenLabs'e iletilir.
 */

export interface Lesson {
  id: string; // ör. "L0-D1"
  title: string;
  content: string; // Doğa Hoca'nın anlatım metni (seslendirilecek)
  lifeConcept: string; // pedagojik "hayat dersi" konsepti
  tone: string; // Doğa Hoca tonu (TONE_MAPPING etiketine karşılık gelir)
  stability: number; // ElevenLabs voice_settings.stability
  similarityBoost: number; // ElevenLabs voice_settings.similarity_boost
}

/**
 * LEVEL 0 — Satranç Okuryazarlığı (Satranç Dünyasına İlk Adım)
 * İlk 5 ders. (Piramit ilerledikçe genişletilecek.)
 */
export const LEVEL_0_LESSONS: Lesson[] = [
  {
    id: "L0-D1",
    title: "Tahtayı Tanıyalım",
    content:
      "Satranç tahtası, 64 kareden oluşan bir evrendir. Bugün seninle bu evrenin sınırlarını keşfedeceğiz. Unutma, her büyük yolculuk küçük bir adımla başlar.",
    lifeConcept: "Odaklanma",
    tone: "Teşvik Edici",
    stability: 0.5,
    similarityBoost: 0.75,
  },
  {
    id: "L0-D2",
    title: "Kareler ve İsimleri",
    content:
      "Her karenin bir adı var, tıpkı evimizdeki odalar gibi. Taşlarını nereye yerleştireceğini bilmek, stratejinin ilk kuralıdır. Adresini bilmeyen, hedefine varamaz.",
    lifeConcept: "Düzen",
    tone: "Bilge",
    stability: 0.6,
    similarityBoost: 0.7,
  },
  {
    id: "L0-D3",
    title: "Piyon: Sadık Asker",
    content:
      "Piyonlar satrancın kalbidir. Tek bir adım atarlar ama asla geri dönmezler. Hayatta da bazı kararlar geri alınamaz, bu yüzden her hamleni sevgiyle yap.",
    lifeConcept: "Kararlılık",
    tone: "Bilge",
    stability: 0.5,
    similarityBoost: 0.8,
  },
  {
    id: "L0-D4",
    title: "Kale: Güç ve Koruma",
    content:
      "Kalenin gücü düz gitmesinden gelir. Hayatın karmaşasında düz bir çizgide durabilmek, gerçek bir cesaret göstergesidir. Bugün kalenin gücünü keşfet.",
    lifeConcept: "Cesaret",
    tone: "Öğretici",
    stability: 0.4,
    similarityBoost: 0.85,
  },
  {
    id: "L0-D5",
    title: "At: Sınırları Aşmak",
    content:
      "At, diğer taşların üzerinden atlayabilir. Engeller senin için bir son değil, birer geçittir. Bugün at gibi engellerin üzerinden atlamayı öğreneceğiz.",
    lifeConcept: "Problem Çözme",
    tone: "Teşvik Edici",
    stability: 0.5,
    similarityBoost: 0.7,
  },
];

/** Seviyeye göre dersleri getirir. */
export function getLevelLessons(level: number): Lesson[] {
  if (level === 0) return LEVEL_0_LESSONS;
  return [];
}
