import Link from "next/link";
import { LessonPlayer } from "@/components/lesson/LessonPlayer";
import {
  getChildLesson,
  CHILD_LESSON_LIST,
} from "@/lib/child-lessons-loader";

/** Statik üretim: tüm ders id'lerini önceden oluştur. */
export function generateStaticParams() {
  return CHILD_LESSON_LIST.map((l) => ({ id: l.id }));
}

export default function DersPage({ params }: { params: { id: string } }) {
  const lesson = getChildLesson(params.id);

  if (!lesson) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-4">
        <p className="text-gray-300">Bu ders henüz hazır değil. 🛠️</p>
        <Link
          href="/dashboard"
          className="px-6 py-3 bg-ora-gold text-ora-dark font-semibold rounded-lg hover:opacity-90 transition"
        >
          Yoluma dön
        </Link>
      </main>
    );
  }

  return <LessonPlayer lesson={lesson} />;
}
