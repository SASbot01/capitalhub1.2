import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminGetRoutes, adminCreateRoute, adminUpdateRoute, adminDeleteRoute } from "../../api/admin";
import { uploadFile } from "../../api/client";
import type { Route } from "../../api/training";

export default function AdminRoutesPage() {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Route | null>(null);
  const [form, setForm] = useState({ name: "", description: "", imageUrl: "", displayOrder: 0, active: true });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadRoutes(); }, []);

  async function loadRoutes() {
    setLoading(true);
    try {
      const data = await adminGetRoutes();
      setRoutes(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  function openCreate() {
    setEditing(null);
    setForm({ name: "", description: "", imageUrl: "", displayOrder: routes.length + 1, active: true });
    setShowForm(true);
  }

  function openEdit(route: Route) {
    setEditing(route);
    setForm({ name: route.name, description: route.description || "", imageUrl: route.imageUrl || "", displayOrder: route.displayOrder || 0, active: route.active });
    setShowForm(true);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadFile(file, "routes");
      setForm(f => ({ ...f, imageUrl: res.url }));
    } catch (err) { console.error(err); }
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await adminUpdateRoute(editing.id, form);
      } else {
        await adminCreateRoute(form);
      }
      setShowForm(false);
      await loadRoutes();
    } catch (err) { console.error(err); }
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Eliminar esta ruta y todo su contenido?")) return;
    try {
      await adminDeleteRoute(id);
      await loadRoutes();
    } catch (err) { console.error(err); }
  }

  if (loading) return <div className="text-center text-muted py-16">Cargando rutas...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-offwhite">Gestionar Rutas</h1>
          <p className="text-sm text-muted mt-1">Crea y organiza las rutas de formacion</p>
        </div>
        <button onClick={openCreate} className="px-4 py-2 bg-accent text-carbon text-sm font-bold rounded-lg hover:bg-offwhite transition">
          + Nueva Ruta
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-panel border border-graphite rounded-xl p-6 w-full max-w-lg space-y-4">
            <h2 className="text-lg font-bold text-offwhite">{editing ? "Editar Ruta" : "Nueva Ruta"}</h2>

            <div>
              <label className="block text-xs text-muted mb-1">Nombre</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required
                className="w-full px-3 py-2 bg-carbon border border-graphite rounded-lg text-sm text-offwhite focus:border-accent outline-none" />
            </div>

            <div>
              <label className="block text-xs text-muted mb-1">Descripcion</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
                className="w-full px-3 py-2 bg-carbon border border-graphite rounded-lg text-sm text-offwhite focus:border-accent outline-none resize-none" />
            </div>

            <div>
              <label className="block text-xs text-muted mb-1">Imagen</label>
              {form.imageUrl && (
                <img src={form.imageUrl} alt="preview" className="w-24 h-24 object-cover rounded-lg mb-2" />
              )}
              <input type="file" accept="image/*" onChange={handleImageUpload}
                className="w-full text-sm text-muted file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-graphite file:text-offwhite file:text-xs file:cursor-pointer" />
              {uploading && <p className="text-xs text-accent mt-1">Subiendo imagen...</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted mb-1">Orden</label>
                <input type="number" value={form.displayOrder} onChange={e => setForm(f => ({ ...f, displayOrder: Number(e.target.value) }))}
                  className="w-full px-3 py-2 bg-carbon border border-graphite rounded-lg text-sm text-offwhite focus:border-accent outline-none" />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
                    className="w-4 h-4 accent-accent" />
                  <span className="text-sm text-offwhite">Activa</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-muted hover:text-offwhite transition">
                Cancelar
              </button>
              <button type="submit" disabled={saving || uploading} className="px-4 py-2 bg-accent text-carbon text-sm font-bold rounded-lg hover:bg-offwhite transition disabled:opacity-50">
                {saving ? "Guardando..." : editing ? "Guardar" : "Crear"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Routes Grid */}
      {routes.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <p className="text-lg mb-2">No hay rutas creadas</p>
          <p className="text-sm">Crea tu primera ruta para empezar a organizar las formaciones</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map(route => (
            <div key={route.id} className="bg-panel border border-graphite rounded-xl overflow-hidden hover:border-offwhite/20 transition">
              {route.imageUrl && (
                <img src={route.imageUrl} alt={route.name} className="w-full h-40 object-cover" />
              )}
              {!route.imageUrl && (
                <div className="w-full h-40 bg-graphite flex items-center justify-center">
                  <span className="text-3xl text-muted font-bold">{route.name.charAt(0)}</span>
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-offwhite">{route.name}</h3>
                  {!route.active && (
                    <span className="text-[10px] bg-red-900/40 text-red-400 px-2 py-0.5 rounded-full">Inactiva</span>
                  )}
                </div>
                <p className="text-sm text-muted mb-4 line-clamp-2">{route.description}</p>
                <div className="flex gap-2">
                  <button onClick={() => navigate(`/admin/routes/${route.id}/formations`)}
                    className="flex-1 px-3 py-2 bg-graphite text-offwhite text-xs font-medium rounded-lg hover:bg-offwhite/20 transition">
                    Ver Formaciones
                  </button>
                  <button onClick={() => openEdit(route)}
                    className="px-3 py-2 bg-graphite text-offwhite text-xs rounded-lg hover:bg-offwhite/20 transition">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(route.id)}
                    className="px-3 py-2 text-red-400 text-xs rounded-lg hover:bg-red-900/30 transition">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
