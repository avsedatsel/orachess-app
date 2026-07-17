/**
 * ORACHESS - LEVEL DETECTION QUIZ DATA
 * 12 Seviye, Her Seviyede 3 Soru
 * Toplam: 36 Soru
 */

export interface QuizQuestion {
  id: string;
  level: number; // 0-11
  levelName: string;
  eloRange: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0-3 indeksi
  explanation: string; // Doğru cevaptan sonra gösterilecek
}

export const quizQuestions: QuizQuestion[] = [
  // ========== SEVIYE 0 (0-600 Elo) - Satranç Okuryazarlığı ==========
  {
    id: "q0-1",
    level: 0,
    levelName: "Satranç Okuryazarlığı",
    eloRange: "0-600",
    question: "Satranç tahtasında kaç tane kare vardır?",
    options: ["32 kare", "64 kare", "100 kare", "81 kare"],
    correctAnswer: 1,
    explanation:
      "Satranç tahtası 8×8 = 64 karedir. 32'si beyaz, 32'si siyah.",
  },
  {
    id: "q0-2",
    level: 0,
    levelName: "Satranç Okuryazarlığı",
    eloRange: "0-600",
    question: "Oyun başında piyonda kaç tane vardır?",
    options: ["4 piyon", "6 piyon", "8 piyon", "10 piyon"],
    correctAnswer: 2,
    explanation:
      "Her oyuncunun başında 8 piyon vardır. Beyaz: a2-h2, Siyah: a7-h7.",
  },
  {
    id: "q0-3",
    level: 0,
    levelName: "Satranç Okuryazarlığı",
    eloRange: "0-600",
    question: "Kral kaç kareye hareket edebilir?",
    options: ["2 kare", "4 kare", "8 kare (boş ise)", "sınırsız"],
    correctAnswer: 2,
    explanation:
      "Kral, etrafındaki 8 kareye bir hamle uzaklığında hareket edebilir (tahta sınırları ve başka taşlar göz önüne alınarak).",
  },

  // ========== SEVIYE 1 (600-850 Elo) - Görsel Taktikler ==========
  {
    id: "q1-1",
    level: 1,
    levelName: "Görsel Taktikler",
    eloRange: "600-850",
    question:
      "Aşağıdakilerden hangisi satrançta en güçlü taktik kombinasyonudur?",
    options: ["Çatallama (Fork)", "Sabitlenmiş taş", "Çivili taş", "Tümü eşit derecede güçlü"],
    correctAnswer: 0,
    explanation:
      "Çatallama (fork), bir taşla iki veya daha fazla düşman taşını tehdit etmektir. En etkili taktiktir.",
  },
  {
    id: "q1-2",
    level: 1,
    levelName: "Görsel Taktikler",
    eloRange: "600-850",
    question: "Mat koymak için gereken minimum taş sayısı nedir?",
    options: ["1 taş", "2 taş", "3 taş", "5 taş"],
    correctAnswer: 2,
    explanation:
      "Vezir veya 2 kale (veya vezir + kale) ile mat konulabilir. Minimum 3 taş kombinasyonudur.",
  },
  {
    id: "q1-3",
    level: 1,
    levelName: "Görsel Taktikler",
    eloRange: "600-850",
    question: "Bir piyonun en değerli ilerlemesi nedir?",
    options: ["Bir kare ileri gitmek", "En üz sıraya ulaşmak", "Düşman taşını almak", "Diğer piyonları korumak"],
    correctAnswer: 1,
    explanation:
      "Piyon 8. (ya da 1.) sıraya ulaştığında vezir, kale, fil veya at olarak tanınabilir. Bu çoğunlukla vezire yükseltilir.",
  },

  // ========== SEVIYE 2 (850-1100 Elo) - Taş Gelişimi & Açılış ==========
  {
    id: "q2-1",
    level: 2,
    levelName: "Taş Gelişimi & Açılış",
    eloRange: "850-1100",
    question:
      "Satranç açılışında en iyi strateji nedir?",
    options: [
      "Merkezi kontrol et (e4, d4 vb.)",
      "Krallı kaslı (castling) yap",
      "Hemen düşman taşlarına saldır",
      "Krali çıktır",
    ],
    correctAnswer: 0,
    explanation:
      "Açılışta merkezi kontrol en önemlidir. e4 ve d4 en klasik açılışlardır. Merkezi kontrol altına alırsan oyun ortasında avantaj alırsın.",
  },
  {
    id: "q2-2",
    level: 2,
    levelName: "Taş Gelişimi & Açılış",
    eloRange: "850-1100",
    question: "Açılış fazında filieri nereye geliştirmelisin?",
    options: [
      "Başlangıç karesinde bırak",
      "Merkez piyonları destekle (c4, f4 vb.)",
      "Dışarı çık, köşegen kontrol et",
      "Arka sıraya sakla",
    ],
    correctAnswer: 2,
    explanation:
      "Filieri açılışta dışarı çıkarmalısın ve köşegenleri kontrol etmelisin. Pasif fililer oyunu zayıflatır.",
  },
  {
    id: "q2-3",
    level: 2,
    levelName: "Taş Gelişimi & Açılış",
    eloRange: "850-1100",
    question: "Kaslı (Castling) ne zaman yapılabilir?",
    options: [
      "İstediğin zaman",
      "Kral veya kale hareket etmemişse ve aralarında hiçbir taş yoksa",
      "Kral saldırı altında değilse",
      "Sadece oyunun son safhasında",
    ],
    correctAnswer: 1,
    explanation:
      "Kaslı: Kral ve kale ilk konumlarında olmalı, aralarında taş olmamalı, kral saldırı altında olmamalı, kral geçecek karelerde saldırı altında olmamalıdır.",
  },

  // ========== SEVIYE 3 (1100-1300 Elo) - Oyun Ortası Planlama ==========
  {
    id: "q3-1",
    level: 3,
    levelName: "Oyun Ortası Planlama",
    eloRange: "1100-1300",
    question: "Oyun ortasında en önemli strateji nedir?",
    options: [
      "Rastgele taş hareket ettir",
      "Merkez kontrolünü koru ve taş gelişimini tamamla",
      "Hemen düşman krallına saldır",
      "Piyonları çiftleştir",
    ],
    correctAnswer: 1,
    explanation:
      "Oyun ortasında merkez kontrolü ve taş gelişimi temel stratejilerdir. Hızlı ve koordine hamleleri öncelemelisin.",
  },
  {
    id: "q3-2",
    level: 3,
    levelName: "Oyun Ortası Planlama",
    eloRange: "1100-1300",
    question: "Oyun ortasında hangi taş genellikle daha değerlidir?",
    options: ["Piyon", "At", "Fil", "Vezir"],
    correctAnswer: 2,
    explanation:
      "Oyun ortasında at ve fil eşit değerdedir (~3 puan). Ancak açık pozisyonlarda fil, kapalı pozisyonlarda at daha güçlüdür.",
  },
  {
    id: "q3-3",
    level: 3,
    levelName: "Oyun Ortası Planlama",
    eloRange: "1100-1300",
    question:
      "Zayıf karenin önüne piyon koyamazsan, ne yapmalısın?",
    options: [
      "İhmal et",
      "Atını veya filini buraya yerleştir",
      "Düşman taşlarını değiştir",
      "Kaçar krala git",
    ],
    correctAnswer: 1,
    explanation:
      "Zayıf kare (düşman tarafından kontrol edilen) tarafsız karenin uzağında olmalıdır. Atını veya filini buraya koy ve kontrol et.",
  },

  // ========== SEVIYE 4 (1300-1500 Elo) - Profilaksi ==========
  {
    id: "q4-1",
    level: 4,
    levelName: "Profilaksi (Önleyici Satranç)",
    eloRange: "1300-1500",
    question: "Profilaksi nedir?",
    options: [
      "Düşman planlarını durdurmak",
      "Sadece kendi planını uygulamak",
      "Düşman krallına mat vermek",
      "Piyonları ileri taşımak",
    ],
    correctAnswer: 0,
    explanation:
      "Profilaksi, düşmanın tehditli planlarını önceden görerek onları engelleme stratejisidir. Defans + saldırı kombinasyonu.",
  },
  {
    id: "q4-2",
    level: 4,
    levelName: "Profilaksi (Önleyici Satranç)",
    eloRange: "1300-1500",
    question:
      "Düşman 'e5' merkez piyon avansını planlıyorsa, sen ne yaparsın?",
    options: [
      "Hiçbir şey yapma",
      "f4 veya d4 ile ilerleme planını engelle",
      "Hemen saldır",
      "Taşları değiştir",
    ],
    correctAnswer: 1,
    explanation:
      "Profilaksi prensibi: Düşmanın planını görüp engelle. e5 avansını f4 veya d4 ile bloke edebilirsin.",
  },
  {
    id: "q4-3",
    level: 4,
    levelName: "Profilaksi (Önleyici Satranç)",
    eloRange: "1300-1500",
    question: "Hangi oyuncu profilaksi konusunda en meşhurdur?",
    options: [
      "Bobby Fischer",
      "Anatoly Karpov",
      "Garry Kasparov",
      "Mikhail Tal",
    ],
    correctAnswer: 1,
    explanation:
      "Anatoly Karpov profilaksi ve defansif satrançta master'dir. 'Düşmanın planını bulmak, kendi planınızdan daha önemlidir' diyen Karpov'un felsefesidir.",
  },

  // ========== SEVIYE 5 (1500-1750 Elo) - Derin Hesaplama & Kombinasyon ==========
  {
    id: "q5-1",
    level: 5,
    levelName: "Derin Hesaplama & Kombinasyon",
    eloRange: "1500-1750",
    question:
      "Kombinasyonun temelinde ne yatar?",
    options: [
      "Rastgele hamleleri birleştirme",
      "Mantıksal zorlama ve zorlayıcı (forcing) hamleleri kullanma",
      "Sadece hücum",
      "Pozisyon görmezden gelme",
    ],
    correctAnswer: 1,
    explanation:
      "Kombinasyon: Kontrollü, mantıklı ve zorlayıcı (sak, mat tehdidi, çatallama) hamleleri art arda kullanarak avantaj elde etme.",
  },
  {
    id: "q5-2",
    level: 5,
    levelName: "Derin Hesaplama & Kombinasyon",
    eloRange: "1500-1750",
    question:
      "8 hamle derin hesaplama yeteneğiniz varsa, hangi bilgiler en önemlidir?",
    options: [
      "Tüm hamleleri bilmek",
      "Kritik hamleleri tanımak ve hızlı kararlar almak",
      "Sadece saldırı hamleleri",
      "Hiçbiri",
    ],
    correctAnswer: 1,
    explanation:
      "Derin hesaplamada kritik hamleleri tanımak ve hızlı evaluasyon yapmak önemlidir. Tüm hamleleri hesaplamazsın; seçici olursun.",
  },
  {
    id: "q5-3",
    level: 5,
    levelName: "Derin Hesaplama & Kombinasyon",
    eloRange: "1500-1750",
    question:
      "'Zeitnot' (zaman basıncı) sırasında kombinasyon bulmak için ne yapmalısın?",
    options: [
      "Hiç hesaplama yapma",
      "Tüm kombinasyonları bul",
      "Temel taktik motiflerini tanı ve hızlı karar ver",
      "Rasgele hamle yap",
    ],
    correctAnswer: 2,
    explanation:
      "Zaman basıncında çekirdek taktik motiflerini (çatallama, pimleme vb.) hızlıca tanımak ve sezgisel karar almak gerekir.",
  },

  // ========== SEVIYE 6 (1750-2000 Elo) - Konumsal Satranç & Piyon Yapısı ==========
  {
    id: "q6-1",
    level: 6,
    levelName: "Konumsal Satranç & Piyon Yapısı",
    eloRange: "1750-2000",
    question: "Piyon yapısı nedir ve neden önemlidir?",
    options: [
      "Piyonların düzeni; sabit ve hamle sırasında değişemez",
      "Oyunun temelini oluşturan ve plan belirleyen unsur",
      "Sadece görüntü",
      "Hiç önemli değil",
    ],
    correctAnswer: 1,
    explanation:
      "Piyon yapısı satranç planının temelini belirler. Zayıf kareleri, saldırı hedeflerini ve uzun vadeli stratejisini tanımlar.",
  },
  {
    id: "q6-2",
    level: 6,
    levelName: "Konumsal Satranç & Piyon Yapısı",
    eloRange: "1750-2000",
    question:
      "Çift piyon (doubled pawns) nedir ve hangi durumda kabul edilebilir?",
    options: [
      "Her zaman kötü",
      "Merkez kontrolü veya açıklık sağlaması durumunda kabul edilebilir",
      "Her zaman iyi",
      "Piyon yok demektir",
    ],
    correctAnswer: 1,
    explanation:
      "Çift piyon genellikle zayıflıktır. Ancak merkez açılması veya taş aktivitesi sağlarsa, kompansasyon olabilir.",
  },
  {
    id: "q6-3",
    level: 6,
    levelName: "Konumsal Satranç & Piyon Yapısı",
    eloRange: "1750-2000",
    question: "İzole piyon (isolated pawn) stratejisi nedir?",
    options: [
      "İzole piyonu koru",
      "İzole piyonu saldırısız bırak; onu bloke etmeye odaklan",
      "İzole piyonun bulunduğu dosyada saldır",
      "Piyonu feda et",
    ],
    correctAnswer: 1,
    explanation:
      "İzole piyon genellikle zayıflıktır. Onu bloke ederek taş aktivitesini kısıtlarsın. Direkt saldırı çoğu zaman beyaz taş verir.",
  },

  // ========== SEVIYE 7 (2000-2250 Elo) - Ustalık Psikolojisi & Zaman Yönetimi ==========
  {
    id: "q7-1",
    level: 7,
    levelName: "Ustalık Psikolojisi & Zaman Yönetimi",
    eloRange: "2000-2250",
    question: "Psikolojik avantaj satrançta ne kadar etkilidir?",
    options: [
      "Hiç etkili değil",
      "Önemli; rakibi sinirlendir, hataları artar",
      "Her zaman kazanmayı garantiler",
      "Sadece başlangıçta önemli",
    ],
    correctAnswer: 1,
    explanation:
      "Satrançta psikoloji kritiktir. Rakibini sinirlendir, güvensiz yaratabilirsin. Hataları artar, değerlendirme düşer.",
  },
  {
    id: "q7-2",
    level: 7,
    levelName: "Ustalık Psikolojisi & Zaman Yönetimi",
    eloRange: "2000-2250",
    question:
      "Zaman yönetiminde stratejik oyuncu (1 saat) vs. taktik oyuncu (blitz) farkı nedir?",
    options: [
      "Fark yok",
      "Stratejik oyuncu derin hesaplamaya, taktik oyuncu sezgiye güvenir",
      "Taktik oyuncu daima kazanır",
      "Stratejik oyuncu daima kazanır",
    ],
    correctAnswer: 1,
    explanation:
      "Zaman kontrolü tarzını değiştirir. Klasik oyunda derin analiz, blitzde sezgi ve hız ön plandadır.",
  },
  {
    id: "q7-3",
    level: 7,
    levelName: "Ustalık Psikolojisi & Zaman Yönetimi",
    eloRange: "2000-2250",
    question:
      "Rakibin güçlü yönünü bilerek çalmak stratejisi nedir?",
    options: [
      "Her zaman kaçın",
      "Eğer hazırlanmışsan meydan oku; değilse farklı taktik kullan",
      "Kesinlikle hep saldır",
      "Rakibi değiştir",
    ],
    correctAnswer: 1,
    explanation:
      "Hazırlıklıysan güçlü yönüne meydan okuyabilirsin. Değilse farklı pozisyon türlerine doğru yönlendir.",
  },

  // ========== SEVIYE 8 (2250-2500 Elo) - Profesyonel Hazırlık (Novelty) ==========
  {
    id: "q8-1",
    level: 8,
    levelName: "Profesyonel Hazırlık (Novelty)",
    eloRange: "2250-2500",
    question: "Novelty nedir ve neden önemlidir?",
    options: [
      "Yeni bir açılış hareket veya derin fikir",
      "Sadece estetik değer",
      "Açılış kitabından kopya",
      "Hiçbir şey",
    ],
    correctAnswer: 0,
    explanation:
      "Novelty: Rakibinin hazırlanmamış olduğu derin ve yeni bir fikir. Turuvada avantaj sağlar.",
  },
  {
    id: "q8-2",
    level: 8,
    levelName: "Profesyonel Hazırlık (Novelty)",
    eloRange: "2250-2500",
    question:
      "Açılış kitabından çıktıktan sonra (Out of book) doğru strateji nedir?",
    options: [
      "Rasgele oyun",
      "Pozisyon anlayışı ve plan üretin; basitlik tercih edin",
      "Mekatiksel hamle yap",
      "Varyantları takip et",
    ],
    correctAnswer: 1,
    explanation:
      "Out of book'ta pozisyon çözümleme önemlidir. Basit ve anlaşılır planlarla devam et.",
  },
  {
    id: "q8-3",
    level: 8,
    levelName: "Profesyonel Hazırlık (Novelty)",
    eloRange: "2250-2500",
    question:
      "Dünya şampiyonu gibi hazırlanmak için ne yapmalısın?",
    options: [
      "Tüm açılışları ezberle",
      "Pozisyon anlayışı, taktik çalışması ve rakip analizi dengele",
      "Sadece blitz oyna",
      "Bilgisayar vs. olmaktan kaçın",
    ],
    correctAnswer: 1,
    explanation:
      "Üst seviye hazırlık: Açılış bilgisi + pozisyon anlayışı + taktik çalışma + rakip analizi = Bütünleşik sistem.",
  },

  // ========== SEVIYE 9 (2500-2700 Elo) - Büyükusta Sezgi Yönetimi ==========
  {
    id: "q9-1",
    level: 9,
    levelName: "Büyükusta Sezgi Yönetimi",
    eloRange: "2500-2700",
    question:
      "Büyükusta sezgisi (GM Intuition) neye dayalıdır?",
    options: [
      "Rastgelelik",
      "Binlerce oyun ve savaş deneyimi",
      "Sadece matematik",
      "Hiç bilim yok",
    ],
    correctAnswer: 1,
    explanation:
      "Büyükusta sezgisi uzun yıl deneyiminden, binlerce oyundan ve yoğun analiz çalışmasından doğar.",
  },
  {
    id: "q9-2",
    level: 9,
    levelName: "Büyükusta Sezgi Yönetimi",
    eloRange: "2500-2700",
    question:
      "Pozisyon evaluasyonunun %90'ı görünür mü?",
    options: [
      "Evet, her zaman",
      "Hayır; çoğu zaman derinlik ve dinamizm gizlidir",
      "Hiç yoktur",
      "Belirsiz",
    ],
    correctAnswer: 1,
    explanation:
      "Büyük ustalar görünmeyen faktörleri (dinamik güç, uzun vadeli faktörler, psikoloji) değerlendir.",
  },
  {
    id: "q9-3",
    level: 9,
    levelName: "Büyükusta Sezgi Yönetimi",
    eloRange: "2500-2700",
    question:
      "Kompleks pozisyonda 'Best Move' yerine 'Practical Move' tercih etmelisin mi?",
    options: [
      "Her zaman best move ara",
      "Pozisyon türüne göre; karmaşık pozisyonda practical move daha verimli olabilir",
      "Hiçbir zaman best move bulunmaz",
      "Her zaman practical move yap",
    ],
    correctAnswer: 1,
    explanation:
      "Büyük ustalar bağlamdan hamle seçerler. Kompleks oyunda practical (güvenli ama efektif) hamle, best move kadar etkili olabilir.",
  },

  // ========== SEVIYE 10 (2700-2900 Elo) - Stockfish Analitik Sentezi ==========
  {
    id: "q10-1",
    level: 10,
    levelName: "Stockfish Analitik Sentezi",
    eloRange: "2700-2900",
    question:
      "Stockfish analizi insani analiz ile çakışmadığında ne yaparsın?",
    options: [
      "Her zaman Stockfish'i takip et",
      "Her iki görüşü analiz et; derinlik ve bağlam kontrol et",
      "İnsani görüşü görmezden gel",
      "Rastgele seç",
    ],
    correctAnswer: 1,
    explanation:
      "Bilgisayar ve insan analiz tamamlayıcıdır. Çatışmalar derinlik ve oyun bağlamı kontrol edilerek çözülür.",
  },
  {
    id: "q10-2",
    level: 10,
    levelName: "Stockfish Analitik Sentezi",
    eloRange: "2700-2900",
    question:
      "'Engine ile bağlantı kopması' durumunda nasıl çalışırsın?",
    options: [
      "Paraliz kalırsın",
      "Pozisyon, plan ve sezgiyle devam edersin",
      "Oyun bitmiş gibi davranırsın",
      "Kaçarsın",
    ],
    correctAnswer: 1,
    explanation:
      "Gerçek yaşamda bilgisayar hep yardımcı değildir. Pozisyon anlayışına güvenmelisin.",
  },
  {
    id: "q10-3",
    level: 10,
    levelName: "Stockfish Analitik Sentezi",
    eloRange: "2700-2900",
    question:
      "Stockfish'in 'Centipawn Loss' metriği satranççı için ne anlama gelir?",
    options: [
      "Hiç anlamı yok",
      "Hareket kalitesini ve hatayı ölçer; uzun vadede cumulative hata gösterir",
      "Sadece mühendislere aittir",
      "Tam hata tanımı",
    ],
    correctAnswer: 1,
    explanation:
      "Centipawn Loss: Hareketin bilgisayar değerlendirmesiyle optimal hamle arasındaki fark. Hata ve stil gösterir.",
  },

  // ========== SEVIYE 11 (2900-3000+ Elo) - Elite Satranç Bilim İnsanlığı ==========
  {
    id: "q11-1",
    level: 11,
    levelName: "Elite Satranç Bilim İnsanlığı",
    eloRange: "2900-3000+",
    question:
      "Satranç oyunun sonunda 'objektif gerçek' vardır mı?",
    options: [
      "Hayır, her zaman subjektiftir",
      "Evet; ama insanın algıladığı gerçek sınırlıdır. Bilgisayarlar daha ileri görebilir",
      "Hiçbir şey var değil",
      "Sadece açılış gerçektir",
    ],
    correctAnswer: 1,
    explanation:
      "Satranç matematik olarak deterministiktir (ilk hamle veri her şeyi belirler), ancak insanın anlaması sınırlıdır.",
  },
  {
    id: "q11-2",
    level: 11,
    levelName: "Elite Satranç Bilim İnsanlığı",
    eloRange: "2900-3000+",
    question:
      "'Büyükusta' ile 'Engine' arasındaki harita (mapping) nedir?",
    options: [
      "Hiç bağlantı yok",
      "İkisi de güç hesaplıyor; ikisi de hiyerarşik dallanmayı tercih ediyor; ama insanın sezgisi farklı kriterler kullanıyor",
      "Tamamen aynıdırlar",
      "Bilgisayar daima daha iyidir",
    ],
    correctAnswer: 1,
    explanation:
      "İnsan sezgi ile bilgisayar hesabı berbat eş. İnsan daha az hamle araştırır ama daha geniş bağlama bakar.",
  },
  {
    id: "q11-3",
    level: 11,
    levelName: "Elite Satranç Bilim İnsanlığı",
    eloRange: "2900-3000+",
    question:
      "Satrançta 'yenilik' ne demektir? (2024+ context)",
    options: [
      "Eski hamleleri tekrarlama",
      "Yeni fikirleri, yapay zeka kombinasyonları ve insan sezgisini sentezleyerek bulma",
      "Sadece açılış inovasyonu",
      "Hiç yenilik yoktur",
    ],
    correctAnswer: 1,
    explanation:
      "Modern satranç: İnsan sezgi + bilgisayar analiz + açılış inovasyonu. Alanı ileri taşıyan ustalar bu üçünü sentezleyenlerdir.",
  },
];

