import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminGetLessonsByModule, adminCreateLesson, adminUpdateLesson, adminDeleteLesson, adminGetModule } from "../../api/admin";
import type { TrainingModule, Lesson } from "../../api/training";

export default function AdminLessonsPage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const [module, setModule] = useState<TrainingModule | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Lesson | null>(null);
  const [form, setForm] = useState({ title: "", description: "", videoUrl: "", duration: "", position: 0 });
  const [saving, setSaving] = useState(false);

  const mid = Number(moduleId);

  useEffect(() => { loadData(); }, [moduleId]);

  async function loadData() {
    setLoading(true);
    try {
      const [m, l] = await Promise.all([adminGetModule(mid), adminGetLessonsByModule(mid)]);
      setModule(m);
      setLessons(l);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  function openCreate() {
    setEditing(null);
    setForm({ title: "", description: "", videoUrl: "", duration: "", position: lessons.length + 1 });
    setShowForm(true);
  }

  function openEdit(l: Lesson) {
    setEditing(l);
    setForm({ title: l.title || "", description: l.description || "", videoUrl: l.videoUrl || "", duration: l.duration || "", position: l.position || 0 });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, moduleId: mid, courseId: module?.formationId };
      if (editing) {
        await adminUpdateLesson(editing.id, payload);
      } else {
        await adminCreateLesson(payload);
      }
      setShowForm(false);
      await loadData();
    } catch (err) { console.error(err); }
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Eliminar esta clase?")) return;
    try { await adminDeleteLesson(id); await loadData(); } catch (e) { console.error(e); }
  }

  if (loading) return <div className="text-center text-muted py-16">Cargando clases...</div>;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted mb-6">
        <button onClick={() => navigate("/admin/routes")} className="hover:text-offwhite transition">Rutas</button>
        <span>/</span>
        {module && (
          <>
            <button onClick={() => navigate(`/admin/formations/${module.formationId}/modules`)} className="hover:text-offwhite transition">Bloques</button>
            <span>/</span>
          </>
        )}
        <span className="text-offwhite">{module?.name}</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-offwhite">Clases de {module?.name}</h1>
          <p className="text-sm text-muted mt-1">Anade las clases con sus URLs de GoHighLevel</p>
        </div>
        <button onClick={openCreate} className="px-4 py-2 bg-accent text-carbon text-sm font-bold rounded-lg hover:bg-offwhite transition">
          + Nueva Clase
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-panel border border-graphite rounded-xl p-6 w-full max-w-lg space-y-4">
            <h2 className="text-lg font-bold text-offwhite">{editing ? "Editar Clase" : "Nueva Clase"}</h2>

            <div>
              <label className="block text-xs text-muted mb-1">Titulo de la clase</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required
                className="w-full px-3 py-2 bg-carbon border border-graphite rounded-lg text-sm text-offwhite focus:border-accent outline-none" />
            </div>

            <div>
              <label className="block text-xs text-muted mb-1">Descripcion</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
                className="w-full px-3 py-2 bg-carbon border border-graphite rounded-lg text-sm text-offwhite focus:border-accent outline-none resize-none" />
            </div>

            <div>
              <label className="block text-xs text-muted mb-1">URL del video (GoHighLevel u otra)</label>
              <input value={form.videoUrl} onChange={e => setForm(f => ({ ...f, videoUrl: e.target.value }))} type="url"
                placeholder="https://app.gohighlevel.com/..."
                className="w-full px-3 py-2 bg-carbon border border-graphite rounded-lg text-sm text-offwhite placeholder-muted/50 focus:border-accent outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted mb-1">Duracion</label>
                <input value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                  placeholder="ej: 15 min"
                  className="w-full px-3 py-2 bg-carbon border border-graphite rounded-lg text-sm text-offwhite placeholder-muted/50 focus:border-accent outline-none" />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">Posicion</label>
                <input type="number" value={form.position} onChange={e => setForm(f => ({ ...f, position: Number(e.target.value) }))}
                  className="w-full px-3 py-2 bg-carbon border border-graphite rounded-lg text-sm text-offwhite focus:border-accent outline-none" />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-muted hover:text-offwhite transition">Cancelar</button>
              <button type="submit" disabled={saving} className="px-4 py-2 bg-accent text-carbon text-sm font-bold rounded-lg hover:bg-offwhite transition disabled:opacity-50">
                {saving ? "Guardando..." : editing ? "Guardar" : "Crear"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lessons List */}
      {lessons.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <p className="text-lg mb-2">No hay clases</p>
          <p className="text-sm">Anade la primera clase con su URL de GoHighLevel</p>
        </div>
      ) : (
        <div className="space-y-3">
          {lessons.map((l, i) => (
            <div key={l.id} className="bg-panel border border-graphite rounded-xl p-4 flex items-center gap-4 hover:border-offwhite/20 transition">
              <div className="w-10 h-10 bg-graphite rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-sm text-offwhite font-bold">{i + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-offwhite">{l.title}</h3>
                <div className="flex items-center gap-3 mt-1">
                  {l.duration && <span className="text-[10px] text-muted">{l.duration}</span>}
                  {l.videoUrl && (
                    <a href={l.videoUrl} target="_blank" rel="noopener noreferrer"
                      className="text-[10px] text-accent hover:underline truncate max-w-[200px]">
                      {l.videoUrl}
                    </a>
                  )}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => openEdit(l)}
                  className="px-3 py-1.5 bg-graphite text-offwhite text-xs rounded-lg hover:bg-offwhite/20 transition">
                  Editar
                </button>
                <button onClick={() => handleDelete(l.id)}
                  className="px-3 py-1.5 text-red-400 text-xs rounded-lg hover:bg-red-900/30 transition">
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
