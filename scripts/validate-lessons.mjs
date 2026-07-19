/**
 * DERS DENETÇİSİ — "makineler makineleri denetler" (ANAYASA §13)
 * ------------------------------------------------------------
 * content/child-lessons/*.json dosyalarını okur ve otomatik denetler:
 *   1) Şema: 6 durak, zorunlu alanlar, hedef dakika
 *   2) Satranç: her FEN geçerli mi, her hamle o FEN'de yasal mı (chess.js)
 *   3) Dil: ANAYASA'daki yasak kelimeler metinlerde geçiyor mu
 *   4) Zincir: bilişsel bağ (oncekiDers) gerçek bir derse işaret ediyor mu
 *
 * Çalıştırma:  node scripts/validate-lessons.mjs
 * Çıkış kodu:  0 = hepsi temiz, 1 = en az bir hata (CI'da kullanılabilir)
 */

import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Chess } from "chess.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIR = join(__dirname, "..", "content", "child-lessons");

const DURAK_SAYISI = 6;
const HEDEF_DAKIKA = 45;
const YASAK_KELIMELER = [
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

// --- Yükleme -------------------------------------------------------------
const files = readdirSync(DIR).filter((f) => f.endsWith(".json"));
const lessons = files.map((f) => ({
  file: f,
  data: JSON.parse(readFileSync(join(DIR, f), "utf8")),
}));
const ids = new Set(lessons.map((l) => l.data.id));

let hataToplam = 0;
let uyariToplam = 0;

// Bir dersteki tüm serbest metinleri toplar (yasak kelime taraması için).
function metinleriTopla(d) {
  const parts = [];
  for (const dur of d.duraklar ?? []) {
    parts.push(dur.kesif ?? "", dur.piyoncuk ?? "", dur.baslik ?? "");
    const g = dur.gorev ?? {};
    parts.push(g.yonerge ?? "", g.kutlama ?? "", ...(g.kesifIpuclari ?? []));
  }
  parts.push(d.moladavet ?? "", d.baslik ?? "");
  return parts.join(" \n ").toLocaleLowerCase("tr");
}

// --- Denetim -------------------------------------------------------------
for (const { file, data: d } of lessons) {
  const hatalar = [];
  const uyarilar = [];

  // 1) Şema
  if (!d.id) hatalar.push("id yok");
  if (d.hedefDakika !== HEDEF_DAKIKA)
    uyarilar.push(`hedefDakika ${d.hedefDakika} (beklenen ${HEDEF_DAKIKA})`);
  if (!Array.isArray(d.duraklar) || d.duraklar.length !== DURAK_SAYISI)
    hatalar.push(`durak sayısı ${d.duraklar?.length} (olması gereken ${DURAK_SAYISI})`);
  if (!d.vakaDosyasi?.satrancBaglantisi) hatalar.push("vakaDosyasi eksik");
  if (!d.ustalikOlcumu?.secenekler?.length) hatalar.push("ustalikOlcumu eksik");

  // 2) Satranç doğruluğu — her FEN + her hamle motorla denetlenir
  for (const dur of d.duraklar ?? []) {
    const g = dur.gorev ?? {};
    if (!g.kesifIpuclari?.length)
      hatalar.push(`Durak ${dur.no}: en az 1 keşif ipucu olmalı`);
    if (g.fen) {
      let chess;
      try {
        chess = new Chess(g.fen);
      } catch {
        hatalar.push(`Durak ${dur.no}: geçersiz FEN`);
      }
      if (chess && g.dogruHamleSan) {
        const dene = (san) => {
          const t = new Chess(g.fen);
          try {
            return !!t.move(san);
          } catch {
            return false;
          }
        };
        if (!dene(g.dogruHamleSan))
          hatalar.push(
            `Durak ${dur.no}: '${g.dogruHamleSan}' bu FEN'de YASAL DEĞİL`
          );
        for (const alt of g.kabulEdilen ?? [])
          if (!dene(alt))
            hatalar.push(`Durak ${dur.no}: kabul edilen '${alt}' yasal değil`);
      }
      if (chess && g.tur === "hamle" && !g.dogruHamleSan)
        uyarilar.push(`Durak ${dur.no}: 'hamle' görevi ama dogruHamleSan yok`);
    }
  }

  // 3) Dil — yasak kelimeler
  const metin = metinleriTopla(d);
  for (const kelime of YASAK_KELIMELER)
    if (metin.includes(kelime.toLocaleLowerCase("tr")))
      hatalar.push(`YASAK kelime kullanılmış: "${kelime}"`);

  // 4) Bilişsel bağ zinciri
  if (d.biliselBag === undefined) hatalar.push("biliselBag yok");
  else {
    const onceki = d.biliselBag.oncekiDers;
    if (onceki !== null && !ids.has(onceki))
      hatalar.push(`biliselBag.oncekiDers "${onceki}" mevcut bir derse işaret etmiyor`);
    if (!d.biliselBag.sonrakiTohum) uyarilar.push("sonrakiTohum boş");
  }

  // Rapor
  const durum = hatalar.length ? "❌ HATA" : uyarilar.length ? "⚠️  UYARI" : "✅ TEMİZ";
  console.log(`\n${durum}  ${file}  (${d.id} — ${d.baslik})`);
  for (const h of hatalar) console.log(`   ❌ ${h}`);
  for (const u of uyarilar) console.log(`   ⚠️  ${u}`);

  hataToplam += hatalar.length;
  uyariToplam += uyarilar.length;
}

console.log(
  `\n──────────────────────────────\nToplam: ${lessons.length} ders · ${hataToplam} hata · ${uyariToplam} uyarı`
);
process.exit(hataToplam ? 1 : 0);
