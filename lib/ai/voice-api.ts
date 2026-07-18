"use server";

/**
 * Doğa Hoca'nın SESİ — ElevenLabs Text-to-Speech (Faz 4).
 *
 * Beynin (Gemini) ürettiği METNİ sese çevirir. Yani önce metin gerekir.
 * Çalışması için Vercel'de `ELEVENLABS_API_KEY` tanımlı OLMALI.
 * Anahtar yoksa çökmez; net bir hata döner.
 */

// "Doğa Hoca" için olgun, sakin erkek ses. İstenirse burası değiştirilebilir.
// (ElevenLabs premade "Adam" sesi.) Farklı ses için voice_id'yi değiştirin.
const ELEVENLABS_VOICE_ID = "pNInz6obpgDQGcFmaJgB";
// Türkçe destekleyen çok dilli model.
const ELEVENLABS_MODEL = "eleven_multilingual_v2";

export async function synthesizeSpeech(
  text: string
): Promise<{ audio: string } | { error: string }> {
  try {
    if (!text || !text.trim()) {
      return { error: "Seslendirilecek metin yok." };
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return {
        error:
          "Ses şu an yapılandırılmadı (ELEVENLABS_API_KEY eksik). Vercel ayarlarından eklenmeli.",
      };
    }

    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: ELEVENLABS_MODEL,
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      }
    );

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("ElevenLabs error:", res.status, detail);
      // GEÇİCİ TEŞHİS: gerçek hatayı göster (çözülünce sadeleştirilecek)
      return { error: `ElevenLabs (${res.status}): ${detail.slice(0, 250)}` };
    }

    const buf = Buffer.from(await res.arrayBuffer());
    return { audio: `data:audio/mpeg;base64,${buf.toString("base64")}` };
  } catch (e) {
    console.error("ElevenLabs exception:", e);
    return { error: "Ses üretilirken bir hata oluştu." };
  }
}
