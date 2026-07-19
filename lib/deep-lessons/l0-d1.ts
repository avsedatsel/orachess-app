/**
 * ÖRNEK DERİN DERS — L0-D1 "Tahtayı Tanıyalım"
 * 45 dakikalık, 5 aşamalı derin eğitim formatının REFERANS ŞABLONU.
 * Kalan 359 ders bu kalıba göre üretilecek (bkz. docs/DERS_PROTOKOLU.md).
 */

import { STARTING_FEN } from "@/lib/chess-utils";
import type { DeepLesson } from "@/lib/lesson-schema";

export const L0_D1: DeepLesson = {
  id: "L0-D1",
  level: 0,
  order: 1,
  title: "Tahtayı Tanıyalım",
  lifeConcept: "Odaklanma",
  tone: "Teşvik Edici",
  stability: 0.5,
  similarityBoost: 0.75,
  targetMinutes: 45,

  stages: [
    // 1) ISINMA (~5 dk)
    {
      kind: "warmup",
      title: "Isınma — Evrenin Sınırları",
      durationSec: 300,
      narration:
        "Merhaba, hoş geldin. Bugün bir yolculuğa çıkıyoruz. Ama her yolculuk gibi, önce üzerinde yürüyeceğimiz zemini tanımalıyız. Satranç tahtası 64 kareden oluşan bir evren. Gözlerini kıs ve şu tahtaya bak: sence bu evrenin kaç tane 'sınırı' var? Acele etme, sadece hisset.",
    },
    // 2) KAVRAM (~10 dk) — Vaka Dosyası burada
    {
      kind: "concept",
      title: "Kavram — Düzenin Haritası",
      durationSec: 600,
      narration:
        "Tahta 8'e 8, yani 64 kare. Yatay sıralara 'yatay hat' (rank), dikey sıralara 'dikey hat' (file) diyoruz. Sütunlar a'dan h'ye harflerle, satırlar 1'den 8'e rakamlarla adlandırılır. Yani her karenin bir adresi vardır: e4, d5, g1... Bir haritada nasıl her sokağın adı varsa, tahtada da her karenin adı var. Adresini bilmeyen, hedefine varamaz.",
    },
    // 3) İNTERAKTİF UYGULAMA (~15 dk)
    {
      kind: "interactive",
      title: "Uygulama — Kareleri Bul",
      durationSec: 900,
      narration:
        "Şimdi sıra sende. Doğa Hoca sana bir kare söyleyecek, sen o kareyi bulacaksın. Yanılırsan üzülme — her usta önce buradan geçti.",
      tasks: [
        {
          fen: STARTING_FEN,
          prompt:
            "Beyaz şah hangi karede duruyor? O taşı seçip bir kare ileri (e1→e2 boş değil) yerine, önce merkezdeki e2 piyonunu iki kare ileri sür (e2–e4).",
          bestMoveSan: "e4",
          acceptableMovesSan: ["d4"],
          socraticHints: [
            "Merkez, tahtanın kalbidir. Ortadaki dört kareye (d4, e4, d5, e5) hükmeden, oyuna hükmeder.",
            "e sütunundaki piyonu iki kare ileri sürmeyi dene.",
          ],
          successMessage:
            "Harika! e4 ile merkezi selamladın. İlk adımın en zorudur, sen attın bile.",
        },
      ],
    },
    // 4) ANALİZ (~10 dk)
    {
      kind: "analysis",
      title: "Analiz — Ustalar Nasıl Başlar",
      durationSec: 600,
      narration:
        "Az önce yaptığın hamleyi, tarihin en büyük ustaları da milyonlarca kez yaptı. Merkeze sahip çıkmak bir tesadüf değil, bir prensiptir. Şimdi bir usta oyununun ilk hamlelerine bakalım ve neden merkezin bu kadar değerli olduğunu birlikte görelim.",
      exampleGames: [
        {
          title: "Merkez Prensibi — Temsili Açılış",
          keyFens: [
            "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
          ],
          takeaway:
            "İlk hamlede merkeze bir piyon sürmek, taşlarına nefes alacak alan açar. Alan, satrançta zamandır.",
        },
      ],
    },
    // 5) BİLİŞSEL KAPANIŞ (~5 dk)
    {
      kind: "closure",
      title: "Kapanış — Bugünün Tohumu",
      durationSec: 300,
      narration:
        "Bugün tahtanın bir evren, her karenin bir adres olduğunu öğrendik. Ve merkezin neden önemli olduğunu hissettik. Unutma: hayatta da odağını bildiğin yere kurarsan, dağılmazsın. Bugün öğrendiğin tek şey buysa bile, yeter.",
      reflection:
        "Bugünkü derste 'odaklanma' ile 'merkeze sahip çıkmak' arasında nasıl bir benzerlik gördün? Bir cümleyle kendine söyle.",
    },
  ],

  caseStudy: {
    domain: "İş Dünyası — Büyük Buhran (1929)",
    scenario:
      "1929 krizinde ayakta kalan şirketler, her yöne saldıran değil; çekirdek işine (merkezine) tutunup gücünü oraya yoğunlaştıran şirketlerdi.",
    chessParallel:
      "Tahtada merkeze (d4-e4-d5-e5) sahip çıkmak, tıpkı bir yöneticinin kaynaklarını dağıtmadan çekirdek değerine yoğunlaştırması gibidir.",
    lifeLesson:
      "Belirsizlikte hayatta kalmak, her yeri tutmaya çalışmakla değil; merkezini sağlam tutmakla olur.",
  },

  engagement: [
    {
      atSecond: 120,
      type: "predict",
      prompt: "Sence bu 64 karenin kaç tanesi 'merkez' sayılır? Tahmin et.",
    },
    {
      atSecond: 480,
      type: "socratic",
      prompt:
        "Neden ilk hamlede kenardaki bir piyonu değil de ortadaki bir piyonu sürmek daha akıllıca olabilir?",
    },
    {
      atSecond: 900,
      type: "pause-think",
      prompt: "Hamleyi yapmadan önce 10 saniye dur. Acele en büyük rakiptir.",
    },
    {
      atSecond: 1500,
      type: "micro-reward",
      prompt: "İlk merkez hamleni yaptın — 'Odak' rozetinin ilk parçası senin!",
    },
    {
      atSecond: 2400,
      type: "recall",
      prompt:
        "Kapatmadan önce: bugün öğrendiğin karenin adı neydi? Sesli söyle.",
    },
  ],

  cognitiveLink: {
    prevLessonId: null,
    prevConcept: null,
    bridge:
      "Bu ilk ders; zeminimizi kuruyoruz. Zemin sağlam olmadan üzerine bina yükselmez.",
    nextSeed:
      "Kareleri tanıdık. Peki bu karelerde yaşayan ilk taşımız, sadık askerimiz kim olacak? Bir sonraki derste piyonla tanışacağız.",
  },

  masteryCheck: {
    question: "Tahtadaki merkez kareler hangileridir?",
    options: ["a1-h8 köşeleri", "d4-e4-d5-e5", "sadece e2-e4", "tüm 8. yatay"],
    correctIndex: 1,
    lifeSkillTag: "Odaklanma",
  },
};
