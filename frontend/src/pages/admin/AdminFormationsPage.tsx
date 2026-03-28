import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminGetFormationsByRoute, adminCreateFormation, adminUpdateFormation, adminDeleteFormation, adminGetRoute } from "../../api/admin";
import { uploadFile } from "../../api/client";
import type { Route, Formation } from "../../api/training";

export default function AdminFormationsPage() {
  const { routeId } = useParams<{ routeId: string }>();
  const navigate = useNavigate();
  const [route, setRoute] = useState<Route | null>(null);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Formation | null>(null);
  const [form, setForm] = useState({ name: "", description: "", imageUrl: "", displayOrder: 0, active: true, minTier: "T0", isIntroModule: false });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const rid = Number(routeId);

  useEffect(() => { loadData(); }, [routeId]);

  async function loadData() {
    setLoading(true);
    try {
      const [r, f] = await Promise.all([adminGetRoute(rid), adminGetFormationsByRoute(rid)]);
      setRoute(r);
      setFormations(f);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  function openCreate() {
    setEditing(null);
    setForm({ name: "", description: "", imageUrl: "", displayOrder: formations.length + 1, active: true, minTier: "T0", isIntroModule: false });
    setShowForm(true);
  }

  function openEdit(f: Formation) {
    setEditing(f);
    setForm({ name: f.name, description: f.description || "", imageUrl: f.imageUrl || "", displayOrder: f.displayOrder || 0, active: f.active, minTier: f.minTier || "T0", isIntroModule: f.isIntroModule });
    setShowForm(true);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadFile(file, "formations");
      setForm(f => ({ ...f, imageUrl: res.url }));
    } catch (err) { console.error(err); }
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, routeId: rid };
      if (editing) {
        await adminUpdateFormation(editing.id, payload);
      } else {
        await adminCreateFormation(payload);
      }
      setShowForm(false);
      await loadData();
    } catch (err) { console.error(err); }
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Eliminar esta formacion?")) return;
    try { await adminDeleteFormation(id); await loadData(); } catch (e) { console.error(e); }
  }

  if (loading) return <div className="text-center text-muted py-16">Cargando formaciones...</div>;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted mb-6">
        <button onClick={() => navigate("/admin/routes")} className="hover:text-offwhite transition">Rutas</button>
        <span>/</span>
        <span className="text-offwhite">{route?.name}</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-offwhite">Formaciones de {route?.name}</h1>
          <p className="text-sm text-muted mt-1">Gestiona los cursos dentro de esta ruta</p>
        </div>
        <button onClick={openCreate} className="px-4 py-2 bg-accent text-carbon text-sm font-bold rounded-lg hover:bg-offwhite transition">
          + Nueva Formacion
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-panel border border-graphite rounded-xl p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-offwhite">{editing ? "Editar Formacion" : "Nueva Formacion"}</h2>

            <div>
              <label className="block text-xs text-muted mb-1">Titulo</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required
                className="w-full px-3 py-2 bg-carbon border border-graphite rounded-lg text-sm text-offwhite focus:border-accent outline-none" />
            </div>

            <div>
              <label className="block text-xs text-muted mb-1">Descripcion</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
                className="w-full px-3 py-2 bg-carbon border border-graphite rounded-lg text-sm text-offwhite focus:border-accent outline-none resize-none" />
            </div>

            <div>
              <label className="block text-xs text-muted mb-1">Foto</label>
              {form.imageUrl && <img src={form.imageUrl} alt="preview" className="w-24 h-24 object-cover rounded-lg mb-2" />}
              <input type="file" accept="image/*" onChange={handleImageUpload}
                className="w-full text-sm text-muted file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-graphite file:text-offwhite file:text-xs file:cursor-pointer" />
              {uploading && <p className="text-xs text-accent mt-1">Subiendo...</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted mb-1">Orden</label>
                <input type="number" value={form.displayOrder} onChange={e => setForm(f => ({ ...f, displayOrder: Number(e.target.value) }))}
                  className="w-full px-3 py-2 bg-carbon border border-graphite rounded-lg text-sm text-offwhite focus:border-accent outline-none" />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">Tier minimo</label>
                <select value={form.minTier} onChange={e => setForm(f => ({ ...f, minTier: e.target.value }))}
                  className="w-full px-3 py-2 bg-carbon border border-graphite rounded-lg text-sm text-offwhite focus:border-accent outline-none">
                  <option value="T0">T0 (Trial)</option>
                  <option value="STARTER">Starter</option>
                  <option value="T1">T1 (Basic)</option>
                  <option value="T2">T2 (Bootcamp)</option>
                  <option value="T3">T3 (Pro)</option>
                  <option value="T4">T4 (Enterprise)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="w-4 h-4 accent-accent" />
                <span className="text-sm text-offwhite">Activa</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isIntroModule} onChange={e => setForm(f => ({ ...f, isIntroModule: e.target.checked }))} className="w-4 h-4 accent-accent" />
                <span className="text-sm text-offwhite">Modulo introductorio (gratuito)</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-muted hover:text-offwhite transition">Cancelar</button>
              <button type="submit" disabled={saving || uploading} className="px-4 py-2 bg-accent text-carbon text-sm font-bold rounded-lg hover:bg-offwhite transition disabled:opacity-50">
                {saving ? "Guardando..." : editing ? "Guardar" : "Crear"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Formations List */}
      {formations.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <p className="text-lg mb-2">No hay formaciones</p>
          <p className="text-sm">Crea la primera formacion para esta ruta</p>
        </div>
      ) : (
        <div className="space-y-3">
          {formations.map(f => (
            <div key={f.id} className="bg-panel border border-graphite rounded-xl p-4 flex items-center gap-4 hover:border-offwhite/20 transition">
              {f.imageUrl ? (
                <img src={f.imageUrl} alt={f.name} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
              ) : (
                <div className="w-16 h-16 bg-graphite rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl text-muted font-bold">{f.name.charAt(0)}</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-offwhite">{f.name}</h3>
                  {!f.active && <span className="text-[10px] bg-red-900/40 text-red-400 px-2 py-0.5 rounded-full">Inactiva</span>}
                  {f.isIntroModule && <span className="text-[10px] bg-green-900/40 text-green-400 px-2 py-0.5 rounded-full">Intro</span>}
                </div>
                <p className="text-xs text-muted mt-0.5 truncate">{f.description}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => navigate(`/admin/formations/${f.id}/modules`)}
                  className="px-3 py-1.5 bg-graphite text-offwhite text-xs rounded-lg hover:bg-offwhite/20 transition">
                  Bloques
                </button>
                <button onClick={() => openEdit(f)}
                  className="px-3 py-1.5 bg-graphite text-offwhite text-xs rounded-lg hover:bg-offwhite/20 transition">
                  Editar
                </button>
                <button onClick={() => handleDelete(f.id)}
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
