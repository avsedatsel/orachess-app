/**
 * Çocuk derslerini (content/child-lessons/*.json) uygulamaya yükler.
 * JSON'lar Anayasa şemasına (ChildLesson) uyar ve derleme zamanı içe aktarılır.
 */

import type { ChildLesson } from "@/lib/child-lesson-schema";
import L0D1 from "@/content/child-lessons/L0-D1.json";
import L0D2 from "@/content/child-lessons/L0-D2.json";
import L0D3 from "@/content/child-lessons/L0-D3.json";
import L0D4 from "@/content/child-lessons/L0-D4.json";
import L0D5 from "@/content/child-lessons/L0-D5.json";

const ALL = [L0D1, L0D2, L0D3, L0D4, L0D5] as unknown as ChildLesson[];

export const CHILD_LESSONS: Record<string, ChildLesson> = Object.fromEntries(
  ALL.map((l) => [l.id, l])
);

/** Sıra numarasına göre sıralı ders listesi. */
export const CHILD_LESSON_LIST: ChildLesson[] = [...ALL].sort(
  (a, b) => a.dersNo - b.dersNo
);

export function getChildLesson(id: string): ChildLesson | null {
  return CHILD_LESSONS[id] ?? null;
}
