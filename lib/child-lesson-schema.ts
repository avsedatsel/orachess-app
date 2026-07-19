/**
 * ÇOCUK DERSİ ŞEMASI (7-12 yaş) — "Oyun Arkadaşı Doğa & Piyoncuk"
 * ============================================================
 * ANAYASA'nın (docs/ANAYASA.md) teknik karşılığı. Tüm çocuk dersleri bu
 * sözleşmeye uyan JSON olarak üretilir ve scripts/validate-lessons.mjs ile
 * otomatik denetlenir. Alan adları Türkçedir (domain diliyle tutarlı).
 */

/** Bir görevin türü (ANAYASA §4). */
export type GorevTuru =
  | "isik-yak" // ekrana dokun, kare parlar
  | "tahmin" // "sence nereye?" — parmakla göster
  | "ses-avi" // "bu sesi hangi taş çıkarıyor?"
  | "hamle" // tahtada gerçek hamle
  | "rol-degistir" // çocuk Piyoncuk'a/Doğa'ya öğretir (protégé)
  | "secim"; // çocuk hikâyeyi yönlendirir

/** Bir duraktaki interaktif görev. */
export interface KesifGorevi {
  tur: GorevTuru;
  yonerge: string; // çocuğa görev (oyun arkadaşı dili)
  fen?: string; // gerekiyorsa pozisyon
  hedefKare?: string; // "isik-yak"/"tahmin" için hedef (ör. "d4")
  dogruHamleSan?: string; // "hamle" görevi için beklenen hamle (SAN)
  kabulEdilen?: string[]; // kabul edilebilir alternatif hamleler (SAN)
  kesifIpuclari: string[]; // KADEMELİ, "yanlış" içermeyen ipuçları (en az 1)
  kutlama: string; // başarı repliği ("Vaaay!")
}

/** Tek bir macera durağı (~6 dk). */
export interface Durak {
  no: number; // 1..6
  baslik: string;
  kesif: string; // Doğa'nın kısa keşif anlatımı (sıcak dil, max ~3 dk)
  piyoncuk?: string; // Piyoncuk'un o duraktaki repliği (protégé anı)
  gorev: KesifGorevi;
}

/** Çocuğun günlük hayatından vaka dosyası (ANAYASA §10). */
export interface VakaDosyasi {
  gunlukHayat: string; // gerçek çocuk senaryosu
  satrancBaglantisi: string; // tahtadaki karşılığı
  ders: string; // çıkarılan hayat dersi
}

/** Dersler arası bilişsel bağ (ANAYASA §9). */
export interface BiliselBag {
  oncekiDers: string | null; // önceki ders id'si (ilk derste null)
  kopru: string; // önceki derse köprü cümlesi
  sonrakiTohum: string; // sonraki derse merak tohumu
}

/** Sınav hissi vermeyen ustalık ölçümü (ANAYASA §12). */
export interface UstalikOlcumu {
  soru: string;
  secenekler: string[];
  dogruIndex: number;
  yasBecerisiEtiketi: string;
}

/** 45 dakikalık ÇOCUK DERSİ — tam sözleşme. */
export interface ChildLesson {
  id: string; // "L0-D1"
  blok: number; // 1..12
  dersNo: number; // 1..360 (küresel sıra)
  baslik: string;
  yasBecerisi: string; // çocuk evreninden hayat becerisi
  hedefDakika: number; // 45
  duraklar: Durak[]; // TAM 6 durak
  vakaDosyasi: VakaDosyasi;
  biliselBag: BiliselBag;
  moladavet: string; // Piyoncuk'tan nazik mola daveti
  ustalikOlcumu: UstalikOlcumu;
}

/** Sabitler — denetçi ve üretim bunları temel alır. */
export const DURAK_SAYISI = 6;
export const HEDEF_DAKIKA = 45;

/** Yasak kelimeler (ANAYASA §3). Denetçi metinlerde bunları arar. */
export const YASAK_KELIMELER = [
  "yanlış",
  "hata yaptın",
  "yapmalısın",
  "başaramadın",
  "dikkatsiz",
  "taktik",
  "pozisyon",
  "kombinasyon",
  "varyant",
  "profilaksi",
  "zugzwang",
];
