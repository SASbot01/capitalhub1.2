import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminGetModulesByFormation, adminCreateModule, adminUpdateModule, adminDeleteModule, adminGetFormation } from "../../api/admin";
import type { Formation, TrainingModule } from "../../api/training";

export default function AdminModulesPage() {
  const { formationId } = useParams<{ formationId: string }>();
  const navigate = useNavigate();
  const [formation, setFormation] = useState<Formation | null>(null);
  const [modules, setModules] = useState<TrainingModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<TrainingModule | null>(null);
  const [form, setForm] = useState({ name: "", description: "", displayOrder: 0, contentType: "TECHNICAL" });
  const [saving, setSaving] = useState(false);

  const fid = Number(formationId);

  useEffect(() => { loadData(); }, [formationId]);

  async function loadData() {
    setLoading(true);
    try {
      const [f, m] = await Promise.all([adminGetFormation(fid), adminGetModulesByFormation(fid)]);
      setFormation(f);
      setModules(m);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  function openCreate() {
    setEditing(null);
    setForm({ name: "", description: "", displayOrder: modules.length + 1, contentType: "TECHNICAL" });
    setShowForm(true);
  }

  function openEdit(m: TrainingModule) {
    setEditing(m);
    setForm({ name: m.name, description: m.description || "", displayOrder: m.displayOrder || 0, contentType: m.contentType || "TECHNICAL" });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, formationId: fid };
      if (editing) {
        await adminUpdateModule(editing.id, payload);
      } else {
        await adminCreateModule(payload);
      }
      setShowForm(false);
      await loadData();
    } catch (err) { console.error(err); }
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Eliminar este bloque?")) return;
    try { await adminDeleteModule(id); await loadData(); } catch (e) { console.error(e); }
  }

  if (loading) return <div className="text-center text-muted py-16">Cargando bloques...</div>;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted mb-6">
        <button onClick={() => navigate("/admin/routes")} className="hover:text-offwhite transition">Rutas</button>
        <span>/</span>
        {formation && (
          <>
            <button onClick={() => navigate(`/admin/routes/${formation.routeId}/formations`)} className="hover:text-offwhite transition">Formaciones</button>
            <span>/</span>
          </>
        )}
        <span className="text-offwhite">{formation?.name}</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-offwhite">Bloques de {formation?.name}</h1>
          <p className="text-sm text-muted mt-1">Organiza los modulos de esta formacion</p>
        </div>
        <button onClick={openCreate} className="px-4 py-2 bg-accent text-carbon text-sm font-bold rounded-lg hover:bg-offwhite transition">
          + Nuevo Bloque
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-panel border border-graphite rounded-xl p-6 w-full max-w-lg space-y-4">
            <h2 className="text-lg font-bold text-offwhite">{editing ? "Editar Bloque" : "Nuevo Bloque"}</h2>

            <div>
              <label className="block text-xs text-muted mb-1">Nombre del bloque</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required
                className="w-full px-3 py-2 bg-carbon border border-graphite rounded-lg text-sm text-offwhite focus:border-accent outline-none" />
            </div>

            <div>
              <label className="block text-xs text-muted mb-1">Descripcion</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
                className="w-full px-3 py-2 bg-carbon border border-graphite rounded-lg text-sm text-offwhite focus:border-accent outline-none resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted mb-1">Orden</label>
                <input type="number" value={form.displayOrder} onChange={e => setForm(f => ({ ...f, displayOrder: Number(e.target.value) }))}
                  className="w-full px-3 py-2 bg-carbon border border-graphite rounded-lg text-sm text-offwhite focus:border-accent outline-none" />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">Tipo de contenido</label>
                <select value={form.contentType} onChange={e => setForm(f => ({ ...f, contentType: e.target.value }))}
                  className="w-full px-3 py-2 bg-carbon border border-graphite rounded-lg text-sm text-offwhite focus:border-accent outline-none">
                  <option value="TECHNICAL">Tecnico</option>
                  <option value="MINDSET">Mindset</option>
                </select>
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

      {/* Modules List */}
      {modules.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <p className="text-lg mb-2">No hay bloques</p>
          <p className="text-sm">Crea el primer bloque para organizar las clases</p>
        </div>
      ) : (
        <div className="space-y-3">
          {modules.map((m, i) => (
            <div key={m.id} className="bg-panel border border-graphite rounded-xl p-4 flex items-center gap-4 hover:border-offwhite/20 transition">
              <div className="w-10 h-10 bg-graphite rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-sm text-offwhite font-bold">{i + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-offwhite">{m.name}</h3>
                  <span className="text-[10px] bg-graphite text-muted px-2 py-0.5 rounded-full">{m.contentType}</span>
                </div>
                <p className="text-xs text-muted mt-0.5 truncate">{m.description}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => navigate(`/admin/modules/${m.id}/lessons`)}
                  className="px-3 py-1.5 bg-graphite text-offwhite text-xs rounded-lg hover:bg-offwhite/20 transition">
                  Clases
                </button>
                <button onClick={() => openEdit(m)}
                  className="px-3 py-1.5 bg-graphite text-offwhite text-xs rounded-lg hover:bg-offwhite/20 transition">
                  Editar
                </button>
                <button onClick={() => handleDelete(m.id)}
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
