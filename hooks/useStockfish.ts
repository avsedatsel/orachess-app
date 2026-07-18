"use client";

/**
 * useStockfish — Stockfish 18 (lite single-threaded WASM) analiz motoru
 *
 * Motor bir Web Worker içinde çalışır; ana thread'i (arayüzü) BLOKLAMAZ.
 * Dosyalar: /public/stockfish/stockfish-18-lite-single.{js,wasm}
 * Bu sürüm özel CORS/COEP header'ı GEREKTİRMEZ (Vercel'de sorunsuz çalışır).
 */

import { useCallback, useEffect, useRef, useState } from "react";

export interface StockfishEval {
  depth: number;
  scoreCp: number | null; // santipiyon (Beyaz perspektifinden; + = Beyaz iyi)
  mateIn: number | null; // N hamlede mat (+ = Beyaz mat ediyor, - = Siyah)
  bestMove: string | null; // UCI formatı, örn "e2e4"
}

const ENGINE_PATH = "/stockfish/stockfish-18-lite-single.js";

export function useStockfish() {
  const workerRef = useRef<Worker | null>(null);
  const turnRef = useRef<"w" | "b">("w");
  const [ready, setReady] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [evaluation, setEvaluation] = useState<StockfishEval | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let worker: Worker;
    try {
      worker = new Worker(ENGINE_PATH);
    } catch (e) {
      console.error("Stockfish motoru başlatılamadı:", e);
      return;
    }
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent) => {
      const line: string =
        typeof e.data === "string" ? e.data : e.data?.data ?? "";
      if (!line) return;

      // Motor hazır
      if (line === "uciok" || line === "readyok") {
        setReady(true);
        return;
      }

      // Analiz satırı: "info depth 15 ... score cp 34 ... pv e2e4 e7e5 ..."
      if (line.startsWith("info") && line.includes("score")) {
        const sign = turnRef.current === "w" ? 1 : -1;
        const depthMatch = line.match(/ depth (\d+)/);
        const cpMatch = line.match(/score cp (-?\d+)/);
        const mateMatch = line.match(/score mate (-?\d+)/);
        const pvMatch = line.match(/ pv (\S+)/);

        setEvaluation((prev) => ({
          depth: depthMatch ? parseInt(depthMatch[1], 10) : prev?.depth ?? 0,
          scoreCp: cpMatch
            ? sign * parseInt(cpMatch[1], 10)
            : mateMatch
            ? null
            : prev?.scoreCp ?? null,
          mateIn: mateMatch
            ? sign * parseInt(mateMatch[1], 10)
            : cpMatch
            ? null
            : prev?.mateIn ?? null,
          bestMove: pvMatch ? pvMatch[1] : prev?.bestMove ?? null,
        }));
        return;
      }

      // Analiz bitti
      if (line.startsWith("bestmove")) {
        const bm = line.split(" ")[1];
        if (bm && bm !== "(none)") {
          setEvaluation((prev) =>
            prev
              ? { ...prev, bestMove: bm }
              : { depth: 0, scoreCp: null, mateIn: null, bestMove: bm }
          );
        }
        setAnalyzing(false);
        return;
      }
    };

    worker.onerror = (e) => {
      console.error("Stockfish worker hatası:", e.message);
    };

    // UCI el sıkışması
    worker.postMessage("uci");
    worker.postMessage("isready");

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  /** Verilen FEN pozisyonunu belirtilen derinliğe kadar analiz eder. */
  const analyze = useCallback((fen: string, depth = 15) => {
    const worker = workerRef.current;
    if (!worker) return;
    turnRef.current = fen.split(" ")[1] === "b" ? "b" : "w";
    setEvaluation(null);
    setAnalyzing(true);
    worker.postMessage("stop");
    worker.postMessage(`position fen ${fen}`);
    worker.postMessage(`go depth ${depth}`);
  }, []);

  /** Süregelen analizi durdurur. */
  const stop = useCallback(() => {
    workerRef.current?.postMessage("stop");
    setAnalyzing(false);
  }, []);

  return { ready, analyzing, evaluation, analyze, stop };
}
