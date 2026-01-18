// frontend/src/pages/rep/RepTrainingPage.tsx
import { useEffect, useState } from "react";
import Topbar from "../../layouts/Topbar";
import { getTrainingCourses, completeLesson, type Course, type Lesson } from "../../api/training";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function RepTrainingPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [processingLessonId, setProcessingLessonId] = useState<number | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await getTrainingCourses();
      setCourses(data);
      if (data.length > 0 && !activeCourseId) {
        // Default to first course or logic to find active one
        setActiveCourseId(data[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch courses", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteLesson = async (lessonId: number) => {
    try {
      setProcessingLessonId(lessonId);
      await completeLesson(lessonId);
      // Refresh state to unlock next lesson and update progress
      await fetchCourses();
    } catch (error) {
      console.error("Failed to complete lesson", error);
    } finally {
      setProcessingLessonId(null);
    }
  };

  const activeCourse = courses.find((c) => c.id === activeCourseId) || courses[0];

  const totalCourses = courses.length;
  const completedCourses = courses.filter((c) => c.progress === 100).length;
  const avgProgress =
    Math.round(
      courses.reduce((acc, c) => acc + c.progress, 0) / courses.length
    ) || 0;

  const badgeColor = (level: string) => {
    switch (level) {
      case "Básico":
        return "bg-neutral-100 text-neutral-700";
      case "Intermedio":
        return "bg-black text-white";
      case "Avanzado":
        return "bg-neutral-900 text-white";
      default:
        return "bg-neutral-100 text-neutral-700";
    }
  };

  const pillForStatus = (lesson: Lesson) => {
    if (lesson.status === "completed") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] font-medium text-emerald-700">
          Completada
        </span>
      );
    }
    if (lesson.status === "in-progress") {
      // Show complete button if it's in-progress
      return (
        <button
          onClick={() => handleCompleteLesson(lesson.id)}
          disabled={processingLessonId === lesson.id}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black text-[10px] font-medium text-white hover:bg-neutral-800 transition-colors disabled:opacity-50"
        >
          {processingLessonId === lesson.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
          Completar
        </button>
      )
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-neutral-100 text-[10px] font-medium text-neutral-500">
        Bloqueada
      </span>
    );
  };

  if (loading) {
    return <div className="flex items-center justify-center p-12"><Loader2 className="w-6 h-6 animate-spin text-neutral-400" /></div>;
  }

  if (!courses.length) {
    return (
      <div className="space-y-6">
        <Topbar title="Formación" subtitle="Cursos para mejorar tu performance" />
        <div className="text-center py-12 text-neutral-500">No hay cursos asignados todavía.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Topbar
        title="Formación"
        subtitle="Cursos para mejorar tu performance como setter / closer"
      />

      {/* RESUMEN SUPERIOR */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 px-5 py-4">
          <p className="text-xs text-neutral-500 mb-1">Cursos activos</p>
          <p className="text-2xl font-semibold tracking-tight">
            {totalCourses}
          </p>
          <p className="text-[11px] text-neutral-400 mt-1">
            Cursos asignados para tu rol actual.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 px-5 py-4">
          <p className="text-xs text-neutral-500 mb-1">
            Cursos completados
          </p>
          <p className="text-2xl font-semibold tracking-tight">
            {completedCourses}
          </p>
          <p className="text-[11px] text-neutral-400 mt-1">
            Cuando llegues al 100% generaremos tu certificado.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 px-5 py-4">
          <p className="text-xs text-neutral-500 mb-1">
            Progreso promedio
          </p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-semibold tracking-tight">
              {avgProgress}%
            </p>
            <div className="w-24 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
              <div
                className="h-full bg-neutral-900"
                style={{ width: `${avgProgress}%` }}
              />
            </div>
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            Suma de todos tus cursos activos.
          </p>
        </div>
      </section>

      {/* GRID PRINCIPAL: CURSO ACTIVO + LISTA CURSOS */}
      <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-6 mb-10">
        {/* CURSO ACTIVO */}
        {activeCourse && (
          <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 px-6 py-5">
            <h3 className="text-sm font-medium text-neutral-900 mb-1.5">
              Curso seleccionado
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              {/* Description removed as it is not in the Course interface yet */}
              {"Continúa donde lo dejaste."}
            </p>

            <div className="rounded-2xl border border-neutral-200 px-4 py-4 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                <div>
                  <p className="text-xs text-neutral-500 mb-1">
                    {activeCourse.focus}
                  </p>
                  <h4 className="text-base font-semibold text-neutral-900">
                    {activeCourse.title}
                  </h4>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className={
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium " +
                        badgeColor(activeCourse.level)
                      }
                    >
                      {activeCourse.level}
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      {activeCourse.lessons.length} lecciones
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-start sm:items-end gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-500">
                      Progreso
                    </span>
                    <span className="text-sm font-semibold text-neutral-900">
                      {activeCourse.progress}%
                    </span>
                  </div>
                  <div className="w-40 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                    <div
                      className="h-full bg-neutral-900"
                      style={{ width: `${activeCourse.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-neutral-100 pt-3">
                <p className="text-xs font-medium text-neutral-900 mb-2">
                  Lecciones
                </p>
                <div className="space-y-2">
                  {activeCourse.lessons.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between text-xs py-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-neutral-400 w-4">
                          {index + 1}.
                        </span>
                        <span className="text-neutral-800">
                          {lesson.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-neutral-400">
                          {lesson.duration}
                        </span>
                        {pillForStatus(lesson)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LISTA DE CURSOS */}
        <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 px-6 py-5">
          <h3 className="text-sm font-medium text-neutral-900 mb-1.5">
            Catálogo asignado
          </h3>
          <p className="text-xs text-neutral-500 mb-4">
            Selecciona un curso para ver sus detalles.
          </p>

          <div className="space-y-3">
            {courses.map((course) => (
              <button
                key={course.id}
                type="button"
                onClick={() => setActiveCourseId(course.id)}
                className={`w-full text-left rounded-2xl border px-4 py-3 hover:border-neutral-300 transition-colors ${activeCourseId === course.id ? "border-neutral-900 bg-neutral-50" : "border-neutral-200 bg-white"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-neutral-500 mb-0.5">
                      {course.focus}
                    </p>
                    <h4 className="text-sm font-semibold text-neutral-900">
                      {course.title}
                    </h4>
                    <div className="mt-1 flex items-center gap-2">
                      <span
                        className={
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium " +
                          badgeColor(course.level)
                        }
                      >
                        {course.level}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-semibold text-neutral-900">
                      {course.progress}%
                    </span>
                    <div className="w-16 h-1 rounded-full bg-neutral-100 overflow-hidden">
                      <div
                        className="h-full bg-neutral-900"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