/**
 * Utility: 12 Seviye Tanımı
 */
export const LEVELS_DEFINITION = [
  { level: 0, name: "Satranç Okuryazarlığı", eloRange: "0-600" },
  { level: 1, name: "Görsel Taktikler", eloRange: "600-850" },
  { level: 2, name: "Taş Gelişimi & Açılış", eloRange: "850-1100" },
  { level: 3, name: "Oyun Ortası Planlama", eloRange: "1100-1300" },
  { level: 4, name: "Profilaksi (Önleyici Satranç)", eloRange: "1300-1500" },
  { level: 5, name: "Derin Hesaplama & Kombinasyon", eloRange: "1500-1750" },
  { level: 6, name: "Konumsal Satranç & Piyon Yapısı", eloRange: "1750-2000" },
  { level: 7, name: "Ustalık Psikolojisi & Zaman Yönetimi", eloRange: "2000-2250" },
  { level: 8, name: "Profesyonel Hazırlık (Novelty)", eloRange: "2250-2500" },
  { level: 9, name: "Büyükusta Sezgi Yönetimi", eloRange: "2500-2700" },
  { level: 10, name: "Stockfish Analitik Sentezi", eloRange: "2700-2900" },
  {
    level: 11,
    name: "Elite Satranç Bilim İnsanlığı",
    eloRange: "2900-3000+",
  },
];
