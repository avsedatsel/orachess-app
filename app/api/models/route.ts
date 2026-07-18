import { NextResponse } from "next/server";

/**
 * GEÇİCİ TEŞHİS: Bu anahtarın erişebildiği, generateContent destekleyen modelleri listeler.
 * Doğru model adını seçtikten sonra bu dosya kaldırılacak.
 * Ziyaret: /api/models
 */
export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY tanımlı değil" }, { status: 500 });
  }
  try {
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models?pageSize=200",
      { headers: { "x-goog-api-key": apiKey } }
    );
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return NextResponse.json({ status: res.status, detail }, { status: 200 });
    }
    const data = await res.json();
    const models = (data.models || [])
      .filter((m: { supportedGenerationMethods?: string[] }) =>
        (m.supportedGenerationMethods || []).includes("generateContent")
      )
      .map((m: { name: string }) => m.name);
    return NextResponse.json({ count: models.length, models });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
